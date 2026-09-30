#!/usr/bin/env node
/**
 * 개발용 명령 — 브랜드 색 하나로 `nui-theme.css` 를 만든다 (`npm run color:generate`).
 *
 *   node scripts/color/generate-cmd.mjs --preset 42
 *   node scripts/color/generate-cmd.mjs --accent "#b1002a"   [--out <경로>]
 *
 * 계산은 `generate.mjs` 가 하고 이 파일은 **명령만** 갖는다. 소비자 명령은 `cli.mjs` 다.
 *
 * 왜 따로 두나 (2026-09-28) — 예전에는 이 블록이 `generate.mjs` 안에서
 * `fileURLToPath(import.meta.url) === process.argv[1]` 로 「직접 실행됐나」를 판정했다.
 * `cli.mjs` 가 `generate.mjs` 를 import 해 `dist/cli.js` 한 파일로 번들되면 두 모듈의
 * `import.meta.url` 이 **같은 파일**이 된다. 그래서 CLI 를 심볼릭 `.bin` 없이 실제 경로로
 * 부르면(`pnpm dlx` · `yarn dlx` · yarn PnP) 이 판정이 참이 되어 이 블록까지 돌았다 —
 * `--preset` 은 패키지 밖의 `presets.json` 을 찾다 ENOENT 로 죽고, `--accent` 는 패키지 안에
 * `dist/nui-theme.css` 를 썼다(읽기 전용이면 EROFS). v0.2.0 에서 실측했다.
 * 라이브러리 모듈은 부작용 없이 두고 진입점은 파일 하나에 하나만 둔다. `verify:cli` 가 지킨다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generate, toCss } from "./generate.mjs";
import { checkTheme } from "./gates.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PRESETS = join(HERE, "..", "..", "presets.json");

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};

let accent;
let preset;

if (arg("preset")) {
  const { presets } = JSON.parse(readFileSync(PRESETS, "utf8"));
  const n = Number(arg("preset"));
  preset = presets.find((p) => p.n === n);
  if (!preset) {
    console.error(
      `✗ 프리셋 ${n} 번이 없다. 1~${presets.length} 중에서 고른다.`,
    );
    process.exit(1);
  }
  accent = preset.hex;
} else if (arg("accent")) {
  accent = arg("accent");
} else {
  console.error("✗ --preset <번호> 또는 --accent <#hex> 가 필요하다.");
  process.exit(1);
}

const result = generate(accent);
const out = arg("out") ?? join(HERE, "nui-theme.css");
writeFileSync(out, toCss(result, { preset }), "utf8");

console.log(
  `✅ 색 102개 생성 — ${accent}${preset ? ` (프리셋 ${preset.n}. ${preset.name})` : ""}`,
);
for (const theme of ["light", "dark"]) {
  const t = result[theme];
  console.log(
    `   ${theme.padEnd(5)} 9번 ${t.brand[9]} · 글자 ${t.contrast} (${t.contrastRatio}:1)` +
      ` · 보조 ${t.secondary[9]} · 글자 ${t.secondaryContrast} (${t.secondaryContrastRatio}:1)` +
      ` · 회색 ${t.gray[9]}`,
  );
}
// 기준은 gates.mjs 한 벌 — 프리셋 검사 · CLI 와 같은 것
const g = checkTheme(result);
for (const f of g.fails) console.log(`   ✗ ${f.message}`);
for (const i of g.infos) console.log(`   ⓘ ${i.message}`);
console.log(`   → ${out.split("/").slice(-2).join("/")}`);
