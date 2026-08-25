#!/usr/bin/env node
/**
 * 문서 사이트의 모든 페이지를 실제로 렌더해 **콘솔 에러/경고가 없는지** 검사한다.
 *
 * 왜 필요한가: 이 프로젝트에서 실제로 있었던 일이다.
 *   `<Checkbox checked readOnly />` 는 타입 검사·빌드·CSS 격리 검사를 전부 통과했지만,
 *   readOnly 를 DOM 에 전달하지 않아 React 가 controlled 경고를 냈다.
 *   정적 검사로는 못 잡고 브라우저에서만 드러난다.
 *
 * 사용: dev server 기동 후  node scripts/check-console.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DOCS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.argv[2] ?? "http://localhost:3000";

/** nav.ts 에서 라우트를 뽑는다 — 페이지를 추가하면 자동으로 검사 대상이 된다 */
const navSource = readFileSync(join(DOCS_ROOT, "src/site/nav.ts"), "utf8");
const routes = [...navSource.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1]);

/** 개발 환경에서만 나오고 실사용과 무관한 잡음 */
const IGNORE = ["Download the React DevTools", "[Fast Refresh]", "webpack-hmr"];

try {
  await fetch(BASE, { signal: AbortSignal.timeout(3000) });
} catch {
  console.error(
    `❌ ${BASE} 에 접속할 수 없다. 먼저 \`npm run dev\` 로 서버를 띄울 것.`,
  );
  process.exit(1);
}

const browser = await chromium.launch();
const failures = [];

for (const route of routes) {
  const page = await browser.newPage();
  const problems = [];

  page.on("console", (msg) => {
    if (msg.type() !== "error" && msg.type() !== "warning") return;
    const text = msg.text();
    if (IGNORE.some((pattern) => text.includes(pattern))) return;
    problems.push(`[${msg.type()}] ${text}`);
  });
  page.on("pageerror", (error) =>
    problems.push(`[pageerror] ${error.message}`),
  );

  try {
    await page.goto(BASE + route, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });
    await page.waitForTimeout(600);
  } catch (error) {
    problems.push(`[navigation] ${error.message}`);
  }

  const unique = [...new Set(problems)];
  if (unique.length > 0) failures.push({ route, problems: unique });
  console.log(`${unique.length === 0 ? "✅" : "❌"} ${route}`);

  await page.close();
}

await browser.close();

if (failures.length > 0) {
  console.error(`\n❌ 콘솔 검사 실패 — ${failures.length}개 페이지\n`);
  for (const failure of failures) {
    console.error(`  ${failure.route}`);
    for (const problem of failure.problems) {
      console.error(`    · ${problem.slice(0, 300)}`);
    }
  }
  process.exit(1);
}

console.log(`\n✅ 콘솔 검사 통과 — ${routes.length}개 페이지, 에러·경고 0건`);
