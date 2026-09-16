#!/usr/bin/env node
/**
 * 팝업 계열의 **브라우저에서만 드러나는 회귀**를 검사한다.
 *
 *   1. dim 을 누르면 닫힌다 (LayerPopup). 화면 전체를 덮는 positioner 가 dim 위에서
 *      클릭을 먹어 조용히 죽어 있던 적이 있다 (2026-09-09) — CSS 격리 · 콘솔 · 타입
 *      검사 전부 통과한 채였다.
 *   2. Alert · Confirm 은 dim 과 Esc 로 닫히지 않는다 (KRDS 398).
 *   3. 겹쳐 열면 Esc 는 맨 위만 닫는다.
 *
 * 사용: dev server 기동 후  node scripts/check-popup.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE =
  process.argv.find((a) => a.startsWith("http")) ??
  `http://localhost:${process.env.PORT ?? 3000}`;
// 검출력 시험 (scripts.md §4) — 시트 절을 **드래그가 꺼진 시트**에 돌려 실패를 내는지 본다.
// 합성 반례가 곧 문서의 「정렬 바꾸기」 시트다. 실패가 셋 미만이면 절이 아무것도 못 보는 것이다.
const SELFTEST = process.argv.includes("--selftest");

try {
  await fetch(BASE, { signal: AbortSignal.timeout(3000) });
} catch {
  console.error(
    `❌ ${BASE} 에 접속할 수 없다. 먼저 \`npm run dev\` 로 서버를 띄울 것.`,
  );
  process.exit(1);
}

const failures = [];
// 시트 드래그 절이 본 수 — 0 이면 실패 (scripts.md §2). 아래 절이 올린다
let sheetChecks = 0;
// 영수증 — 어느 길로 끝나든 마지막 줄. dev server 가 없어 위에서 죽으면 이 줄이 없다 = 미실시 (2026-09-11)
process.on("exit", (code) =>
  console.log(
    `RECEIPT check-popup failures=${failures.length} sheet=${sheetChecks} selftest=${SELFTEST ? "on" : "off"} exit=${code}`,
  ),
);
const ok = (m) => console.log("  ✅", m);
const bad = (m) => {
  console.log("  ❌", m);
  failures.push(m);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type())) {
    consoleMessages.push(`${m.type()}: ${m.text()}`);
  }
});
const panels = () => page.locator(".nui-popup__panel").count();
const wait = (ms) => page.waitForTimeout(ms);
// 실제 마우스로 화면 구석을 누른다 — locator.click 은 가로막는 요소를 기다리므로
// 「무엇이 클릭을 받는가」 자체를 재지 못한다.
const clickDim = async () => {
  await page.mouse.click(8, 8);
  await wait(600);
};

console.log("\n■ LayerPopup");
await page.goto(`${BASE}/components/layer-popup`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "약관 보기" }).click();
await wait(500);
(await panels()) === 1 ? ok("열린다") : bad("열리지 않는다");
const hit = await page.evaluate(
  () => document.elementFromPoint(8, 8)?.className,
);
hit === "nui-popup__dim"
  ? ok("화면 구석의 클릭은 dim 이 받는다")
  : bad(`화면 구석의 클릭을 ${hit} 이 받는다 — dim 에 닿지 않는다`);
await clickDim();
(await panels()) === 0
  ? ok("dim 을 누르면 닫힌다")
  : bad("dim 을 눌러도 닫히지 않는다");

await page.getByRole("button", { name: "겹쳐 열기" }).click();
await wait(500);
await page.getByRole("button", { name: "주소 찾기" }).click();
await wait(500);
(await panels()) === 2
  ? ok("둘이 겹쳐 열린다")
  : bad(`겹친 패널이 ${await panels()}`);
await page.keyboard.press("Escape");
await wait(600);
(await panels()) === 1
  ? ok("Esc 는 맨 위만 닫는다 (아래는 isTopmost=false)")
  : bad(`Esc 뒤 패널이 ${await panels()} (기대 1)`);
await page.keyboard.press("Escape");
await wait(600);

console.log("\n■ Confirm");
await page.goto(`${BASE}/components/confirm`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "발송" }).first().click();
await wait(500);
await page.keyboard.press("Escape");
await wait(400);
(await panels()) === 1 ? ok("Esc 로 닫히지 않는다") : bad("Esc 로 닫혔다");
await clickDim();
(await panels()) === 1 ? ok("dim 으로 닫히지 않는다") : bad("dim 으로 닫혔다");
await page.getByRole("button", { name: "취소" }).click();
await wait(600);
(await panels()) === 0
  ? ok("취소 버튼으로 닫힌다")
  : bad("취소를 눌러도 남아 있다");

// ── BottomSheet 끌어서 닫기 (G1 · 2026-09-15 · spec Popup.md §6-7 · §10)
//
// 정적 검사가 전부 통과하고 브라우저에서만 드러나는 것 — 시트의 `transform` 문자열과
// 드래그의 `y` 가 겨뤄 안 따라오는 것 · 속도 문턱을 px/ms 로 적어 살짝만 움직여도 닫히는 것 ·
// 패널 전체가 리스너라 본문 스크롤이 죽는 것 · 손잡이·헤더의 pointerdown 이 닫기 버튼 탭을
// 삼키는 것. 절 안의 수(`sheet=`)가 0 이면 실패다 (scripts.md §2).
console.log("\n■ BottomSheet 끌어서 닫기");
const sheetOk = (m) => {
  sheetChecks += 1;
  ok(m);
};
const sheetBad = (m) => {
  sheetChecks += 1;
  bad(m);
};

const SHEET_URL = `${BASE}/components/bottom-sheet`;
const HANDLE = ".nui-popup__handle";
const PANEL = ".nui-popup__panel";
const BODY = ".nui-popup__body";

/** 패널의 세로 이동량(px). transform 이 `none` 이면 0 */
const panelY = (p) =>
  p.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return new DOMMatrixReadOnly(getComputedStyle(el).transform).m42;
  }, PANEL);
