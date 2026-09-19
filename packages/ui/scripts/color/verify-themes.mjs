#!/usr/bin/env node
/**
 * `styles/themes/` 가 「문서에 보이는 색 = 패키지에 든 색」을 지키는지 검사한다.
 *
 * 무엇을 못 보고 있어서 — 격리 검사(`check-css-isolation.mjs`)는 `styles/` 최상위만 읽어
 * `themes/` 185파일이 검사 밖이었다. 그 파일들은 의도적으로 레이어 밖이라 격리 검사의
 * 「@layer 필수」와 반대 규칙이 필요하다.
 *
 * 1) 수   — presets.json 의 항목마다 파일이 하나씩, 남는 파일도 없어야 한다
 * 2) 값   — 파일의 라이트 9번 · 다크 9번 · 글자색이 지금 생성기로 다시 만든 값과 같다.
 *           문서 사이트도 같은 `generate()` 로 미리보기를 만드므로 이것이 곧 문서와의 일치다
 * 3) 구조 — 셀렉터는 넷뿐, 선언은 전부 `--nui-color-*`, `@layer` 는 **없다**(레이어 밖이어야
 *           우리 기본값을 덮는다), 머리 주석에 패키지 버전
 *
 * 절마다 검사한 수를 찍고 0 이면 실패다. 마지막 줄은 RECEIPT (rules/scripts.md §1 · §2).
 * `--self-test` 는 합성 사례 다섯으로 검출력을 본다 (§4).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generate, themeFileName } from "./generate.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const DIR = join(ROOT, "styles", "themes");

const SELF_TEST = process.argv.includes("--self-test");
const receipt = { files: 0, values: 0, selectors: 0, decls: 0, problems: 0 };
// 자기 시험은 자기 영수증을 찍는다 — 본 검사의 영수증이 겹쳐 찍히면 어느 쪽 수인지 모른다
if (!SELF_TEST)
  process.on("exit", (code) =>
    console.log(
      `RECEIPT verify-themes files=${receipt.files} values=${receipt.values} selectors=${receipt.selectors} decls=${receipt.decls} problems=${receipt.problems} exit=${code}`,
    ),
  );

const ALLOWED_SELECTORS = new Set([
  ":root",
  "@media (prefers-color-scheme: dark)",
  ':root:not([data-theme="light"])',
  ':root[data-theme="dark"]',
]);

/**
 * 구조 검사 — CSS 문자열 하나. 주석은 걷어내고 본다(`@layer` 낱말이 주석에 있어도 셀렉터가 아니다).
 * @returns {{ problems: string[], selectors: number, decls: number }}
 */
export function checkStructure(file, css) {
  const problems = [];
  let selectors = 0;
  let decls = 0;
  const body = css.replace(/\/\*[\s\S]*?\*\//g, "");

  if (body.includes("@layer"))
    problems.push(`${file}: @layer 가 있다 — 레이어 밖이어야 기본값을 덮는다`);

  // `{` 앞의 글자가 셀렉터다. 정규식으로는 `}` 와 `;` 경계를 못 가르므로 한 글자씩 본다
  let buf = "";
  for (const ch of body) {
    if (ch === "{") {
      const sel = buf.trim();
      selectors++;
      if (!ALLOWED_SELECTORS.has(sel))
        problems.push(`${file}: 허용되지 않은 셀렉터 '${sel}'`);
      buf = "";
    } else if (ch === "}" || ch === ";") buf = "";
    else buf += ch;
  }
  for (const m of body.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)) {
    decls++;
    if (!m[1].startsWith("--nui-color-"))
      problems.push(`${file}: 색 primitive 가 아닌 선언 ${m[1]}`);
  }
  if (!css.startsWith("/* @nui-kit/react@"))
    problems.push(`${file}: 머리 주석에 패키지 버전이 없다`);
  return { problems, selectors, decls };
}

