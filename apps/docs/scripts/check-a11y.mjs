#!/usr/bin/env node
/**
 * 접근성 회귀 검사 — **정적 검사로는 잡히지 않는 것**만 본다.
 *
 * 1. `prefers-reduced-motion` 대응
 *    framer-motion 은 CSS `--nui-duration-*` 의 1ms 무력화를 읽지 않는다
 *    (`MotionConfig.reducedMotion` 기본값이 `"never"`). `useReducedMotion()` 을
 *    빠뜨리면 모션 감소 설정이 **조용히** 무시된다 — 타입도 빌드도 통과한다.
 * 2. 명도 대비 (WCAG 2.1 AA) — **라이트·다크 두 테마**
 *    토큰을 바꾸면 대비가 깨질 수 있는데 어떤 정적 검사에도 걸리지 않는다.
 *    다크는 OS 설정만으로 자동 적용되므로 라이트와 같은 정본이다 (tokens.md §4-1-1).
 *    비활성은 AA 에서 빠지지만 하한 2.0:1 을 둔다 (design-system.md §2).
 * 3. 터치 영역 — 누를 수 있는 것의 히트 영역 실측 (a11y.md §8)
 *    24px 미만은 실패, 44px 미만은 경고.
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
const warnings = [];
const ok = (m) => console.log("  ✅", m);
const bad = (m) => {
  console.log("  ❌", m);
  failures.push(m);
};
const warn = (m) => {
  console.log("  ⚠️ ", m);
  warnings.push(m);
};

const browser = await chromium.launch();
const VIEWPORT = { width: 1280, height: 900 };

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
    viewport: VIEWPORT,
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

// 1-b) 로딩 스피너 — 회전 duration 이 스케일 밖(1s 고정)이라 1ms 무력화를 타지 않는다.
//      `animation: none` 으로 직접 멈춰야 한다 (a11y.md §6 · specs/Button.md §7).
{
  const ctx = await browser.newContext({
    reducedMotion: "reduce",
    viewport: VIEWPORT,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/components/button", { waitUntil: "networkidle" });
  const spinner = page.locator(".nui-icon--spin").first();
  if ((await spinner.count()) === 0) {
    bad("Button 로딩 스피너: 요소를 찾지 못했다 (.nui-icon--spin)");
  } else {
    const name = await spinner.evaluate(
      (el) => getComputedStyle(el).animationName,
    );
    name === "none"
      ? ok("Button 로딩 스피너 — reduce 에서 회전 없음")
      : bad(`Button 로딩 스피너: reduce 인데 돈다 (animation-name: ${name})`);
  }
  await ctx.close();
}

// ── 2) 명도 대비 — 라이트 · 다크
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

/**
 * [라벨, 페이지, 셀렉터, 최소비율, 열기]
 * 큰 글자(18.66px+ bold, 24px+)는 3.0. 비활성은 하한 2.0.
 * `열기` 는 요소가 상호작용 뒤에만 생길 때 먼저 할 일이다.
 */
const CONTRAST_TARGETS = [
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
  [
    "비활성 버튼 라벨 (하한)",
    "/components/button",
    ".nui-button[disabled] .nui-button__wrap",
    2.0,
  ],
  ["입력 글자", "/components/textfield", ".nui-textfield__input", 4.5],
  ["에러 메시지", "/components/textfield", ".nui-message__msg--error", 4.5],
  ["Field 설명", "/components/field", ".nui-field__description", 4.5],
  [
    "Tooltip 글자",
    "/components/tooltip",
    ".nui-tooltip__content",
    4.5,
    async (page) => page.locator(".nui-tooltip").first().hover(),
  ],
  [
    "Toast 메시지",
    "/components/toast",
    ".nui-toast__message",
    4.5,
    async (page) =>
      page.getByRole("button", { name: "기본 토스트" }).first().click(),
  ],
];

for (const theme of ["light", "dark"]) {
  console.log(`\n■ 명도 대비 — ${theme}`);
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: theme,
  });
  const page = await ctx.newPage();

  for (const [label, url, selector, min, open] of CONTRAST_TARGETS) {
    await page.goto(BASE + url, { waitUntil: "networkidle" });
    // 문서 사이트는 저장된 테마가 없으면 OS 설정(colorScheme)을 따른다.
    const stamped = await page.evaluate(
      () => document.documentElement.dataset.theme,
    );
    if (stamped !== theme) {
      bad(`${label}: 테마가 ${theme} 이어야 하는데 ${stamped} 다`);
      continue;
    }
    if (open) {
      try {
        await open(page);
      } catch {
        bad(`${label}: 열지 못했다`);
        continue;
      }
    }
    const el = page.locator(selector).first();
    const appeared = await el
      .waitFor({ state: "visible", timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    if (!appeared) {
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
    r >= min ? ok(line) : bad(`${line} — 기준 ${min}:1 미달`);
  }
  await ctx.close();
}

// ── 3) 터치 영역
console.log("\n■ 터치 영역 (24px 미만 실패 · 44px 미만 경고)");

/** [라벨, 페이지, 셀렉터, 열기] */
const TOUCH_TARGETS = [
  ["IconButton", "/components/button", ".nui-button--icon"],
  [
    "Textfield 지우기",
    "/components/textfield",
    ".nui-textfield__btn",
    async (page) => page.locator(".nui-textfield__input").first().fill("값"),
  ],
  ["Password 토글", "/components/password", ".nui-textfield__btn"],
  ["Select 화살표", "/components/select", ".nui-select__dropdown-indicator"],
  [
    "Datepicker 이전/다음",
    "/components/datepicker",
    ".nui-daypicker__button-next",
    async (page) => page.locator(".nui-textfield__input").first().click(),
  ],
  [
    "Datepicker 날짜",
    "/components/datepicker",
    ".nui-daypicker__day-button",
    async (page) => page.locator(".nui-textfield__input").first().click(),
  ],
  [
    "Popup 닫기",
    "/components/popup",
    ".nui-popup__close",
    // Alert 은 닫기 버튼이 없다. 헤더가 있는 LayerPopup 을 연다.
    async (page) =>
      page.getByRole("button", { name: "프로필 팝업" }).first().click(),
  ],
  ["Accordion 헤더", "/components/accordion", ".nui-accordion__button"],
];

{
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  for (const [label, url, selector, open] of TOUCH_TARGETS) {
    await page.goto(BASE + url, { waitUntil: "networkidle" });
    if (open) {
      try {
        await open(page);
      } catch {
        warn(`${label}: 열지 못해 재지 못했다`);
        continue;
      }
    }
    const el = page.locator(selector).first();
    const appeared = await el
      .waitFor({ state: "visible", timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    if (!appeared) {
      warn(`${label}: 요소를 찾지 못했다 (${selector})`);
      continue;
    }
    const { w, h } = await el.evaluate((node) => {
      const r = node.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });
    const line = `${label} ${w}×${h}`;
    if (Math.min(w, h) < 24) bad(`${line} — 하한 24px 미만`);
    else if (Math.min(w, h) < 44) warn(`${line} — 44px 미만`);
    else ok(line);
  }
  await ctx.close();
}

await browser.close();

if (warnings.length > 0) {
  console.warn(`\n⚠️  경고 ${warnings.length}건 — 실패는 아니다`);
}
if (failures.length > 0) {
  console.error(`\n❌ 접근성 검사 실패 — ${failures.length}건`);
  process.exit(1);
}
console.log(
  "\n✅ 접근성 검사 통과 — 모션 감소 대응 · 명도 대비(라이트·다크) · 터치 영역",
);
