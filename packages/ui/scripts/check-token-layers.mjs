#!/usr/bin/env node
/**
 * 토큰 계층과 역할군 규율을 **소스(SCSS)** 에서 검사한다.
 * 규칙 본문은 `.claude/rules/design-system.md`.
 *
 * 왜 필요한가 — 계열별 이식을 마친 뒤 측정했더니 hover 배경에 세 가지 토큰이,
 * 포커스 링에 세 가지 크기가 기준 없이 섞여 있었다. 토큰은 충분했지만 선택
 * 규칙이 없어서 컴포넌트마다 다르게 골랐다. 문서만 있으면 다시 어긋난다.
 *
 * 검사 대상은 빌드된 CSS 가 아니라 **소스** 다 — 어떤 토큰 이름을 참조했는지는
 * 컴파일 뒤에는 알 수 없기 때문이다(`var()` 로 남지만 중첩 alias 는 사라진다).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ⚠️ 한글 경로가 percent-encoding 되므로 fileURLToPath 를 쓴다.
const COMPONENTS_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "styles",
  "components",
);

/** 컴포넌트가 직접 참조하면 안 되는 primitive 색 접두사 */
const PRIMITIVE_COLOR = /v\("(color-[a-z0-9-]+)"\)/g;

/**
 * 역할군 ↔ CSS 속성.
 * 토큰 이름이 왼쪽 패턴에 걸리면, 오른쪽 속성에만 쓸 수 있다.
 */
const ROLE_RULES = [
  {
    role: "글자색",
    token: /^(text-[a-z-]+|control-text[a-z-]*|action-fg[a-z-]*)$/,
    allow: /^(color|caret-color|-webkit-text-fill-color|fill|stroke)$/,
  },
  {
    role: "테두리색",
    // `border-width*` 는 색이 아니라 두께이므로 제외한다.
    token: /^(border-(?!width)[a-z-]+|control-border[a-z-]*|action-border[a-z-]*)$/,
    // shorthand(`border-top: 1px solid var(…)`)도 허용한다.
    allow: /^(border[a-z-]*|outline[a-z-]*|box-shadow)$/,
  },
  {
    role: "배경",
    token: /^(surface-[a-z-]+|layer-[a-z-]+|control-bg[a-z-]*|action-bg[a-z-]*|status-[a-z-]+|gradient-[a-z-]+)$/,
    allow: /^(background[a-z-]*)$/,
  },
];

/** 표면 hover 에 쓰면 안 되는 토큰 → 대신 써야 하는 것 */
const HOVER_BG_FORBIDDEN = new Set([
  "surface-neutral-soft",
  "surface-neutral-subtle",
]);

/**
 * 구 이름 → 새 이름. `_seed.scss` 의 DEPRECATED 절과 짝이다.
 * 컴포넌트가 아직 구 이름을 쓰고 있으면 **경고**로 보고한다(실패시키지 않는다) —
 * 이행 중이기 때문이다. 목록이 비면 `_seed.scss` 의 alias 를 지울 수 있다.
 */
const DEPRECATED = {
  "space-2xs": "space-1",
  "space-xs": "space-2",
  "space-sm": "space-3",
  "space-md": "space-4",
  "space-lg": "space-6",
  "radius-xs": "radius-1",
  "radius-sm": "radius-2",
  "radius-md": "radius-3",
  "radius-lg": "radius-4",
  "radius-xl": "radius-6",
  "radius-pill": "radius-full",
  "radius-pill-fluid": "radius-full",
  "radius-round": "radius-circle",
  "focus-ring-width": "focus-width",
  "focus-ring-offset": "focus-offset",
  "border-width-focus": "focus-width",
  "shadow-focus": "focus-ring",
  "shadow-focus-sm": "focus-ring-sm",
  "shadow-focus-strong": "focus-ring-strong",
  "shadow-focus-error": "focus-ring-error",
  "shadow-soft": "shadow-1",
  "shadow-base": "shadow-2",
  "shadow-brand": "shadow-2",
  "shadow-dropdown": "shadow-2",
  "shadow-dropdown-strong": "shadow-2",
  "shadow-overlay": "shadow-3",
  "shadow-toast": "shadow-3",
  "surface-panel-strong": "layer-floating",
  "surface-panel-muted": "layer-floating-muted",
  "surface-inverse": "layer-inverse",
  "surface-overlay-dim": "layer-overlay",
};

