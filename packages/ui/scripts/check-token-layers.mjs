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
    token: /^(surface-[a-z-]+|control-bg[a-z-]*|action-bg[a-z-]*|status-[a-z-]+|gradient-[a-z-]+)$/,
    allow: /^(background[a-z-]*)$/,
  },
];

/** 표면 hover 에 쓰면 안 되는 토큰 → 대신 써야 하는 것 */
const HOVER_BG_FORBIDDEN = new Set([
  "surface-neutral-softest",
  "surface-neutral-soft",
  "surface-neutral-subtle",
]);

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

if (problems.length > 0) {
  console.error(`❌ 토큰 계층 검사 실패 — ${problems.length}건\n`);
  for (const p of problems) console.error(`   ${p}`);
  process.exit(1);
}

const count = readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".scss")).length;
console.log(`✅ 토큰 계층 검사 통과 (${count}개 파일)`);
