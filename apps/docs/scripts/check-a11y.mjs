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
 * 2-c. 버튼 **조합 전수** — variant(solid·soft·line·text) × color(넷) × 상태(기본·비활성).
 *    예전에는 셋만 재고 있었고, 실제로 나온 위반 둘이 그 목록 밖이었다 (06 D10).
 * 2-e. soft · line · text 의 hover · active 글자 — 2-b 의 hover 항목은 solid 만 잰다.
 * 2-f. 선택 컨트롤 **전수** — tone × 상태 × 테마. 채움과 그 위 표시의 반전 짝.
 * 2-g. 포커스가 안쪽 내용을 **밀지 않는가** — 두께를 상태로 바꾸면 글자가 흔들린다.
 *    면이 없는 것은 **실제로 마우스를 올리고 눌러서** 잰다.
 * 2-d. placeholder — `::placeholder` 는 의사요소라 요소 순회에 안 잡힌다. placeholder 도 글자다.
 * 3. 터치 영역 — 누를 수 있는 것의 히트 영역 실측 (a11y.md §8)
 *    박스가 아니라 `elementFromPoint` 로 실제 눌리는 범위를 잰다.
 *    24px 미만은 실패, 44px 미만은 경고. 이유가 적힌 예외는 통과.
 *
 * 사용: dev server 기동 후  node scripts/check-a11y.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE =
  process.argv.slice(2).find((a) => !a.startsWith("--")) ??
  `http://localhost:${process.env.PORT ?? 3000}`; // PORT 는 next dev 도 읽는다 — 세션마다 다른 포트 (2026-09-11)

// --page=button,textfield — `scripts/changed-scope.mjs` 가 뽑은 슬러그만 잰다. 없으면 전체 (2026-09-11).
// 고칠 때마다 3~4분을 기다리지 않게 하는 필터다. 공유 자산이 바뀌면 changed-scope 가 all 을 내고,
// revise 4단계 직전의 전체 실행이 필터가 놓친 것을 잡는다. 필터로 건너뛴 절은 그 사실을 찍는다.
const pageArg = process.argv.find((a) => a.startsWith("--page="));
const SCOPE = pageArg
  ? new Set(pageArg.slice("--page=".length).split(",").filter(Boolean))
  : null;
