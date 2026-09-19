#!/usr/bin/env node
/**
 * `npx nui-theme` — 소비자가 브랜드 색을 고르는 명령 하나.
 *
 *   npx nui-theme --preset 42            패키지 안의 styles/themes/preset-42.css 를 복사한다
 *   npx nui-theme --accent "#b1002a"     생성기로 계산한다 (목록에 없는 색)
 *   옵션  --out <경로>   기본 ./nui-theme.css   ·   --no-apply   layout 에 import 를 넣지 않는다
 *
 * 성공 — 파일을 만들고(있으면 덮어쓴다. 자동 생성 파일이다) 루트 layout 에 import 한 줄을
 *        넣는다. 9번이 입력과 다르면 전후 hex 를 함께 찍는다 — 실패가 아니라 정보다.
 * 실패 — `gates.mjs` 의 기준(프리셋 검사와 같은 것)을 하나라도 못 넘으면 이유와 수치를 찍고
 *        exit 1. **파일도 layout 도 손대지 않는다.** 이전에 성공한 상태가 그대로 남는다.
 *
 * 프리셋을 계산하지 않고 **복사**하는 이유 — 문서 사이트의 미리보기와 같은 빌드에서 나온
 * 파일이 패키지에 들어 있다. 여기서 다시 계산하면 이 번들의 생성기 버전이 그 파일과
 * 어긋날 수 있다. 계산은 목록에 없는 색에만 쓴다.
 *
 * tsup 이 `dist/cli.js` 로 번들한다(`tsup.cli.config.ts`). 생성기와 그 의존성이 전부
 * 안에 들어가므로 소비자 node_modules 에는 아무것도 더 깔리지 않는다.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generate, themeFileName, toCss } from "./generate.mjs";
import { checkTheme } from "./gates.mjs";
import { hexToOklch } from "./oklch.mjs";

/** 프리셋을 거른 기준과 같다 — presets.json 의 `rule`. 이 아래는 회색이라 색깔 값이 우연한 숫자다. */
const MIN_CHROMA = 0.05;

const HERE = dirname(fileURLToPath(import.meta.url));
/** 번들(dist/cli.js)에서도 소스(scripts/color/cli.mjs)에서도 패키지 루트를 찾는다. */
const PKG_ROOT = [join(HERE, ".."), join(HERE, "..", "..")].find((d) =>
  existsSync(join(d, "styles", "themes")),
);

const argv = process.argv.slice(2);
if (argv[0] === "theme") argv.shift(); // `npx @nui-kit/react theme --preset 42` 꼴도 받는다
const flag = (name) => argv.includes(`--${name}`);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};

const usage = `nui-theme — @nui-kit/react 브랜드 색 고르기

  npx nui-theme --preset <번호>        준비된 프리셋 중 하나. 문서 사이트의 번호
  npx nui-theme --accent <#hex>        목록에 없는 색. 6자리 hex

  --out <경로>    만들 파일. 기본 ./nui-theme.css (있으면 덮어쓴다)
  --no-apply      루트 layout 에 import 를 넣지 않는다

성공하면 파일을 만들고 app/layout 에 import 한 줄을 넣는다 (예: import "../nui-theme.css").
기준에 못 미치는 색이면 이유를 찍고 아무것도 바꾸지 않는다.`;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

if (flag("help") || argv.length === 0) {
  console.log(usage);
  process.exit(argv.length === 0 ? 1 : 0);
}
if (!PKG_ROOT) fail("패키지 안의 styles/themes 를 찾지 못했다. 설치가 깨졌다.");

const out = resolve(arg("out") ?? "nui-theme.css");
const presetArg = arg("preset");
const accentArg = arg("accent");
if (presetArg && accentArg) fail("--preset 과 --accent 는 하나만 준다.");

// ── 1. 검사를 전부 끝낸다. 여기서 실패하면 아무것도 쓰지 않는다 ─────────────────────
let css;
let summary;
const notes = [];

