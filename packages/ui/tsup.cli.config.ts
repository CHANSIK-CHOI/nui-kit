import { defineConfig } from "tsup";

/**
 * `npx nui-theme` 번들 — `scripts/color/cli.mjs` → `dist/cli.js`.
 *
 * 컴포넌트 설정(`tsup.config.ts`)과 따로 둔 이유 — 그쪽은 `"use client"` 배너와 peer
 * external 이 붙고 `clean: true` 라, 같은 배열에 넣으면 CLI 산출물이 지워지거나 배너를
 * 받는다. `build:js` 가 컴포넌트 다음에 이 설정을 돌린다.
 *
 * 생성기와 그 의존성(radix-theme-generator · colorjs.io · bezier-easing · @radix-ui/colors)을
 * 전부 안에 넣는다 — 실측 176 KB. dep 으로 넘기면 소비자 node_modules 가 9.4 MB 는다.
 */
export default defineConfig({
  entry: { cli: "scripts/color/cli.mjs" },
  format: ["esm"],
  platform: "node",
  target: "node18",
  outDir: "dist",
  clean: false,
  splitting: false,
  sourcemap: false,
  dts: false,
  minify: true,
  noExternal: [/.*/],
});