const inScope = (url) =>
  !SCOPE || SCOPE.has(url.replace(/^\/components\//, "").replace(/^\//, ""));
const skipped = (what) =>
  console.log(
    `  ⏭️  ${what} — 범위 밖 (--page=${[...(SCOPE ?? [])].join(",")})`,
  );

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
].filter(([, url]) => inScope(url))) {
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
//      `animation: none` 으로 직접 멈춰야 한다 (a11y.md §6 · Button.md spec §7).
if (!inScope("/components/button")) skipped("Button 로딩 스피너");
else {
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
  // 열린 항목의 제목 — `text-brand`(brand-11) 가 `layer-default` 위에 서는 유일한 자리 (2026-09-13).
  // 데모의 첫 아코디언이 defaultActiveIndices={[0]} 이라 열려 있다
  [
    "Accordion 열린 제목",
    "/components/accordion",
    ".nui-accordion__item.nui-is-active .nui-accordion__button:not(.nui-accordion__button--icon) .nui-accordion__title",
    4.5,
  ],
  [
    "Accordion 닫힌 제목",
    "/components/accordion",
    ".nui-accordion__item:not(.nui-is-active) .nui-accordion__button:not(.nui-accordion__button--icon) .nui-accordion__title",
    4.5,
  ],
  ["에러 메시지", "/components/textfield", ".nui-message__msg--error", 4.5],
  // 도움말은 Footer 의 Message 다 — Field.Description 은 없다 (2026-09-11)
  [
    "Field 도움말",
    "/components/field",
    ".nui-field__footer .nui-message__msg",
    4.5,
  ],
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
  // ⚠️ tone 마다 잰다. 예전에는 기본 토스트만 재고 있었고, 그 사이 error 가 다크에서
  //    어두운 배경 + 어두운 글자로 **1.14:1** 이 되어 있었다 (2026-09-07 발견).
  [
    "Toast 메시지 (success)",
    "/components/toast",
    ".nui-toast--success .nui-toast__message",
    4.5,
    async (page) =>
      page.getByRole("button", { name: "성공 토스트" }).first().click(),
  ],
  [
    "Toast 메시지 (error)",
    "/components/toast",
    ".nui-toast--error .nui-toast__message",
    4.5,
    async (page) =>
      page.getByRole("button", { name: "에러 토스트" }).first().click(),
  ],
  // 2026-09-10 — 사이드바 28 중 19 만 재고 있었다. 컨트롤이 있는 여섯 페이지를 더한다.
  //   「통과」가 「검사한 것만 통과」가 되지 않게 (a11y.md §4-1). icon · message · popup(개요)은
  //   컨트롤이 없어 뺀다.
  [
    "ButtonLink 라벨",
    "/components/button-link",
    "a.nui-button .nui-button__wrap",
    4.5,
  ],
  [
    "ButtonLink primary 라벨",
    "/components/button-link",
    "a.nui-button--primary .nui-button__wrap",
    4.5,
  ],
  [
    "ButtonGroup 항목 라벨",
    "/components/button-group",
    ".nui-button-group .nui-button__wrap",
    4.5,
  ],
  [
    "Alert 제목",
    "/components/alert",
    ".nui-popup__title",
    4.5,
    async (page) => page.getByRole("button", { name: "저장" }).first().click(),
  ],
  [
    "Alert 설명",
    "/components/alert",
    ".nui-popup__description",
    4.5,
    async (page) => page.getByRole("button", { name: "저장" }).first().click(),
  ],
  [
    "Alert 확인 버튼 라벨",
    "/components/alert",
    ".nui-popup__actions .nui-button__wrap, .nui-popup__foot .nui-button__wrap",
    4.5,
    async (page) => page.getByRole("button", { name: "저장" }).first().click(),
  ],
  // tone 아이콘 — **글자가 아니라 기준이 3.0 이다** (WCAG 1.4.11 · a11y.md §4-1).
  // 면이 없어 패널 표면 위에서 바로 재진다.
  //
  // ⚠️ **셀렉터를 tone 마다 나눈다** (2026-09-11 리뷰). 넷을 전부 `.nui-popup__icon` 으로
  //    두었더니 tone 클래스가 안 붙어도 · SCSS tone 절이 통째로 사라져도 넷 다 기본색을
  //    재고 통과했다 — **검출력 0 인 검사가 「넷 통과」 문구를 만든다**(scripts.md §4).
  //    지금은 클래스가 빠지면 「요소를 찾지 못했다」로 실패한다.
  //
  // ⚠️ 기본값 `info` 는 tone 클래스를 붙이지 않는데, `:not([class*="--"])` 로는 못 잡는다 —
  //    루트에 `nui-popup--dialog` · `--small` 이 함께 있어 그 조건이 **언제나 거짓**이다
  //    (검출력 시험에서 잡았다). tone 셋을 하나씩 부정해야 한다.
  ...[
    [
      "info",
      ".nui-popup-alert:not(.nui-popup-alert--success):not(.nui-popup-alert--warning):not(.nui-popup-alert--danger) .nui-popup__icon",
    ],
    ["success", ".nui-popup-alert--success .nui-popup__icon"],
    ["warning", ".nui-popup-alert--warning .nui-popup__icon"],
    ["danger", ".nui-popup-alert--danger .nui-popup__icon"],
  ].map(([tone, selector], index) => [
    `Alert tone=${tone} 아이콘`,
    "/components/alert",
    selector,
    3,
    async (page) =>
      page
        .locator(".doc-case-grid")
        .first()
        .locator(".doc-case")
        .nth(index)
        .getByRole("button")
        .click(),
  ]),
  [
    "Confirm 제목",
    "/components/confirm",
    ".nui-popup__title",
    4.5,
    async (page) => page.getByRole("button", { name: "삭제" }).first().click(),
  ],
  [
    "Confirm 취소 버튼 라벨 (line)",
    "/components/confirm",
    ".nui-popup__actions .nui-button--line .nui-button__wrap, .nui-popup__foot .nui-button--line .nui-button__wrap",
    4.5,
    async (page) => page.getByRole("button", { name: "삭제" }).first().click(),
  ],
  [
    "BottomSheet 제목",
    "/components/bottom-sheet",
    ".nui-popup__title",
    4.5,
    async (page) =>
      page.getByRole("button", { name: "정렬 바꾸기" }).first().click(),
  ],
  [
    "FullPopup 제목",
    "/components/full-popup",
    ".nui-popup__title",
    4.5,
    async (page) =>
      page.getByRole("button", { name: "상품 상세 보기" }).first().click(),
  ],
];

for (const theme of ["light", "dark"]) {
  console.log(`\n■ 명도 대비 — ${theme}`);
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: theme,
  });
  const page = await ctx.newPage();

  for (const [label, url, selector, min, open] of CONTRAST_TARGETS.filter((t) =>
    inScope(t[1]),
  )) {
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
    // 사이트 크롬(모바일 헤더의 IconButton · Switch)이 DOM 앞에 있고 데스크톱에서는
    // display: none 이다. 보이는 것 중 첫 번째를 잰다 (2026-09-11 · 문서 반응형)
    const el = page.locator(selector).filter({ visible: true }).first();
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
  // 반전 표면 위 — 토스트의 접두 아이콘과 액션 라벨. 채움 단계(9·11)는 여기서 3.9~4.6 이라
  // 못 쓴다. 3단계가 테마마다 뒤집혀 반전 표면과 언제나 반대다.
  ["토스트 success 아이콘", "text-success-on-inverse", "layer-inverse", 3],
  ["토스트 error 아이콘", "text-danger-on-inverse", "layer-inverse", 3],
  ["토스트 액션 라벨", "text-brand-on-inverse", "layer-inverse", 4.5],
  // 반전 표면 위의 hover·active **면** — 알파 토큰이라 표면을 먼저 칠하고 그 위에 얹어 읽는다("over").
  // 그냥 읽으면 rgba 의 rgb 만 남아 흰 7.8% 가 흰색(21:1)으로 **통과해 버린다** — 헛통과다.
  // 하한 1.1 은 AA 가 아니라 「보임」 — 라이트 투명 요소의 hover(a3)가 흰 위 1.15 다. 예전 값
  // (`control-bg-hover` 검정 알파를 `#000` 위에)은 ≈1.00 이라 두 테마 모두 안 보였다 (2026-09-14)
  [
    "토스트 닫기 hover 면 (보임 하한)",
    "control-bg-hover-on-inverse",
    "layer-inverse",
    1.1,
    "over",
  ],
  [
    "토스트 닫기 active 면 (보임 하한)",
    "control-bg-active-on-inverse",
    "layer-inverse",
    1.1,
    "over",
  ],
  // 검출력 시험(2026-09-14) — 옛 값(`control-bg-hover` 를 반전 표면에 "over")을 넣으면 1.01 · 1.00 으로
  // 실패했다. 합성 없이 읽으면 같은 쌍이 21:1 로 통과한다 — "over" 를 빼면 검사가 눈을 감는다.
  // 비활성 선도 배경에 녹으면 "없음"으로 읽힌다 — 하한 2.0 (design-system.md §2)
  [
    "비활성 입력 테두리 (하한)",
    "control-border-disabled",
    "control-bg-disabled",
    2,
  ],
  [
    "비활성 선택 컨트롤 테두리 (하한)",
    "control-border-disabled",
    "control-bg-subtle",
    2,
  ],
  [
    "비활성 선택 컨트롤 채움 (하한)",
    "control-selection-disabled",
    "layer-default",
    2,
  ],
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
  // quiet 은 채움이 gray-11 이라 neutral(gray-12)보다 여유가 적다. 기본 · hover · pressed 셋 다 잰다
  ["quiet 글자 · 배경", "action-quiet-fg", "action-quiet", 4.5],
  ["quiet 글자 · hover 배경", "action-quiet-fg", "action-quiet-hover", 4.5],
  ["quiet 글자 · pressed 배경", "action-quiet-fg", "action-quiet-active", 4.5],
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
];