if (presetArg) {
  const n = Number(presetArg);
  const src = join(PKG_ROOT, "styles", "themes", themeFileName(n));
  if (!Number.isInteger(n) || !existsSync(src)) {
    fail(
      `프리셋 ${presetArg} 번이 없다. 번호는 문서 사이트 「브랜드 색 고르기」에서 본다.`,
    );
  }
  css = readFileSync(src, "utf8");
  summary = `프리셋 ${n}`;
} else if (accentArg) {
  const hex = (
    accentArg.startsWith("#") ? accentArg : `#${accentArg}`
  ).toLowerCase();
  if (!/^#[0-9a-f]{6}$/.test(hex)) {
    fail(`"${accentArg}" 은 6자리 hex 가 아니다. 예: --accent "#b1002a"`);
  }
  const { C } = hexToOklch(hex);
  if (C < MIN_CHROMA) {
    fail(
      `${hex} 는 회색에 가깝다 (선명함 ${C.toFixed(3)} < ${MIN_CHROMA}). ` +
        "색깔 값이 우연한 숫자라 화면 전체가 엉뚱한 색조로 물든다. 더 선명한 색을 고른다.",
    );
  }
  const result = generate(hex);
  const g = checkTheme(result);
  if (g.fails.length > 0) {
    console.error(
      `✗ ${hex} 는 브랜드 색이 될 수 없다. 프리셋과 같은 기준이다.`,
    );
    for (const f of g.fails) console.error(`   ${f.message}`);
    console.error(
      "   파일은 만들지 않았다. 이전에 만든 파일이 있으면 그대로다.",
    );
    process.exit(1);
  }
  const { version } = JSON.parse(
    readFileSync(join(PKG_ROOT, "package.json"), "utf8"),
  );
  css = toCss(result, { compact: true, version });
  summary = hex;
  for (const theme of ["light", "dark"]) {
    const t = result[theme];
    notes.push(
      `   ${theme.padEnd(5)} 채움 ${t.brand[9]} 위 글자 ${t.contrast} ${t.contrastRatio}:1` +
        ` · 보조 ${t.secondary[9]} 위 글자 ${t.secondaryContrastRatio}:1`,
    );
  }
  for (const i of g.infos) {
    notes.push(
      `   ⓘ ${i.theme.padEnd(5)} 9번이 ${i.from} 가 아니라 ${i.to} 다 — ${i.reason}. ` +
        "페이지 배경과 구분되지 않아 같은 색조의 가장 가까운 채움이 앉았다",
    );
  }
} else {
  fail(
    "--preset <번호> 또는 --accent <#hex> 가 필요하다. --help 로 사용법을 본다.",
  );
}

// ── 2. 파일 ────────────────────────────────────────────────────────────────────
const existed = existsSync(out);
writeFileSync(out, css, "utf8");
console.log(`✅ ${summary} → ${out}${existed ? " (덮어썼다)" : ""}`);
for (const line of notes) console.log(line);

// ── 3. 루트 layout 에 import ───────────────────────────────────────────────────
const INDEX_IMPORT = `import "@nui-kit/react/styles/index.css";`;
const importLine = (from) => {
  let rel = relative(dirname(from), out).split("\\").join("/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return `import "${rel}";`;
};

function findRootLayouts() {
  const found = [];
  for (const dir of ["app", join("src", "app")]) {
    for (const ext of ["tsx", "jsx", "js"]) {
      const p = resolve(dir, `layout.${ext}`);
      if (existsSync(p)) found.push(p);
    }
  }
  return found;
}

const layouts = findRootLayouts();
if (flag("no-apply")) {
  // 넣지는 않되 경로는 정확히 — layout 이 하나면 그 파일 기준의 상대 경로다
  const line =
    layouts.length === 1
      ? importLine(layouts[0])
      : `import "./${basename(out)}";`;
  console.log(
    `\n루트 layout 에서 라이브러리 CSS 뒤에 불러온다${layouts.length === 1 ? ` (${relative(process.cwd(), layouts[0])} 기준)` : ""}.\n  ${INDEX_IMPORT}\n  ${line}`,
  );
} else {
  if (layouts.length !== 1) {
    console.log(
      layouts.length === 0
        ? "\n루트 layout(app/layout.tsx · src/app/layout.tsx)을 찾지 못해 import 를 넣지 않았다. 직접 넣는다."
        : `\n루트 layout 이 ${layouts.length}개라 어느 것인지 몰라 넣지 않았다 (${layouts.map((l) => relative(process.cwd(), l)).join(", ")}). 직접 넣는다.`,
    );
    console.log(`  ${INDEX_IMPORT}\n  import "./${basename(out)}";`);
  } else {
    const layout = layouts[0];
    const line = importLine(layout);
    const src = readFileSync(layout, "utf8");
    const shown = relative(process.cwd(), layout);
    if (src.includes(line)) {
      console.log(`\n${shown} 에 import 가 이미 있다. 그대로 둔다.`);
    } else {
      let next;
      if (src.includes(INDEX_IMPORT)) {
        next = src.replace(INDEX_IMPORT, `${INDEX_IMPORT}\n${line}`);
      } else {
        // 라이브러리 CSS import 가 없으면 둘 다 마지막 import 뒤에 둔다
        const imports = [...src.matchAll(/^import[^\n]*\n/gm)];
        const at = imports.length
          ? imports[imports.length - 1].index +
            imports[imports.length - 1][0].length
          : 0;
        next = `${src.slice(0, at)}${INDEX_IMPORT}\n${line}\n${src.slice(at)}`;
      }
      writeFileSync(layout, next, "utf8");
      console.log(`\n${shown} 에 import 를 넣었다.\n  ${line}`);
    }
  }
}
