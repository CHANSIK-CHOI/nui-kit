#!/usr/bin/env node
/**
 * 드롭다운 모션 검사 — **Select 와 Datepicker 를 한 스크립트가 잰다.**
 *
 * 무엇을 못 보고 있었나 — 셋이다.
 *
 *   1. **퇴장이 있는지 문자열로는 판정이 안 된다.** react-select 의 `renderMenu()` 는
 *      `menuIsOpen` 이 false 가 되는 즉시 `null` 을 반환하므로, `AnimatePresence` 가
 *      메뉴를 붙잡지 못하면 **코드에 `exit` 가 적혀 있어도 재생되지 않는다.**
 *      실제로 `NuiSelectContainer` 의 `Children.map` 을 빼면 그렇게 된다(대조군 실측) —
 *      타입도 빌드도 통과하고 콘솔만 key 중복을 흘린다.
 *   2. **등장 방향의 부호.** framer 의 `initial` 은 마운트 때 한 번만 읽히는데
 *      `MenuPlacer` 의 placement 는 **첫 렌더에 언제나 `"bottom"`** 이다. 그래서
 *      뒤집힌 메뉴가 트리거 반대편에서 오는 것이 **조용히** 일어난다(2026-09-14 ~ 09-16
 *      실제로 그 상태였다). `key={placement}` 가 그것을 고치는데, 되돌아가도 화면
 *      말고는 아무것도 말하지 않는다.
 *   3. **「둘이 동일하다」를 지킬 자리가 없었다.** Select 와 Datepicker 를 각자
 *      검사하면 값이 갈리는 것을 아무도 못 본다. 사용자 요청이 「이 드롭다운 관련해서는
 *      Datepicker 와 Select 가 동일해야 한다」였다(2026-09-16).
 *
 * 재는 것 — 절 여섯.
 *   ■ 등장 방향   첫 프레임의 `translateY` 부호가 placement 를 따르는가 (아래로 · 뒤집혀서)
 *   ■ 퇴장       닫은 뒤에도 패널이 DOM 에 남아 `opacity` 가 줄어드는가 (닫는 경로마다)
 *   ■ 포인터     퇴장 중 `pointer-events: none` 이라 옵션이 눌리지 않는가
 *   ■ 재개폐     퇴장 중 다시 열어도 패널이 둘이 되지 않는가
 *   ■ 모션 감소   `prefers-reduced-motion` 에서 위치가 안 움직이고, 퇴장이 0 이 아니라 페이드로 걸리며 그동안 눌리지 않는가
 *   ■ 동일       두 소스가 같은 모션 키를 쓰고, 재 보면 이동 거리도 같은가
 *
 * ⚠️ **일부러 도중을 잡는 검사다**(`scripts.md §10` 의 예외). 「멈출 때까지 읽는다」는
 *    최종값을 기대값과 견주는 자리의 규칙인데, 여기서 보는 것은 **전환이 일어나는 중이라는
 *    사실 자체**다. 등장 첫 프레임은 바깥 폴링으로는 못 잡아(`enterEmphasized` 가 첫
 *    프레임에 43% 를 쓴다) 브라우저 안에서 `MutationObserver` + `rAF` 로 기록한다.
 *
 * 헛짚기 — 첫 실행(2026-09-16) 대상 3 · 헛짚기 0.
 * 재현성 — **연속 4회 실측**(2026-09-16). 등장(bottom) `ty=-8.0` **고정**(12/12) ·
 *   뒤집힘(top) `6.2 ~ 8.0`. 문턱은 등장 `|ty| ≥ 7`(여유 1.0) · 뒤집힘 `|ty| ≥ 4`(여유 2.2) ·
 *   동일 `|a−b| ≤ 1`(실측 차 0). 뒤집힘만 흔들리는 것은 `key={placement}` remount 가
 *   한 틱을 먹기 때문이고, 그래서 그 절만 하한을 절반에 둔다(아래 주석).
 *   **`verify:a11y` 직후의 부하 조건**(2026-09-17 · 1회) — `failures=0` · 등장 `-8.0` · 뒤집힘 `8.0` ·
 *   모션 감소 퇴장 11 · 7ms. `scripts.md §10` 의 사고가 난 조건이다.
 *   같은 날 연속 실행에서 「기본 모드」 절이 두 판 중 한 판에서 Select · MultiSelect 둘 다 헛짚었다(스크롤 18 · 29px · 탐침 12판 중 2판 재현) — 원인은 컴포넌트가
 *   아니라 Playwright 가 누르기 전에 한 스크롤이었고, 기준 시점을 `pointerdown` 으로 옮겨 고쳤다
 *   (절 안 주석). 고친 뒤 연속 4회 + 부하 1회 전부 통과.
 * **그 첫 실행이 진짜 결함 둘을 잡았다** — `Datepicker` 의 달력이 닫히는 동안
 *   `pointer-events: auto` 라 150ms 안에 같은 자리를 누르면 날짜가 바뀌었다
 *   (escape · outside 두 경로). `Select` 에는 있던 규칙이 Datepicker 에만 없었고
 *   **둘을 따로 보는 검사로는 영영 안 보이는 종류**다. 이것이 이 스크립트의 존재 이유다.
 *
 * 검출력 — `--selftest` 는 **기대 자체를 뒤집어 다시 측정한다**(`SELFTEST_EXPECT`).
 *   해석만 바꾸면 `expect(true, …)` 같은 헛된 단언도 「검출」로 찍힌다 — 첫 판이 그랬고
 *   리뷰에서 BLOCKER 로 잡혔다(`scripts.md §4`). 지금은 부호 · 퇴장 유무 · 포인터 ·
 *   동일성 넷을 실제로 반대로 두고 돌려, 건강한 트리에서 **전부 실패해야** 통과다.
 *   **기대 수는 사례 수에서 센다** — 적어 두면 사례를 더할 때마다 낡는다.
 *
 * 사용:
 *   node scripts/check-menu-motion.mjs                    전체
 *   node scripts/check-menu-motion.mjs --page=select      changed-scope 가 뽑은 슬러그만
 *   node scripts/check-menu-motion.mjs --selftest         검출력 시험
 *
 * dev server 가 없으면 영수증 없이 exit 1 — 그것이 「미실시」의 정의다(`scripts.md §8`).
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = `http://localhost:${process.env.PORT ?? 3000}`;
const SELFTEST = process.argv.includes("--selftest");
const pageArg = process.argv.find((a) => a.startsWith("--page="));
const SCOPE = pageArg
  ? new Set(pageArg.slice("--page=".length).split(",").filter(Boolean))
  : null;

// worktree 에서도 자기 트리를 보게 한다 — `import.meta.url` 은 심볼릭 링크를 타고
// 메인으로 풀린다 (`scripts.md §8`).
const ROOT = execSync("git rev-parse --show-toplevel").toString().trim();

const ENTER_MS = 200; // d4 — motionTransition.popover
const EXIT_MS = 150; // d3 — motionTransition.popoverExit
const AWAY_PX = 8; // translateY(∓8px)
// 「기본 모드」 절의 전제 — 이보다 아래 공간이 넓으면 메뉴가 그냥 들어가 판정에 구분력이 없다.
// 데모 메뉴(옵션 8개)가 넘는 높이의 하한으로 react-select `minMenuHeight` 기본(140)을 쓴다.
const MENU_MIN_PX = 140;

/**
 * ★ 기대는 **데이터**다. `--selftest` 가 이 표를 통째로 뒤집어 다시 측정한다 —
 *   해석만 바꾸면 아무것도 재지 않는 단언도 통과한다(리뷰 BLOCKER · 2026-09-16).
 */
