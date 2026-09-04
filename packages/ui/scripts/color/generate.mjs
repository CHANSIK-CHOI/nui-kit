#!/usr/bin/env node
/**
 * 브랜드 색 하나 → 화면에 쓸 색 102개 (brand 16 · secondary 16 · gray 17 · 글자색 2, 두 테마).
 * secondary 는 KRDS 준수(2026-09-04, A1)로 더했다 — 아래 SECONDARY_REF.
 * 계획: `plan/03-color-engine.html` 6장.
 *
 * ★ 2026-09-02 — 우리가 만든 곡선 대신 **Radix 공식 생성기**를 쓴다.
 *
 * 왜 바꿨나 — 우리 방식은 고른 색에서 **색깔(H)만** 가져오고 밝기·선명함은
 * 곡선 한 벌로 고정했다. 그래서 밝기가 전혀 다른 두 색이 같은 결과를 냈다.
 * 실측: Figma 185색이 실질 39가지였고 이웃 쌍의 91%가 구분 불가였다.
 *
 * Radix 생성기는 **25개 참조 곡선 중 입력 색과 가장 가까운 것을 고르고**
 * 베지어 이징으로 변형한다. 그래서 입력이 다르면 결과도 다르다.
 * 게다가 우리가 직접 만들려던 것들을 이미 다 갖고 있다 —
 * 9번 재조정 · 글자색 계산 · 버튼 hover 색 · 채도 제한 · 반투명 역산.
 *
 * 검증: 우리 브랜드 `#01796f` 로 돌리면 현재 `_seed.scss` 의 brand 12단계가
 * **한 글자도 다르지 않게** 재현된다. 우리 색이 원래 이 도구로 만들어진 값이다.
 *
 * 사용:
 *   node scripts/color/generate.mjs --preset 42
 *   node scripts/color/generate.mjs --accent "#b1002a"
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateRadixColors } from "radix-theme-generator";
import { hexToOklch, oklchToHex } from "./oklch.mjs";
import { contrast, SOLID_TEXT } from "./contrast.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PRESETS = join(HERE, "..", "..", "presets.json");

/** CSS 변수 접두사. `src/styles/abstracts/_prefix.scss` 와 같아야 한다. */
const PREFIX = "--nui-";

/**
 * 페이지 배경. Radix 도구의 기본값과 같다.
 * 생성기가 반투명을 이 배경에서 역산하므로 실제 배경과 맞아야 한다.
 */
const BACKGROUND = { light: "#ffffff", dark: "#111111" };

/**
 * 회색 참조를 만드는 규칙 — 브랜드의 **색깔만** 물려받고 거의 무채색으로 둔다.
 *
 * 이 값을 주면 Radix 가 6종 회색(gray·mauve·slate·sage·olive·sand) 중
 * 어울리는 곡선을 골라 쓴다. 브랜드가 바뀌면 회색도 함께 바뀐다(`C-01`).
 *
 * L·C 는 실측으로 고른 값이고 **테마마다 다르다** — 라이트 회색은 밝은 쪽에서,
 * 다크 회색은 어두운 쪽에서 곡선이 갈리기 때문이다.
 * 현재 `_seed.scss` 재현도: 라이트 최대 ΔE 0.45 · 다크 1.01.
 *
 * ⚠️ 색깔(H)은 **브랜드 것을 그대로** 쓴다. 실측으로는 다크에서 H 를 20° 낮추면
 *    재현도가 0.83 으로 좋아지지만, 그건 우리 원본 회색이 우연히 그 자리에 있었을
 *    뿐이고 새 브랜드에는 근거가 없다. `C-01`(회색은 브랜드 색깔을 물려받는다)을
 *    지키는 쪽을 택했다.
 */
const GRAY_REF = {
  light: { L: 60, C: 0.003 },
  dark: { L: 40, C: 0.008 },
};
export const grayRefFor = (accentHex, theme) =>
  oklchToHex({ ...GRAY_REF[theme], H: hexToOklch(accentHex).H });

/**
 * 보조 색(secondary)을 만드는 규칙 — KRDS 색 체계(가이드 80~83쪽)의 두 번째 주요 색이다.
 *
 * KRDS 의 primary→secondary 관계를 재 보니 **같은 색조에서 채도를 0.57 배로 낮추고
 * 기준 단계를 한 단계 어둡게** 둔 색이었다(`research/krds/pencil-colors.md`).
 * 그 관계를 그대로 쓴다. 소비자는 여전히 프리셋 하나만 고른다.
 *
 * 밝기 이동은 테마마다 다르다 — 라이트는 어둡게(−6) 해서 흰 글자 7:1(AAA 급),
 * 다크는 밝게(+4) 해서 어두운 배경 위 4.1:1 을 확보한다. KRDS 도 다크에서 secondary 를
 * 밝은 쪽으로 옮긴다(82쪽). 색조는 브랜드 것을 유지한다 — 회색과 같은 원칙(`C-01`).
 * 185색 전부에서 9번 글자 대비 3:1 미달이 0건인 값이다.
 */
const SECONDARY_REF = {
  light: { dL: -6, C: 0.57 },
  dark: { dL: 4, C: 0.57 },
};
export const secondaryRefFor = (accentHex, theme) => {
  const o = hexToOklch(accentHex);
  const { dL, C } = SECONDARY_REF[theme];
  return oklchToHex({ L: o.L + dL, C: o.C * C, H: o.H });
};

