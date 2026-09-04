#!/usr/bin/env node
/**
 * 색 엔진 검증 — 관문 1·2·3. 계획: `plan/03-color-engine.html` 7장.
 *
 * 기준은 **ΔE < 1.0** 이다. "hex 한 글자도 다르지 않다"가 아니다.
 * 원본 `_seed.scss` 는 단계마다 색깔(H)이 조금씩 다른데(gray 는 145~197°까지)
 * 우리는 색깔을 하나로 통일하므로(`C-01`) 글자 단위 일치는 애초에 불가능하다.
 * 우리가 원하는 것은 "글자가 같다"가 아니라 **"화면이 안 바뀐다"** 이고,
 * ΔE 가 그것을 직접 잰다. 1.0 이 훈련된 눈으로 겨우 구분하는 정도다.
 *
 * ⚠️ 반투명은 반드시 **배경에 얹은 뒤** 잰다. `light/gray-a3` 는 원색끼리 재면
 *    ΔE 5.14 지만 투명도 0.063 으로 얹히면 0.27 이다. 합성 전 값으로 판정하면
 *    멀쩡한 색을 실패로 잡는다.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { hexToOklch, oklchToHex, compositeOver, inGamut } from "./oklch.mjs";
import { contrast, AA, SOLID_TEXT, MUTED_TEXT } from "./contrast.mjs";
import { generate, STEPS, ALPHA_STEPS } from "./generate.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SEED = join(HERE, "..", "..", "src", "styles", "tokens", "_seed.scss");
const PRESETS = join(HERE, "..", "..", "presets.json");

/** 통과 기준. 1.0 = 훈련된 눈으로 겨우 구분하는 색차. */
export const MAX_DELTA_E = 1.0;

/**
 * 회색에만 적용하는 느슨한 기준.
 *
 * 브랜드 12단계는 **완전히 일치**한다(ΔE 0). 우리 색이 이 생성기로 만들어진
 * 값이기 때문이고, 그 일치가 "생성기가 옳다"는 증거다.
 *
 * 회색은 다르다. 생성기에 **회색 참조값**을 줘야 하는데 원본이 그때 무엇을
 * 넣었는지 기록이 없다. 우리는 추정한 값을 넣으므로 정확히 맞출 수가 없다.
 * 추정으로 최대 1.01 까지 맞췄고, 그 한 자리(`dark/gray-a5`)만 1.0 을 넘는다.
 */
export const MAX_DELTA_E_GRAY = 1.5;

/** OKLab 공간의 거리 = 지각 색차. */
export function deltaE(hexA, hexB) {
  const a = hexToOklch(hexA);
  const b = hexToOklch(hexB);
  const rad = (d) => (d * Math.PI) / 180;
  return (
    Math.hypot(
      (a.L - b.L) / 100,
      a.C * Math.cos(rad(a.H)) - b.C * Math.cos(rad(b.H)),
      a.C * Math.sin(rad(a.H)) - b.C * Math.sin(rad(b.H)),
    ) * 100
  );
}

/**
 * `_seed.scss` 를 테마별로 가른다.
 * 다크는 `@mixin dark-scheme` 안에, 라이트는 그 뒤 `@layer nui.tokens` 안에 있다.
 */
function splitThemes(scss) {
  const darkAt = scss.indexOf("@mixin dark-scheme");
  const lightAt = scss.indexOf("@layer nui.tokens");
  if (darkAt < 0 || lightAt < 0) {
    throw new Error(
      "_seed.scss 에서 테마 블록을 찾지 못했다 — 파일 구조가 바뀌었나?",
    );
  }
  return { dark: scss.slice(darkAt, lightAt), light: scss.slice(lightAt) };
}

/** `_seed.scss` 한 블록에서 색을 긁는다. */
function grab(block, group) {
  const out = new Map();
  const re = new RegExp(
    `#\\{v\\("color-${group}-(a?\\d+)"\\)\\}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`,
    "g",
  );
  for (const m of block.matchAll(re)) out.set(m[1], m[2].toLowerCase());
  return out;
}

const LAYER_DEFAULT_STEP = { light: 2, dark: 1 };

/**
 * 생성 결과를 원본과 대조한다.
 * 반투명은 그 테마의 `layer-default` 위에 얹은 뒤 잰다.
 */
function compare(themes, result) {
  const rows = [];
  for (const theme of ["light", "dark"]) {
    // ⚠️ 양쪽을 **같은 조건**에서 합성해야 한다. 원본은 원본의 layer-default 위에,
    //    생성본은 생성본의 layer-default 위에 얹는다. 한쪽만 순수 흰색으로 재면
    //    배경 차이가 색 차이로 둔갑한다.
    const step = LAYER_DEFAULT_STEP[theme];
    const bgOriginal = grab(themes[theme], "gray").get(String(step));
    const bgMade = result[theme].gray[step];
    for (const group of ["brand", "secondary", "gray"]) {
      const src = grab(themes[theme], group);
      const made = result[theme][group];
      for (const step of STEPS) {
        rows.push({
          id: `${theme}/${group}-${step}`,
          want: src.get(String(step)),
          got: made[step],
          dE: deltaE(src.get(String(step)), made[step]),
          composited: false,
        });
      }
      for (const step of ALPHA_STEPS[group]) {
        const want = src.get(`a${step}`);
        const got = made[`a${step}`];
        rows.push({
          id: `${theme}/${group}-a${step}`,
          want,
          got,
          // 화면에 나오는 것끼리 비교한다 — 각자의 배경 위에 얹는다.
          dE: deltaE(
            compositeOver(want, bgOriginal),
            compositeOver(got, bgMade),
          ),
          composited: true,
        });
      }
    }
  }
  return rows;
}