for (const theme of inScope("/components/button") ? ["light", "dark"] : []) {
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
    // `under` 를 주면 그 토큰을 먼저 칠하고 위에 얹는다 — 알파 면(hover·active)은 표면과 합성해야 값이 나온다
    const read = (token, under) => {
      ctx.clearRect(0, 0, 1, 1);
      if (under) {
        probe.style.backgroundColor = `var(--nui-${under})`;
        ctx.fillStyle = getComputedStyle(probe).backgroundColor;
        ctx.fillRect(0, 0, 1, 1);
      }
      probe.style.backgroundColor = `var(--nui-${token})`;
      ctx.fillStyle = getComputedStyle(probe).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return a === 0 ? "" : `rgb(${r}, ${g}, ${b})`;
    };
    const out = pairs.map(([label, fg, bg, min, mode]) => [
      label,
      read(fg, mode === "over" ? bg : undefined),
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

// ── 2-c) 버튼 조합 전수 — variant 4 × color 4 × 상태 2, 두 테마 (06 D10)
//
// 예전에는 기본·primary·비활성 **셋만** 재고 있었다. D9(warning line·text 글자 1.5) ·
// D12(비활성 line 테두리 1.38)는 전부 그 목록 **밖**에서 났다.
// "통과"가 "검사한 것은 통과"가 되면 위반이 검사 밖에 숨는다.
//
// 문서 사이트가 30조합을 다 렌더하지는 않으므로, 실제 데모 버튼 **옆에** 같은 표면 위로
// 탐침을 심어 잰다. 배경이 데모 카드의 것이라 화면에서 보이는 값과 같다.
console.log("\n■ 버튼 조합 전수 — variant × color × 상태 (라이트 · 다크)");

const BUTTON_COLORS = [
  ["neutral", ""],
  // quiet 은 2026-09-11 에 늘었다. soft 와 같다 — 목록에 안 더하면 새 색이 검사 밖이다.
  ["quiet", "nui-button--quiet"],
  ["primary", "nui-button--primary"],
  ["secondary", "nui-button--secondary"],
  ["danger", "nui-button--danger"],
];
const BUTTON_VARIANTS = [
  ["solid", ""],
  // soft 는 2026-09-07 에 늘었다(prototype B1). 목록에 안 더하면 새 variant 가
  // 검사 밖으로 빠진다 — 이 절이 존재하는 이유가 정확히 그것이다.
  ["soft", "nui-button--soft"],
  ["line", "nui-button--line"],
  ["text", "nui-button--text"],
];

/**
 * 색 계산을 **캔버스에 실제로 칠해서** 한다.
 *  - `color-mix()` 의 계산값은 `oklab(...)` 문자열이라 숫자만 뽑으면 틀린다
 *  - 반투명 테두리(알파 토큰)는 뒷배경과 합성해야 눈에 보이는 색이 된다
 * 둘 다 "배경을 먼저 칠하고 그 위에 덧칠한 뒤 픽셀을 읽는" 방식 하나로 풀린다.
 */
const BUTTON_PROBE = ({ colors, variants }) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const cx = canvas.getContext("2d", { willReadFrequently: true });
  const composite = (bg, fg) => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = "#fff";
    cx.fillRect(0, 0, 1, 1);
    cx.fillStyle = bg;
    cx.fillRect(0, 0, 1, 1);
    if (fg) {
      cx.fillStyle = fg;
      cx.fillRect(0, 0, 1, 1);
    }
    const [r, g, b] = cx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  };
  const opaqueBehind = (node) => {
    let cur = node.parentElement;
    while (cur) {
      const value = getComputedStyle(cur).backgroundColor;
      if (value && !/rgba\(0, 0, 0, 0\)|transparent/.test(value)) return value;
      cur = cur.parentElement;
    }
    return getComputedStyle(document.documentElement).backgroundColor;
  };

  // 데모 버튼과 같은 표면 위에 심는다. 없으면 body.
  const sample = [...document.querySelectorAll(".nui-button")].find(
    (b) => b.getClientRects().length > 0,
  );
  const host = document.createElement("div");
  host.style.cssText = "position:absolute;left:-9999px;top:0;width:200px";
  (sample?.parentElement ?? document.body).appendChild(host);

  const rows = [];
  for (const [color, colorClass] of colors) {
    for (const [variant, variantClass] of variants) {
      for (const disabled of [false, true]) {
        const el = document.createElement("button");
        el.type = "button";
        el.className = ["nui-button", colorClass, variantClass]
          .filter(Boolean)
          .join(" ");
        if (disabled) el.disabled = true;
        const wrap = document.createElement("span");
        wrap.className = "nui-button__wrap";
        wrap.textContent = "확인";
        el.appendChild(wrap);
        host.appendChild(el);

        const cs = getComputedStyle(el);
        const behind = opaqueBehind(el);
        const own = cs.backgroundColor;
        const filled = !/rgba\(0, 0, 0, 0\)|transparent/.test(own);
        // 글자는 자기 배경 위에 — solid 면 버튼 면, line·text 면 뒤 표면
        const bg = composite(behind, filled ? own : null);
        const fg = composite(
          `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`,
          getComputedStyle(wrap).color,
        );
        // 테두리는 면이 없는 것(line)만 잰다 — solid 는 테두리색이 배경색과 같아
        // 재봐야 1:1 이고, text 는 테두리가 없다.
        const width = parseFloat(cs.borderTopWidth) || 0;
        const border =
          !filled && width > 0 ? composite(behind, cs.borderTopColor) : null;
        rows.push({ color, variant, disabled, fg, bg, border });
        el.remove();
      }
    }
  }
  host.remove();
  return rows;
};

for (const theme of inScope("/components/button") ? ["light", "dark"] : []) {
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
    bad(`버튼 조합: 테마가 ${theme} 이어야 하는데 ${stamped} 다`);
    await ctx.close();
    continue;
  }
  const rows = await page.evaluate(BUTTON_PROBE, {
    colors: BUTTON_COLORS,
    variants: BUTTON_VARIANTS,
  });
  for (const { color, variant, disabled, fg, bg, border } of rows) {
    const where = `${theme} ${variant}/${color}${disabled ? " 비활성" : ""}`;
    // 비활성은 AA 에서 빠지지만 하한 2.0 을 둔다 (design-system.md §2)
    const textMin = disabled ? 2.0 : 4.5;
    const t = ratio(fg, bg);
    const tLine = `${where} 글자 ${t.toFixed(2)}:1`;
    t >= textMin ? ok(tLine) : bad(`${tLine} — 기준 ${textMin}:1 미달`);

    if (border) {
      const borderMin = disabled ? 2.0 : 3.0;
      const b = ratio(border, bg);
      const bLine = `${where} 테두리 ${b.toFixed(2)}:1`;
      b >= borderMin ? ok(bLine) : bad(`${bLine} — 기준 ${borderMin}:1 미달`);
    }
  }
  await ctx.close();
}