const near = (v, target, tol = 1) => v != null && Math.abs(v - target) <= tol;

const SHEET_OPENER = SELFTEST ? "정렬 바꾸기" : "끌어서 닫는 시트 열기";
const openDragSheet = async (p) => {
  // 앞 검사가 못 닫고 남긴 시트(자기 시험의 반례)가 있으면 Esc 로 치운다 — 열린 채면 오프너가 dim 뒤다
  if ((await p.locator(PANEL).count()) > 0) {
    await p.keyboard.press("Escape");
    await p.waitForTimeout(600);
  }
  await p.getByRole("button", { name: SHEET_OPENER }).first().click();
  await p.locator(PANEL).waitFor({ state: "visible", timeout: 3000 });
  // 등장 스프링(visualDuration 0.3)이 앉을 때까지 — 값이 움직이는 동안 재지 않는다
  await p.waitForTimeout(600);
};
const center = (box) => ({
  x: box.x + box.width / 2,
  y: box.y + box.height / 2,
});
/** 끄는 자리 — 손잡이. 없으면(자기 시험) 헤더 왼쪽에서 끈다 */
const gripOf = async (p) => {
  // `boundingBox()` 는 요소가 붙을 때까지 기다린다 — 없는 손잡이는 먼저 센다
  if ((await p.locator(HANDLE).count()) > 0) {
    return center(await p.locator(HANDLE).boundingBox());
  }
  const head = await p.locator(".nui-popup__head").boundingBox();
  return { x: head.x + 40, y: head.y + head.height / 2 };
};

/**
 * 손가락처럼 끈다. 속도는 `pxPerStep / stepMs` 로 만든다 — framer 는 마지막 100ms 의
 * 이동으로 속도를 재므로(px/s) 「천천히」는 110 px/s 아래여야 한다. 2px/30ms ≈ 67 px/s.
 * `during` 을 주면 놓기 전에 부른다 — 끄는 도중의 값을 재는 자리.
 */
