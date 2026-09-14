#!/usr/bin/env node
/**
 * 눌림 검사 — 누르는 것들을 **실제로 누른 채로** 배율과 면을 잰다.
 *
 * 무엇을 못 보고 있었나 — 눌림은 문자열로 판정이 안 된다(`scripts.md §7`). `:active` 규칙이
 * SCSS 에 있어도 상세도에 밀려 안 걸릴 수 있고, 그 반대로 빼기로 한 면이 남아 있을 수도
 * 있다. 그런데 qa 에이전트가 쓰는 MCP 도구 세트에는 **누른 상태를 유지하는 프리미티브가
 * 없다** — `browser_click` 은 down·up 을 한 프레임에 처리한다. 그래서 눌림 항목이 두 판
 * 연속 「미실시 — 도구 제약」으로 남았고, 한 판은 우회로를 찾느라 12분을 썼다(2026-09-13).
 * Playwright 의 Node API 는 `page.mouse.down()` 을 갖고 있고 `check-a11y.mjs` 가 이미 그것으로
 * hover·active 색을 잰다. 같은 방법을 눌림 배율에 쓴다.
 *
 * 재는 것 — 누르는 자리마다 (1) 정말로 `:active` 가 걸렸나 (2) `transform` 의 배율이 토큰
 * 값과 같나 (3) 면이 있어야 하는 자리에 있고 없어야 하는 자리(ghost)에 없나.
 *
 * 헛짚기 — 첫 실행(2026-09-13) 대상 8 · 헛짚기 0. 마우스가 중앙을 못 누르는 요소가 있으면
 * (1) 이 먼저 실패하므로 「셀렉터가 늙었다」와 「배율이 틀렸다」가 갈린다.
 * ⚠️ 첫 실행에서 Switch 의 첫 매치가 **보이지 않는 요소**라 스크롤 대기 30초 뒤 영수증 없이
 *    죽었다. 보이는 것만 고르고(`>> visible=true`), 한 대상이 실패해도 다음으로 간다 —
 *    어느 길로 끝나든 영수증을 찍는다(`scripts.md §1`).
 * 검출력 — `--selftest` 가 기대값을 일부러 틀리게 두어(배율 0.5 · square 면 없음 · 버튼 전체가
 * 줄어드는 자리에 `still` · root 에 면이 있는 자리에 `faceFrom: root` + `face: none`) 넷 다
 * 잡히는지 본다. 첫 실행 검출 2/2 (대상 8) · Accordion 을 더한 2026-09-13 부터 4/4 (대상 10).
 *
 * 사용:
 *   node scripts/check-press.mjs                 전체
 *   node scripts/check-press.mjs --page=checkbox  changed-scope 가 뽑은 슬러그만
 *   node scripts/check-press.mjs --selftest       검출력 시험
 *
 * dev server 가 없으면 영수증 없이 exit 1 — 그것이 「미실시」의 정의다(`scripts.md §8`).
 */
import { chromium } from "playwright";

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

/**
 * 누르는 자리. 값은 `tokens.md §3-10` 의 배율 토큰이고, 면은 `design-system.md §2-2-0 · §2-3-1`.
 *
 * ⚠️ ghost 만 `scale-90` 이고 면이 없다 — 「배경 없이 체크만」이 정의라 배율이 유일한 눌림
 *    신호다(spec SelectionControl §5-2). 나머지 24px 요소는 면이 있어 `scale-94` 그대로다.
 *    갈림의 기준은 크기가 아니라 **면의 유무**다.
 *
 * root       마우스가 누르는 요소(가운데를 누른다). 보이는 첫 매치. 실제 `:active` 는
 *            `input` 이 받으면 그것을 본다
 * read       transform 을 읽는 요소. 없으면 root 자신
 * scale      기대 배율
 * face       "none" 누르는 동안 면이 없어야 한다 · "yes" 있어야 한다 · "any" 안 본다
 * faceFrom   면을 읽는 요소 — "read"(기본) · "root". 「내용만 줄어든다」 자리는 배율은 `read` 에,
 *            면은 `root` 에 있다 (Accordion 모드 A · design-system.md §2-3-1)
 * still      true 면 root 의 transform 이 **없어야** 한다 — 면이 제자리인지 (Accordion 모드 A)
 *
 * 아직 안 재는 것 — Popup 닫기(0.96) · Toast 닫기(0.94) · Select 지우기(0.94). 셋 다 열어야
 * 보이는 자리라 opener 가 필요하다. 다음 판에서 더한다 — 여기 적어 두는 것은 「통과」가 그 셋을
 * 빼고 한 말임을 남기기 위해서다(`scripts.md §9`).
 */