const EXPECT = {
  enterSign: -1, // 아래로 펼치면 위(음수)에서 내려온다
  flipSign: 1, // 위로 뒤집히면 아래(양수)에서 올라온다
  exitFades: true, // 닫아도 DOM 에 남아 흐려진다
  exitCompletes: true, // 퇴장이 끝나면 DOM 에서 사라진다
  pointerBlocked: true, // 퇴장 중에는 눌리지 않는다
  singlePanel: true, // 퇴장 중 다시 열어도 패널은 하나다
  sameMotion: true, // Select 와 Datepicker 가 같다
  inPlace: true, // 기본 모드 — 제자리 · 뒤집지 않음 · 페이지 스크롤 0 · 래퍼 0 (2026-09-17 A 안)
  reducedNoMove: true, // 모션 감소 — 등장 내내 `transform: none` 이고 끝에 보인다
  reducedExitFades: true, // 모션 감소 — 퇴장이 0 이 아니라 페이드로 걸린다 (not zero · 2026-09-17)
  reducedPointerBlocked: true, // 모션 감소 — 퇴장 중에도 눌리지 않는다
};

// ⚠️ **열 키가 전부 뒤집혀야 한다.** 하나라도 빠뜨리면 그 절은 `--selftest` 에서
//    「못 잡았다」로 남는다 — 첫 판에 「퇴장 완료」·「재개폐」 둘을 빠뜨려 9/33 이 그랬다.
const SELFTEST_EXPECT = {
  enterSign: 1,
  flipSign: -1,
  exitFades: false,
  exitCompletes: false,
  pointerBlocked: false,
  singlePanel: false,
  sameMotion: false,
  inPlace: false,
  reducedNoMove: false,
  reducedExitFades: false,
  reducedPointerBlocked: false,
};

