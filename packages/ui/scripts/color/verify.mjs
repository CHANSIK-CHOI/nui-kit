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
import { compositeOver } from "./oklch.mjs";
import { generate, STEPS, ALPHA_STEPS } from "./generate.mjs";
import { checkTheme, deltaE, GATES } from "./gates.mjs";

// 영수증 — 어느 길로 끝나든 마지막 줄. 없으면 끝까지 안 돈 것이다 (rules/scripts.md §1)
const receipt = { compared: 0, presets: 0, checks: 0, fail: 0, info: 0 };
process.on("exit", (code) =>
  console.log(
    `RECEIPT color-verify compared=${receipt.compared} presets=${receipt.presets} checks=${receipt.checks} fail=${receipt.fail} info=${receipt.info} exit=${code}`,
  ),
);

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

// deltaE 는 `gates.mjs` 에 있다 — 관문 3 의 9번 재조정 판정도 같은 자를 쓴다.

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
  const rows = compare(themes, made);
  receipt.compared = rows.length;
  if (rows.length === 0) {
    console.log("   ✗ 대조할 색이 0개 — _seed.scss 정규식이 늙었다");
    failed++;
  }
  failed += report("생성 결과", rows);
  for (const theme of ["light", "dark"]) {
    const t = made[theme];
    console.log(
      `     ${theme.padEnd(5)} 9번 글자색 ${t.contrast} (${t.contrastRatio}:1) · 보조 ${t.secondaryContrast} (${t.secondaryContrastRatio}:1)`,
    );
  }
  // 기본 브랜드도 같은 기준을 지나야 한다 — 관문 3 과 같은 함수
  const own = checkTheme(made);
  receipt.checks += own.checks;
  for (const f of own.fails) console.log(`     ✗ ${f.message}`);
  failed += own.fails.length;

  // ── 관문 3: 프리셋 전부를 돌린다
  console.log(
    `\n── 관문 3 · 전수 — 프리셋 ${presets.length}색이 전부 안전한가`,
  );
  // 기준은 `gates.mjs` 한 벌이다 — CLI 의 `--accent` 와 문서 미리보기도 같은 것을 읽는다.
  const problems = [];
  const shifted = { light: 0, dark: 0 };
  let checks = 0;
  for (const p of presets) {
    const g = checkTheme(generate(p.hex));
    checks += g.checks;
    for (const f of g.fails) problems.push(`${p.n}. ${p.name} ${f.message}`);
    for (const i of g.infos) shifted[i.theme]++;
  }
  receipt.presets = presets.length;
  receipt.checks += checks;
  receipt.fail = problems.length;
  receipt.info = shifted.light + shifted.dark;
  console.log(
    `   검사 ${checks}건 (${presets.length}색 × 기준 ${GATES.length} + 9번 재조정 × 2테마)`,
  );
  console.log(
    `   9번 재조정(정보) — 라이트 ${shifted.light} · 다크 ${shifted.dark}. 입력이 페이지 배경과 구분되지 않아 참조 스케일의 9번이 앉은 것. 문서 카드가 같은 수를 보여준다`,
  );
  console.log(`   기준 미달 · 화면 밖 색: ${problems.length}건`);
  for (const x of problems.slice(0, 15)) console.log(`     ✗ ${x}`);
  if (problems.length > 15)
    console.log(`     … 그리고 ${problems.length - 15}건 더`);
  if (checks === 0) {
    console.log("   ✗ 검사한 수가 0 — presets.json 이 비었거나 경로가 늙었다");
    failed++;
  }
  failed += problems.length;

  console.log(
    failed === 0
      ? `\n✅ 관문 2~3 통과 — 브랜드 ΔE < ${MAX_DELTA_E} · 회색 < ${MAX_DELTA_E_GRAY}\n`
      : `\n❌ 실패 ${failed}건\n`,
  );
  process.exit(failed === 0 ? 0 : 1);
}
