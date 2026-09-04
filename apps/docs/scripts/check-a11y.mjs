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
 * 2-b. 글자가 아닌 것의 대비 3:1(테두리 · 트랙 · 포커스)과 버튼 hover·pressed 의 글자 대비 —
 *    토큰 계산값으로 두 테마에서 잰다 (KRDS A4 · A5).
 * 3. 터치 영역 — 누를 수 있는 것의 히트 영역 실측 (a11y.md §8)
 *    박스가 아니라 `elementFromPoint` 로 실제 눌리는 범위를 잰다.
 *    24px 미만은 실패, 44px 미만은 경고. 이유가 적힌 예외는 통과.
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
  ["Popup", "/components/layer-popup", null, ".nui-popup__panel"],
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

// ── 2-b) 글자가 아닌 것의 대비 · 상태 색 — 토큰 값으로 잰다 (KRDS A4 · A5)
//
// 입력 테두리 · 스위치 트랙 · 포커스 표시는 배경과 3:1 (WCAG 1.4.11 · 2.4.11, KRDS 695 · 578 · 519쪽).
// 버튼 hover · pressed 는 같은 색조의 다음 단계라 글자 대비를 다시 재야 한다 (KRDS 95~96쪽).
// 토큰의 계산값을 `getComputedStyle` 로 읽어 두 테마에서 잰다 — 상태를 실제로 만들 필요가 없다.
console.log("\n■ 비텍스트 대비 · 상태 색 (라이트 · 다크)");

/** [라벨, 앞색 토큰, 뒷색 토큰, 최소비율] */
const TOKEN_PAIRS = [
  ["입력 테두리", "control-border", "control-bg", 3],
  ["입력 테두리 hover", "control-border-hover", "control-bg", 3],
  ["스위치 꺼짐 트랙", "control-track", "layer-default", 3],
  ["체크박스 테두리", "control-border", "layer-default", 3],
  ["포커스 표시", "focus-color", "layer-default", 3],
  ["비활성 아이콘 (하한)", "control-icon-disabled", "control-bg-disabled", 2],
  [
    "neutral 글자 · hover 배경",
    "action-neutral-fg",
    "action-neutral-hover",
    4.5,
  ],
  [
    "neutral 글자 · pressed 배경",
    "action-neutral-fg",
    "action-neutral-active",
    4.5,
  ],
  ["primary 글자 · hover 배경", "action-primary-fg", "action-primary-hover", 3],
  [
    "primary 글자 · pressed 배경",
    "action-primary-fg",
    "action-primary-active",
    3,
  ],
  ["secondary 글자 · 배경", "action-secondary-fg", "action-secondary", 3],
  [
    "secondary 글자 · hover 배경",
    "action-secondary-fg",
    "action-secondary-hover",
    3,
  ],
  [
    "secondary 글자 · pressed 배경",
    "action-secondary-fg",
    "action-secondary-active",
    3,
  ],
  ["danger 글자 · hover 배경", "action-danger-fg", "action-danger-hover", 3],
  ["danger 글자 · pressed 배경", "action-danger-fg", "action-danger-active", 3],
  [
    "warning 글자 · hover 배경",
    "action-warning-fg",
    "action-warning-hover",
    4.5,
  ],
  [
    "warning 글자 · pressed 배경",
    "action-warning-fg",
    "action-warning-active",
    4.5,
  ],
];

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/components/button", { waitUntil: "networkidle" });
  const stamped = await page.evaluate(
    () => document.documentElement.dataset.theme,
  );
  if (stamped !== theme) {
    bad(`비텍스트 대비: 테마가 ${theme} 이어야 하는데 ${stamped} 다`);
    await ctx.close();
    continue;
  }
  // color-mix() 는 계산값이 `oklab(...)` 문자열로 나와 숫자만 뽑으면 틀린다.
  // 캔버스에 실제로 칠하고 픽셀을 읽어 sRGB 로 받는다.
  const resolved = await page.evaluate((pairs) => {
    const probe = document.createElement("div");
    document.body.appendChild(probe);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const read = (token) => {
      probe.style.backgroundColor = `var(--nui-${token})`;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = getComputedStyle(probe).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return a === 0 ? "" : `rgb(${r}, ${g}, ${b})`;
    };
    const out = pairs.map(([label, fg, bg, min]) => [
      label,
      read(fg),
      read(bg),
      min,
    ]);
    probe.remove();
    return out;
  }, TOKEN_PAIRS);
  for (const [label, fg, bg, min] of resolved) {
    const f = parse(fg);
    const b = parse(bg);
    if (f.length < 3 || b.length < 3) {
      bad(`${theme} ${label}: 토큰을 읽지 못했다 (${fg} / ${bg})`);
      continue;
    }
    const r = ratio(f, b);
    const line = `${theme} ${label} ${r.toFixed(2)}:1`;
    r >= min ? ok(line) : bad(`${line} — 기준 ${min}:1 미달 (${fg} on ${bg})`);
  }
  await ctx.close();
}

// ── 3) 터치 영역
console.log(
  "\n■ 터치 영역 (24px 미만 실패 · 44px 미만 경고 · 예외는 이유와 함께 통과)",
);

