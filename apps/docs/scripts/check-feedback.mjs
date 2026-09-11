#!/usr/bin/env node
/**
 * Toast · Tooltip 의 **브라우저에서만 드러나는 회귀**를 검사한다.
 *
 *   1. Toast 의 `onOpenComplete` 는 열릴 때 한 번만 불린다. 닫힘 모션 끝에 한 번 더
 *      불리던 적이 있다 (2026-09-09) — AnimatePresence 가 얼려 둔 콜백이 통과했다.
 *   2. Toast 는 한 번에 하나만 보이고 error 는 role="alert" 다.
 *   3. Tooltip 은 하나가 열린 뒤 이웃에 닿으면 지연 없이 뜬다. 앞의 것이 완전히 닫힌
 *      뒤부터만 세어 툴바 쓸기에서 484ms 가 걸리던 적이 있다 (2026-09-09).
 *
 * 사용: dev server 기동 후  node scripts/check-feedback.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? `http://localhost:${process.env.PORT ?? 3000}`;

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
  console.log(
    `RECEIPT check-feedback failures=${failures.length} exit=${code}`,
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
const wait = (ms) => page.waitForTimeout(ms);
const panelShown = (text) =>
  page.waitForFunction(
    (t) =>
      [...document.querySelectorAll(".nui-tooltip__panel")].some(
        (p) =>
          p.textContent?.trim() === t &&
          getComputedStyle(p).visibility !== "hidden" &&
          getComputedStyle(p).opacity !== "0",
      ),
    text,
    { timeout: 3000 },
  );

console.log("\n■ Toast");
await page.goto(`${BASE}/components/toast`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "토스트 열기" }).click();
await wait(3400);
const order = await page
  .locator(".doc-example code", { hasText: "→" })
  .first()
  .textContent()
  .catch(() => "");
order === "onOpenComplete → onRequestClose → onCloseComplete"
  ? ok("onOpenComplete 는 열릴 때 한 번만 불린다")
  : bad(`콜백 순서가 「${order}」`);

await page.getByRole("button", { name: "셋 한 번에 열기" }).click();
await wait(400);
const visible = await page.locator(".nui-toast").count();
visible === 1
  ? ok("셋을 열어도 한 번에 하나만 보인다")
  : bad(`동시에 ${visible}개가 보인다`);
await page.getByRole("button", { name: "전부 닫기" }).click();
await wait(600);
await page.getByRole("button", { name: "에러 토스트" }).click();
await wait(400);
const role = await page.locator(".nui-toast").first().getAttribute("role");
role === "alert"
  ? ok("error 는 role=alert 로 즉시 읽힌다")
  : bad(`error 의 role 이 ${role}`);
await page.getByRole("button", { name: "토스트 닫기" }).click();
await wait(600);

console.log("\n■ Tooltip");
await page.goto(`${BASE}/components/tooltip`, { waitUntil: "networkidle" });
await page.mouse.move(5, 5);
await wait(500);
await page.getByRole("button", { name: "검색" }).hover();
await panelShown("검색");
const started = Date.now();
await page.getByRole("button", { name: "달력" }).hover();
await panelShown("달력");
const neighborMs = Date.now() - started;
neighborMs < 200
  ? ok(`이웃 툴팁이 지연 없이 뜬다 (${neighborMs}ms)`)
  : bad(`이웃 툴팁이 ${neighborMs}ms 걸렸다 — 400ms 지연을 다시 기다린다`);
await page.keyboard.press("Escape");
await wait(300);
const afterEsc = await page.evaluate(
  () =>
    [...document.querySelectorAll(".nui-tooltip__panel")].filter(
      (p) =>
        p.textContent?.trim() === "달력" &&
        getComputedStyle(p).visibility !== "hidden",
    ).length,
);
afterEsc === 0 ? ok("Esc 로 닫힌다") : bad("Esc 를 눌러도 남아 있다");

console.log("");
consoleMessages.length === 0
  ? ok("콘솔 에러·경고 0건")
  : bad(`콘솔 출력: ${consoleMessages.slice(0, 3).join(" | ")}`);

await browser.close();

if (failures.length > 0) {
  console.error(`\n❌ Feedback 검사 실패 — ${failures.length}건`);
  process.exit(1);
}
console.log("\n✅ Feedback 검사 통과 — 토스트 콜백·큐·role · 툴팁 이웃·Esc");
