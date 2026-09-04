#!/usr/bin/env node
/**
 * 브랜드 색 프리셋 185개를 **전부 생성해서** 문서용 JSON 으로 뽑는다.
 *
 * 손으로 쓸 수 없는 문서다 — 185색 × 라이트·다크 × 색 50개(보조 색 포함) = 18,500 개다.
 * 곡선을 고치면 여기도 자동으로 따라와야 하므로 생성기를 직접 호출한다.
 *
 * 출력: apps/docs/src/generated/presets.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ⚠️ 한글 경로가 percent-encoding 되므로 fileURLToPath 를 쓴다.
const DOCS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UI = resolve(DOCS_ROOT, "..", "..", "packages", "ui");

const { generate } = await import(resolve(UI, "scripts/color/generate.mjs"));
const { contrast } = await import(resolve(UI, "scripts/color/contrast.mjs"));
const { compositeOver } = await import(resolve(UI, "scripts/color/oklch.mjs"));

/**
 * 스와치 위에 얹을 단계 번호의 색.
 *
 * ⚠️ 흰 글자로 통일하면 1~8번 칸에서 안 읽힌다 — 실측 대비 1.02~2.58 이었다.
 *    밝은 칸에는 검은 글자를 얹어야 한다. 우리가 만든 대비 자를 그대로 쓴다.
 */
const labelColor = (hex, bg) => {
  // 반투명은 배경에 얹은 뒤 판단한다. 그 자체로는 밝기가 정해지지 않는다.
  const solid = hex.length > 7 ? compositeOver(hex, bg) : hex;
  return contrast(solid, "#ffffff") >= contrast(solid, "#000000")
    ? "#fff"
    : "#000";
};

const { presets, count, rule, source } = JSON.parse(
  readFileSync(resolve(UI, "presets.json"), "utf8"),
);

/**
 * 색깔 12구간. 구간마다 페이지를 나눈다.
 * 185색을 한 페이지에 넣으면 2.1MB 가 되고, 찾기도 어렵다.
 */
const GROUPS = [
  { name: "빨강", slug: "red", from: 0 },
  { name: "주황", slug: "orange", from: 30 },
  { name: "노랑", slug: "yellow", from: 60 },
  { name: "연두", slug: "lime", from: 90 },
  { name: "초록", slug: "green", from: 120 },
  { name: "청록", slug: "teal", from: 150 },
  { name: "하늘", slug: "sky", from: 180 },
  { name: "파랑", slug: "blue", from: 210 },
  { name: "남색", slug: "indigo", from: 240 },
  { name: "보라", slug: "purple", from: 270 },
  { name: "자주", slug: "magenta", from: 300 },
  { name: "분홍", slug: "pink", from: 330 },
];

const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const ALPHA = {
  brand: [4, 5, 6, 7],
  secondary: [4, 5, 6, 7],
  gray: [3, 4, 5, 6, 7],
};

/** 라이트·다크를 짝지어 담는다. 페이지는 한 벌만 그리고 CSS 로 갈아끼운다. */
const pair = (light, dark) => ({ l: light, d: dark });

/** 색 + 그 위에 얹을 글자색까지 한 쌍으로. */
const pairWithLabel = (light, dark, bgLight, bgDark) => ({
  l: light,
  d: dark,
  tl: labelColor(light, bgLight),
  td: labelColor(dark, bgDark),
});

const rows = presets.map((p) => {
  const r = generate(p.hex);
  // 반투명 판정에 쓸 배경 — 각 테마의 layer-default 다.
  const bgL = r.light.background;
  const bgD = r.dark.background;
  const P = (l, d) => pairWithLabel(l, d, bgL, bgD);
  return {
    n: p.n,
    hex: p.hex,
    name: p.name,
    h: p.h,
    merged: p.merged,
    isDefault: p.isDefault ?? false,
    group: GROUPS.findLast((g) => p.h >= g.from).slug,
    brand: STEPS.map((s) => P(r.light.brand[s], r.dark.brand[s])),
    secondary: STEPS.map((s) => P(r.light.secondary[s], r.dark.secondary[s])),
    gray: STEPS.map((s) => P(r.light.gray[s], r.dark.gray[s])),
    brandAlpha: ALPHA.brand.map((s) =>
      P(r.light.brand[`a${s}`], r.dark.brand[`a${s}`]),
    ),
    grayAlpha: ALPHA.gray.map((s) =>
      P(r.light.gray[`a${s}`], r.dark.gray[`a${s}`]),
    ),
    secondaryAlpha: ALPHA.secondary.map((s) =>
      P(r.light.secondary[`a${s}`], r.dark.secondary[`a${s}`]),
    ),
    secondarySolid: pair(r.light.secondary[9], r.dark.secondary[9]),
    secondaryContrast: pair(
      r.light.secondaryContrast,
      r.dark.secondaryContrast,
    ),
    secondaryRatio: pair(
      r.light.secondaryContrastRatio,
      r.dark.secondaryContrastRatio,
    ),
    // 9번은 solid 배경이다. 인덱스로 꺼내 쓰면 타입이 불안정해서 따로 담는다.
    solid: pair(r.light.brand[9], r.dark.brand[9]),
    // 그 배경 위의 글자색. 노랑 계열에서 흰색이 아닌 값이 나온다.
    contrast: pair(r.light.contrast, r.dark.contrast),
    ratio: pair(r.light.contrastRatio, r.dark.contrastRatio),
  };
});

const groups = GROUPS.map((g) => ({
  name: g.name,
  slug: g.slug,
  from: g.from,
  to: g.from + 30,
  count: rows.filter((r) => r.group === g.slug).length,
  // 개요 페이지에서 보여줄 대표 색 — 그 구간에서 가장 선명한 것 하나
  sample:
    rows.filter((r) => r.group === g.slug).map((r) => r.solid.l)[0] ?? null,
})).filter((g) => g.count > 0);

const OUT_DIR = resolve(DOCS_ROOT, "src", "generated");
mkdirSync(OUT_DIR, { recursive: true });
const OUT = resolve(OUT_DIR, "presets.json");
writeFileSync(
  OUT,
  JSON.stringify({
    count,
    rule,
    source,
    steps: STEPS,
    alpha: ALPHA,
    groups,
    presets: rows,
  }) + "\n",
  "utf8",
);

const kb = (readFileSync(OUT).length / 1024).toFixed(0);
console.log(`✅ 프리셋 미리보기 — ${rows.length}색 · ${kb}KB`);
console.log(`   ${groups.map((g) => `${g.name} ${g.count}`).join(" · ")}`);