const E = SELFTEST ? SELFTEST_EXPECT : EXPECT;

/**
 * 두 소스가 함께 써야 하는 모션 키 — 하나라도 한쪽에만 있으면 「동일」이 깨진 것이다.
 *
 * ⚠️ **주석을 걷어낸 뒤 정규식으로 본다.** 단순 `includes` 는 **주석 줄만으로 만족된다** —
 *    이 파일들의 경고 주석이 `pointerEvents: "none"` 을 그대로 인용하고 있어서, 실제
 *    `exit` 의 한 줄을 지워도 통과했다(리뷰 WARN · 2026-09-16). 그리고
 *    `"motionTransition.popover"` 는 `popoverExit` 의 **부분 문자열**이라 등장 전환을
 *    지우고 퇴장만 남겨도 두 키가 다 통과했다 — `\b` 로 끊는다.
 */
const SHARED_MOTION_KEYS = [
  [/motionTransition\.popover\b/, "등장 전환(d4 200 · enterEmphasized)"],
  [/motionTransition\.popoverExit\b/, "퇴장 전환(d3 150 · exit)"],
  [/scale\(0\.97\)/, "배율"],
  [/pointerEvents:\s*"none"/, "퇴장 중 포인터 차단"],
  [/pointerEvents:\s*"auto"/, "포인터 복원"],
  [/useReducedMotion\(\)/, "모션 감소 분기"],
];

/** 줄 단위로 주석을 걷어낸다 — 블록 주석 본문(`*` 로 시작)과 줄 주석(`//`). */
const stripComments = (src) =>
  src
    .split("\n")
    .filter((line) => !/^\s*(\/\/|\/\*|\*)/.test(line))
    .join("\n");

const SOURCES = {
  Select: "packages/ui/src/components/Select/SelectIndicators.tsx",
  Datepicker: "packages/ui/src/components/Datepicker/DatepickerBase.tsx",
};

const TARGETS = [
  {
    slug: "select",
    label: "Select",
    path: "/components/select",
    trigger: ".nui-select__control",
    panel: ".nui-select__menu",
    option: ".nui-select__option",
    closers: ["escape", "outside", "option"],
    // 기본 모드는 뒤집지 않는다(`menuPlacement="bottom"`). 뒤집히는 것은 `hasPortal`(`fixed`)
    // 하나라 그 데모를 집는다 — Select.md §6-7
    flipTrigger: '[data-demo="has-portal"] .nui-select__control',
    inPlace: true,
    reduced: true,
  },
  {
    slug: "multi-select",
    label: "MultiSelect",
    path: "/components/multi-select",
    trigger: ".nui-select__control",
    panel: ".nui-select__menu",
    option: ".nui-select__option",
    closers: ["escape"],
    // 페이지에 `hasPortal` 데모가 없다. 방향 모션은 `NuiMenu` 한 벌이라 Select 가 잰다
    flipTrigger: null,
    inPlace: true,
    reduced: false, // `NuiMenu` 한 벌이라 Select 가 잰다
  },
  {
    slug: "datepicker",
    label: "Datepicker",
    path: "/components/datepicker",
    trigger: '.nui-datepicker input[placeholder="날짜를 고르세요"]',
    panel: ".nui-datepicker__dropdown",
    option: ".nui-daypicker__day-button",
    closers: ["escape", "outside"],
    flipTrigger: null, // 자동 뒤집기가 없다 — Datepicker.md §6-6
    inPlace: false, // 달력은 원래 제자리다 — 이 절은 Select 의 배치 전환을 잰다
    reduced: true,
  },
];

let failures = 0;
let checks = 0;
let detected = 0;
const targetsSeen = new Set();
// 플래그로 켜는 절의 수 — 범위 안 대상이 플래그를 갖는데 0 이면 실패다 (scripts.md §2 · 리뷰 INFO)
const sections = { inPlace: 0, reduced: 0 };

process.on("exit", (code) => {
  console.log(
    `RECEIPT check-menu-motion targets=${targetsSeen.size} checks=${checks} inPlace=${sections.inPlace} reduced=${sections.reduced} failures=${failures}` +
      (SELFTEST ? ` detected=${detected}` : "") +
      ` scope=${SCOPE ? [...SCOPE].join(",") : "all"}` +
      ` exit=${code}`,
  );
});

