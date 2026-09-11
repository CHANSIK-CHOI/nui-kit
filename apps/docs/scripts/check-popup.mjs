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
// 영수증 — 어느 길로 끝나든 마지막 줄. dev server 가 없어 위에서 죽으면 이 줄이 없다 = 미실시 (2026-09-11)
process.on("exit", (code) =>
  console.log(`RECEIPT check-popup failures=${failures.length} exit=${code}`),
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

console.log("");
consoleMessages.length === 0
  ? ok("콘솔 에러·경고 0건")
  : bad(`콘솔 출력: ${consoleMessages.slice(0, 3).join(" | ")}`);

await browser.close();

if (failures.length > 0) {
  console.error(`\n❌ Popup 검사 실패 — ${failures.length}건`);
  process.exit(1);
}
console.log("\n✅ Popup 검사 통과 — dim · Esc · 쌓임");