// ── 2-e) 면이 없는 액션(line · text)의 hover · active 글자 (2026-09-07)
//
// 2-b 의 hover · pressed 항목은 **solid 만** 잰다(채움색 위 글자). line · text 는 배경이
// 없어서 그 쌍으로 잴 수 없는데, 예전에는 hover 에서 글자색이 다음 단계로 옮겨 가고 있었다
// — 다크에서 오히려 나빠지는 방향이었다(brand 9단계 3.33 → 10단계 2.70).
//
// 토큰 계산으로 흉내내지 않고 **실제로 마우스를 올리고 눌러서** 잰다. 그래야 나중에
// 누가 hover 규칙을 되돌려도 검사가 잡는다.
console.log("\n■ soft · line · text 의 hover · active 글자 (라이트 · 다크)");

const HOVER_VARIANTS = [
  // soft 도 hover · active 에서 같은 색조의 다음 단계로 간다(3 → 4 → 5). 면이 있으니
  // 2-c 로도 잡히지만, 움직이는 값은 실제로 올려 보고 눌러 봐야 안다.
  ["soft", "nui-button--soft"],
  ["line", "nui-button--line"],
  ["text", "nui-button--text"],
];

/** 페이지에 탐침 도구를 심는다. 배경은 데모 표면과 같은 색으로 직접 칠한다. */
const INSTALL_PROBE = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const cx = canvas.getContext("2d", { willReadFrequently: true });
  const flatten = (layers) => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = "#fff";
    cx.fillRect(0, 0, 1, 1);
    for (const layer of layers) {
      if (!layer || /rgba\(0, 0, 0, 0\)|transparent/.test(layer)) continue;
      cx.fillStyle = layer;
      cx.fillRect(0, 0, 1, 1);
    }
    const [r, g, b] = cx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  };
  // 데모 버튼이 실제로 놓인 표면
  let cur = [...document.querySelectorAll(".nui-button")].find(
    (b) => b.getClientRects().length > 0,
  )?.parentElement;
  let surface = "rgb(255, 255, 255)";
  while (cur) {
    const value = getComputedStyle(cur).backgroundColor;
    if (value && !/rgba\(0, 0, 0, 0\)|transparent/.test(value)) {
      surface = value;
      break;
    }
    cur = cur.parentElement;
  }
  const host = document.createElement("div");
  host.id = "nui-a11y-probe";
  host.style.cssText = `position:fixed;left:24px;top:24px;z-index:99999;padding:8px;width:180px;background:${surface}`;
  document.body.appendChild(host);
  window.__nuiProbe = { flatten, surface, host };
};

const MOUNT_PROBE = (className) => {
  const { host } = window.__nuiProbe;
  host.textContent = "";
  const el = document.createElement("button");
  el.type = "button";
  el.className = className;
  const wrap = document.createElement("span");
  wrap.className = "nui-button__wrap";
  wrap.textContent = "확인";
  el.appendChild(wrap);
  host.appendChild(el);
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

const READ_PROBE = () => {
  const { flatten, surface, host } = window.__nuiProbe;
  const el = host.firstElementChild;
  const cs = getComputedStyle(el);
  const filled = !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor);
  const bg = flatten([surface, cs.backgroundColor]);
  const wrap = el.querySelector(".nui-button__wrap");
  const fg = flatten([
    `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`,
    getComputedStyle(wrap).color,
  ]);
  // 테두리는 면 위가 아니라 뒤 표면 위에 놓인다 — hover 배경은 알파라 그 아래로 비친다
  const width = parseFloat(cs.borderTopWidth) || 0;
  const border =
    width > 0
      ? flatten([surface, cs.backgroundColor, cs.borderTopColor])
      : null;
  return { fg, bg, border, filled };
};

for (const theme of inScope("/components/button") ? ["light", "dark"] : []) {
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
    bad(`line·text hover: 테마가 ${theme} 이어야 하는데 ${stamped} 다`);
    await ctx.close();
    continue;
  }
  await page.evaluate(INSTALL_PROBE);

  for (const [color, colorClass] of BUTTON_COLORS) {
    for (const [variant, variantClass] of HOVER_VARIANTS) {
      const className = ["nui-button", colorClass, variantClass]
        .filter(Boolean)
        .join(" ");
      const { x, y } = await page.evaluate(MOUNT_PROBE, className);
      await page.mouse.move(x, y);
      // 색 전환이 duration-3(150ms)이다. 끝난 뒤에 잰다.
      await page.waitForTimeout(250);
      const hover = await page.evaluate(READ_PROBE);
      await page.mouse.down();
      await page.waitForTimeout(250);
      const active = await page.evaluate(READ_PROBE);
      await page.mouse.up();

      for (const [state, m] of [
        ["hover", hover],
        ["active", active],
      ]) {
        const r = ratio(m.fg, m.bg);
        const line = `${theme} ${variant}/${color} ${state} 글자 ${r.toFixed(2)}:1`;
        r >= 4.5 ? ok(line) : bad(`${line} — 기준 4.5:1 미달`);

        // 면이 있는 것(soft)은 테두리색이 곧 배경색이라 재봐야 1:1 이다 —
        // 2-c 가 쓰는 규칙과 같다. 재는 대상은 면이 없는 line 의 테두리다.
        if (m.border && !m.filled) {
          const b = ratio(m.border, m.bg);
          const bLine = `${theme} ${variant}/${color} ${state} 테두리 ${b.toFixed(2)}:1`;
          b >= 3.0 ? ok(bLine) : bad(`${bLine} — 기준 3:1 미달`);
        }
      }
    }
  }
  await page.evaluate(() =>
    document.getElementById("nui-a11y-probe")?.remove(),
  );
  await ctx.close();
}

// ── 2-g) 포커스가 글자를 밀지 않는다 (2026-09-08 · T2)
//
// 입력 컨트롤 셋이 포커스에서 테두리를 1px → 2px 로 굵히고 있었다. `border-box` 라
// 안쪽이 1px 줄어 **글자가 오른쪽으로 밀렸다** — Tab 으로 훑을 때 칸마다 미세하게
// 흔들린다. 눈으로는 잘 안 보이고 좌표를 재야 드러난다.
//
// 지금은 두께를 상태로 바꾸지 않는다(design-system.md §4-1). 되돌아오면 여기서 잡는다.
console.log("\n■ 포커스가 글자를 밀지 않는가");