const TARGETS = [
  {
    label: "Checkbox ghost 미선택",
    page: "/components/checkbox",
    root: ".nui-checkbox--ghost:not(.nui-is-error):not(.nui-is-disabled):not(.nui-is-readonly):has(input:not(:checked))",
    read: ".nui-checkbox__control",
    scale: 0.9,
    face: "none",
  },
  {
    label: "Checkbox ghost 선택",
    page: "/components/checkbox",
    root: ".nui-checkbox--ghost:not(.nui-is-error):not(.nui-is-disabled):not(.nui-is-readonly):has(input:checked)",
    read: ".nui-checkbox__control",
    scale: 0.9,
    face: "none",
  },
  {
    label: "Checkbox ghost 에러",
    page: "/components/checkbox",
    root: ".nui-checkbox--ghost.nui-is-error:not(.nui-is-disabled)",
    read: ".nui-checkbox__control",
    scale: 0.9,
    face: "none",
  },
  {
    label: "Checkbox square",
    page: "/components/checkbox",
    root: ".nui-checkbox:not(.nui-checkbox--ghost):not(.nui-is-disabled):not(.nui-is-readonly)",
    read: ".nui-checkbox__control",
    scale: 0.94,
    face: "yes",
  },
  {
    label: "Radio",
    page: "/components/radio",
    root: ".nui-radio:not(.nui-is-disabled):not(.nui-is-readonly)",
    read: ".nui-radio__control",
    scale: 0.94,
    face: "yes",
  },
  {
    label: "Switch",
    page: "/components/switch",
    root: ".nui-switch:not(.nui-is-disabled):not(.nui-is-readonly)",
    read: ".nui-switch__control",
    scale: 0.94,
    face: "yes",
  },
  {
    label: "Textfield 보조 버튼",
    page: "/components/textfield",
    root: ".nui-textfield__btn:not([disabled])",
    read: null,
    scale: 0.94,
    face: "any",
  },
  {
    label: "Button",
    page: "/components/button",
    root: ".nui-button:not([disabled]):not([aria-busy=true])",
    read: null,
    scale: 0.98,
    face: "any",
  },
  // Accordion (2026-09-13 · spec Accordion.md §9 「눌림 자리」) — 모드 A 는 내용만, 모드 B 는 버튼 전체
  {
    label: "Accordion 헤더 (모드 A · 내용만)",
    page: "/components/accordion",
    root: ".nui-accordion__button:not(.nui-accordion__button--icon):not([disabled])",
    read: ".nui-accordion__head",
    scale: 0.98,
    face: "yes",
    faceFrom: "root",
    still: true,
  },
  // 모드 B 는 면이 없다(2026-09-13) — 배율이 유일한 신호라 scale-90 · Checkbox ghost 와 같은 줄
  {
    label: "Accordion 화살표 (모드 B · 버튼 전체 · 면 없음)",
    page: "/components/accordion",
    root: ".nui-accordion__button--icon:not([disabled])",
    read: null,
    scale: 0.9,
    face: "none",
  },
];

/* 검출력 시험 — 기대값을 일부러 틀리게 둔다. 둘 다 잡혀야 한다 */
const SELFTEST_TARGETS = [
  { ...TARGETS[0], label: "[selftest] ghost 배율 0.5 기대", scale: 0.5 },
  { ...TARGETS[3], label: "[selftest] square 면 없음 기대", face: "none" },
  // 모드 B 화살표는 버튼 전체가 줄어든다 — `still` 을 걸면 잡혀야 한다
  {
    ...TARGETS[TARGETS.length - 1],
    label: "[selftest] 화살표에 still 기대",
    still: true,
  },
  // 모드 A 의 면은 root(`__button`)에 있다 — `faceFrom: root` 로 읽으면 「면 없음」 기대가 잡혀야 한다.
  // read(`__head`)에서 읽으면 투명이라 조용히 통과한다 — 그 구멍을 이 사례가 본다
  {
    ...TARGETS[TARGETS.length - 2],
    label: "[selftest] 헤더 면 none 기대 (faceFrom root)",
    face: "none",
  },
];