const dragDown = async (p, from, distance, pxPerStep, stepMs, during) => {
  await p.mouse.move(from.x, from.y);
  await p.mouse.down();
  const steps = Math.ceil(distance / pxPerStep);
  for (let i = 1; i <= steps; i += 1) {
    await p.mouse.move(from.x, from.y + Math.min(distance, i * pxPerStep));
    await p.waitForTimeout(stepMs);
  }
  if (during) await during();
  await p.mouse.up();
};

const sheetFailuresBefore = failures.length;
await page.goto(SHEET_URL, { waitUntil: "networkidle" });
await openDragSheet(page);
(await panels()) === 1 && (await page.locator(HANDLE).count()) === 1
  ? sheetOk("shouldCloseOnDrag 를 켜면 손잡이가 보인다")
  : sheetBad("손잡이가 없거나 시트가 안 열렸다");

// 끄는 면은 위쪽 44 띠 하나다 — 보이는 막대(36×4)와 다른 것이다 (spec §6-7 · §9)
// ⚠️ 띠가 없을 때(자기 시험의 반례)도 죽지 않아야 절이 끝까지 돌아 검출 수를 센다.
const hasBand = (await page.locator(HANDLE).count()) > 0;
const band = hasBand ? await page.locator(HANDLE).boundingBox() : null;
const bar = hasBand
  ? await page.evaluate((sel) => {
      const s = getComputedStyle(document.querySelector(sel), "::before");
      return {
        w: Math.round(parseFloat(s.width)) || 0,
        h: Math.round(parseFloat(s.height)) || 0,
      };
    }, HANDLE)
  : { w: 0, h: 0 };
Math.round(band?.height ?? 0) === 44
  ? sheetOk("끄는 띠가 44 다 (SEED touchArea)")
  : sheetBad(`끄는 띠가 ${Math.round(band?.height ?? 0)} — 기대 44`);
bar.w === 36 && bar.h === 4
  ? sheetOk("보이는 막대는 36×4 다 (SEED root)")
  : sheetBad(`막대가 ${bar.w}×${bar.h} — 기대 36×4`);

// 드래그를 켜면 X 가 기본으로 사라진다 (2026-09-15 · SEED 「둘 중 하나」)
(await page.locator(".nui-popup__close").count()) === 0
  ? sheetOk("드래그를 켜면 닫기 버튼이 기본으로 없다")
  : sheetBad("드래그를 켰는데 닫기 버튼이 그대로 있다");

const panelBox = await page.locator(PANEL).boundingBox();
const grip = await gripOf(page);
const height = panelBox?.height ?? 0;
height > 0
  ? sheetOk(`패널 높이 ${Math.round(height)}px`)
  : sheetBad("패널 높이 0");

// 1) 20% 를 천천히 — 제자리
await dragDown(page, grip, height * 0.2, 2, 30);
await wait(700);
(await panels()) === 1 && near(await panelY(page), 0)
  ? sheetOk("20% 만 끌고 놓으면 제자리로 돌아온다")
  : sheetBad(
      `20% 뒤 패널 ${await panels()} · y=${await panelY(page)} (기대 1 · 0)`,
    );

// 2) 본문은 스크롤하고 시트는 안 움직인다
const overflow = await page.evaluate((sel) => {
  const el = document.querySelector(sel);
  return el ? el.scrollHeight - el.clientHeight : 0;
}, BODY);
overflow > 0
  ? sheetOk(`본문이 ${Math.round(overflow)}px 넘친다 (스크롤 검사의 전제)`)
  : sheetBad("본문이 넘치지 않는다 — 데모 목록이 짧아졌나");
const bodyBox = await page.locator(BODY).boundingBox();
await dragDown(page, center(bodyBox), 200, 20, 10);
await wait(400);
near(await panelY(page), 0)
  ? sheetOk("본문을 끌어도 시트는 움직이지 않는다")
  : sheetBad(`본문을 끌자 시트가 y=${await panelY(page)} 로 움직였다`);