/**
 * [라벨, 페이지, 셀렉터, 열기, 예외 이유?]
 *
 * 박스가 아니라 **실제로 눌리는 범위**를 잰다. `::before` 로 넓힌 히트 영역은
 * `getBoundingClientRect` 에 안 잡히므로, 중심에서 사방으로 1px 씩 나가며
 * `elementFromPoint` 가 그 요소(또는 자손)를 돌려주는 범위를 센다.
 * 이웃 버튼이나 옆 날짜 셀에서 끊기므로 정직한 값이 나온다.
 *
 * 예외 이유가 있는 자리는 44 미만이어도 경고하지 않는다 (a11y.md §8 — 하한 24).
 * **이유 없는 44 미만만 경고다.** 그래야 "경고 0" 이 "이유 없이 작은 자리가 없다" 는 뜻이 된다.
 * 예외를 더할 때는 a11y.md §8 의 표에도 같은 이유를 적는다.
 */
const INPUT_AUX_REASON =
  "입력 안에 버튼 둘이 8px 로 붙는다. 44 를 채우면 히트가 겹쳐 인접 시 38 이 상한이라 하한 24 를 쓴다";

const TOUCH_TARGETS = [
  ["IconButton", "/components/button", ".nui-button--icon"],
  [
    "Textfield 지우기",
    "/components/textfield",
    ".nui-textfield__btn",
    async (page) => page.locator(".nui-textfield__input").first().fill("값"),
    INPUT_AUX_REASON,
  ],
  [
    "Password 토글",
    "/components/password",
    ".nui-textfield__btn",
    null,
    INPUT_AUX_REASON,
  ],
  [
    "Select 화살표",
    "/components/select",
    ".nui-select__dropdown-indicator",
    null,
    INPUT_AUX_REASON,
  ],
  [
    "MultiSelect 칩 삭제",
    "/components/select",
    ".nui-select__multi-value__remove",
    null,
    "칩이 서로 붙어 있어 44 를 채우면 이웃 칩의 히트를 삼킨다. 입력 안 보조 버튼과 같은 이유로 하한 24 를 쓴다",
  ],
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
    "/components/layer-popup",
    ".nui-popup__close",
    // Alert 은 닫기 버튼이 없다. 헤더가 있는 LayerPopup 을 연다.
    async (page) =>
      page.getByRole("button", { name: "프로필 팝업" }).first().click(),
  ],
  ["Accordion 헤더", "/components/accordion", ".nui-accordion__button"],
  // 선택 컨트롤은 투명 input 을 44 로 키워 누르는 범위를 확보한다 (KRDS D2)
  ["Checkbox", "/components/checkbox", ".nui-checkbox__input"],
  [
    "Radio",
    "/components/radio",
    ".nui-radio__input",
    null,
    "세로 묶음의 간격이 16 이라 이웃 input(44)과 4px 겹친다. 겹친 곳은 가까운 쪽이 받으므로 상한이 40 이다. 24 하한은 넘는다",
  ],
  ["Switch", "/components/switch", ".nui-switch__input"],
];

{
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  for (const [label, url, selector, open, exception] of TOUCH_TARGETS) {
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
    // 팝업·달력은 scale 0.98 → 1 로 등장한다. 도중에 재면 모든 치수가 0.99배로
    // 나와 44 가 43 이 된다. 매크로 모션 상한(duration-8 = 400ms)을 넘겨 기다린다.
    await page.waitForTimeout(500);
    const { box, hit } = await el.evaluate((node) => {
      // 히트 영역이 박스 밖으로 나가므로 요소를 화면 가운데에 둔다.
      // 가장자리에 걸치면 탐침이 뷰포트 밖으로 나가 짧게 잰다.
      node.scrollIntoView({ block: "center", inline: "center" });
      const r = node.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const hits = (x, y) => {
        const t = document.elementFromPoint(x, y);
        return t !== null && (t === node || node.contains(t));
      };
      // 중심에서 한 방향으로 히트가 이어지는 길이. 뷰포트 끝까지 본다.
      // 요소가 0.5px 좌표에 놓일 수 있어 반 픽셀씩 나간다 — 정수로 나가면 1px 더 센다.
      const STEP = 0.5;
      const limit = Math.max(window.innerWidth, window.innerHeight);
      const extent = (dx, dy) => {
        let d = 0;
        while (d < limit && hits(cx + dx * (d + STEP), cy + dy * (d + STEP)))
          d += STEP;
        return d;
      };
      return {
        box: { w: Math.round(r.width), h: Math.round(r.height) },
        hit: {
          w: Math.round(extent(-1, 0) + extent(1, 0)),
          h: Math.round(extent(0, -1) + extent(0, 1)),
        },
      };
    });
    const line = `${label} 히트 ${hit.w}×${hit.h} (박스 ${box.w}×${box.h})`;
    const min = Math.min(hit.w, hit.h);
    if (min < 24) bad(`${line} — 하한 24px 미만`);
    else if (min >= 44) ok(line);
    else if (exception) ok(`${line} — 예외: ${exception}`);
    else warn(`${line} — 44px 미만`);
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