const TRANSPARENT = /rgba\(0, 0, 0, 0\)|transparent/;
const failures = [];
const ok = (m) => console.log("  ✅", m);
const bad = (m) => {
  console.log("  ❌", m);
  failures.push(m);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
// 셀렉터가 늙었을 때 30초씩 기다리지 않는다 — 한 대상 8초 안에 답이 안 나오면 실패다
page.setDefaultTimeout(8000);

/** 누른 상태의 배율·면을 한 번 읽는다. */
async function readPressed(root, t) {
  return root.evaluate(
    (el, { readSel, faceFrom }) => {
      const target = readSel ? el.querySelector(readSel) : el;
      const scaleOf = (node) => {
        const m = getComputedStyle(node).transform.match(/matrix\(([-\d.]+),/);
        return m ? Number(m[1]) : 1;
      };
      const activeEl = el.querySelector("input") ?? el;
      return {
        active: activeEl.matches(":active"),
        scale: scaleOf(target),
        rootScale: scaleOf(el),
        bg: getComputedStyle(faceFrom === "root" ? el : target).backgroundColor,
      };
    },
    { readSel: t.read, faceFrom: t.faceFrom ?? "read" },
  );
}

/** 배율이 안 멈춘 채 읽힌 대상 — 영수증에 수로 남긴다 */
let unstable = 0;

/**
 * 가운데를 누른 채 **배율이 멈출 때까지** 읽는다. 토큰 계산으로 흉내내지 않는다.
 * 어떤 예외도 밖으로 던지지 않는다 — 한 대상이 실패해도 영수증까지 간다.
 *
 * ⚠️ **고정 대기(220ms)를 쓰지 않는다** (2026-09-14). `duration-pressed` 가 150 이라 넉넉해
 *    보였지만, 메인 스레드가 바쁘면 전환이 제때 시작하지 못해 **도중을 잡는다.** 실제로
 *    `verify:a11y`(3~4분) 직후와 연속 실행에서 4회 중 2회가 같은 자리에서 틀렸다 —
 *    `Checkbox ghost 미선택 배율 0.963895 — 기대 0.9`. 0.96 은 1 → 0.9 로 가는 중간값이고,
 *    같은 검사가 나머지 2회는 정확히 0.9 를 읽었다. **컴포넌트가 아니라 검사가 흔들렸다.**
 *
 *    헛짚는 검사는 사람이 무시하기 시작하고, 무시하면 진짜를 놓친다 (scripts.md §3).
 *
 * 첫 읽기를 `duration-pressed` 뒤로 미루는 이유 — 그 전에는 전환이 시작도 안 해 `1` 이 두 번
 * 연속 읽히고 **멈춘 것으로 오인**된다. 그 뒤부터 같은 값이 두 번 나오면 확정하고, 끝내 안
 * 멈추면 마지막 값으로 판정하되 `unstable` 에 센다.
 */
const SETTLE_FIRST_MS = 170; // duration-pressed(150) + 여유
const SETTLE_STEP_MS = 60;
const SETTLE_TRIES = 8; // 최대 170 + 480 = 650ms

async function pressAndRead(t) {
  const root = page.locator(`${t.root} >> visible=true`).first();
  try {
    if (!(await root.count())) return { missing: true };
    await root.scrollIntoViewIfNeeded();
    const box = await root.boundingBox();
    if (!box) return { missing: true };
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();

    await page.waitForTimeout(SETTLE_FIRST_MS);
    let prev = await readPressed(root, t);
    for (let i = 0; i < SETTLE_TRIES; i += 1) {
      await page.waitForTimeout(SETTLE_STEP_MS);
      const next = await readPressed(root, t);
      if (next.scale === prev.scale && next.rootScale === prev.rootScale) {
        return next;
      }
      prev = next;
    }
    unstable += 1;
    console.log(
      `  ⚠️  ${t.label} — ${SETTLE_FIRST_MS + SETTLE_STEP_MS * SETTLE_TRIES}ms 안에 배율이 멈추지 않았다 (마지막 ${prev.scale})`,
    );
    return prev;
  } catch (e) {
    return { error: String(e.message ?? e).split("\n")[0] };
  } finally {
    await page.mouse.up().catch(() => {});
    await page.mouse.move(2, 2).catch(() => {});
    await page.waitForTimeout(60);
  }
}

async function run(targets) {
  let pressed = 0;
  let current = null;
  for (const t of targets) {
    if (!inScope(t.page)) {
      console.log(
        `  ⏭️  ${t.label} — 범위 밖 (--page=${[...(SCOPE ?? [])].join(",")})`,
      );
      continue;
    }
    if (current !== t.page) {
      try {
        await page.goto(BASE + t.page, { waitUntil: "networkidle" });
      } catch (e) {
        bad(`${t.label}: 페이지를 못 열었다 — ${t.page}`);
        continue;
      }
      current = t.page;
    }
    const r = await pressAndRead(t);
    if (r.missing) {
      bad(
        `${t.label}: 보이는 요소를 찾지 못했다 — 셀렉터가 늙었거나 데모가 접혀 있다 (${t.root})`,
      );
      continue;
    }
    if (r.error) {
      bad(`${t.label}: 누르지 못했다 — ${r.error}`);
      continue;
    }
    if (!r.active) {
      bad(
        `${t.label}: 눌림이 걸리지 않았다 — 가운데에 다른 요소가 있거나 셀렉터가 늙었다`,
      );
      continue;
    }
    pressed += 1;
    const scaleOk = Math.abs(r.scale - t.scale) < 0.005;
    const line = `${t.label} 배율 ${r.scale}`;
    scaleOk ? ok(line) : bad(`${line} — 기대 ${t.scale}`);
    if (t.still) {
      Math.abs(r.rootScale - 1) < 0.005
        ? ok(`${t.label} 면은 제자리`)
        : bad(
            `${t.label} 면까지 줄었다 (root 배율 ${r.rootScale}) — 내용만 줄어야 한다`,
          );
    }
    if (t.face === "none") {
      TRANSPARENT.test(r.bg)
        ? ok(`${t.label} 면 없음`)
        : bad(`${t.label} 면이 남아 있다 (${r.bg})`);
    } else if (t.face === "yes") {
      !TRANSPARENT.test(r.bg)
        ? ok(`${t.label} 면 있음`)
        : bad(`${t.label} 면이 없다 — 면이 있어야 하는 자리다`);
    }
  }
  return pressed;
}

let exit = 0;

if (SELFTEST) {
  console.log("\n■ 검출력 시험 — 기대값을 일부러 틀리게 둔다");
  const before = failures.length;
  await run(SELFTEST_TARGETS);
  const detected = failures.length - before;
  const want = 4;
  console.log(`\n  검출 ${detected}/${want}`);
  exit = detected === want ? 0 : 1;
  failures.length = 0; // 시험에서 난 실패는 진짜가 아니다
  console.log(
    exit
      ? "❌ 검출력 시험 실패 — 틀린 기대값이 안 잡혔다"
      : "✅ 검출력 시험 통과",
  );
  await browser.close();
  console.log(
    `RECEIPT check-press selftest detected=${detected}/${want} exit=${exit}`,
  );
  process.exit(exit);
}

console.log(
  "\n■ 눌림 — 누른 채로 배율과 면 (design-system §2-2-0 · §6-3 · tokens §3-10)",
);
const pressed = await run(TARGETS);
const targetsInScope = TARGETS.filter((t) => inScope(t.page)).length;
if (targetsInScope > 0 && pressed === 0) {
  bad("하나도 누르지 못했다 — 셀렉터가 전부 늙었거나 페이지가 비었다");
}

await browser.close();

exit = failures.length ? 1 : 0;
console.log(
  exit
    ? `\n❌ 눌림 검사 실패 — ${failures.length}건`
    : `\n✅ 눌림 검사 통과 — ${pressed}곳을 눌렀다`,
);
console.log(
  `RECEIPT check-press scope=${SCOPE ? [...SCOPE].join(",") : "all"} targets=${targetsInScope} pressed=${pressed} unstable=${unstable} failures=${failures.length} exit=${exit}`,
);
process.exit(exit);
