#!/usr/bin/env node
/**
 * 접근성 회귀 검사 — **정적 검사로는 잡히지 않는 것**만 본다.
 *
 * 1. `prefers-reduced-motion` 대응
 *    framer-motion 은 CSS `--nui-duration-*` 의 1ms 무력화를 읽지 않는다
 *    (`MotionConfig.reducedMotion` 기본값이 `"never"`). `useReducedMotion()` 을
 *    빠뜨리면 모션 감소 설정이 **조용히** 무시된다 — 타입도 빌드도 통과한다.
 * 2. 명도 대비 (WCAG 2.1 AA)
 *    토큰을 바꾸면 대비가 깨질 수 있는데 어떤 정적 검사에도 걸리지 않는다.
 *
 * 사용: dev server 기동 후  node scripts/check-a11y.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";

try {
  await fetch(BASE, { signal: AbortSignal.timeout(3000) });
} catch {
  console.error(
    `❌ ${BASE} 에 접속할 수 없다. 먼저 \`npm run dev\` 로 서버를 띄울 것.`,
  );
  process.exit(1);
}

const failures = [];
const ok = (m) => console.log("  ✅", m);
const bad = (m) => {
  console.log("  ❌", m);
  failures.push(m);
};

const browser = await chromium.launch();

// ── 1) prefers-reduced-motion
console.log("■ prefers-reduced-motion");
const isStill = (transform) =>
  transform === "none" || /matrix\(1, 0, 0, 1, 0, 0\)/.test(transform);

for (const [label, url, open, panel] of [
  ["Tooltip", "/components/tooltip", ".nui-tooltip", ".nui-tooltip__panel"],
  ["Popup", "/components/popup", null, ".nui-popup__panel"],
]) {
  const ctx = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: "networkidle" });

  if (open) {
    await page.locator(open).first().hover();
  } else {
    const opener = page
      .getByRole("button")
      .filter({ hasText: /레이어|팝업|열기/ })
      .first();
    if ((await opener.count()) > 0) await opener.click();
  }

  const found = await page
    .waitForSelector(panel, { timeout: 3000 })
    .then(() => true)
    .catch(() => false);

  if (!found) {
    bad(`${label}: 패널을 열지 못해 검사하지 못했다`);
  } else {
    // 전환 도중을 잡는다 — 완료 후에는 둘 다 정지 상태라 구분되지 않는다
    await page.waitForTimeout(40);
    const transform = await page
      .locator(panel)
      .first()
      .evaluate((el) => getComputedStyle(el).transform);
    isStill(transform)
      ? ok(`${label} — 이동·확대 없음`)
      : bad(`${label}: reduce 인데 움직인다 (${transform})`);
  }
  await ctx.close();
}

// ── 2) 명도 대비 (WCAG 2.1 AA)
console.log("\n■ 명도 대비 (WCAG 2.1 AA)");

/** sRGB 상대 휘도 */
function luminance([r, g, b]) {
  const f = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
const parse = (css) =>
  (css.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);

const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
const page = await ctx.newPage();

/** [라벨, 페이지, 셀렉터, 최소비율] — 큰 글자(18.66px+ bold, 24px+)는 3.0 */
const TARGETS = [
  [
    "기본 버튼 라벨",
    "/components/button",
    ".nui-button .nui-button__wrap",
    4.5,
  ],
  [
    "primary 버튼 라벨",
    "/components/button",
    ".nui-button--primary .nui-button__wrap",
    4.5,
  ],
  ["입력 글자", "/components/textfield", ".nui-textfield__input", 4.5],
  ["에러 메시지", "/components/textfield", ".nui-message__msg--error", 4.5],
];

for (const [label, url, selector, min] of TARGETS) {
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) {
    bad(`${label}: 요소를 찾지 못했다 (${selector})`);
    continue;
  }
  const { fg, bg } = await el.evaluate((node) => {
    const color = getComputedStyle(node).color;
    // 투명한 조상을 건너뛰고 실제로 칠해진 배경을 찾는다
    let cur = node;
    let background = "rgba(0, 0, 0, 0)";
    while (cur) {
      const value = getComputedStyle(cur).backgroundColor;
      if (value && !/rgba\(0, 0, 0, 0\)|transparent/.test(value)) {
        background = value;
        break;
      }
      cur = cur.parentElement;
    }
    return { fg: color, bg: background };
  });
  const r = ratio(parse(fg), parse(bg));
  const line = `${label} ${r.toFixed(2)}:1 (${fg} on ${bg})`;
  r >= min ? ok(line) : bad(`${line} — AA 기준 ${min}:1 미달`);
}

await ctx.close();
await browser.close();

if (failures.length > 0) {
  console.error(`\n❌ 접근성 검사 실패 — ${failures.length}건`);
  process.exit(1);
}
console.log("\n✅ 접근성 검사 통과 — 모션 감소 대응 · 명도 대비 AA");