function expect(pass, label, detail) {
  checks += 1;
  if (SELFTEST) {
    if (!pass) {
      detected += 1;
      console.log(`   🎯 검출 — ${label}`);
    } else {
      failures += 1;
      console.log(`   ❌ 못 잡았다 (뒤집은 기대가 통과했다) — ${label}`);
    }
    return;
  }
  if (pass) console.log(`   ✅ ${label}`);
  else {
    failures += 1;
    console.log(`   ❌ ${label} — ${detail}`);
  }
}

const ty = (transform) => {
  if (!transform || transform === "none") return 0;
  return Number(transform.replace(/^matrix\(|\)$/g, "").split(",")[5] ?? 0);
};

async function readPanel(page, panel) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      opacity: Number(cs.opacity),
      transform: cs.transform,
      pointerEvents: cs.pointerEvents,
      placement: el.className.includes("menu--top") ? "top" : "bottom",
      count: document.querySelectorAll(sel).length,
    };
  }, panel);
}

/**
 * 등장 **첫 프레임**을 브라우저 안에서 잡는다.
 *
 * ⚠️ 바깥에서 폴링하면 못 본다 — CDP 왕복이 `enterEmphasized` 보다 느려 `ty` 가 0 에
 *    붙는다(실측 `ty=0.0` 이 통과로 나왔다). 클릭 **전에** 관찰자를 심는다.
 */