/** 값 검사 — 파일 안의 다섯 값이 지금 생성기와 같은가. */
export function checkValues(file, css, hex) {
  const problems = [];
  const r = generate(hex);
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
    if (got !== want)
      problems.push(`${file}: ${label} ${got} ≠ 생성기 ${want}`);
  }
  return { problems, values: pairs.length };
}

/** 검출력 시험 — 합성 사례 다섯 (rules/scripts.md §4). */
function selfTest() {
  const HEAD = "/* @nui-kit/react@0.0.0 — 시험 */\n";
  const ok = `${HEAD}:root{--nui-color-brand-1: #fff;}\n@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--nui-color-brand-1: #000;}}\n:root[data-theme="dark"]{--nui-color-brand-1: #000;}\n`;
  const cases = [
    [
      "위반 1 · @layer 안",
      `${HEAD}@layer nui.tokens{:root{--nui-color-brand-1: #fff;}}`,
      2,
    ],
    [
      "위반 2 · 클래스 셀렉터 · 색 아닌 선언",
      `${HEAD}:root{--nui-color-brand-1: #fff;}.foo{--nui-space-1: 4px;}`,
      2,
    ],
    ["통과 1 · 최소 파일", ok, 0],
    [
      "통과 2 · 실제 preset-42",
      existsSync(join(DIR, themeFileName(42)))
        ? readFileSync(join(DIR, themeFileName(42)), "utf8")
        : ok,
      0,
    ],
    [
      "함정 · 주석 안의 @layer 와 .foo",
      `/* @nui-kit/react@0.0.0 — @layer 도 .foo 도 주석이다 */\n:root{--nui-color-brand-1: #fff;}`,
      0,
    ],
  ];
  let passed = 0;
  for (const [name, css, wantProblems] of cases) {
    const got = checkStructure("t.css", css);
    const pass = got.problems.length === wantProblems;
    if (pass) passed++;
    console.log(
      `  ${pass ? "✅" : "❌"} ${name} — problems ${got.problems.length}/${wantProblems}`,
    );
    if (!pass) for (const p of got.problems) console.log(`      ${p}`);
  }
  console.log(
    `RECEIPT verify-themes-self-test cases=${cases.length} passed=${passed} exit=${passed === cases.length ? 0 : 1}`,
  );
  process.exit(passed === cases.length ? 0 : 1);
}

if (SELF_TEST) selfTest();

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
receipt.files = files.length;
console.log(`  수     ${files.length} 파일 / 프리셋 ${presets.length}`);

// 2) 값 · 3) 구조
for (const p of presets) {
  const file = themeFileName(p.n);
  const path = join(DIR, file);
  if (!existsSync(path)) continue;
  const css = readFileSync(path, "utf8");
  const v = checkValues(file, css, p.hex);
  receipt.values += v.values;
  problems.push(...v.problems);
  const s = checkStructure(file, css);
  receipt.selectors += s.selectors;
  receipt.decls += s.decls;
  problems.push(...s.problems);
}
console.log(`  값     ${receipt.values} 항목 대조`);
console.log(
  `  구조   ${receipt.selectors} 셀렉터 · ${receipt.decls} 선언 검사`,
);

if (
  files.length === 0 ||
  receipt.values === 0 ||
  receipt.decls === 0 ||
  receipt.selectors === 0
) {
  problems.push("검사한 수가 0 인 절이 있다 — 정규식이나 경로가 늙었다");
}
receipt.problems = problems.length;

if (problems.length > 0) {
  console.error(`❌ 프리셋 테마 검사 실패 (${problems.length}건)`);
  for (const p of problems.slice(0, 30)) console.error("  - " + p);
  if (problems.length > 30) console.error(`  … ${problems.length - 30}건 더`);
  process.exit(1);
}
console.log(
  `✅ 프리셋 테마 검사 통과 (${files.length}개 · 문서와 같은 생성기 값)`,
);