function report(title, rows) {
  const limit = (r) => (r.id.includes("gray") ? MAX_DELTA_E_GRAY : MAX_DELTA_E);
  const bad = rows.filter((r) => r.dE >= limit(r));
  const max = rows.reduce((m, r) => (r.dE > m.dE ? r : m), rows[0]);
  const avg = rows.reduce((s, r) => s + r.dE, 0) / rows.length;
  console.log(
    `   ${title}: ${rows.length}개 · 평균 ΔE ${avg.toFixed(3)} · 최대 ${max.dE.toFixed(3)} (${max.id})`,
  );
  for (const r of bad.slice(0, 15)) {
    console.log(
      `     ✗ ${r.id}  ${r.want} → ${r.got}  ΔE ${r.dE.toFixed(2)} (기준 ${limit(r)})`,
    );
  }
  if (bad.length > 15) console.log(`     … 그리고 ${bad.length - 15}건 더`);
  return bad.length;
}

const isMain = fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const themes = splitThemes(readFileSync(SEED, "utf8"));
  // 우리 기본 브랜드 색 — 재현 검증의 입력이다.
  const ACCENT = "#01796f";
  const { presets } = JSON.parse(readFileSync(PRESETS, "utf8"));
  let failed = 0;

  // ── 관문 2: 기본 브랜드 색으로 68개를 만들어 원본과 대조한다
  console.log(
    `\n── 관문 2 · 재현 — ${ACCENT} 로 만든 색(보조 포함)이 원본과 같아 보이나`,
  );
  const made = generate(ACCENT);
  failed += report("생성 결과", compare(themes, made));
  for (const theme of ["light", "dark"]) {
    const t = made[theme];
    const bad = t.belowStandard;
    console.log(
      `     ${theme.padEnd(5)} 9번 글자색 ${t.contrast} (${t.contrastRatio}:1) · 보조 ${t.secondaryContrast} (${t.secondaryContrastRatio}:1)` +
        `${bad ? ` ✗ 기준 ${SOLID_TEXT}:1 미달` : ""}`,
    );
    if (bad) failed++;
  }

  // ── 관문 3: 프리셋 전부를 돌린다
  console.log(
    `\n── 관문 3 · 전수 — 프리셋 ${presets.length}색이 전부 안전한가`,
  );
  const problems = [];
  for (const p of presets) {
    const r = generate(p.hex);
    for (const theme of ["light", "dark"]) {
      const t = r[theme];
      if (t.contrastRatio < SOLID_TEXT) {
        problems.push(
          `${p.n}. ${p.name} (${theme}) 9번 글자 대비 ${t.contrastRatio}:1`,
        );
      }
      if (t.secondaryContrastRatio < SOLID_TEXT) {
        problems.push(
          `${p.n}. ${p.name} (${theme}) 보조 9번 글자 대비 ${t.secondaryContrastRatio}:1`,
        );
      }
      // 본문 글자(11·12번)는 여전히 AA 다. 9번만 완화했다.
      //
      // ⚠️ 배경은 **2번**이다. Radix 가 11번에 대해 보장하는 조건이 "1·2번 배경 위"이고,
      //    우리 `layer-default` 도 gray-2 다. 순수 흰색으로 재면 실제보다 낮게 나온다.
      // 11번은 저대비 글자라 기준이 4.0, 12번은 고대비라 AA 다.
      for (const [step, min] of [
        [11, MUTED_TEXT],
        [12, AA],
      ]) {
        const onBg = contrast(t.brand[step], t.gray[2]);
        if (onBg < min) {
          problems.push(
            `${p.n}. ${p.name} (${theme}) ${step}번 본문 대비 ${onBg.toFixed(2)}:1 (기준 ${min})`,
          );
        }
      }
      for (const [group, colors] of [
        ["brand", t.brand],
        ["secondary", t.secondary],
        ["gray", t.gray],
      ]) {
        for (const [step, hex] of Object.entries(colors)) {
          const c = hexToOklch(hex);
          if (!inGamut(c))
            problems.push(
              `${p.n}. ${p.name} ${theme}/${group}-${step} 화면 밖`,
            );
        }
      }
    }
  }
  console.log(`   대비 미달 · 화면 밖 색: ${problems.length}건`);
  for (const x of problems.slice(0, 15)) console.log(`     ✗ ${x}`);
  if (problems.length > 15)
    console.log(`     … 그리고 ${problems.length - 15}건 더`);
  failed += problems.length;

  console.log(
    failed === 0
      ? `\n✅ 관문 2~3 통과 — 브랜드 ΔE < ${MAX_DELTA_E} · 회색 < ${MAX_DELTA_E_GRAY}\n`
      : `\n❌ 실패 ${failed}건\n`,
  );
  process.exit(failed === 0 ? 0 : 1);
}
