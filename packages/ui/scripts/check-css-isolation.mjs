#!/usr/bin/env node
/**
 * 빌드된 CSS 가 "소비자 프로젝트를 오염시키지 않는다"는 이 라이브러리의 1원칙을
 * 실제로 지키고 있는지 검사한다.
 *
 * 사람이 눈으로 보고 놓치는 종류의 실수(프리픽스 누락, 전역 셀렉터 유입)를
 * 기계가 잡는다. 규칙 문서로 적어두는 대신 여기서 강제한다.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PREFIX = "nui";
// ⚠️ import.meta.url 을 직접 pathname 으로 쓰면 한글 경로가 percent-encoding 되어 깨진다.
const STYLES_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "styles",
);
/** 전역 태그 셀렉터가 허용되는 유일한 파일 (opt-in reset) */
const GLOBAL_SELECTOR_ALLOWLIST = new Set(["preflight.css"]);
/** 변수 선언만 담아야 하는 파일 */
const DECLARATION_ONLY = new Set(["tokens.css"]);

const TAG_SELECTORS =
  "html|body|a|p|ul|ol|li|dl|dt|dd|table|tr|td|th|form|fieldset|legend|" +
  "input|button|select|textarea|label|img|svg|h1|h2|h3|h4|h5|h6|main|" +
  "header|footer|section|article|aside|nav|span|div";

const problems = [];

function check(file, css) {
  // 1) 클래스 셀렉터는 전부 프리픽스가 붙어야 한다.
  //    ('.' 앞이 영숫자인 경우는 `@layer nui.tokens` 같은 레이어 이름이므로 제외)
  const classes = new Set();
  for (const m of css.matchAll(
    /(^|[^A-Za-z0-9_-])(\.[a-zA-Z_][a-zA-Z0-9_-]*)/g,
  )) {
    classes.add(m[2]);
  }
  for (const cls of classes) {
    if (!cls.startsWith(`.${PREFIX}-`)) {
      problems.push(`${file}: 프리픽스 없는 클래스 셀렉터 ${cls}`);
    }
  }

  // 2) CSS 변수(선언·참조)는 전부 프리픽스가 붙어야 한다.
  const vars = new Set();
  for (const m of css.matchAll(/[{;]\s*(--[a-zA-Z0-9_-]+)\s*:/g))
    vars.add(m[1]);
  for (const m of css.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)/g)) vars.add(m[1]);
  for (const name of vars) {
    if (!name.startsWith(`--${PREFIX}-`)) {
      problems.push(`${file}: 프리픽스 없는 CSS 변수 ${name}`);
    }
  }

  // 3) 전역 태그 셀렉터는 preflight.css 에만 존재해야 한다.
  if (!GLOBAL_SELECTOR_ALLOWLIST.has(file)) {
    const globalRe = new RegExp(
      `(^|[{}])\\s*(\\*|${TAG_SELECTORS})\\s*[,{]`,
      "g",
    );
    for (const m of css.matchAll(globalRe)) {
      problems.push(
        `${file}: 전역 태그 셀렉터 '${m[2]}' — 소비자 프로젝트를 오염시킨다`,
      );
    }
  }

  // 4) 모든 CSS 는 @layer 안에 있어야 한다 (소비자 CSS 가 항상 우선하도록).
  if (!css.includes(`@layer ${PREFIX}`)) {
    problems.push(`${file}: @layer ${PREFIX}.* 선언 없음`);
  }

  // 5) @keyframes 이름은 전역이다 — @layer 로 격리되지 않으므로 프리픽스가 붙어야 한다.
  //    소비자의 `spin` 과 이름이 같으면 나중에 선언된 쪽이 양쪽 애니메이션을 바꾼다.
  for (const m of css.matchAll(
    /@(?:-webkit-)?keyframes\s+([a-zA-Z_][a-zA-Z0-9_-]*)/g,
  )) {
    if (!m[1].startsWith(`${PREFIX}-`)) {
      problems.push(`${file}: 프리픽스 없는 @keyframes ${m[1]}`);
    }
  }

  // 6) tokens.css 는 값 선언만 — 어떤 셀렉터에도 스타일을 적용하지 않아야 한다.
  if (DECLARATION_ONLY.has(file) && classes.size > 0) {
    problems.push(
      `${file}: 변수 전용 파일인데 클래스 셀렉터가 있다 (${[...classes].join(", ")})`,
    );
  }
}

if (!existsSync(STYLES_DIR)) {
  console.error(
    "❌ styles/ 가 없다. 먼저 `npm run build:styles` 를 실행할 것.",
  );
  process.exit(1);
}

const files = readdirSync(STYLES_DIR).filter((f) => f.endsWith(".css"));
if (files.length === 0) {
  console.error("❌ styles/ 에 CSS 가 없다.");
  process.exit(1);
}

for (const file of files) {
  check(file, readFileSync(join(STYLES_DIR, file), "utf8"));
}

if (problems.length > 0) {
  console.error("❌ CSS 격리 검사 실패\n");
  for (const p of problems) console.error("  - " + p);
  console.error(
    `\n총 ${problems.length}건. .claude/rules/styles.md 를 참조할 것.`,
  );
  process.exit(1);
}

console.log(`✅ CSS 격리 검사 통과 (${files.length}개 파일)`);
