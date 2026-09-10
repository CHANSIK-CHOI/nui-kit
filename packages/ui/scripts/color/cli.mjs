#!/usr/bin/env node
/**
 * `npx nui-theme` — 소비자가 브랜드 색을 고르는 명령 하나.
 *
 *   npx nui-theme --preset 42            패키지 안의 styles/themes/preset-42.css 를 복사한다
 *   npx nui-theme --accent "#b1002a"     생성기로 계산한다 (목록에 없는 색)
 *   옵션  --out <경로>   기본 ./nui-theme.css   ·   --force   있는 파일을 덮어쓴다
 *
 * 프리셋을 계산하지 않고 **복사**하는 이유 — 문서 사이트의 미리보기와 같은 빌드에서 나온
 * 파일이 패키지에 들어 있다. 여기서 다시 계산하면 이 번들의 생성기 버전이 그 파일과
 * 어긋날 수 있다. 계산은 목록에 없는 색에만 쓴다.
 *
 * tsup 이 `dist/cli.js` 로 번들한다(`tsup.cli.config.ts`). 생성기와 그 의존성이 전부
 * 안에 들어가므로 소비자 node_modules 에는 아무것도 더 깔리지 않는다.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generate, themeFileName, toCss } from "./generate.mjs";
import { hexToOklch } from "./oklch.mjs";
import { SOLID_TEXT } from "./contrast.mjs";

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

  npx nui-theme --preset <번호>        준비된 185색 중 하나. 문서 사이트의 번호
  npx nui-theme --accent <#hex>        목록에 없는 색. 6자리 hex

  --out <경로>    만들 파일. 기본 ./nui-theme.css
  --force         이미 있는 파일을 덮어쓴다

만든 파일을 루트 layout 에서 라이브러리 CSS 뒤에 불러온다.
  import "@nui-kit/react/styles/index.css";
  import "./nui-theme.css";`;

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
if (existsSync(out) && !flag("force")) {
  fail(`${out} 이 이미 있다. 덮어쓰려면 --force`);
}

const presetArg = arg("preset");
const accentArg = arg("accent");
if (presetArg && accentArg) fail("--preset 과 --accent 는 하나만 준다.");

if (presetArg) {
  const n = Number(presetArg);
  const src = join(PKG_ROOT, "styles", "themes", themeFileName(n));
  if (!Number.isInteger(n) || !existsSync(src)) {
    fail(`프리셋 ${presetArg} 번이 없다. 번호는 문서 사이트 「브랜드 색 고르기」에서 본다.`);
  }
  copyFileSync(src, out);
  console.log(`✅ 프리셋 ${n} → ${out}`);
} else if (accentArg) {
  const hex = accentArg.startsWith("#") ? accentArg : `#${accentArg}`;
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    fail(`"${accentArg}" 은 6자리 hex 가 아니다. 예: --accent "#b1002a"`);
  }
  const { C } = hexToOklch(hex);
  if (C < MIN_CHROMA) {
    fail(
      `${hex} 는 회색에 가깝다 (선명함 ${C.toFixed(3)} < ${MIN_CHROMA}). ` +
        "색깔 값이 우연한 숫자라 화면 전체가 엉뚱한 색조로 물든다. 더 선명한 색을 고른다.",
    );
  }
  const { version } = JSON.parse(
    readFileSync(join(PKG_ROOT, "package.json"), "utf8"),
  );
  const result = generate(hex);
  writeFileSync(out, toCss(result, { compact: true, version }), "utf8");
  console.log(`✅ ${hex} → ${out}`);
  for (const theme of ["light", "dark"]) {
    const t = result[theme];
    const line =
      `   ${theme.padEnd(5)} 채움 위 글자 ${t.contrast} ${t.contrastRatio}:1` +
      ` · 보조 ${t.secondary[9]} 위 글자 ${t.secondaryContrastRatio}:1`;
    console.log(t.belowStandard ? `⚠️ ${line.trimStart()} — 기준 ${SOLID_TEXT}:1 미만` : line);
  }
  if (result.light.belowStandard || result.dark.belowStandard) {
    console.log(
      "⚠️ 채워진 버튼 위 글자가 기준에 못 미친다. 파일은 만들었다. 조금 더 진하거나 연한 색을 고르면 지켜진다.",
    );
  }
} else {
  fail("--preset <번호> 또는 --accent <#hex> 가 필요하다. --help 로 사용법을 본다.");
}

console.log(`
루트 layout 에서 라이브러리 CSS 뒤에 불러온다.
  import "@nui-kit/react/styles/index.css";
  import "./${out.split("/").pop()}";`);