/** 우리가 쓰는 단계. Radix 는 12단계와 alpha 12단계를 전부 준다. */
export const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const ALPHA_STEPS = {
  brand: [4, 5, 6, 7],
  secondary: [4, 5, 6, 7],
  gray: [3, 4, 5, 6, 7],
};

/** 9번 배경 위 글자색을 다시 고른다 — Radix 는 흰 글자를 선호해 밝은 색에서도 흰색을 준다. */
function pickContrast(scale, radixContrast, theme) {
  const darkText = theme === "light" ? scale[12] : scale[1];
  let text = radixContrast;
  let ratio = contrast(scale[9], text);
  if (ratio < SOLID_TEXT) {
    for (const alt of [darkText, "#ffffff", "#000000"]) {
      const altRatio = contrast(scale[9], alt);
      if (altRatio > ratio) {
        text = alt;
        ratio = altRatio;
      }
    }
  }
  return { text, ratio };
}

/** 한 테마의 색. */
export function generateTheme(accentHex, theme) {
  const r = generateRadixColors({
    appearance: theme,
    accent: accentHex,
    gray: grayRefFor(accentHex, theme),
    background: BACKGROUND[theme],
  });

  const pick = (scale, alphaScale, steps) => {
    const out = {};
    for (const s of STEPS) out[s] = scale[s - 1];
    for (const s of steps) out[`a${s}`] = alphaScale[s - 1];
    return out;
  };

  const brand = pick(r.accentScale, r.accentScaleAlpha, ALPHA_STEPS.brand);
  const { text, ratio } = pickContrast(brand, r.accentContrast, theme);

  // 보조 색 — 같은 생성기에 파생한 참조색을 넣는다. 회색·배경은 브랜드와 같은 것을 써서
  // 반투명 단계가 같은 배경에서 역산되게 한다.
  const rs = generateRadixColors({
    appearance: theme,
    accent: secondaryRefFor(accentHex, theme),
    gray: grayRefFor(accentHex, theme),
    background: BACKGROUND[theme],
  });
  const secondary = pick(
    rs.accentScale,
    rs.accentScaleAlpha,
    ALPHA_STEPS.secondary,
  );
  const sec = pickContrast(secondary, rs.accentContrast, theme);

  return {
    brand,
    secondary,
    gray: pick(r.grayScale, r.grayScaleAlpha, ALPHA_STEPS.gray),
    contrast: text,
    contrastRatio: Number(ratio.toFixed(2)),
    secondaryContrast: sec.text,
    secondaryContrastRatio: Number(sec.ratio.toFixed(2)),
    // 기준 미달이면 알린다 — 프리셋 목록에서 걸러내는 근거가 된다.
    belowStandard: ratio < SOLID_TEXT || sec.ratio < SOLID_TEXT,
    background: r.background,
  };
}

/** 브랜드 색 하나로 라이트·다크 두 벌을 만든다. */
export function generate(accentHex) {
  return {
    accent: accentHex,
    H: Number(hexToOklch(accentHex).H.toFixed(4)),
    light: generateTheme(accentHex, "light"),
    dark: generateTheme(accentHex, "dark"),
  };
}

/** 한 테마의 CSS 변수 줄들. */
function declarations(theme, indent) {
  const lines = [];
  const pad = " ".repeat(indent);
  for (const [group, colors] of [
    ["brand", theme.brand],
    ["secondary", theme.secondary],
    ["gray", theme.gray],
  ]) {
    for (const s of STEPS)
      lines.push(`${pad}${PREFIX}color-${group}-${s}: ${colors[s]};`);
    for (const s of ALPHA_STEPS[group]) {
      lines.push(`${pad}${PREFIX}color-${group}-a${s}: ${colors[`a${s}`]};`);
    }
  }
  lines.push(`${pad}${PREFIX}color-brand-contrast: ${theme.contrast};`);
  lines.push(
    `${pad}${PREFIX}color-secondary-contrast: ${theme.secondaryContrast};`,
  );
  return lines.join("\n");
}

/**
 * 소비자가 `import` 하는 CSS 한 장(`Q-3`).
 * 레이어에 넣지 않는다 — 레이어 밖이 항상 이기므로 우리 기본값을 덮어쓴다.
 */
export function toCss(result, meta = {}) {
  const head = [
    "/*",
    " * @chansikchoi/next-ui — 브랜드 색 테마",
    meta.preset
      ? ` * 프리셋 ${meta.preset.n}. ${meta.preset.name} (${meta.preset.hex})`
      : null,
    ` * 브랜드 색 ${result.accent}`,
    " *",
    " * Radix 공식 생성기(radix-theme-generator)로 만든 자동 생성 파일이다.",
    " * 손으로 고치지 말 것. 라이브러리 CSS 뒤에 import 한다.",
    " */",
  ]
    .filter(Boolean)
    .join("\n");

  return `${head}

:root {
${declarations(result.light, 2)}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${declarations(result.dark, 4)}
  }
}

:root[data-theme="dark"] {
${declarations(result.dark, 2)}
}
`;
}

const isMain = fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
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
        `${t.belowStandard ? " ⚠️ 기준 미달" : ""} · 회색 ${t.gray[9]}`,
    );
  }
  console.log(`   → ${out.split("/").slice(-2).join("/")}`);
}