/** [이름, 페이지, 컨트롤 셀렉터, 포커스 대상, 기준선 셀렉터] */
const SHIFT_TARGETS = [
  [
    "Textfield",
    "/components/textfield",
    ".nui-textfield__wrap",
    ".nui-textfield__input",
  ],
  [
    "Textarea",
    "/components/textarea",
    ".nui-textarea__wrap",
    ".nui-textarea__input",
  ],
  [
    "Search",
    "/components/search",
    ".nui-textfield__wrap",
    ".nui-textfield__input",
  ],
  [
    "Select",
    "/components/select",
    ".nui-select__control",
    ".nui-select__control",
  ],
];

{
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: "light",
  });
  for (const [label, path, boxSel, focusSel] of SHIFT_TARGETS.filter((t) =>
    inScope(t[1]),
  )) {
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const moved = await page.evaluate(
      async ({ boxSel, focusSel }) => {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        const box = document.querySelector(boxSel);
        if (!box) return { missing: true };
        // 안쪽 내용이 기준이다 — 상자 자체는 어차피 안 움직인다
        const inner = box.firstElementChild ?? box;
        const at = () => {
          const b = box.getBoundingClientRect();
          const i = inner.getBoundingClientRect();
          return [+(i.left - b.left).toFixed(2), +(i.top - b.top).toFixed(2)];
        };
        const target = document.querySelector(focusSel);
        target.blur();
        document.body.focus();
        await sleep(280);
        const rest = at();
        target.focus();
        await sleep(280);
        const focused = at();
        target.blur();
        return { rest, focused };
      },
      { boxSel, focusSel },
    );
    if (moved.missing) {
      bad(`${label} 밀림: ${boxSel} 를 찾지 못했다`);
    } else {
      const dx = +(moved.focused[0] - moved.rest[0]).toFixed(2);
      const dy = +(moved.focused[1] - moved.rest[1]).toFixed(2);
      const line = `${label} 포커스 밀림 ${dx}, ${dy}`;
      dx === 0 && dy === 0
        ? ok(line)
        : bad(`${line} — 포커스가 안쪽 내용을 움직이면 안 된다`);
    }
    await page.close();
  }
  await ctx.close();
}

// ── 2-f) 선택 컨트롤 전수 — tone × 상태 × 테마 (2026-09-08 · S1)
//
// 채움이 중립이 되면서 **반전 짝**이 생겼다. `control-accent` 는 다크에서 흰색으로
// 뒤집히는데 그 위 표시(체크 · 라디오 점 · 스위치 썸)가 흰색으로 고정이면 흰 위
// 흰색이 된다 — 실측 1.0:1 로 아예 안 보였다.
//
// 토큰 쌍으로는 이걸 못 잡는다. 짝이 맞는지가 **DOM 에서 어느 변수를 읽느냐**에
// 달려 있어서다. 그래서 실제 컨트롤을 심어 놓고 렌더된 색을 읽는다.
console.log("\n■ 선택 컨트롤 전수 — tone × 상태 (라이트 · 다크)");

const SELECTION_TONES = [
  ["neutral", ""],
  ["brand", "--brand"],
];
const SELECTION_STATES = [
  ["기본", "", ""],
  ["에러", "nui-is-error", ""],
  ["비활성", "nui-is-disabled", "disabled"],
];

