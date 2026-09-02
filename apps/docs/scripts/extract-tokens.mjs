#!/usr/bin/env node
/**
 * 디자인 토큰을 **SCSS 단일 출처에서** 추출한다.
 *
 * Foundations 문서를 손으로 쓰면 토큰이 바뀔 때마다 어긋난다.
 * `packages/ui/src/styles/tokens/_seed.scss` 를 파싱해 문서가 항상 코드를 따라가게 한다.
 *
 * 출력: apps/docs/src/generated/tokens.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DOCS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SEED = resolve(
  DOCS_ROOT,
  "..",
  "..",
  "packages/ui/src/styles/tokens/_seed.scss",
);
const OUT = join(DOCS_ROOT, "src", "generated", "tokens.json");

const raw = readFileSync(SEED, "utf8");

/**
 * 다크 테마(`@mixin dark-scheme`)는 **같은 이름의 토큰을 다시 선언**한다.
 * 그대로 파싱하면 문서 표에 모든 색이 두 번씩 나오므로 라이트 선언만 남긴다.
 * 다크 값은 "이름은 그대로, 값만 교체"라는 설계라 표에 따로 실을 것이 없다.
 */
const DARK_MIXIN = /@mixin dark-scheme \{[\s\S]*?\n\}\n/;
const scss = raw.replace(DARK_MIXIN, "");

/**
 * `#{v("color-primary")}: #1ca673; // 주석` 형태를 뽑는다.
 * 값 안의 `var(#{v("x")})` 참조는 실제 CSS 변수명으로 되돌린다.
 *
 * ⚠️ 주석은 **같은 줄**만 인정한다. `\s*` 를 쓰면 줄바꿈을 넘어가
 *    다음 줄의 섹션 헤더 주석(`// ── color / gray scale`)을 잘못 집어온다.
 */
const TOKEN_RE =
  /#\{v\("([^"]+)"\)\}:\s*([^;]+);(?:[ \t]*\/\/[ \t]*([^\n]*))?/g;

/** 토큰 이름 → 문서 그룹 */
function groupOf(name) {
  if (name.startsWith("color-")) return "color";
  if (/^(layer|surface)-|^gradient-/.test(name)) return "layer";
  if (name.startsWith("text-")) return "text";
  if (name.startsWith("action-")) return "action";
  if (name.startsWith("status-")) return "status";
  if (name.startsWith("control-") || name === "focus-color") return "control";
  if (name.startsWith("space-")) return "space";
  if (name.startsWith("size-")) return "size";
  if (name.startsWith("radius-")) return "radius";
  if (name.startsWith("shadow-")) return "shadow";
  if (/^(font-|line-height|letter-spacing)/.test(name)) return "typography";
  if (/^(duration-|easing-)/.test(name)) return "motion";
  if (name.startsWith("z-")) return "z-index";
  if (name.startsWith("focus-")) return "focus";
  if (name.startsWith("border-")) return "border";
  return "etc";
}

const groups = {};
let count = 0;

/**
 * 같은 이름의 두 번째 선언은 버린다 — **첫 선언이 기본값**이다.
 *
 * `_seed.scss` 는 `prefers-reduced-motion: reduce` 블록에서 `duration-1~6` 을
 * 1ms 로 다시 선언한다. 이걸 그대로 긁으면 문서에 duration 이 12줄로 나오고,
 * 뒤 6줄은 값이 전부 1ms 라 소비자가 실제 기본값을 알 수 없다.
 * React 도 key 중복으로 에러를 낸다.
 */
const seen = new Set();

for (const m of scss.matchAll(TOKEN_RE)) {
  const [, name, rawValue, comment] = m;
  if (seen.has(name)) continue;
  seen.add(name);
  const value = rawValue
    .replace(/var\(#\{v\("([^"]+)"\)\}\)/g, (_, ref) => `var(--nui-${ref})`)
    .replace(/\s+/g, " ")
    .trim();

  const group = groupOf(name);
  (groups[group] ??= []).push({
    name: `--nui-${name}`,
    value,
    note: comment?.trim() ?? null,
    /** 다른 토큰을 참조하는가 (문서에서 별칭으로 표시) */
    alias: /^var\(--nui-/.test(value),
  });
  count += 1;
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(groups, null, 2) + "\n", "utf8");
console.log(
  `✅ 토큰 추출 완료 — ${count}개 / ${Object.keys(groups).length}개 그룹 → src/generated/tokens.json`,
);
for (const [g, list] of Object.entries(groups)) {
  console.log(`   ${g.padEnd(12)} ${list.length}개`);
}
