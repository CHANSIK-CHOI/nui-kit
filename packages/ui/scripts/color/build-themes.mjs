#!/usr/bin/env node
/**
 * 프리셋 185색을 전부 CSS 로 미리 만들어 패키지에 싣는다 → `styles/themes/preset-<n>.css`
 *
 * 왜 소비자가 아니라 우리가 만드나 (2026-09-10 결정)
 * - 문서 사이트의 미리보기와 **같은 빌드 · 같은 생성기 버전**에서 나온다. 소비자 쪽에서
 *   만들면 소비자 `node_modules` 의 생성기 버전에 따라 문서와 다른 색이 나올 수 있다
 * - 소비자는 의존성도 명령도 없이 `import` 한 줄로 고른다
 *   `import "@nui-kit/react/styles/themes/preset-42.css"`
 * - 임의 색은 다음 단계의 CLI 가 맡는다. 그 CLI 의 `--preset` 도 이 파일을 복사한다
 *
 * `build:styles` 가 `styles/` 를 지우고 다시 만들므로 그 **뒤에** 돈다(`build` 순서).
 * 검사는 `verify-themes.mjs` — 수 · 값 · 구조.
 */
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generate, toCss, themeFileName } from "./generate.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT_DIR = join(ROOT, "styles", "themes");

const { presets } = JSON.parse(
  readFileSync(join(ROOT, "presets.json"), "utf8"),
);
const { version } = JSON.parse(
  readFileSync(join(ROOT, "package.json"), "utf8"),
);

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const started = Date.now();
let bytes = 0;
for (const preset of presets) {
  const css = toCss(generate(preset.hex), { preset, compact: true, version });
  bytes += Buffer.byteLength(css, "utf8");
  writeFileSync(join(OUT_DIR, themeFileName(preset.n)), css, "utf8");
}

console.log(
  `✅ 프리셋 테마 ${presets.length}개 생성 → styles/themes/ · ${(bytes / 1024).toFixed(0)} KB · ${Date.now() - started}ms`,
);
