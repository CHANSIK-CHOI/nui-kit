#!/usr/bin/env node
/**
 * `styles/themes/` 가 「문서에 보이는 색 = 패키지에 든 색」을 지키는지 검사한다.
 *
 * 1) 수 — presets.json 의 항목마다 파일이 하나씩, 남는 파일도 없어야 한다
 * 2) 값 — 파일의 라이트 9번 · 다크 9번 · 글자색이 지금 생성기로 다시 만든 값과 같다.
 *    문서 사이트도 같은 `generate()` 로 미리보기를 만들므로 이것이 곧 문서와의 일치다
 * 3) 구조 — 셀렉터는 `:root` 계열 셋뿐, 선언은 전부 `--nui-color-*`, `@layer` 는 **없다**
 *    (레이어 밖이어야 우리 기본값을 덮는다). 격리 검사(`check-css-isolation.mjs`)는
 *    최상위 파일만 보므로 여기서 따로 본다
 *
 * 절마다 검사한 수를 찍는다. 0 이면 실패다 — 「검사한 것만 통과」를 막는다.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generate, themeFileName } from "./generate.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const DIR = join(ROOT, "styles", "themes");

if (!existsSync(DIR)) {
  console.error(
    "❌ styles/themes/ 가 없다. 먼저 `npm run build:themes` 를 실행할 것.",
  );
  process.exit(1);
}

const { presets } = JSON.parse(
  readFileSync(join(ROOT, "presets.json"), "utf8"),
);
const files = readdirSync(DIR).filter((f) => f.endsWith(".css"));
const problems = [];

// 1) 수
const expected = new Set(presets.map((p) => themeFileName(p.n)));
for (const f of files) if (!expected.has(f)) problems.push(`남는 파일 ${f}`);
for (const f of expected)
  if (!files.includes(f)) problems.push(`없는 파일 ${f}`);
console.log(`  수     ${files.length} 파일 / 프리셋 ${presets.length}`);

// 2) 값 · 3) 구조
const ALLOWED_SELECTORS = new Set([
  ":root",
  "@media (prefers-color-scheme: dark)",
  ':root:not([data-theme="light"])',
  ':root[data-theme="dark"]',
]);
let checkedValues = 0;
let checkedDecls = 0;
let checkedSelectors = 0;
for (const p of presets) {
  const file = themeFileName(p.n);
  const path = join(DIR, file);
  if (!existsSync(path)) continue;
  const css = readFileSync(path, "utf8");

  // 값 — 라이트 블록은 첫 `:root{`, 다크 블록은 `[data-theme="dark"]{` 뒤
  const r = generate(p.hex);
  const light = css.match(/\n:root\{([^}]*)\}/)?.[1] ?? "";
  const dark = css.match(/:root\[data-theme="dark"\]\{([^}]*)\}/)?.[1] ?? "";
  const pick = (block, name) =>
    block.match(new RegExp(`--nui-color-${name}:\\s*([^;]+);`))?.[1]?.trim();
  const pairs = [
    ["light brand-9", pick(light, "brand-9"), r.light.brand[9]],
    ["light brand-contrast", pick(light, "brand-contrast"), r.light.contrast],
    ["light gray-12", pick(light, "gray-12"), r.light.gray[12]],
    ["dark brand-9", pick(dark, "brand-9"), r.dark.brand[9]],
    ["dark secondary-9", pick(dark, "secondary-9"), r.dark.secondary[9]],
  ];
  for (const [label, got, want] of pairs) {
    checkedValues++;
    if (got !== want)
      problems.push(`${file}: ${label} ${got} ≠ 생성기 ${want}`);
  }

  // 구조
  if (css.includes("@layer"))
    problems.push(`${file}: @layer 가 있다 — 레이어 밖이어야 기본값을 덮는다`);
  // `{` 앞의 글자가 셀렉터다. 정규식으로는 `}` 와 `;` 경계를 못 가르므로 한 글자씩 본다
  let buf = "";
  for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (ch === "{") {
      const sel = buf.trim();
      checkedSelectors++;
      if (!ALLOWED_SELECTORS.has(sel))
        problems.push(`${file}: 허용되지 않은 셀렉터 '${sel}'`);
      buf = "";
    } else if (ch === "}" || ch === ";") buf = "";
    else buf += ch;
  }
  for (const m of css.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)) {
    checkedDecls++;
    if (!m[1].startsWith("--nui-color-"))
      problems.push(`${file}: 색 primitive 가 아닌 선언 ${m[1]}`);
  }
  if (!css.startsWith("/* @nui-kit/react@"))
    problems.push(`${file}: 머리 주석에 패키지 버전이 없다`);
}
console.log(`  값     ${checkedValues} 항목 대조`);
console.log(`  구조   ${checkedSelectors} 셀렉터 · ${checkedDecls} 선언 검사`);

if (
  files.length === 0 ||
  checkedValues === 0 ||
  checkedDecls === 0 ||
  checkedSelectors === 0
) {
  problems.push("검사한 수가 0 인 절이 있다 — 정규식이나 경로가 늙었다");
}

if (problems.length > 0) {
  console.error(`❌ 프리셋 테마 검사 실패 (${problems.length}건)`);
  for (const p of problems.slice(0, 30)) console.error("  - " + p);
  if (problems.length > 30) console.error(`  … ${problems.length - 30}건 더`);
  process.exit(1);
}
console.log(
  `✅ 프리셋 테마 검사 통과 (${files.length}개 · 문서와 같은 생성기 값)`,
);
