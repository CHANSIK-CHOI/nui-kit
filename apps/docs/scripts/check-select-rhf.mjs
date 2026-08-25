#!/usr/bin/env node
/**
 * RHF 연동 Select 의 **remount 회귀**를 검사한다.
 *
 * 왜 별도 스크립트인가 — 이 결함은 정적 검사도 `verify:console` 도 잡지 못한다.
 *   `ValueContainer` 래퍼를 만드는 useMemo 의 deps 에 aria 값이 섞이면, 값이 바뀔
 *   때마다 컴포넌트 함수 identity 가 바뀌어 react-select 이 input 을 remount 한다.
 *   포커스와 입력 중이던 검색어가 날아가는데, **에러가 토글되는 순간에만** 일어나
 *   일반적인 "입력 중 포커스 유지" 테스트로는 재현되지 않는다.
 *   (RHF `mode: "onChange"` / `Field.Message` 등록·해제가 실제 트리거다.)
 *
 * 검사 방식: input DOM 노드에 표식(dataset)을 남기고, 에러를 껐다 켠 뒤에도
 *   같은 노드인지 본다. remount 되면 표식이 사라진다.
 *
 * 사용: dev server 기동 후  node scripts/check-select-rhf.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const URL = `${BASE}/components/select`;

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
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type())) {
    consoleMessages.push(`${m.type()}: ${m.text()}`);
  }
});
page.on("dialog", (d) => d.accept());
await page.goto(URL, { waitUntil: "networkidle" });

const form = page.locator("form");
const select = form.locator(".nui-select").nth(0);
const multi = form.locator(".nui-select").nth(1);
const combobox = (root) => root.locator('input[role="combobox"]');
const formState = async () =>
  JSON.parse(await form.locator("pre code").textContent());

// ── 에러를 발생시키고 input 에 표식을 남긴다
await form.locator("button[type=submit]").click();
await page.waitForTimeout(300);
await combobox(select).evaluate((el) => {
  el.dataset.nuiProbe = "keep-me";
});
const probe = () =>
  combobox(select).evaluate((el) => el.dataset.nuiProbe ?? "(remount 됨)");

// ── 값 선택 → 에러 해제 (aria-describedby 가 변한다)
await select.locator(".nui-select__control").click();
await page.waitForSelector(".nui-select__option");
await page.locator(".nui-select__option", { hasText: "부산" }).first().click();
await page.waitForTimeout(300);
const cleared = await formState();
cleared.errors.city
  ? bad("값을 선택했는데 에러가 해제되지 않았다")
  : ok("값 선택으로 에러 해제 (aria-describedby 변화 발생)");
(await probe()) === "keep-me"
  ? ok("에러 해제 후에도 동일 input 노드 — remount 없음")
  : bad("에러 해제 시 input 이 remount 됐다 (포커스·검색어 소실)");

// ── 값 해제 → 에러 재발생
await select.locator(".nui-select__clear-indicator").click();
await page.waitForTimeout(300);
const errored = await formState();
errored.errors.city
  ? ok("값 해제로 에러 재발생")
  : bad("값을 지웠는데 에러가 생기지 않았다");
(await probe()) === "keep-me"
  ? ok("에러 재발생 후에도 동일 input 노드 — remount 없음")
  : bad("에러 재발생 시 input 이 remount 됐다");

// ── 에러 상태에서 검색 입력
await select.locator(".nui-select__control").click();
await combobox(select).type("대", { delay: 80 });
await page.waitForTimeout(200);
await combobox(select).type("구", { delay: 80 });
await page.waitForTimeout(200);
const typed = await combobox(select).inputValue();
const activeRole = await page.evaluate(() =>
  document.activeElement?.getAttribute("role"),
);
typed === "대구"
  ? ok("에러 상태에서도 연속 입력이 유지된다")
  : bad(`검색어가 "${typed}" 로 잘렸다 (기대 "대구")`);
activeRole === "combobox" ? ok("포커스 유지") : bad(`포커스가 ${activeRole}`);
await page.keyboard.press("Enter");
await page.waitForTimeout(300);

// ── MultiSelect 값 순서 보존
await multi.locator(".nui-select__control").click();
await page.waitForSelector(".nui-select__option");
await page.locator(".nui-select__option", { hasText: "서울" }).first().click();
await page.waitForTimeout(200);
await multi.locator(".nui-select__control").click();
await page.locator(".nui-select__option", { hasText: "광주" }).first().click();
await page.waitForTimeout(200);
const picked = await formState();
JSON.stringify(picked.values.interests) === JSON.stringify(["seoul", "gwangju"])
  ? ok("MultiSelect 가 선택 순서를 보존한다")
  : bad(`값 순서가 ${JSON.stringify(picked.values.interests)}`);
const chips = await multi.locator(".nui-select__multi-value__label").allTextContents();
JSON.stringify(chips) === JSON.stringify(["서울", "광주"])
  ? ok("칩 렌더 순서도 value 배열과 일치")
  : bad(`칩 순서가 ${JSON.stringify(chips)}`);

// ── reset 반영
await form.locator("button", { hasText: "초기화" }).click();
await page.waitForTimeout(300);
const afterReset = await formState();
afterReset.values.city === null && afterReset.values.interests.length === 0
  ? ok("reset 이 컨트롤에 반영된다")
  : bad(`reset 후 값이 ${JSON.stringify(afterReset.values)}`);

consoleMessages.length === 0
  ? ok("콘솔 에러·경고 0건")
  : bad(`콘솔 출력: ${consoleMessages.join(" | ")}`);

await browser.close();

if (failures.length > 0) {
  console.error(`\n❌ RHF Select 검사 실패 — ${failures.length}건`);
  process.exit(1);
}
console.log("\n✅ RHF Select 검사 통과 — remount 회귀 없음");