/** 체크박스 · 라디오 · 스위치를 직접 심어 채움과 그 위 표시의 대비를 잰다. */
const SELECTION_PROBE = ({ tones, states }) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const cx = canvas.getContext("2d", { willReadFrequently: true });
  const flatten = (layers) => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = "#fff";
    cx.fillRect(0, 0, 1, 1);
    for (const layer of layers) {
      if (!layer || /rgba\(0, 0, 0, 0\)|transparent/.test(layer)) continue;
      cx.fillStyle = layer;
      cx.fillRect(0, 0, 1, 1);
    }
    const [r, g, b] = cx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  };

  let cur = document.querySelector(".nui-checkbox")?.parentElement;
  let surface = "rgb(255, 255, 255)";
  while (cur) {
    const value = getComputedStyle(cur).backgroundColor;
    if (value && !/rgba\(0, 0, 0, 0\)|transparent/.test(value)) {
      surface = value;
      break;
    }
    cur = cur.parentElement;
  }

  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:24px;top:24px;z-index:99999;padding:8px;background:${surface}`;
  document.body.appendChild(host);

  // [이름, 블록 클래스, 표시 클래스, 표시의 색이 실린 속성]
  const KINDS = [
    ["Checkbox", "nui-checkbox", "nui-checkbox__indicator", "borderRightColor"],
    ["Radio", "nui-radio", "nui-radio__indicator", "backgroundColor"],
    ["Switch", "nui-switch", "nui-switch__thumb", "backgroundColor"],
  ];

  const rows = [];
  for (const [kind, blockClass, markClass, markProp] of KINDS) {
    for (const [tone, toneMod] of tones) {
      for (const [state, stateClass, inputAttr] of states) {
        host.innerHTML =
          `<span class="${blockClass}${toneMod ? " " + blockClass + toneMod : ""}${stateClass ? " " + stateClass : ""}">` +
          `<input type="checkbox" class="${blockClass}__input" checked ${inputAttr}>` +
          `<span class="${blockClass}__control"><span class="${markClass}"></span></span>` +
          `</span>`;
        const control = host.querySelector(`.${blockClass}__control`);
        const mark = host.querySelector(`.${markClass}`);
        const fill = flatten([
          surface,
          getComputedStyle(control).backgroundColor,
        ]);
        const markColor = flatten([
          `rgb(${fill[0]}, ${fill[1]}, ${fill[2]})`,
          getComputedStyle(mark)[markProp],
        ]);
        rows.push({
          kind,
          tone,
          state,
          fill,
          mark: markColor,
          surface: flatten([surface]),
        });
      }
    }
  }
  host.remove();
  return rows;
};

for (const theme of inScope("/components/checkbox") ? ["light", "dark"] : []) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/components/checkbox", { waitUntil: "networkidle" });
  const stamped = await page.evaluate(
    () => document.documentElement.dataset.theme,
  );
  if (stamped !== theme) {
    bad(`선택 컨트롤: 테마가 ${theme} 이어야 하는데 ${stamped} 다`);
    await ctx.close();
    continue;
  }
  const rows = await page.evaluate(SELECTION_PROBE, {
    tones: SELECTION_TONES,
    states: SELECTION_STATES,
  });
  for (const { kind, tone, state, fill, mark, surface } of rows) {
    const where = `${theme} ${kind}/${tone} ${state}`;
    // 표시는 글자가 아니라 도형이다 — 비텍스트 3:1. 비활성은 하한 2.0
    const markMin = state === "비활성" ? 2 : 3;
    const m = ratio(mark, fill);
    const mLine = `${where} 표시 ${m.toFixed(2)}:1`;
    m >= markMin ? ok(mLine) : bad(`${mLine} — 기준 ${markMin}:1 미달`);
    // 채움 자체도 표면과 갈려야 "선택됨"으로 읽힌다
    const f = ratio(fill, surface);
    const fLine = `${where} 채움 ${f.toFixed(2)}:1`;
    f >= markMin ? ok(fLine) : bad(`${fLine} — 기준 ${markMin}:1 미달`);
  }
  await ctx.close();
}

// ── 2-c-2) Checkbox shape="ghost" — 면이 없는 모양 (2026-09-12)
//
// 위 절은 **채움 위의 표시**를 잰다. ghost 에는 채움이 없으므로 표시를 **표면과 직접**
// 재야 하고, 미선택에도 체크가 보이므로 **선택 여부 두 벌을 다** 재야 한다.
//
// ⚠️ 선택 여부를 색이 말하지 않는다 — brand · danger 로 칠한 체크는 미선택 회색과
//    1.4:1 이라 색만으로는 WCAG 1.4.1 을 못 넘는다. 그래서 **획 두께가 실제로 갈리는지**를
//    함께 본다. 색 대비만 재면 그 채널이 사라져도 통과한다.
//
// 검출력 시험 (2026-09-12 · scripts.md §4) — 실제 SCSS 를 한 줄씩 망가뜨려 재확인했다.
//   · 선택 시 획을 `border-width-1` 로 되돌린다  → 「획 1 → 1」 **16건 검출**
//   · ghost 의 면을 `control-bg-subtle` 로 남긴다 → 「면이 남아 있다」 **16건 검출**
//   둘 다 되돌린 뒤 0건. 현재 트리에서 헛짚기 0 · 통과 48건.
console.log(
  "\n■ Checkbox shape=ghost — 선택여부 × tone × 상태 (라이트 · 다크)",
);

/** [라벨, 상태 클래스, input 속성] — 위 절과 달리 읽기 전용도 잰다(ghost 는 표시색이 바뀐다) */
const GHOST_STATES = [
  ["기본", "", ""],
  ["에러", "nui-is-error", ""],
  ["비활성", "nui-is-disabled", "disabled"],
  ["읽기전용", "nui-is-readonly", ""],
];

let ghostChecks = 0;

const GHOST_PROBE = ({ tones, states }) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const cx = canvas.getContext("2d", { willReadFrequently: true });
  const flatten = (layers) => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = "#fff";
    cx.fillRect(0, 0, 1, 1);
    for (const layer of layers) {
      if (!layer || /rgba\(0, 0, 0, 0\)|transparent/.test(layer)) continue;
      cx.fillStyle = layer;
      cx.fillRect(0, 0, 1, 1);
    }
    const [r, g, b] = cx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  };

  let cur = document.querySelector(".nui-checkbox")?.parentElement;
  let surface = "rgb(255, 255, 255)";
  while (cur) {
    const value = getComputedStyle(cur).backgroundColor;
    if (value && !/rgba\(0, 0, 0, 0\)|transparent/.test(value)) {
      surface = value;
      break;
    }
    cur = cur.parentElement;
  }

  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:24px;top:24px;z-index:99999;padding:8px;background:${surface}`;
  document.body.appendChild(host);

  const rows = [];
  for (const [tone, toneMod] of tones) {
    for (const [state, stateClass, inputAttr] of states) {
      for (const checked of [false, true]) {
        host.innerHTML =
          `<span class="nui-checkbox nui-checkbox--ghost${toneMod ? " nui-checkbox" + toneMod : ""}${stateClass ? " " + stateClass : ""}">` +
          `<input type="checkbox" class="nui-checkbox__input" ${checked ? "checked" : ""} ${inputAttr}>` +
          `<span class="nui-checkbox__control"><span class="nui-checkbox__indicator"></span></span>` +
          `</span>`;
        const control = host.querySelector(".nui-checkbox__control");
        const mark = host.querySelector(".nui-checkbox__indicator");
        const markStyle = getComputedStyle(mark);
        const face = getComputedStyle(control).backgroundColor;
        rows.push({
          tone,
          state,
          checked,
          surface: flatten([surface]),
          // 면을 함께 깔아 「정말로 투명한가」가 수치에 드러나게 한다
          mark: flatten([surface, face, markStyle.borderRightColor]),
          face,
          stroke: parseFloat(markStyle.borderRightWidth),
        });
      }
    }
  }
  host.remove();
  return rows;
};

for (const theme of inScope("/components/checkbox") ? ["light", "dark"] : []) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/components/checkbox", { waitUntil: "networkidle" });
  const rows = await page.evaluate(GHOST_PROBE, {
    tones: SELECTION_TONES,
    states: GHOST_STATES,
  });
  if (rows.length === 0) {
    bad(`ghost(${theme}): 잰 것이 하나도 없다 — 셀렉터가 늙었다`);
  }
  const strokes = new Map();
  for (const { tone, state, checked, surface, mark, face, stroke } of rows) {
    const where = `${theme} ghost/${tone} ${state} ${checked ? "선택" : "미선택"}`;
    // 표시는 도형이다 — 비텍스트 3:1. 비활성은 하한 2.0
    const markMin = state === "비활성" ? 2 : 3;
    const m = ratio(mark, surface);
    const line = `${where} 표시 ${m.toFixed(2)}:1`;
    m >= markMin ? ok(line) : bad(`${line} — 기준 ${markMin}:1 미달`);
    ghostChecks += 1;
    // ghost 는 어떤 상태에서도 면을 갖지 않는다 — hover · 눌림에도 (2026-09-13). 이 절은 정적
    // 상태만 재고 `:active` 는 재지 않는다. 눌림 면과 배율은 `check-press.mjs` 가 누른 채로 잰다
    if (!/rgba\(0, 0, 0, 0\)|transparent/.test(face)) {
      bad(`${where} — 면이 남아 있다(${face}). ghost 는 상자를 그리지 않는다`);
    }
    strokes.set(`${tone}/${state}/${checked}`, stroke);
  }
  for (const [tone] of SELECTION_TONES) {
    for (const [state] of GHOST_STATES) {
      const off = strokes.get(`${tone}/${state}/false`);
      const on = strokes.get(`${tone}/${state}/true`);
      const line = `${theme} ghost/${tone} ${state} 획 ${off} → ${on}`;
      on > off
        ? ok(line)
        : bad(`${line} — 선택 여부를 색 말고 말하는 것이 없다 (WCAG 1.4.1)`);
      ghostChecks += 1;
    }
  }
  await ctx.close();
}