/** `typo()` / `motion()` 믹스인이 이름을 조립할 때 쓰는 구 스케일 키 */
const DEPRECATED_SCALE = {
  typo: { label: "1", "body-sm": "3", body: "4", title: "6", display: "8" },
  motion: { quick: "2", fast: "3", base: "4", slow: "5", deliberate: "6" },
};

const problems = [];

for (const file of readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".scss"))) {
  const css = readFileSync(join(COMPONENTS_DIR, file), "utf8");

  // 1) primitive 색 직접 참조 금지
  for (const m of css.matchAll(PRIMITIVE_COLOR)) {
    problems.push(
      `${file}: primitive 색 '${m[1]}' 을 직접 참조한다 — semantic 을 쓸 것 (design-system.md §1)`,
    );
  }

  // 2) 역할군 ↔ 속성 일치
  const declaration = /^\s*([a-z-]+)\s*:\s*([^;]*v\("([a-z0-9-]+)"\)[^;]*);/gm;
  for (const m of css.matchAll(declaration)) {
    const [, property, , token] = m;
    for (const rule of ROLE_RULES) {
      if (rule.token.test(token) && !rule.allow.test(property)) {
        problems.push(
          `${file}: ${rule.role} 토큰 '${token}' 을 '${property}' 에 쓴다 — 역할군과 속성을 맞출 것 (design-system.md §2)`,
        );
      }
    }
  }

  // 3) 표면 hover 배경은 control-bg-hover 로 통일
  const hoverBlock = /:hover[^{]*\{([^}]*)\}/g;
  for (const m of css.matchAll(hoverBlock)) {
    for (const t of m[1].matchAll(/v\("([a-z0-9-]+)"\)/g)) {
      if (HOVER_BG_FORBIDDEN.has(t[1])) {
        problems.push(
          `${file}: hover 배경에 '${t[1]}' 을 쓴다 — 'control-bg-hover' 로 통일할 것 (design-system.md §3-3)`,
        );
      }
    }
  }
}

// 4) deprecated 토큰 사용 — 경고만 한다(이행 중이므로 실패시키지 않는다)
const warnings = [];

for (const file of readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".scss"))) {
  const css = readFileSync(join(COMPONENTS_DIR, file), "utf8");

  for (const m of css.matchAll(/v\("([a-z0-9-]+)"\)/g)) {
    const next = DEPRECATED[m[1]];
    if (next) warnings.push(`${file}: '${m[1]}' → '${next}'`);
  }
  for (const m of css.matchAll(/@include typo\(\s*"([a-z-]+)"/g)) {
    const next = DEPRECATED_SCALE.typo[m[1]];
    if (next) warnings.push(`${file}: typo("${m[1]}", …) → typo("${next}", …)`);
  }
  for (const m of css.matchAll(/@include motion\([^)]*?"([a-z]+)"\s*\)/g)) {
    const next = DEPRECATED_SCALE.motion[m[1]];
    if (next) warnings.push(`${file}: motion(…, "${m[1]}") → motion(…, "${next}")`);
  }
}

if (problems.length > 0) {
  console.error(`❌ 토큰 계층 검사 실패 — ${problems.length}건\n`);
  for (const p of problems) console.error(`   ${p}`);
  process.exit(1);
}

const count = readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".scss")).length;
console.log(`✅ 토큰 계층 검사 통과 (${count}개 파일)`);

if (warnings.length > 0) {
  const byFile = new Map();
  for (const w of warnings) {
    const file = w.slice(0, w.indexOf(":"));
    byFile.set(file, (byFile.get(file) ?? 0) + 1);
  }
  console.warn(
    `\n⚠️  구 토큰 이름 ${warnings.length}건 (파일 ${byFile.size}개) — 컴포넌트 반영 단계에서 정리한다.`,
  );
  console.warn("   대응표는 .claude/rules/tokens.md §6\n");
  for (const [file, n] of [...byFile].sort((a, b) => b[1] - a[1])) {
    console.warn(`   ${String(n).padStart(3)}건  ${file}`);
  }
  console.warn("\n   전체 목록: VERBOSE=1 npm run verify:tokens -w @chansikchoi/next-ui");
  if (process.env.VERBOSE) {
    console.warn("");
    for (const w of warnings) console.warn(`   ${w}`);
  }
}
