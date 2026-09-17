#!/usr/bin/env node
/**
 * 터치 눌림 검사 — 누르는 것이 **브라우저 기본 하이라이트와 글자 선택**을 끄고 있나,
 * 그리고 끄면 안 되는 자리(입력칸을 품은 요소 · 컨테이너)에는 **새지 않았나** (styles.md §9-1).
 *
 * 무엇을 못 보고 있었나 — 사용자가 iPhone 과 DevTools 에뮬레이션에서 「뗄 때 회색 · 꾹 누르면
 * 하늘색이 깜빡인다」고 제보했다(2026-09-17). 원인은 우리 CSS 가 아니라 브라우저 기본
 * `-webkit-tap-highlight-color` 였고, 누르는 요소 **전 그룹 44개가 기본값**이었다. 하이라이트는
 * 계산 스타일로 보이지 않고 스크린샷으로만 잡히는데, 그 속성이 투명이면 정의상 그려질 것이 없다 —
 * 그래서 이 검사는 **계산값**으로 판정하고 터치를 넣지 않는다(빠르고 흔들리지 않는다).
 *
 * 재는 것 — 모바일 컨텍스트(iPhone 13 · hasTouch)에서
 *   A  누르는 요소(button · a · label · role · input[checkbox|radio] · select · 바깥쪽 `cursor: pointer`)를
 *      전 페이지에서 긁어 첫 `nui-` / `doc-` 클래스(없으면 첫 클래스)로 묶고, 그룹마다 tap-highlight 투명 ·
 *      `user-select: none` — **누르는 조상 안의 것은 뺀다**(상속으로 따라온다) · **본문 링크(클래스 없는 `<a>`)는
 *      하이라이트만 투명이고 선택은 `auto`** 가 기대값이다(문단 복사에서 링크 글자가 빠지지 않게)
 *   B  §9-1 표의 자리는 **`user-select: auto` 여야** 한다 — 믹스인이 새면 여기서 잡힌다
 *   C  열어야 존재하는 자리(메뉴 옵션 · 달력 · 토스트 · 팝업)는 `opener` 로 연 뒤 A · B 와 같이 잰다
 *   D  문서 사이트 `globals.scss` 의 `:hover` 가 `@media (hover: hover)` 밖에 있나 — 패키지 쪽은 `check-token-layers` 6-a 가 본다
 *
 * 헛짚기 — 첫 실행(2026-09-17 · 파일럿 뒤 · 2판 전) 에서 잰다. 결과는 주석 아래에 적는다.
 * 검출력 — `--selftest` 가 페이지에 `<style>` 을 심어 A(`.nui-button` 을 기본값으로) · B(`.nui-select__control` 에
 *   `none`) 를 되돌리고, D 는 합성 SCSS 로 「밖 1 · 안 1」을 넣어 셋이 잡히고 하나는 통과하는지 본다.
 *
 * 사용:
 *   node scripts/check-touch.mjs                 전체 (dev server 필요)
 *   node scripts/check-touch.mjs --page=button   changed-scope 가 뽑은 슬러그만 (D 는 항상)
 *   node scripts/check-touch.mjs --selftest      검출력 시험
 *
 * dev server 가 없으면 영수증 없이 exit 1 — 그것이 「미실시」의 정의다(`scripts.md §8`).
 */