await page.mouse.move(center(bodyBox).x, center(bodyBox).y);
await page.mouse.wheel(0, 200);
await wait(200);
const scrolled = await page.evaluate(
  (sel) => document.querySelector(sel)?.scrollTop ?? 0,
  BODY,
);
scrolled > 0
  ? sheetOk(`본문이 스크롤된다 (scrollTop ${Math.round(scrolled)})`)
  : sheetBad("본문이 스크롤되지 않는다 — touch-action 이 본문까지 걸렸나");

// 2-b) 본문 끝에 닿아도 뒤 페이지가 안 움직인다 — `overscroll-behavior: contain`
//      선언형 팝업은 배경 잠금이 없으므로(spec §6-2) 이 한 줄이 유일한 방어다.
await page.evaluate((sel) => {
  const el = document.querySelector(sel);
  el.scrollTop = el.scrollHeight;
}, BODY);
const pageScrollBefore = await page.evaluate(() => window.scrollY);
await page.mouse.move(center(bodyBox).x, center(bodyBox).y);
await page.mouse.wheel(0, 400);
await wait(300);
(await page.evaluate(() => window.scrollY)) === pageScrollBefore
  ? sheetOk("본문 끝에서 더 밀어도 뒤 페이지가 안 움직인다")
  : sheetBad(
      `스크롤이 뒤로 샜다 — window.scrollY ${pageScrollBefore} → ${await page.evaluate(() => window.scrollY)}`,
    );

// 3) 닫기 버튼 탭이 삼켜지지 않는다 — 띠가 X 를 덮지만 X 가 `z-index: 1` 로 이긴다.
//    기본값이 꺼짐으로 바뀌었으므로 `hasCloseButton` 을 켠 케이스에서 본다.
await page.keyboard.press("Escape");
await wait(600);
await page
  .getByRole("button", { name: "닫기 버튼도 함께 열기" })
  .first()
  .click();
await page.locator(PANEL).waitFor({ state: "visible", timeout: 3000 });
await wait(600);
(await page.locator(".nui-popup__close").count()) === 1
  ? sheetOk("hasCloseButton 을 켜면 X 가 다시 나온다")
  : sheetBad("hasCloseButton 을 켰는데 X 가 없다");
await page.locator(".nui-popup__close").click();
await wait(600);
(await panels()) === 0
  ? sheetOk("띠가 덮어도 닫기 버튼이 눌린다")
  : sheetBad("닫기 버튼 탭이 띠에 삼켜졌다");

// 3-b) 막대만 끄면 띠는 남는다 — `hasDragHandle={false}`
await page.getByRole("button", { name: "막대 없는 시트 열기" }).first().click();
await page.locator(PANEL).waitFor({ state: "visible", timeout: 3000 });
await wait(600);
const noBar = await page.evaluate((sel) => {
  const el = document.querySelector(sel);
  return el ? getComputedStyle(el, "::before").content : "(띠 없음)";
}, HANDLE);
(await page.locator(HANDLE).count()) === 1 && noBar === "none"
  ? sheetOk("hasDragHandle={false} — 막대는 없고 띠는 남는다")
  : sheetBad(
      `막대 끈 시트의 띠 ${await page.locator(HANDLE).count()}개 · ::before ${noBar}`,
    );
const noBarGrip = await gripOf(page);
await dragDown(page, noBarGrip, height * 0.45, 2, 30);
await wait(800);
(await panels()) === 0
  ? sheetOk("막대가 없어도 띠를 끌면 닫힌다")
  : sheetBad("막대 없는 시트가 끌리지 않는다");

// 4) 45% 를 천천히 — 닫힌다
await openDragSheet(page);
await dragDown(page, grip, height * 0.45, 2, 30);
await wait(800);
(await panels()) === 0
  ? sheetOk("40% 를 넘겨 놓으면 닫힌다")
  : sheetBad(`45% 를 끌어 놓았는데 패널 ${await panels()}`);

