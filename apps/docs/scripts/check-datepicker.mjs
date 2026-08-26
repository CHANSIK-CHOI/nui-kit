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
 * 사용: dev server 기동 후  node scripts/check-datepicker.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const URL = `${BASE}/components/datepicker`;

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
await page.goto(URL, { waitUntil: "networkidle" });

const openCalendars = () => page.locator(".nui-daypicker").count();
const first = page.locator(".nui-datepicker").first();

// ── 1) 열기 → 날짜 선택 → 닫힘 + 포커스 복귀
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

// ── 2) 팝업이 잘리지 않고 전 날짜를 클릭할 수 있다
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

// ── 3) RHF: 검증 실패가 캘린더를 열지 않는다
const form = page.locator("form");
await form.locator("button[type=submit]").click();
await page.waitForTimeout(800);
(await openCalendars()) === 0
  ? ok("검증 실패로 포커스가 옮겨져도 캘린더가 열리지 않는다")
  : bad("검증 실패 시 캘린더가 열려 에러 메시지를 가린다");
const errorText = await form
  .locator(".nui-message__msg--error")
  .first()
  .textContent()
  .catch(() => null);
errorText ? ok("에러 메시지가 보인다") : bad("에러 메시지가 없다");

// 그 뒤 사용자가 직접 클릭하면 정상적으로 열려야 한다 (과잉 차단 방지)
await form.locator(".nui-datepicker").first().locator("input").click();
await page.waitForTimeout(400);
(await openCalendars()) > 0
  ? ok("검증 실패 후에도 클릭하면 정상적으로 열린다")
  : bad("클릭해도 열리지 않는다 — 과잉 차단");

// ── 4) RHF 3종 값 반영 + 제출
await form
  .locator(".nui-daypicker__day-button:not([disabled])")
  .nth(15)
  .click();
await page.waitForTimeout(500);
const rangeField = form.locator(".nui-datepicker").nth(1);
await rangeField.locator("input").click();
await page.waitForSelector(".nui-daypicker");
const rangeButtons = form.locator(".nui-daypicker__day-button:not([disabled])");
await rangeButtons.nth(8).click();
await page.waitForTimeout(250);
await rangeButtons.nth(13).click();
await page.waitForTimeout(600);

const multiField = form.locator(".nui-datepicker").nth(2);
await multiField.locator("input").click();
await page.waitForSelector(".nui-daypicker");
const multiButtons = form.locator(".nui-daypicker__day-button:not([disabled])");
await multiButtons.nth(5).click();
await page.waitForTimeout(250);
(await openCalendars()) > 0
  ? ok("다중 선택은 골라도 닫히지 않는다")
  : bad("다중 선택 모드인데 첫 선택에 닫혔다");
await multiButtons.nth(9).click();
await page.waitForTimeout(250);
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

const formState = JSON.parse(await form.locator("pre code").textContent());
formState.isValid
  ? ok("RHF 3종 값이 모두 반영되어 isValid true")
  : bad(`isValid=${formState.isValid} / errors=${JSON.stringify(formState.errors)}`);
formState.extraDates?.length === 2
  ? ok("RHFDateMultiplePicker 가 여러 날짜를 누적한다")
  : bad(`다중 값이 ${JSON.stringify(formState.extraDates)}`);

await form
  .locator("button[type=submit]")
  .click({ timeout: 5000 })
  .then(() => ok("제출 버튼을 클릭할 수 있다 (달력이 가리지 않는다)"))
  .catch(() => bad("제출 버튼이 가려져 클릭할 수 없다"));

// ── 5) reset
await form.locator("button", { hasText: "초기화" }).click();
await page.waitForTimeout(400);
const values = await form
  .locator(".nui-datepicker input")
  .evaluateAll((els) => els.map((el) => el.value));
values.every((v) => v === "")
  ? ok("reset 이 3종 모두에 반영된다")
  : bad(`reset 후에도 값이 남아 있다: ${JSON.stringify(values)}`);

consoleMessages.length === 0
  ? ok("콘솔 에러·경고 0건")
  : bad(`콘솔 출력: ${consoleMessages.slice(0, 3).join(" | ")}`);

await browser.close();

if (failures.length > 0) {
  console.error(`\n❌ Datepicker 검사 실패 — ${failures.length}건`);
  process.exit(1);
}
console.log("\n✅ Datepicker 검사 통과 — 개폐·포커스·팝업 클리핑·RHF 회귀 없음");
