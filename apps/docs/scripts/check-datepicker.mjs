#!/usr/bin/env node
/**
 * Datepicker 계열의 **브라우저에서만 드러나는 회귀**를 검사한다.
 *
 * 왜 별도 스크립트인가 — 아래 항목은 typecheck·verify:css·verify:pkg·verify:console
 * 을 전부 통과한 상태에서 실제로 발생했던 결함이다.
 *
 *   1. 날짜를 골라도 캘린더가 닫히지 않는다
 *      닫으면서 포커스를 되돌릴 때 `focus()` 가 focus 핸들러를 동기 호출해
 *      같은 배치에서 다시 열렸다. 열린 달력이 제출 버튼을 덮어 폼 제출까지 막혔다.
 *   2. 검증 실패 시 캘린더가 저절로 열린다
 *      RHF 가 첫 에러 필드로 포커스를 옮기는 것을 "사용자가 열려는 것" 으로 오인해,
 *      정작 읽어야 할 에러 메시지를 가렸다.
 *   3. 팝업이 조상의 `overflow: hidden` 에 잘려 날짜를 하나도 고를 수 없다
 *
 * 세 컴포넌트가 각자 페이지를 가진다 (2026-09-08 · 8단계). 페이지마다 RHF 폼이
 * 하나씩 있고, 폼의 `pre code` 가 폼 상태를 JSON 으로 보여준다.
 *
 * 사용: dev server 기동 후  node scripts/check-datepicker.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const PAGES = {
  single: `${BASE}/components/datepicker`,
  range: `${BASE}/components/date-range-picker`,
  multiple: `${BASE}/components/date-multiple-picker`,
};

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
const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
const consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type())) {
    consoleMessages.push(`${m.type()}: ${m.text()}`);
  }
});
page.on("dialog", (d) => d.accept());

const openCalendars = () => page.locator(".nui-daypicker").count();
const confirmButton = () =>
  page.locator(".nui-datepicker__dropdown-foot button");
const readFormState = async (form) =>
  JSON.parse(await form.locator("pre code").textContent());

// ── Datepicker ──────────────────────────────────────────────────────────
console.log("\n■ Datepicker");
await page.goto(PAGES.single, { waitUntil: "networkidle" });
const first = page.locator(".nui-datepicker").first();

// 1) 열기 → 날짜 선택 → 닫힘 + 포커스 복귀
await first.locator("input").click();
await page.waitForSelector(".nui-daypicker");
await first
  .locator(".nui-daypicker__day-button:not([disabled])")
  .nth(15)
  .click();
await page.waitForTimeout(600);
const afterPick = await first.evaluate((el) => ({
  value: el.querySelector("input")?.value,
  open: Boolean(el.querySelector(".nui-daypicker")),
  focusRole: document.activeElement?.getAttribute("role"),
}));
afterPick.open
  ? bad("날짜를 골라도 캘린더가 닫히지 않는다 (포커스 복귀가 다시 열고 있다)")
  : ok("날짜 선택 후 캘린더가 닫힌다");
afterPick.value
  ? ok(`값이 입력창에 반영된다 (${afterPick.value})`)
  : bad("선택한 값이 입력창에 없다");
afterPick.focusRole === "combobox"
  ? ok("닫을 때 포커스가 입력창으로 돌아온다")
  : bad(`닫은 뒤 포커스가 ${afterPick.focusRole} 로 유실됐다`);

// 2) 팝업이 잘리지 않고 전 날짜를 클릭할 수 있다
await first.locator("input").click();
await page.waitForSelector(".nui-daypicker");
const hitTest = await page.evaluate(() => {
  const buttons = [...document.querySelectorAll(".nui-daypicker__day-button")];
  let hittable = 0;
  for (const button of buttons) {
    const rect = button.getBoundingClientRect();
    // 뷰포트 밖은 스크롤하면 닿으므로 제외한다
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      hittable += 1;
      continue;
    }
    const hit = document.elementFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    );
    if (button === hit || button.contains(hit)) hittable += 1;
  }
  return { total: buttons.length, hittable };
});
hitTest.hittable === hitTest.total
  ? ok(`날짜 ${hitTest.total}개를 모두 마우스로 고를 수 있다`)
  : bad(
      `날짜 ${hitTest.total - hitTest.hittable}개가 가려져 있다 (팝업이 잘렸다)`,
    );
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

// 3) RHF: 검증 실패가 캘린더를 열지 않는다
const singleForm = page.locator("form");
await singleForm.locator("button[type=submit]").click();
await page.waitForTimeout(800);
(await openCalendars()) === 0
  ? ok("검증 실패로 포커스가 옮겨져도 캘린더가 열리지 않는다")
  : bad("검증 실패 시 캘린더가 열려 에러 메시지를 가린다");
const errorText = await singleForm
  .locator(".nui-message__msg--error")
  .first()
  .textContent()
  .catch(() => null);
errorText ? ok("에러 메시지가 보인다") : bad("에러 메시지가 없다");

// 그 뒤 사용자가 직접 클릭하면 정상적으로 열려야 한다 (과잉 차단 방지)
await singleForm.locator(".nui-datepicker input").click();
await page.waitForTimeout(400);
(await openCalendars()) > 0
  ? ok("검증 실패 후에도 클릭하면 정상적으로 열린다")
  : bad("클릭해도 열리지 않는다 — 과잉 차단");
await singleForm
  .locator(".nui-daypicker__day-button:not([disabled])")
  .nth(15)
  .click();
await page.waitForTimeout(500);
const singleState = await readFormState(singleForm);
singleState.isValid && singleState.visitDate
  ? ok("RHFDatepicker 값이 반영되어 isValid true")
  : bad(`isValid=${singleState.isValid} / visitDate=${singleState.visitDate}`);
await singleForm
  .locator("button[type=submit]")
  .click({ timeout: 5000 })
  .then(() => ok("제출 버튼을 클릭할 수 있다 (달력이 가리지 않는다)"))
  .catch(() => bad("제출 버튼이 가려져 클릭할 수 없다"));
await singleForm.locator("button", { hasText: "초기화" }).click();
await page.waitForTimeout(400);
(await singleForm.locator(".nui-datepicker input").inputValue()) === ""
  ? ok("reset 이 입력창에 반영된다")
  : bad("reset 후에도 값이 남아 있다");

// ── DateRangePicker ─────────────────────────────────────────────────────
console.log("\n■ DateRangePicker");
await page.goto(PAGES.range, { waitUntil: "networkidle" });
const rangeForm = page.locator("form");
await rangeForm.locator(".nui-datepicker input").click();
await page.waitForSelector(".nui-daypicker");
const rangeButtons = rangeForm.locator(
  ".nui-daypicker__day-button:not([disabled])",
);
await rangeButtons.nth(8).click();
await page.waitForTimeout(250);
(await confirmButton().isDisabled())
  ? ok("시작일만 고르면 확정 버튼이 잠긴다")
  : bad("미완성 기간인데 확정 버튼이 열려 있다");
await rangeButtons.nth(13).click();
await page.waitForTimeout(300);

// 기간·다중은 **확정 버튼을 눌러야** 값이 나간다 (2026-09-08 · 08 DP2).
// 시작만 고른 중간 상태가 값으로 새어 나가던 것을 막은 변경이라, 검사도 새 흐름을 밟는다.
(await confirmButton().isDisabled())
  ? bad("기간을 둘 다 골랐는데 확정 버튼이 잠겨 있다")
  : ok("기간을 둘 다 고르면 확정 버튼이 풀린다");
const beforeConfirm = await readFormState(rangeForm);
beforeConfirm.stay === null
  ? ok("확정 전에는 값이 폼에 들어가지 않는다")
  : bad(`확정 전인데 값이 나갔다: ${JSON.stringify(beforeConfirm.stay)}`);
await confirmButton().click();
await page.waitForTimeout(500);
const rangeState = await readFormState(rangeForm);
rangeState.isValid && rangeState.stay?.from && rangeState.stay?.to
  ? ok("확정하면 from · to 가 폼에 들어가 isValid true")
  : bad(
      `isValid=${rangeState.isValid} / stay=${JSON.stringify(rangeState.stay)}`,
    );
await rangeForm.locator("button", { hasText: "초기화" }).click();
await page.waitForTimeout(400);
(await rangeForm.locator(".nui-datepicker input").inputValue()) === ""
  ? ok("reset 이 입력창에 반영된다")
  : bad("reset 후에도 값이 남아 있다");

// ── 입력창 Enter 는 확정 버튼과 같은 일을 한다 (2026-09-09 · spec §6-3)
//
// 예전에는 그냥 닫았고 달력으로 고른 임시 선택이 조용히 버려졌다 — 「친 값은 이미
// 반영돼 있다」는 전제가 **타이핑에만** 성립했기 때문이다. 확정할 수 없으면 닫지도 않는다.
const rangeInput = rangeForm.locator(".nui-datepicker input");
await rangeInput.click();
await page.waitForSelector(".nui-daypicker");
const enterButtons = rangeForm.locator(
  ".nui-daypicker__day-button:not([disabled])",
);
await enterButtons.nth(9).click(); // 시작일만 — 확정 불가
await page.waitForTimeout(250);
await rangeInput.press("Enter");
await page.waitForTimeout(300);
(await openCalendars()) > 0
  ? ok("확정할 수 없을 때 Enter 는 달력을 닫지 않는다")
  : bad("미완성 기간인데 Enter 가 달력을 닫았다 — 임시 선택이 버려진다");
const afterDeadEnter = await readFormState(rangeForm);
afterDeadEnter.stay === null
  ? ok("확정할 수 없을 때 Enter 는 값도 내보내지 않는다")
  : bad(`Enter 로 미완성 값이 나갔다: ${JSON.stringify(afterDeadEnter.stay)}`);

await enterButtons.nth(13).click(); // 종료일 — 확정 가능
await page.waitForTimeout(250);
await rangeInput.press("Enter");
await page.waitForTimeout(500);
(await openCalendars()) === 0
  ? ok("확정할 수 있을 때 Enter 가 달력을 닫는다")
  : bad("확정 가능한데 Enter 가 닫지 않았다");
const afterEnter = await readFormState(rangeForm);
afterEnter.stay?.from && afterEnter.stay?.to
  ? ok("Enter 가 확정한다 — from · to 가 폼에 들어간다")
  : bad(
      `Enter 로 확정되지 않았다: ${JSON.stringify(afterEnter.stay)} — 임시 선택이 버려졌다`,
    );
await rangeForm.locator("button", { hasText: "초기화" }).click();
await page.waitForTimeout(400);

// ── DateMultiplePicker ──────────────────────────────────────────────────
console.log("\n■ DateMultiplePicker");
await page.goto(PAGES.multiple, { waitUntil: "networkidle" });
const multiForm = page.locator("form");
await multiForm.locator(".nui-datepicker input").click();
await page.waitForSelector(".nui-daypicker");
const multiButtons = multiForm.locator(
  ".nui-daypicker__day-button:not([disabled])",
);
await multiButtons.nth(5).click();
await page.waitForTimeout(250);
(await openCalendars()) > 0
  ? ok("다중 선택은 골라도 닫히지 않는다")
  : bad("다중 선택 모드인데 첫 선택에 닫혔다");
await multiButtons.nth(9).click();
await page.waitForTimeout(250);
// ⚠️ 타이핑이 막힌 모드에서 Enter 는 **여는 키**다. 확정 판단이 그보다 앞에 있어야
//    열린 달력에서 재-열기가 아니라 확정이 된다 (2026-09-09 · spec §6-3).
//    순서가 뒤집히면 **이 모드가 먼저 깨진다** — Range 케이스로는 안 잡힌다.
await multiForm.locator(".nui-datepicker input").press("Enter");
await page.waitForTimeout(500);
(await openCalendars()) === 0
  ? ok("타이핑이 막힌 모드에서도 Enter 가 확정한다 (재-열기가 아니다)")
  : bad("Multiple 에서 Enter 가 달력을 닫지 않았다 — 확정보다 여는 키가 이겼다");
const multiEnter = await readFormState(multiForm);
multiEnter.extraDates?.length === 2
  ? ok(`Enter 로 확정한 값이 폼에 들어간다 (${multiEnter.extraDates.length}개)`)
  : bad(`Enter 확정이 안 됐다: ${JSON.stringify(multiEnter.extraDates)}`);
await multiForm.locator(".nui-datepicker input").click();
await page.waitForSelector(".nui-daypicker");

// ⚠️ Escape 로 닫으면 임시 선택이 **버려진다** — 확정을 눌러야 값이 나간다.
await confirmButton().click();
await page.waitForTimeout(500);
const multiState = await readFormState(multiForm);
multiState.extraDates?.length === 2
  ? ok("RHFDateMultiplePicker 가 여러 날짜를 누적한다")
  : bad(`다중 값이 ${JSON.stringify(multiState.extraDates)}`);
multiState.isValid
  ? ok("확정하면 isValid true")
  : bad(`isValid=${multiState.isValid}`);
await multiForm.locator("button", { hasText: "초기화" }).click();
await page.waitForTimeout(400);
(await multiForm.locator(".nui-datepicker input").inputValue()) === ""
  ? ok("reset 이 입력창에 반영된다")
  : bad("reset 후에도 값이 남아 있다");

console.log("");
consoleMessages.length === 0
  ? ok("콘솔 에러·경고 0건")
  : bad(`콘솔 출력: ${consoleMessages.slice(0, 3).join(" | ")}`);

await browser.close();

if (failures.length > 0) {
  console.error(`\n❌ Datepicker 검사 실패 — ${failures.length}건`);
  process.exit(1);
}
console.log(
  "\n✅ Datepicker 검사 통과 — 개폐·포커스·팝업 클리핑·확정 흐름·RHF 회귀 없음",
);