// 5) 짧게 빠르게 — 닫힌다 (20px/10ms ≈ 2000 px/s > 110)
await openDragSheet(page);
(await panelY(page)) != null && near(await panelY(page), 0)
  ? sheetOk("다시 열면 0 에서 시작한다")
  : sheetBad(`다시 열자 y=${await panelY(page)} 에서 시작했다`);
await dragDown(page, grip, 80, 20, 10);
await wait(800);
(await panels()) === 0
  ? sheetOk("짧아도 빠르게 튕기면 닫힌다")
  : sheetBad(`80px 튕김 뒤 패널 ${await panels()}`);

// 6) 띠 밖(제목)은 끌리지 않는다 ★ (2026-09-15에 헤더를 끄는 면에서 뺐다 · spec §6-7)
//    예전에는 헤더 전체가 끌렸다. 제목 길이에 따라 끄는 면이 달라지고 제목을 긁을 수 없었다.
//
//    ⚠️ 제목의 **맨 위**를 잡는다. 세로 중앙을 잡던 때는 띠 경계와 3px 차이로 통과해서,
//       띠가 제목을 실제로 덮고 있던 판을 놓쳤다(2026-09-15 리뷰). 막대를 끈 시트까지
//       돌리는 이유도 같다 — 그쪽이 덜 비우므로 겹치면 먼저 겹친다.
for (const [opener, label] of [
  ["끌어서 닫는 시트 열기", "막대 있는 시트"],
  ["막대 없는 시트 열기", "막대 없는 시트"],
]) {
  if ((await page.locator(PANEL).count()) > 0) {
    await page.keyboard.press("Escape");
    await wait(600);
  }
  await page.getByRole("button", { name: opener }).first().click();
  await page.locator(PANEL).waitFor({ state: "visible", timeout: 3000 });
  await wait(600);

  const titleBox = await page.locator(".nui-popup__title").boundingBox();
  const bandBox = await page.locator(HANDLE).boundingBox();
  bandBox && titleBox && bandBox.y + bandBox.height <= titleBox.y + 1
    ? sheetOk(`${label}: 띠가 제목을 덮지 않는다`)
    : sheetBad(
        `${label}: 띠가 제목을 ${Math.round((bandBox?.y ?? 0) + (bandBox?.height ?? 0) - (titleBox?.y ?? 0))}px 덮는다`,
      );

  let titleDragY = null;
  await dragDown(
    page,
    { x: titleBox.x + 20, y: titleBox.y + 2 },
    height * 0.2,
    2,
    30,
    async () => {
      titleDragY = await panelY(page);
    },
  );
  near(titleDragY, 0)
    ? sheetOk(`${label}: 제목을 끌어도 움직이지 않는다`)
    : sheetBad(`${label}: 제목을 끌자 y=${titleDragY} 로 움직였다`);
  await wait(700);
}
// 헤더가 손가락 조작을 가로채지 않는다 — 제목을 긁을 수 있다
const headTouch = await page.evaluate(
  () =>
    getComputedStyle(document.querySelector(".nui-popup__head")).touchAction,
);
headTouch === "auto"
  ? sheetOk("헤더에 touch-action 이 걸려 있지 않다")
  : sheetBad(`헤더 touch-action 이 ${headTouch} — 제목을 긁을 수 없다`);
await page.keyboard.press("Escape");
await wait(600);

// 7) 모션 감소 — 끌리고, 놓으면 즉시 제자리
const reducedCtx = await browser.newContext({
  reducedMotion: "reduce",
  viewport: { width: 1280, height: 900 },
});
const reduced = await reducedCtx.newPage();
await reduced.goto(SHEET_URL, { waitUntil: "networkidle" });
await openDragSheet(reduced);
const rGrip = await gripOf(reduced);
let reducedDragY = null;
await dragDown(reduced, rGrip, height * 0.2, 2, 30, async () => {
  reducedDragY = await panelY(reduced);
});
reducedDragY != null && reducedDragY > 10
  ? sheetOk(`모션 감소에서도 끌린다 (y=${Math.round(reducedDragY)})`)
  : sheetBad(`모션 감소에서 안 끌린다 (y=${reducedDragY})`);