// ── 2-d) placeholder — placeholder 도 글자다 (06 D14)
//
// `::placeholder` 는 의사요소라 요소 순회로는 안 잡힌다. 그래서 검사 밖에 있었다.
console.log("\n■ placeholder 대비 (라이트 · 다크)");

/** [라벨, 페이지, 셀렉터, 의사요소인가] */
const PLACEHOLDER_TARGETS = [
  ["Textfield", "/components/textfield", ".nui-textfield__input", true],
  ["Textarea", "/components/textarea", ".nui-textarea__input", true],
  ["Search", "/components/search", ".nui-textfield__input", true],
  ["Datepicker", "/components/datepicker", ".nui-textfield__input", true],
  [
    "DateRangePicker",
    "/components/date-range-picker",
    ".nui-textfield__input",
    true,
  ],
  [
    "DateMultiplePicker",
    "/components/date-multiple-picker",
    ".nui-textfield__input",
    true,
  ],
  ["Select", "/components/select", ".nui-select__placeholder", false],
  [
    "MultiSelect",
    "/components/multi-select",
    ".nui-select__placeholder",
    false,
  ],
];

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  for (const [label, url, selector, pseudo] of PLACEHOLDER_TARGETS.filter((t) =>
    inScope(t[1]),
  )) {
    await page.goto(BASE + url, { waitUntil: "networkidle" });
    // 사이트 크롬(모바일 헤더의 IconButton · Switch)이 DOM 앞에 있고 데스크톱에서는
    // display: none 이다. 보이는 것 중 첫 번째를 잰다 (2026-09-11 · 문서 반응형)
    const el = page.locator(selector).filter({ visible: true }).first();
    const appeared = await el
      .waitFor({ state: "visible", timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    if (!appeared) {
      bad(`${theme} ${label} placeholder: 요소를 찾지 못했다 (${selector})`);
      continue;
    }
    const measured = await el.evaluate((node, isPseudo) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const cx = canvas.getContext("2d", { willReadFrequently: true });
      const composite = (bg, fg) => {
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = "#fff";
        cx.fillRect(0, 0, 1, 1);
        cx.fillStyle = bg;
        cx.fillRect(0, 0, 1, 1);
        if (fg) {
          cx.fillStyle = fg;
          cx.fillRect(0, 0, 1, 1);
        }
        const [r, g, b] = cx.getImageData(0, 0, 1, 1).data;
        return [r, g, b];
      };
      let cur = node;
      let behind = "rgb(255, 255, 255)";
      while (cur) {
        const value = getComputedStyle(cur).backgroundColor;
        if (value && !/rgba\(0, 0, 0, 0\)|transparent/.test(value)) {
          behind = value;
          break;
        }
        cur = cur.parentElement;
      }
      const bg = composite(behind, null);
      const color = isPseudo
        ? getComputedStyle(node, "::placeholder").color
        : getComputedStyle(node).color;
      return {
        fg: composite(`rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`, color),
        bg,
        raw: color,
      };
    }, pseudo);
    const r = ratio(measured.fg, measured.bg);
    const line = `${theme} ${label} placeholder ${r.toFixed(2)}:1 (${measured.raw})`;
    r >= 4.5 ? ok(line) : bad(`${line} — 기준 4.5:1 미달`);
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

const TEXT_BUTTON_REASON =
  "문장 안·목록 행 안에 놓이는 variant 라 세로 44 를 채우면 줄 간격이 벌어져 문단이 어긋나고, 가로는 글자 폭이 이 variant 의 정의다. 하한 24 를 쓴다";

const TOUCH_TARGETS = [
  // IconButton 은 2026-09-08 에 자기 페이지로 나갔다 — Button 페이지에는 없다
  ["IconButton", "/components/icon-button", ".nui-button--icon"],
  // text 버튼은 2026-09-09 에 글자 폭이 됐다. 그 전에는 부모 폭이라 히트가 넓었고
  // 이 자리가 검사 밖이었다 — 좁아진 지금부터 재야 한다.
  // size 셋을 따로 잰다 (2026-09-12). 하나만 재면 가장 작은 자리(small 29)가 검사 밖이고,
  // large 는 글자가 18 로 오르며 높이가 35 가 되므로 셋이 서로 다른 값이다.
  [
    "Button text small",
    "/components/button",
    ".nui-button--text.nui-button--small",
    null,
    TEXT_BUTTON_REASON,
  ],
  [
    "Button text medium",
    "/components/button",
    ".nui-button--text:not(.nui-button--large):not(.nui-button--small)",
    null,
    TEXT_BUTTON_REASON,
  ],
  [
    "Button text large",
    "/components/button",
    ".nui-button--text.nui-button--large",
    null,
    TEXT_BUTTON_REASON,
  ],
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
    "/components/multi-select",
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
      page.getByRole("button", { name: "프로필 수정" }).first().click(),
  ],
  ["Accordion 헤더", "/components/accordion", ".nui-accordion__button"],
  // 모드 B — 화살표만 버튼. 첫 `.nui-accordion__button` 은 모드 A(넓은 헤더)라 이 자리가
  // 측정되지 않고 있었다 (2026-09-09). 36 으로 보이고 44 를 누른다.
  [
    "Accordion 화살표 버튼",
    "/components/accordion",
    ".nui-accordion__button--icon",
  ],
  [
    "Toast 액션",
    "/components/toast",
    ".nui-toast__action",
    async (page) =>
      page
        .getByRole("button", { name: "되돌리기 있는 토스트" })
        .first()
        .click(),
  ],
  [
    "Toast 닫기",
    "/components/toast",
    ".nui-toast__close",
    async (page) =>
      page
        .getByRole("button", { name: "닫기 버튼 있는 토스트" })
        .first()
        .click(),
    "토스트 안에서 액션 라벨과 8px 로 붙는다. 44 를 채우면 두 히트가 겹쳐 인접 시 상한이 낮아지므로 하한 24 를 쓴다 — 입력 안 보조 버튼과 같은 이유",
  ],
  // 선택 컨트롤은 투명 input 을 44 로 키워 누르는 범위를 확보한다 (KRDS D2)
  ["Checkbox", "/components/checkbox", ".nui-checkbox__input"],
  // ghost 는 상자가 없지만 누르는 범위는 그대로 44 다 — 투명 input 이 히트를 소유한다
  [
    "Checkbox ghost",
    "/components/checkbox",
    ".nui-checkbox--ghost .nui-checkbox__input",
  ],
  [
    "Radio",
    "/components/radio",
    ".nui-radio__input",
    null,
    "세로 묶음의 간격이 16 이라 이웃 input(44)과 4px 겹친다. 겹친 곳은 가까운 쪽이 받으므로 상한이 40 이다. 24 하한은 넘는다",
  ],
  ["Switch", "/components/switch", ".nui-switch__input"],
  // 2026-09-10 — 미등록이던 여섯 페이지의 누르는 것. 팝업 닫기는 hit-area 로 44 를 누른다 (a11y.md §8-1)
  ["ButtonLink", "/components/button-link", "a.nui-button"],
  [
    "ButtonGroup 항목",
    "/components/button-group",
    ".nui-button-group .nui-button",
  ],
  [
    "Alert 확인",
    "/components/alert",
    ".nui-popup__actions .nui-button, .nui-popup__foot .nui-button",
    async (page) => page.getByRole("button", { name: "저장" }).first().click(),
  ],
  [
    "Confirm 취소",
    "/components/confirm",
    ".nui-popup__actions .nui-button, .nui-popup__foot .nui-button",
    async (page) => page.getByRole("button", { name: "삭제" }).first().click(),
  ],
  [
    "BottomSheet 닫기",
    "/components/bottom-sheet",
    ".nui-popup__close",
    async (page) =>
      page.getByRole("button", { name: "정렬 바꾸기" }).first().click(),
  ],
  [
    "FullPopup 닫기",
    "/components/full-popup",
    ".nui-popup__close",
    async (page) =>
      page.getByRole("button", { name: "상품 상세 보기" }).first().click(),
  ],
];

{
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  for (const [label, url, selector, open, exception] of TOUCH_TARGETS.filter(
    (t) => inScope(t[1]),
  )) {
    await page.goto(BASE + url, { waitUntil: "networkidle" });
    if (open) {
      try {
        await open(page);
      } catch {
        warn(`${label}: 열지 못해 재지 못했다`);
        continue;
      }
    }
    // 사이트 크롬(모바일 헤더의 IconButton · Switch)이 DOM 앞에 있고 데스크톱에서는
    // display: none 이다. 보이는 것 중 첫 번째를 잰다 (2026-09-11 · 문서 반응형)
    const el = page.locator(selector).filter({ visible: true }).first();
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

// 글자 최소 13px (KRDS 서체 스케일 최소 · tokens.md §3-3) — 2026-09-11.
// 토큰은 13 아래가 없지만 소비자 글꼴 축소·em 자식·인라인 스타일이 들어올 수 있어 렌더로 잰다.
// 라이브러리 요소(.nui-*)의 직접 텍스트만 본다 — 문서 사이트 자체의 캡션은 대상이 아니다.
{
  console.log("\n■ 글자 최소 13px (.nui-* 의 직접 텍스트)");
  const pages = [
    ...new Set([...CONTRAST_TARGETS, ...TOUCH_TARGETS].map((t) => t[1])),
  ].filter(inScope);
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  let seen = 0;
  for (const url of pages) {
    await page.goto(BASE + url, { waitUntil: "networkidle" });
    const small = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll(
        '[class^="nui-"], [class*=" nui-"]',
      )) {
        const text = [...el.childNodes].filter(
          (c) => c.nodeType === 3 && c.textContent.trim(),
        ).length;
        if (!text) continue;
        const cs = getComputedStyle(el);
        if (
          cs.display === "none" ||
          cs.visibility === "hidden" ||
          el.closest(".nui-sr-only")
        )
          continue;
        n++;
        const px = parseFloat(cs.fontSize);
        if (px < 13) out.push(`${el.className.split(" ")[0]} ${px}px`);
      }
      return { n, out };
    });
    seen += small.n;
    for (const s of small.out) bad(`${url} — ${s} (13px 미만)`);
  }
  if (pages.length === 0) skipped("글자 최소 13px");
  else
    seen > 0
      ? ok(`${pages.length}페이지 · 텍스트 요소 ${seen}개 · 13px 미만 없음`)
      : bad("텍스트 요소를 하나도 못 셌다 — 셀렉터가 늙었다");
  await ctx.close();
}

await browser.close();

// 영수증 — 마지막 줄. 없으면 끝까지 안 돈 것이다 (tail 로 잘라 읽다가 대비 절을 놓친 적이 있다 · 2026-09-10).
const receipt = (exit) =>
  `RECEIPT check-a11y scope=${SCOPE ? [...SCOPE].join(",") : "all"} contrast=${CONTRAST_TARGETS.filter((t) => inScope(t[1])).length}×2 ghost=${ghostChecks} touch=${TOUCH_TARGETS.filter((t) => inScope(t[1])).length} failures=${failures.length} warnings=${warnings.length} exit=${exit}`;

if (warnings.length > 0) {
  console.warn(`\n⚠️  경고 ${warnings.length}건 — 실패는 아니다`);
}
if (failures.length > 0) {
  console.error(`\n❌ 접근성 검사 실패 — ${failures.length}건`);
  console.log(receipt(1));
  process.exit(1);
}
console.log(
  "\n✅ 접근성 검사 통과 — 모션 감소 대응 · 명도 대비(라이트·다크) · 터치 영역 · 글자 최소",
);
console.log(receipt(0));