async function armEnterRecorder(page, panel) {
  await page.evaluate((sel) => {
    window.__nuiFrames = [];
    window.__nuiWatching = false;
    const tick = () => {
      const el = document.querySelector(sel);
      if (!el) return;
      const cs = getComputedStyle(el);
      window.__nuiFrames.push({
        transform: cs.transform,
        opacity: Number(cs.opacity),
        placement: el.className.includes("menu--top") ? "top" : "bottom",
      });
      if (window.__nuiFrames.length < 14) requestAnimationFrame(tick);
    };
    const obs = new MutationObserver(() => {
      if (window.__nuiWatching || !document.querySelector(sel)) return;
      window.__nuiWatching = true;
      requestAnimationFrame(tick);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }, panel);
}

async function readRecordedEnter(page) {
  await page.waitForTimeout(ENTER_MS + 80);
  const frames = await page.evaluate(() => window.__nuiFrames ?? []);
  if (!frames.length) return null;
  return frames.reduce((a, f) =>
    Math.abs(ty(f.transform)) > Math.abs(ty(a.transform)) ? f : a,
  );
}

async function openPanel(page, t) {
  await page.locator(`${t.trigger} >> visible=true`).first().click();
  await page.waitForSelector(t.panel, { timeout: 3000 });
}

async function run() {
  const res = await fetch(BASE).catch(() => null);
  if (!res?.ok) {
    console.error(`❌ dev server 가 없다 — npm run dev (${BASE})`);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const measured = new Map();

  for (const t of TARGETS) {
    if (SCOPE && !SCOPE.has(t.slug)) {
      console.log(`⏭️  ${t.label} — 범위 밖`);
      continue;
    }
    targetsSeen.add(t.slug);
    console.log(`\n■ ${t.label}`);

    const page = await browser.newPage({
      viewport: { width: 1000, height: 900 },
    });

    // ── 등장 방향 (아래로 펼쳐지는 자리)
    await page.goto(`${BASE}${t.path}`, { waitUntil: "networkidle" });
    await armEnterRecorder(page, t.panel);
    await openPanel(page, t);
    const entering = await readRecordedEnter(page);
    const enterTy = ty(entering?.transform);
    expect(
      entering?.placement === "bottom" &&
        Math.sign(enterTy) === E.enterSign &&
        Math.abs(enterTy) >= AWAY_PX - 1,
      `${t.label} 등장 방향 — 아래로 펼치면 위에서 자란다 (ty=${enterTy.toFixed(1)})`,
      `placement=${entering?.placement} ty=${enterTy.toFixed(1)} — 기대 부호 ${E.enterSign} · |ty| ≥ ${AWAY_PX - 1}`,
    );
    measured.set(t.slug, Math.abs(enterTy));

    // ── 퇴장 · 포인터 (닫는 경로마다)
    for (const closer of t.closers) {
      await page.goto(`${BASE}${t.path}`, { waitUntil: "networkidle" });
      await openPanel(page, t);
      await page.waitForTimeout(ENTER_MS + 120);

      if (closer === "escape") await page.keyboard.press("Escape");
      else if (closer === "outside") await page.mouse.click(5, 5);
      else await page.locator(`${t.option} >> visible=true`).first().click();

      await page.waitForTimeout(Math.round(EXIT_MS / 2.5));
      const leaving = await readPanel(page, t.panel);
      const fading = leaving !== null && leaving.opacity < 1;
      expect(
        fading === E.exitFades,
        `${t.label} 퇴장 재생 — ${closer}`,
        leaving === null
          ? "닫자마자 DOM 에서 사라졌다 (AnimatePresence 가 못 붙잡았다)"
          : `opacity=${leaving.opacity} — 줄어들지 않았다`,
      );

      if (leaving) {
        const hit = await page.evaluate(
          ({ panel, option }) => {
            const el = document.querySelector(panel);
            const opt = el?.querySelector(option);
            if (!opt) return { checked: false };
            const r = opt.getBoundingClientRect();
            const top = document.elementFromPoint(
              r.left + r.width / 2,
              r.top + r.height / 2,
            );
            return {
              checked: true,
              insidePanel: el.contains(top),
              pointerEvents: getComputedStyle(el).pointerEvents,
            };
          },
          { panel: t.panel, option: t.option },
        );
        if (hit.checked) {
          const blocked =
            hit.insidePanel === false && hit.pointerEvents === "none";
          expect(
            blocked === E.pointerBlocked,
            `${t.label} 퇴장 중 포인터 차단 — ${closer}`,
            `insidePanel=${hit.insidePanel} pointerEvents=${hit.pointerEvents}`,
          );
        }
      }

      await page.waitForTimeout(EXIT_MS + 200);
      const gone = await readPanel(page, t.panel);
      expect(
        (gone === null) === E.exitCompletes,
        `${t.label} 퇴장 완료 — ${closer}`,
        "퇴장이 끝났는데 DOM 에 남아 있다",
      );
    }

    // ── 재개폐: 퇴장 중에 다시 열어도 패널이 둘이 되지 않는다 (spec §10)
    await page.goto(`${BASE}${t.path}`, { waitUntil: "networkidle" });
    await openPanel(page, t);
    await page.waitForTimeout(ENTER_MS + 100);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(Math.round(EXIT_MS / 3));
    await page.locator(`${t.trigger} >> visible=true`).first().click();
    // ① 겹침 창 — 퇴장 중인 것과 새로 연 것이 동시에 살아 있을 수 있는 순간이다.
    //    spec §10 의 문장이 가리키는 자리가 여기다 (리뷰 INFO · 2026-09-16).
    await page.waitForTimeout(50);
    const overlapping = await readPanel(page, t.panel);
    expect(
      (overlapping !== null && overlapping.count === 1) === E.singlePanel,
      `${t.label} 퇴장 중 재개폐 — 겹침 창에서 패널이 하나다`,
      overlapping === null
        ? "그 순간 패널이 없다"
        : `패널이 ${overlapping.count}개 — 퇴장 중인 것과 새로 연 것이 겹쳤다`,
    );
    // ② 완료 후 — 영영 안 사라지는 유령 패널을 잡는다
    await page.waitForTimeout(ENTER_MS + 120);
    const reopened = await readPanel(page, t.panel);
    expect(
      (reopened !== null && reopened.count === 1) === E.singlePanel,
      `${t.label} 퇴장 중 재개폐 — 완료 후 패널이 하나다`,
      reopened === null
        ? "다시 열리지 않았다"
        : `패널이 ${reopened.count}개 — 유령 패널이 남았다`,
    );

    // ── 기본 모드 — 제자리 · 뒤집지 않음 · 페이지 스크롤 0 · 래퍼 0 (A 안 · Select.md §6-7)
    if (t.inPlace) {
      await page.setViewportSize({ width: 1000, height: 420 });
      await page.goto(`${BASE}${t.path}`, { waitUntil: "networkidle" });
      // 페이지의 **마지막** 컨트롤을 뷰포트 하단에 민다 — 첫 컨트롤은 문서 맨 위라
      // `block: "end"` 로 못 내려 공간이 넉넉해지고, 그러면 이 절이 아무것도 안 잰다
      const trigger = page.locator(`${t.trigger} >> visible=true`).last();
      await trigger.evaluate((el) => el.scrollIntoView({ block: "end" }));
      await page.waitForTimeout(150);
      // ⚠️ **기준 시점은 `pointerdown` 이다 — 클릭 명령 전이 아니다** (2026-09-17). 위쪽 레이아웃이
      //    `scrollIntoView` 뒤에 늘어나는 판이 있다(실측 12판 중 2판 · +30px). 그러면 트리거가 화면
      //    밖으로 밀리고 Playwright 가 누르기 **전에** 스크롤해 되돌린다 — 그 스크롤을 「메뉴가 연
      //    스크롤」로 셌다(18 · 29px 헛짚기). 누르는 순간의 `scrollY` 와 아래 공간을 브라우저 안에서 적는다.
      await page.evaluate((sel) => {
        window.__nuiDown = null;
        addEventListener(
          "pointerdown",
          (e) => {
            const el = e.target.closest?.(sel);
            window.__nuiDown = {
              scrollY: window.scrollY,
              below: el
                ? window.innerHeight - el.getBoundingClientRect().bottom
                : null,
            };
          },
          { capture: true, once: true },
        );
      }, t.trigger);
      await trigger.click();
      await page.waitForSelector(t.panel, { timeout: 3000 });
      await page.waitForTimeout(ENTER_MS + 120);
      const placed = await page.evaluate(
        ({ panel }) => {
          const menu = document.querySelector(panel);
          return {
            top: menu?.className.includes("menu--top") ?? null,
            inContainer: !!menu?.closest(".nui-select__container"),
            wrappers: document.querySelectorAll(".nui-select__menu-portal")
              .length,
            scrollY: window.scrollY,
            down: window.__nuiDown,
          };
        },
        { panel: t.panel },
      );
      // 누른 순간을 못 적었으면 판정할 기준이 없다 — 원인을 그대로 말하고 실패한다 (리뷰 INFO)
      if (!placed.down || placed.down.below === null) {
        failures += 1;
        checks += 1;
        console.log(
          `   ❌ ${t.label} 기본 모드 — 누른 순간을 기록하지 못했다 (pointerdown 이 ${t.trigger} 에 닿지 않았다) — 기준 시점이 없어 판정할 수 없다`,
        );
        await page.close();
        continue;
      }
      const below = placed.down.below;
      const moved = Math.round(placed.scrollY - placed.down.scrollY);
      // ⚠️ **전제 — 공간이 모자라야 이 절이 무언가를 잰다.** 메뉴가 들어가는 자리(react-select
      //    `getMenuPlacement` 1번 갈래)에서는 기본을 되돌려도 「뒤집기 없음 · 스크롤 0 · 래퍼 0」이
      //    전부 참이다. 데모 끝에 여백이 생기거나 `.last()` 가 바뀌면 조용히 아무것도 안 재게
      //    되므로 전제를 **실패**로 잡는다(리뷰 WARN · 2026-09-17). selftest 는 이 전제를 뒤집지 않는다.
      if (below >= MENU_MIN_PX) {
        failures += 1;
        checks += 1;
        console.log(
          `   ❌ ${t.label} 기본 모드 — 전제 실패: 컨트롤 아래 공간 ${Math.round(below)}px ≥ ${MENU_MIN_PX}px. 메뉴가 들어가는 자리라 이 절이 아무것도 안 잰다 — 데모 배치가 바뀌었는지 본다`,
        );
        await page.close();
        continue;
      }
      const inPlace =
        placed.top === false &&
        placed.inContainer &&
        placed.wrappers === 0 &&
        moved === 0;
      sections.inPlace += 1;
      expect(
        inPlace === E.inPlace,
        `${t.label} 기본 모드 — 제자리 · 뒤집지 않음 · 페이지 스크롤 0 · 래퍼 0 (아래 공간 ${Math.round(below)}px)`,
        `menu--top=${placed.top} 컨테이너 안=${placed.inContainer} 래퍼=${placed.wrappers} 스크롤 변화=${moved}px`,
      );
    }

    // ── 뒤집힘 방향 (`hasPortal` 데모가 있는 컴포넌트만)
    if (t.flipTrigger) {
      await page.setViewportSize({ width: 1000, height: 420 });
      await page.goto(`${BASE}${t.path}`, { waitUntil: "networkidle" });
      // ⚠️ 트리거를 뷰포트 **하단**으로 결정적으로 민다. 데모 배치가 바뀌었다고
      //    이 절이 조용히 미실시가 되면 `key={placement}` 를 아무도 안 재게 된다
      //    (리뷰 WARN · 2026-09-16).
      const below = await page
        .locator(`${t.flipTrigger} >> visible=true`)
        .first()
        .evaluate((el) => {
          el.scrollIntoView({ block: "end" });
          const r = el.getBoundingClientRect();
          return window.innerHeight - r.bottom;
        });
      await page.waitForTimeout(150);
      await armEnterRecorder(page, t.panel);
      // ⚠️ `openPanel` 은 페이지의 **첫** 컨트롤을 누른다 — 여기서는 `hasPortal` 데모를 직접 누른다
      await page.locator(`${t.flipTrigger} >> visible=true`).first().click();
      await page.waitForSelector(t.panel, { timeout: 3000 });
      const flipped = await readRecordedEnter(page);
      const flipTy = ty(flipped?.transform);
      // ⚠️ **이 절은 부호 전용이다.** 뒤집힐 때는 `key={placement}` remount 가 한 틱을
      //    먹어 첫 기록 프레임이 이미 진행돼 있다(실측 6.5 · 4.9 — 아래로 펼칠 때는 8.0).
      //    거리의 정확성은 「실측 동일」 절이 bottom 자리에서 8px 하한으로 본다. 여기서
      //    같은 하한을 요구하면 remount 라는 **의도한 동작** 때문에 헛짚는다(`scripts.md §3`).
      //    하한을 절반에 두는 것은 0 부근에서 부호가 흔들리는 것만 막기 위해서다.
      expect(
        flipped?.placement === "top" &&
          Math.sign(flipTy) === E.flipSign &&
          Math.abs(flipTy) >= AWAY_PX / 2,
        `${t.label} 뒤집힘 방향 — 위로 뒤집히면 아래(트리거 쪽)에서 자란다 (ty=${flipTy.toFixed(1)})`,
        `placement=${flipped?.placement} ty=${flipTy.toFixed(1)} · 트리거 아래 공간 ${Math.round(below)}px` +
          (flipped?.placement !== "top"
            ? " — 뒤집히지 않았다. 뷰포트나 데모 배치가 바뀌었는지 본다"
            : ` — 기대 부호 ${E.flipSign} · |ty| ≥ ${AWAY_PX / 2}`),
      );
    }

    // ── 모션 감소 — 위치 이동 없음 · 퇴장은 페이드 · 퇴장 중 포인터 차단 (Select.md §10 · motion.md §5-2)
    //    Emil *"not zero"* 를 따른다(2026-09-17 · `sources/emil-apple.md` 「모션 감소」 행 따름).
    //    `reduceMotion` 이 이동을 빼고 `opacity` · `pointerEvents` · 퇴장 시간을 남기고,
    //    `reduceMotionTransition` 이 같은 시간의 페이드를 준다 — 퇴장 150ms.
    //    예전 기대는 「퇴장 즉시」(실측 7~21ms)였다 — 그것이 재던 것이 정본 이탈이었다.
    if (t.reduced) {
      const rm = await browser.newPage({
        viewport: { width: 1000, height: 900 },
        reducedMotion: "reduce",
      });
      await rm.goto(`${BASE}${t.path}`, { waitUntil: "networkidle" });
      await armEnterRecorder(rm, t.panel);
      await openPanel(rm, t);
      // 첫 rAF 가 늦게 오는 판이 있다(탐침 900ms) — 고정 대기 대신 프레임이 다 찰 때까지 기다린다
      await rm
        .waitForFunction(() => (window.__nuiFrames ?? []).length >= 14, null, {
          timeout: 3000,
        })
        .catch(() => {});
      const frames = await rm.evaluate(() => window.__nuiFrames ?? []);
      const moved = frames.filter((f) => f.transform !== "none");
      const last = frames.at(-1);
      // 「끝에 보인다」는 0.99 이상 — 등장이 페이드라 마지막 기록 프레임이 0.999999 일 수 있다.
      // 예전 `duration: 0` 은 한 프레임에 1 이 되어 `=== 1` 이 우연히 맞았다 (scripts.md §10)
      const noMove =
        frames.length > 0 && moved.length === 0 && (last?.opacity ?? 0) >= 0.99;
      sections.reduced += 1;
      expect(
        noMove === E.reducedNoMove,
        `${t.label} 모션 감소 — 등장에 위치 이동이 없다 (프레임 ${frames.length})`,
        frames.length === 0
          ? "프레임을 하나도 못 잡았다"
          : `transform 이 none 이 아닌 프레임 ${moved.length}개 (첫 값 ${moved[0]?.transform ?? "-"}) · 마지막 opacity=${last?.opacity}`,
      );

      // 퇴장은 브라우저 안에서 잰다 — 키를 받은 순간부터 패널이 DOM 에서 빠진 순간까지 ·
      // 그 도중(EXIT_MS / 3 = 50ms)의 `pointer-events`
      await rm.evaluate(
        ({ sel, midMs }) => {
          window.__nuiExitMs = null;
          window.__nuiMidPointer = null;
          document.addEventListener(
            "keydown",
            (e) => {
              if (e.key !== "Escape") return;
              const t0 = performance.now();
              setTimeout(() => {
                const el = document.querySelector(sel);
                window.__nuiMidPointer = el
                  ? getComputedStyle(el).pointerEvents
                  : "gone";
              }, midMs);
              const obs = new MutationObserver(() => {
                if (document.querySelector(sel)) return;
                window.__nuiExitMs = performance.now() - t0;
                obs.disconnect();
              });
              obs.observe(document.body, { childList: true, subtree: true });
            },
            { capture: true, once: true },
          );
        },
        { sel: t.panel, midMs: Math.round(EXIT_MS / 3) },
      );
      await rm.keyboard.press("Escape");
      await rm.waitForTimeout(EXIT_MS + 300);
      const exitMs = await rm.evaluate(() => window.__nuiExitMs);
      const midPointer = await rm.evaluate(() => window.__nuiMidPointer);
      // 문턱은 `EXIT_MS × ⅔`(100ms) — 예전 `duration: 0` 은 7~21ms 에 DOM 을 뺐고, 150ms 페이드는
      // 그보다 빨리 빠질 수 없다. 둘 사이가 넓어 부하에 흔들리지 않는다.
      const REDUCED_EXIT_MIN = Math.round((EXIT_MS * 2) / 3);
      const fades = exitMs !== null && exitMs >= REDUCED_EXIT_MIN;
      expect(
        fades === E.reducedExitFades,
        `${t.label} 모션 감소 — 퇴장이 페이드로 걸린다 (${exitMs === null ? "-" : exitMs.toFixed(0)}ms)`,
        exitMs === null
          ? `${EXIT_MS + 300}ms 가 지나도 DOM 에 남아 있다`
          : `${exitMs.toFixed(0)}ms — ${REDUCED_EXIT_MIN}ms 이상이어야 한다 (0 이 아니다)`,
      );
      // 퇴장 중 포인터 차단 — 모션 감소에서도 페이드 150ms 동안 옵션 · 날짜가 눌리면 안 된다
      const blocked = midPointer === "none";
      expect(
        blocked === E.reducedPointerBlocked,
        `${t.label} 모션 감소 — 퇴장 중 포인터 차단 (${midPointer ?? "-"})`,
        `퇴장 ${Math.round(EXIT_MS / 3)}ms 시점 pointer-events=${midPointer}`,
      );
      await rm.close();
    }

    await page.close();
  }

  // ── 동일 ①: 두 소스가 같은 모션 키를 쓴다 (브라우저가 아니라 파일로 잰다)
  if (!SCOPE || (SCOPE.has("select") && SCOPE.has("datepicker"))) {
    console.log("\n■ Select ↔ Datepicker 동일");
    const src = Object.fromEntries(
      Object.entries(SOURCES).map(([name, rel]) => [
        name,
        stripComments(readFileSync(join(ROOT, rel), "utf8")),
      ]),
    );
    for (const [re, label] of SHARED_MOTION_KEYS) {
      const inBoth = Object.values(src).every((s) => re.test(s));
      expect(
        inBoth === E.sameMotion,
        `소스 동일 — ${label} (${re.source})`,
        Object.entries(src)
          .filter(([, s]) => !re.test(s))
          .map(([n]) => `${n} 에 없다`)
          .join(" · ") || "양쪽에 다 있다",
      );
    }

    // ── 동일 ②: 재 보면 이동 거리도 같다
    if (measured.has("select") && measured.has("datepicker")) {
      const a = measured.get("select");
      const b = measured.get("datepicker");
      // 절대값 하한을 함께 본다 — 둘 다 늦게 잡혀 작은 값이면 「틀린 값끼리 통과」가 된다
      const same = Math.abs(a - b) <= 1 && a >= AWAY_PX - 1 && b >= AWAY_PX - 1;
      expect(
        same === E.sameMotion,
        `실측 동일 — 첫 프레임 이동 거리 (${a.toFixed(1)} · ${b.toFixed(1)})`,
        `Select ${a.toFixed(1)} vs Datepicker ${b.toFixed(1)} — 차이 1px 이내 · 각각 ${AWAY_PX - 1}px 이상이어야 한다`,
      );
    }
  } else {
    console.log("\n⏭️  Select ↔ Datepicker 동일 — 범위 밖 (둘 다 있어야 잰다)");
  }

  await browser.close();

  if (checks === 0) {
    console.error(
      "\n❌ 검사한 것이 없다 — 셀렉터나 범위가 늙었다 (scripts.md §2)",
    );
    process.exit(1);
  }

  for (const key of Object.keys(sections)) {
    const wanted = TARGETS.some((t) => t[key] && (!SCOPE || SCOPE.has(t.slug)));
    if (wanted && sections[key] === 0) {
      console.error(
        `\n❌ 절 ${key} 이 0건이다 — 플래그를 가진 대상이 범위 안에 있는데 아무것도 안 쟀다 (scripts.md §2)`,
      );
      process.exit(1);
    }
  }

  if (SELFTEST) {
    console.log(`\n🎯 검출력 ${detected}/${checks} (못 잡은 것 ${failures})`);
    process.exit(failures === 0 ? 0 : 1);
  }

  console.log(
    failures === 0
      ? `\n✅ 드롭다운 모션 통과 — 대상 ${targetsSeen.size} · 검사 ${checks}`
      : `\n❌ ${failures}건 실패`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