await reduced.waitForTimeout(50);
near(await panelY(reduced), 0)
  ? sheetOk("모션 감소: 놓으면 즉시 제자리")
  : sheetBad(`모션 감소: 놓고 50ms 뒤 y=${await panelY(reduced)}`);

// 8) 모션 감소 · 끌어서 닫힘 — 끌어 내린 자리에서 사라진다. 되돌아감을 걸면 다음 프레임에
//    0 으로 튀었다가 사라진다(리뷰 2회차). 놓은 뒤 여섯 프레임의 이동량을 찍어 0 이 없어야 한다.
await openDragSheet(reduced);
await dragDown(reduced, rGrip, height * 0.45, 2, 30);
const closingFrames = await reduced.evaluate(
  (sel) =>
    new Promise((resolve) => {
      const out = [];
      const tick = () => {
        const el = document.querySelector(sel);
        out.push(
          el
            ? Math.round(
                new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
              )
            : null,
        );
        if (out.length < 6) requestAnimationFrame(tick);
        else resolve(out);
      };
      requestAnimationFrame(tick);
    }),
  PANEL,
);
await reduced.waitForTimeout(400);
const closedWithoutSnap =
  (await reduced.locator(PANEL).count()) === 0 &&
  closingFrames.every((v) => v === null || v > 10);
closedWithoutSnap
  ? sheetOk(
      `모션 감소: 끌어 내린 자리에서 사라진다 (프레임 ${closingFrames.join(" ")})`,
    )
  : sheetBad(
      `모션 감소: 닫힐 때 제자리로 튀거나 안 닫혔다 (프레임 ${closingFrames.join(" ")} · 패널 ${await reduced.locator(PANEL).count()})`,
    );

// 9) 모션 감소 · 끌어 닫은 뒤 **다시 열면 0 에서** ★ (2026-09-15 · 실기기에서 잡혔다)
//    `onExitComplete` 가 값만 놓고(`set`) 애니메이션을 안 멈추면, framer 가 드래그 종료에
//    스스로 건 관성이 다음 프레임에 옛 값을 다시 써 손을 뗀 자리에서 열린다. `jump` 가 멈춘다.
//    모션 감소 절이 「끌고 놓기」만 보고 이것을 안 봐서 놓쳤던 자리다.
await openDragSheet(reduced);
const reopenY = await panelY(reduced);
near(reopenY, 0)
  ? sheetOk("모션 감소: 끌어 닫은 뒤 다시 열면 0 에서 시작한다")
  : sheetBad(`모션 감소: 다시 열자 y=${reopenY} 에서 시작했다 (기대 0)`);
await reducedCtx.close();

sheetChecks > 0 || bad("시트 절이 아무것도 보지 않았다");

if (SELFTEST) {
  // 드래그가 꺼진 시트에서는 손잡이 · 40% · 튕김 · 헤더 · 모션 감소 다섯이 실패해야 한다.
  const detected = failures.length - sheetFailuresBefore;
  console.log("\n■ 자기 시험 — 드래그 없는 시트에서 절이 실패를 내는가");
  await browser.close();
  const passed = detected >= 3;
  console.log(
    passed
      ? `  ✅ 검출 ${detected}건 (기대 3 이상) — 절이 실제로 본다`
      : `  ❌ 검출 ${detected}건 — 절이 아무것도 못 본다`,
  );
  console.log(`RECEIPT check-popup selftest=on detected=${detected}`);
  process.exit(passed ? 0 : 1);
}

console.log("");
consoleMessages.length === 0
  ? ok("콘솔 에러·경고 0건")
  : bad(`콘솔 출력: ${consoleMessages.slice(0, 3).join(" | ")}`);

await browser.close();

if (failures.length > 0) {
  console.error(`\n❌ Popup 검사 실패 — ${failures.length}건`);
  process.exit(1);
}
console.log("\n✅ Popup 검사 통과 — dim · Esc · 쌓임 · 시트 드래그");