import { chromium, devices } from "playwright";
import { readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DOCS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = `http://localhost:${process.env.PORT ?? 3000}`;
const SELFTEST = process.argv.includes("--selftest");
const pageArg = process.argv.find((a) => a.startsWith("--page="));
const SCOPE = pageArg
  ? new Set(pageArg.slice("--page=".length).split(",").filter(Boolean))
  : null;
const inScope = (path) =>
  !SCOPE || SCOPE.has(path.replace(/^\/components\//, ""));

try {
  await fetch(BASE, { signal: AbortSignal.timeout(3000) });
} catch {
  console.error(
    `❌ dev server 가 없다 — ${BASE}. \`npm run dev\` 를 먼저 띄운다`,
  );
  process.exit(1);
}

/** nav.ts 에서 라우트를 뽑는다 — 페이지를 추가하면 자동으로 검사 대상이 된다 */
const navSource = readFileSync(join(DOCS_ROOT, "src/site/nav.ts"), "utf8");
const ROUTES = [
  ...new Set([...navSource.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1])),
].filter(inScope);

/**
 * B · 걸면 안 되는 자리 — `styles.md §9-1` 표와 같은 이유. 이유 없는 예외는 두지 않는다(`scripts.md §5`).
 * 여기 있는 것은 A 에서 판정하지 않고, 대신 **`auto` 인지** 본다.
 */
const MUST_STAY_AUTO = [
  {
    sel: ".nui-select__control",
    why: "react-select 검색 input 을 품는다 — 조상의 none 이 iOS 입력을 막는다",
  },
  { sel: ".nui-select__value-container", why: "위와 같다 (input 의 부모)" },
  { sel: ".nui-select__input-container", why: "위와 같다 (input 의 부모)" },
  { sel: ".nui-textfield__wrap", why: "input 을 품는다" },
  { sel: ".nui-textarea__wrap", why: "textarea 를 품는다" },
  {
    sel: ".nui-accordion__panel",
    why: "소비자 본문 — 상속으로 글이 선택 불가가 된다",
  },
  { sel: ".nui-toast", why: "메시지는 소비자 글", opened: true },
  {
    sel: ".nui-popup",
    why: "컨테이너 — 소비자 콘텐츠로 상속된다",
    opened: true,
  },
];

/**
 * C · 열어야 존재하는 자리. 페이지를 새로 열고 opener 를 순서대로 누른 뒤 `judge` 는 A 규칙으로,
 * `stayAuto` 는 B 규칙으로 잰다.
 * ⏳ Popup 닫기(`.nui-popup__close`)는 다른 세션이 Popup 을 잡고 있어 2026-09-17 판에 없다 — 그 판이
 *    끝나면 `judge` 에 더한다. 지금은 `.nui-popup` 루트의 `auto` 만 본다.
 */
const OPENED = [
  {
    label: "Select 메뉴",
    page: "/components/select",
    openers: [".nui-select__control"],
    judge: [".nui-select__option"],
  },
  {
    label: "달력",
    page: "/components/datepicker",
    openers: ['.doc-case:has-text("칠 수 있다") .nui-textfield__btn--date'],
    judge: [
      ".nui-daypicker__day-button",
      ".nui-daypicker__button-previous",
      ".nui-daypicker__button-next",
      ".nui-daypicker__dropdown",
    ],
  },
  {
    label: "Toast 액션",
    page: "/components/toast",
    openers: ['.nui-button:has-text("되돌리기 있는 토스트")'],
    judge: [".nui-toast__action"],
    stayAuto: [".nui-toast"],
  },
  {
    label: "Toast 닫기",
    page: "/components/toast",
    openers: ['.nui-button:has-text("닫기 버튼 있는 토스트")'],
    judge: [".nui-toast__close"],
    stayAuto: [".nui-toast"],
  },
  {
    label: "LayerPopup",
    page: "/components/layer-popup",
    openers: [".doc-case .nui-button--line"],
    judge: [],
    stayAuto: [".nui-popup"],
  },
];

const failures = [];
const ok = (m) => console.log("  ✅", m);
const bad = (m) => {
  console.log("  ❌", m);
  failures.push(m);
};

// ── 브라우저 안에서 도는 수집기 ─────────────────────────────────────────
const PRESSABLE_SEL =
  'button, a[href], label, summary, select, input[type="checkbox"], input[type="radio"], [role="button"], [role="option"], [role="switch"], [role="checkbox"], [role="radio"], [role="tab"], [role="menuitem"]';

/** A · 페이지의 누르는 요소를 그룹으로 모은다. `skip` 셀렉터(B 표)는 뺀다 */
function collectGroups({ pressableSel, skipSel, onlySel }) {
  const skip = (el) => skipSel && el.matches(skipSel);
  const inPressable = (el) => Boolean(el.parentElement?.closest(pressableSel));
  const outermostPointer = (el) => {
    if (getComputedStyle(el).cursor !== "pointer") return false;
    let p = el.parentElement;
    while (p && p !== document.body) {
      if (getComputedStyle(p).cursor === "pointer") return false;
      p = p.parentElement;
    }
    return true;
  };
  const set = new Set();
  if (onlySel) {
    for (const el of document.querySelectorAll(onlySel)) set.add(el);
  } else {
    for (const el of document.querySelectorAll(pressableSel)) {
      if (!inPressable(el)) set.add(el);
    }
    for (const el of document.querySelectorAll("[class]")) {
      if (set.has(el) || inPressable(el)) continue;
      if (outermostPointer(el)) set.add(el);
    }
  }
  const groups = {};
  // 클래스 없는 요소도 판정한다 (2026-09-17). 첫 판은 세기만 해서 본문 링크 172개 ·
  // 데모 label 2 · 프리셋 카드 12(`preset-` 접두)가 검사 밖이었다 — 「검사한 것만 통과」였다.
  // **본문 링크(클래스 없는 `<a>`)는 기대가 다르다** — 하이라이트만 투명이고 선택은 `auto` 로 남는다
  // (styles.md §9-1 · 문단을 드래그로 복사할 때 링크 글자가 빠지지 않게)
  let prose = 0;
  for (const el of set) {
    if (skip(el)) continue;
    const cls = [...el.classList];
    const tag = el.tagName.toLowerCase();
    const isProseLink = tag === "a" && cls.length === 0;
    const key = isProseLink
      ? "a (본문 링크)"
      : (cls.find((c) => c.startsWith("nui-")) ??
        cls.find((c) => c.startsWith("doc-")) ??
        cls[0] ??
        `<${tag}> (클래스 없음)`);
    if (isProseLink) prose += 1;
    const c = getComputedStyle(el);
    const g = (groups[key] ??= { n: 0, badTap: 0, badSel: 0, tag });
    g.n += 1;
    if (
      c.getPropertyValue("-webkit-tap-highlight-color") !== "rgba(0, 0, 0, 0)"
    )
      g.badTap += 1;
    const wantSel = isProseLink ? "auto" : "none";
    if (c.getPropertyValue("user-select") !== wantSel) g.badSel += 1;
  }
  return { groups, unclassed: prose };
}

/** B · 표의 자리가 `auto` 인지. 없으면 `missing` */
function readStayAuto(sel) {
  const el = document.querySelector(sel);
  if (!el) return { missing: true };
  return { us: getComputedStyle(el).getPropertyValue("user-select") };
}

// ── D · 문서 사이트 SCSS 의 :hover 가 hover 미디어 밖에 있나 ─────────────
/** 주석을 걷고 중괄호 깊이를 따라가며 `:hover` 셀렉터가 `@media (hover: hover)` 안에 있는지 본다 */
function hoverOutsideMedia(scss) {
  const src = scss.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  const stack = []; // 각 블록이 hover 미디어인가
  const outside = [];
  let buf = "";
  for (const ch of src) {
    if (ch === "{") {
      const head = buf.trim();
      const isHoverMedia = /^@media[^{]*hover:\s*hover/.test(head);
      if (/:hover/.test(head) && !stack.some(Boolean))
        outside.push(head.replace(/\s+/g, " "));
      stack.push(isHoverMedia);
      buf = "";
    } else if (ch === "}") {
      stack.pop();
      buf = "";
    } else if (ch === ";") {
      buf = "";
    } else {
      buf += ch;
    }
  }
  return outside;
}

// ── 실행 ────────────────────────────────────────────────────────────────
const browser = await chromium.launch();
const ctx = await browser.newContext({
  ...devices["iPhone 13"],
  colorScheme: "light",
});
const page = await ctx.newPage();
page.setDefaultTimeout(8000);

const SKIP_SEL = MUST_STAY_AUTO.map((x) => x.sel).join(", ");
const counts = {
  pages: 0,
  groups: 0,
  judged: 0,
  allowed: 0,
  opened: 0,
  docs: 0,
  hover: 0,
  unclassed: 0,
};

/** 한 페이지(또는 열린 상태)에서 A 를 돌려 그룹을 판정한다 */
async function judgeGroups(where, onlySel) {
  const { groups, unclassed } = await page.evaluate(collectGroups, {
    pressableSel: PRESSABLE_SEL,
    skipSel: SKIP_SEL,
    onlySel: onlySel ?? null,
  });
  counts.unclassed += unclassed;
  for (const [key, g] of Object.entries(groups)) {
    counts.groups += 1;
    counts.judged += g.n;
    if (key.startsWith("doc-")) counts.docs += 1;
    if (g.badTap || g.badSel) {
      bad(
        `${where} · ${key} <${g.tag}> ×${g.n} — 탭 하이라이트 기본값 ${g.badTap} · user-select 기대와 다름 ${g.badSel}`,
      );
    }
  }
  return Object.keys(groups).length;
}

/** B 를 한 셀렉터에 대해 */
async function judgeStayAuto(where, entry) {
  const r = await page.evaluate(readStayAuto, entry.sel);
  if (r.missing) return false;
  counts.allowed += 1;
  r.us === "auto"
    ? ok(`${where} · ${entry.sel} 은 auto — ${entry.why}`)
    : bad(
        `${where} · ${entry.sel} 에 user-select: ${r.us} 가 샜다 — ${entry.why}`,
      );
  return true;
}

async function gotoPage(route) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
}

let exit = 0;

if (SELFTEST) {
  console.log("\n■ 검출력 시험 — 기본값을 되돌린 채 잡히는지");
  let detected = 0;
  const want = 4;
  // A — .nui-button 을 브라우저 기본값으로 되돌린다
  await gotoPage("/components/button");
  await page.addStyleTag({
    content:
      ".nui-button{-webkit-tap-highlight-color:initial !important;user-select:auto !important}",
  });
  const before = failures.length;
  await judgeGroups("[selftest] button", ".nui-button");
  if (failures.length > before) detected += 1;
  // B — 입력 컨테이너에 none 을 심는다
  await gotoPage("/components/select");
  await page.addStyleTag({
    content: ".nui-select__control{user-select:none !important}",
  });
  const before2 = failures.length;
  await judgeStayAuto("[selftest] select", MUST_STAY_AUTO[0]);
  if (failures.length > before2) detected += 1;
  // A' — 본문 링크에 none 이 새면 잡혀야 한다 (본문 링크만 기대가 auto 다)
  await gotoPage("/foundations");
  await page.addStyleTag({
    content: ".doc-shell a:not([class]){user-select:none !important}",
  });
  const before3 = failures.length;
  await judgeGroups("[selftest] 본문 링크", ".doc-shell a:not([class])");
  if (failures.length > before3) detected += 1;
  // D — 밖 1 · 안 1 (함정)
  const out = hoverOutsideMedia(
    ".x:hover { color: red } @media (hover: hover) and (pointer: fine) { .y:hover { color: blue } } /* .z:hover { } */",
  );
  if (out.length === 1 && out[0] === ".x:hover") detected += 1;
  else
    bad(
      `[selftest] hover 파서 — 기대 [.x:hover] · 실제 ${JSON.stringify(out)}`,
    );
  failures.length = 0; // 시험에서 난 실패는 진짜가 아니다
  exit = detected >= want ? 0 : 1;
  console.log(`\n  검출 ${detected}/${want}`);
  console.log(exit ? "❌ 검출력 시험 실패" : "✅ 검출력 시험 통과");
  await browser.close();
  console.log(
    `RECEIPT check-touch selftest detected=${detected}/${want} exit=${exit}`,
  );
  process.exit(exit);
}

// A + B · 페이지마다
console.log(
  "\n■ A · 누르는 요소 — 탭 하이라이트 투명 · user-select none (styles.md §9-1)",
);
for (const route of ROUTES) {
  try {
    await gotoPage(route);
  } catch {
    bad(`${route}: 페이지를 못 열었다`);
    continue;
  }
  counts.pages += 1;
  await judgeGroups(route);
  for (const entry of MUST_STAY_AUTO.filter((x) => !x.opened)) {
    await judgeStayAuto(route, entry).catch(() => {});
  }
}
if (counts.pages === 0)
  bad("A: 본 페이지가 0 — nav.ts 를 못 읽었거나 --page 가 틀렸다");
if (counts.groups === 0) bad("A: 판정한 그룹이 0 — 셀렉터가 늙었다");
console.log(
  `  · pages=${counts.pages} groups=${counts.groups} elements=${counts.judged} docs-groups=${counts.docs} prose-links(하이라이트만 · 선택 auto)=${counts.unclassed}`,
);

// B · 정적 자리 요약
// ⚠️ 범위 필터로 비는 것과 셀렉터가 늙어 비는 것을 가른다 (scripts.md §2 · §6). `--page=button` 처럼
//    입력 컨테이너 · 패널이 원래 없는 페이지만 보면 0 이 정상이다 — 그때는 ⏭️ 이고 실패가 아니다.
//    전체 실행에서 0 이면 실패다. 첫 판은 이 둘을 안 갈라 `--page=toast` · `--page=button` 이 거짓 실패했다
//    (2026-09-17 qa). 필터 실행이 놓치는 「셀렉터가 늙었다」는 4단계 직전의 전체 실행이 잡는다
const staticAllowed = counts.allowed;
console.log("\n■ B · 걸면 안 되는 자리 — user-select auto 유지");
if (staticAllowed > 0) {
  console.log(`  · allowed=${staticAllowed} (위 페이지 순회에서 잰 수)`);
} else if (SCOPE) {
  console.log(
    `  ⏭️  이 범위(--page=${[...SCOPE].join(",")})의 페이지에 표의 정적 자리가 없다`,
  );
} else {
  bad("B: 표의 자리를 하나도 못 찾았다 — 셀렉터가 늙었다");
}

// C · 열어야 존재하는 자리
console.log("\n■ C · 열어야 존재하는 자리");
for (const c of OPENED) {
  if (!inScope(c.page)) {
    console.log(`  ⏭️  ${c.label} — 범위 밖`);
    continue;
  }
  try {
    await gotoPage(c.page);
    for (const o of c.openers) {
      await page.locator(`${o} >> visible=true`).first().click();
      await page.waitForTimeout(400);
    }
    for (const sel of c.judge)
      await page.waitForSelector(`${sel} >> visible=true`);
  } catch (e) {
    bad(
      `${c.label}: 열지 못했다 — opener 가 늙었거나 대상이 안 뜬다 · ${String(
        e.message ?? e,
      )
        .split("\n")[0]
        .slice(0, 100)}`,
    );
    continue;
  }
  counts.opened += 1;
  if (c.judge.length) {
    const n = await judgeGroups(c.label, c.judge.join(", "));
    if (n === 0) bad(`${c.label}: 판정할 요소가 0 — ${c.judge.join(", ")}`);
    else ok(`${c.label}: ${c.judge.length}개 셀렉터 판정`);
  }
  for (const sel of c.stayAuto ?? []) {
    const entry = MUST_STAY_AUTO.find((x) => x.sel === sel);
    const found = await judgeStayAuto(c.label, entry);
    if (!found) bad(`${c.label}: ${sel} 을 못 찾았다`);
  }
}
// 범위 안의 대상이 하나라도 있었는데 못 열었으면 실패, 전부 범위 밖이면 ⏭️ (B 와 같은 이유)
const openedInScope = OPENED.filter((c) => inScope(c.page)).length;
if (openedInScope === 0) {
  console.log("  ⏭️  이 범위에 열어야 존재하는 자리가 없다");
} else if (counts.opened === 0) {
  bad(`C: 범위 안 ${openedInScope}곳 중 연 자리가 0`);
}

// D · docs :hover
console.log("\n■ D · 문서 사이트 :hover — @media (hover: hover) 밖");
const scss = readFileSync(join(DOCS_ROOT, "src/styles/globals.scss"), "utf8");
const outside = hoverOutsideMedia(scss);
// 수는 주석을 걷은 뒤 센다 — 주석 속 `:hover` 언급이 「본 규칙 수」로 들어가지 않게 (scripts.md §1)
counts.hover = (
  scss
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .match(/:hover/g) ?? []
).length;
if (counts.hover === 0) bad("D: globals.scss 에 :hover 가 0 — 파일이 바뀌었나");
outside.length
  ? bad(`hover 미디어 밖 :hover ${outside.length} — ${outside.join(" | ")}`)
  : ok(`:hover ${counts.hover}개 전부 hover 미디어 안`);

await browser.close();
exit = failures.length ? 1 : 0;
console.log(
  exit
    ? `\n❌ 터치 눌림 검사 실패 — ${failures.length}건`
    : "\n✅ 터치 눌림 검사 통과",
);
console.log(
  `RECEIPT check-touch pages=${counts.pages} groups=${counts.groups} elements=${counts.judged} allowed=${counts.allowed} opened=${counts.opened}/${OPENED.filter((c) => inScope(c.page)).length} docs=${counts.docs} prose=${counts.unclassed} hover=${counts.hover} scope=${SCOPE ? [...SCOPE].join(",") : "all"} failures=${failures.length} exit=${exit}`,
);
process.exit(exit);
