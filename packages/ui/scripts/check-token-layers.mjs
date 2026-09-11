#!/usr/bin/env node
/**
 * 토큰 계층과 역할군 규율을 **소스(SCSS)** 에서 검사한다.
 * 규칙은 아래 검사 항목의 주석이 갖는다.
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
    token:
      /^(border-(?!width)[a-z-]+|control-border[a-z-]*|action-border[a-z-]*)$/,
    // shorthand(`border-top: 1px solid var(…)`)도 허용한다.
    allow: /^(border[a-z-]*|outline[a-z-]*|box-shadow)$/,
  },
  {
    role: "배경",
    token:
      /^(surface-[a-z-]+|layer-[a-z-]+|control-bg[a-z-]*|action-bg[a-z-]*|status-[a-z-]+|gradient-[a-z-]+)$/,
    allow: /^(background[a-z-]*)$/,
  },
];

/**
 * 표면 hover 에 쓰면 안 되는 토큰 — 정적인 면(카드·구분 영역·읽기 전용)의 배경이다.
 * hover 는 `control-bg-hover`, active 는 `control-bg-active` 로 통일한다
 * (design-system.md §2-3).
 */
const HOVER_BG_FORBIDDEN = new Set([
  "surface-neutral-soft",
  "surface-neutral-subtle",
  "control-bg-subtle",
  "control-bg-readonly",
]);

/**
 * 공개 훅(`hook()`) 규율 — 무엇을 열고, 이름을 어떻게 짓는가.
 *
 * 원칙: **소비자가 잘못 바꿨을 때 자기 눈으로 알아챌 수 있으면 열고, 없으면 막는다.**
 *
 *   색      배경과 글자가 짝이다. 배경만 바꾸면 대비가 깨지는데 **소비자는 모른다**
 *           (저시력 사용자만 겪는다). 그래서 훅을 두지 않는다 —
 *           창구는 브랜드 색 프리셋과 className 둘뿐이다 (tokens.md §6-1).
 *   치수    바꾸면 결과가 바로 보인다. 짝도 없다. 그래서 컴포넌트별로 연다.
 *
 * 예외 하나 — **포커스 링 두께**는 치수지만 막는다. 얇아지면 키보드 사용자만
 * 영향을 받고 소비자는 알아채지 못한다(색과 같은 성격이다).
 */
const COLOR_HOOK = /-(bg|dim|color)$/;

/** 훅 이름의 속성 부분. **긴 것부터** 매칭한다(`max-width` 가 `width` 보다 먼저) */
const HOOK_PROPS = [
  "border-width",
  "min-height",
  "min-width",
  "max-width",
  "padding-x",
  "padding-y",
  "padding",
  "height",
  "width",
  "radius",
  "size",
  "gap",
];

/**
 * 크기 · 모양 · 변형 옵션. **컴포넌트 이름 바로 뒤**에 온다 —
 * `button--large-height` 처럼 옵션별로 묶여야 소비자가 "large 버튼을 통째로"
 * 찾을 수 있다.
 *
 * ⚠️ 낱말은 **prop 값 그대로**다 (2026-09-09). 예전에는 `lg` · `md` · `sm` 이었는데
 *    prop 은 `large` · `medium` · `small` 이라 **같은 개념이 두 낱말**이었다
 *    (components.md §9 「같은 개념은 같은 이름」). 소비자가 코드에서 읽은 낱말을
 *    그대로 검색할 수 있어야 한다.
 */
const HOOK_OPTIONS = new Set([
  // size
  "large",
  "medium",
  "small",
  // shape
  "square",
  "round",
  // variant
  "text",
  // direction — Field. 이름 검사는 이 낱말 없이도 통과한다(등록 안 된 낱말은 요소로 읽힌다).
  // 등록은 「이 낱말은 prop 값」이라는 선언과 문서 표의 옵션 열을 위한 것이다
  "row",
]);

/**
 * 훅 이름이 `{컴포넌트}--{옵션?}-{요소?}-{속성}` 을 지키는지. 문제가 없으면 null.
 *
 * 컴포넌트 이름 뒤에 **대시 두 개**를 둔다 — KRDS 디자인 토큰 표기(가이드 214쪽)다.
 * `--nui-button--medium-height` 를 읽으면 "button 의 medium 옵션의 height" 로 끊긴다.
 * 소비자가 `button--` 로 검색하면 버튼 훅만 모인다.
 *
 * ⚠️ 컴포넌트 이름은 **컴포넌트마다 다르다.** `IconButton` 은 `icon-button--`,
 *    `ButtonGroup` 은 `button-group--` 이다. 한 SCSS 파일에 셋이 들어 있어도
 *    이름을 나눈다 — 안 나누면 `IconButton` 만 손보려는 소비자가 `Button` 까지
 *    움직인다.
 */
function checkHookName(name) {
  const sep = name.indexOf("--");
  if (sep <= 0 || name.indexOf("--", sep + 2) !== -1) {
    return "컴포넌트 이름 뒤에 대시 두 개가 정확히 한 번 와야 한다 (`button--medium-height`)";
  }
  const rest = name.slice(sep + 2);
  const prop = HOOK_PROPS.find((p) => rest === p || rest.endsWith(`-${p}`));
  if (!prop) {
    return `속성으로 끝나지 않는다 — 허용: ${HOOK_PROPS.join(" · ")}`;
  }

  const parts = rest
    .slice(0, rest.length - prop.length)
    .split("-")
    .filter(Boolean);

  const optionAt = parts.findIndex((p) => HOOK_OPTIONS.has(p));
  if (optionAt > 0) {
    return `옵션 '${parts[optionAt]}' 은 컴포넌트 이름 바로 뒤에 와야 한다`;
  }
  return null;
}

/**
 * 구 이름 → 새 이름. `_seed.scss` 의 DEPRECATED 절과 짝이다.
 * 컴포넌트가 아직 구 이름을 쓰고 있으면 **경고**로 보고한다(실패시키지 않는다) —
 * 이행 중이기 때문이다. 목록이 비면 `_seed.scss` 의 alias 를 지울 수 있다.
 */
const DEPRECATED = {
  // 2026-09-11 — 번호를 순서대로 다시 매겼다 (tokens.md §2). 값은 그대로, 이름만.
  //   ⚠️ 옛 `radius-2/3` · `font-size-3/4/5` · `line-height-3/4/5` 는 **새 이름과 겹쳐** 여기 못 넣는다
  //      (같은 이름이 옛 뜻으로 남아 있어도 검사가 못 가른다 — 값 표로 본다). 겹치지 않는 옛 이름만 잡는다.
  "radius-1_5": "radius-2",
  "radius-2_5": "radius-4",
  "space-6": "space-5",
  "font-size-6": "font-size-5",
  "line-height-6": "line-height-5",
  "letter-spacing-6": "letter-spacing-5",
  // 둥근 정도 최대 12 (KRDS C1) — 16 · 24 는 지웠다
  "radius-6": "(삭제 — 최대 12 · radius-5)",
  // 굵기 두 단계 (KRDS B1, 2026-09-04)
  "font-weight-medium": "font-weight-regular",
  "font-weight-semi-bold": "font-weight-bold",
  // 상태를 투명도로 표현하지 않는다 (KRDS A3)
  "opacity-icon-disabled": "control-icon-disabled",
  "opacity-icon-readonly": "control-text-muted",
  "opacity-hover": "action-*-hover",
  "opacity-pressed": "action-*-active",
  "space-2xs": "space-1",
  "space-xs": "space-2",
  "space-sm": "space-3",
  "space-md": "space-4",
  "space-lg": "space-5",
  "radius-xs": "radius-1",
  "radius-sm": "radius-3",
  "radius-md": "radius-5",
  "radius-lg": "(삭제 — 최대 12 · radius-5)",
  "radius-xl": "(삭제 — 최대 12 · radius-5)",
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
  // 눌림 배율을 컴포넌트 실측(0.94 · 0.96)에 맞추며 이름이 함께 옮겨갔다.
  "scale-95": "scale-94",
  "scale-97": "scale-96",
  // 2026-09-03 규칙 정본 갱신 (tokens.md §4-0 · §4-1 · §5-3)
  "text-inverse-strong":
    "text-on-inverse (layer-inverse 위) · text-on-accent (accent 채움 위)",
  "layer-floating-muted": "surface-neutral-soft",
  "gradient-panel-soft":
    "layer-default (카드) · surface-neutral-soft (얹는 면)",
  "size-icon-sm": "size-dot-md",
  "easing-linear": "(삭제 — 쓰는 곳이 없다)",
  "action-success": "(삭제 — Button variant 가 없다)",
  "action-info": "(삭제 — Button variant 가 없다)",
  "action-success-fg": "(삭제)",
  "action-info-fg": "(삭제)",
  // `font-size-2` · `line-height-2` · `space-5` 는 2026-09-11 재번호로 **새 이름이 됐다** — 여기서 뺐다
  "font-size-8": "(삭제 — 매트릭스 밖)",
  "line-height-8": "(삭제)",
  "letter-spacing-8": "(삭제)",
  "space-8": "(삭제 — 참조 0건)",
};

/** `typo()` / `motion()` 믹스인이 이름을 조립할 때 쓰는 구 스케일 키 (값은 2026-09-11 재번호 기준) */
const DEPRECATED_SCALE = {
  typo: {
    label: "1",
    "body-sm": "2",
    body: "3",
    title: "5",
    display: "(삭제)",
  },
  motion: { quick: "2", fast: "3", base: "4", slow: "5", deliberate: "6" },
};

const problems = [];
let ruleChecks = 0; // 영수증용 — 파일마다 적용한 규칙 수

for (const file of readdirSync(COMPONENTS_DIR).filter((f) =>
  f.endsWith(".scss"),
)) {
  const css = readFileSync(join(COMPONENTS_DIR, file), "utf8");
  ruleChecks += 4;

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
          `${file}: ${rule.role} 토큰 '${token}' 을 '${property}' 에 쓴다 — 역할군과 속성을 맞출 것 (tokens.md §4-3)`,
        );
      }
    }
  }

  // 3) 공개 훅 — 색은 열지 않는다 · 이름은 {컴포넌트}--{옵션?}-{속성}
  for (const m of css.matchAll(/hook\(\s*"([a-z0-9-]+)"/g)) {
    const name = m[1];

    if (COLOR_HOOK.test(name)) {
      problems.push(
        `${file}: 색 훅 '${name}' — 색은 컴포넌트별로 열지 않는다. ` +
          `창구는 브랜드 색 프리셋과 className 뿐이다 (tokens.md §6-1)`,
      );
      continue;
    }

    const bad = checkHookName(name);
    if (bad) {
      problems.push(`${file}: 훅 이름 '${name}' — ${bad} (design-plan 2-3)`);
    }
  }

  // 4) 표면 hover 배경은 control-bg-hover 로 통일
  // ⚠️ `[^}]*` 로 블록을 잡으면 `#{v("…")}` 의 `}` 에서 끊겨 두 번째 선언부터 못 본다.
  //    실제로 Textfield 지우기 버튼의 hover 배경을 놓치고 있었다. 줄 첫머리의 `}` 까지 읽는다.
  const hoverBlock = /:hover[^{]*\{([\s\S]*?)\n\s*\}/g;
  for (const m of css.matchAll(hoverBlock)) {
    for (const t of m[1].matchAll(/v\("([a-z0-9_-]+)"\)/g)) {
      if (HOVER_BG_FORBIDDEN.has(t[1])) {
        problems.push(
          `${file}: hover 배경에 '${t[1]}' 을 쓴다 — 'control-bg-hover' 로 통일할 것 (design-system.md §2-3)`,
        );
      }
    }
  }

  // 6) 정본 규칙의 grep 검사 (2026-09-11) — KRDS · Emil/Apple 규칙 중 「아무도 안 보던」 자리.
  //    도입 전에 재 봤다: 전 항목 진짜 0건, 헛짚기는 주석 2건(hover) · 표시 전환 6건(opacity) ·
  //    내부 변수 1건(radius) 이라 그것들을 제외하는 꼴로 좁혔다. 주석은 먼저 걷어낸다.
  const code = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  ruleChecks += 6;

  // 6-a) hover 는 hoverable 믹스인 안에서만 (styles.md §9 · Emil #8)
  let rest = "";
  let i = 0;
  for (;;) {
    const m = /@include hoverable\s*\{/.exec(code.slice(i));
    if (!m) {
      rest += code.slice(i);
      break;
    }
    rest += code.slice(i, i + m.index);
    let j = i + m.index + m[0].length;
    for (let depth = 1; depth > 0 && j < code.length; j++)
      depth += { "{": 1, "}": -1 }[code[j]] ?? 0;
    i = j;
  }
  if (/:hover/.test(rest)) {
    problems.push(
      `${file}: ':hover' 가 hoverable 믹스인 밖에 있다 — 터치·스타일러스에서 hover 가 남는다 (styles.md §9)`,
    );
  }

  // 6-b) 비활성·읽기 전용을 투명도로 표현하지 않는다 (KRDS 101쪽 · tokens.md §3-9). 표시 켜고 끄기(체크 표시 · 투명 input)는 허용
  //      ⚠️ 앞 300자를 보면 앞 블록의 토큰 이름(`control-selection-disabled`)에 걸린다 — 실측 헛짚기 2.
  //      opacity 가 든 블록의 **셀렉터**와 그 부모 셀렉터만 본다.
  //      ⚠️ SCSS 보간 `#{state("disabled")}` 의 중괄호가 블록 경계로 잡히면 셀렉터가 빈다 — 검출력 시험에서
  //      위반 2건을 0으로 셌다. 보간을 먼저 평탄화한다(`#{…}` → `«…»`). flat 안에서만 찾으므로 길이가 달라도 된다.
  const flat = code.replace(/#\{([^{}]*)\}/g, "«$1»");
  const selectorOf = (pos) => {
    const open = flat.lastIndexOf("{", pos);
    if (open < 0) return { text: "", open };
    const start = Math.max(
      flat.lastIndexOf("}", open),
      flat.lastIndexOf("{", open - 1),
      flat.lastIndexOf(";", open),
    );
    return { text: flat.slice(start + 1, open), open };
  };
  // 부모 블록의 `{` — 앞으로 되짚으며 닫힘/열림 짝을 세어 깊이가 한 단계 위로 올라가는 자리.
  // ⚠️ `lastIndexOf("{", open - 1)` 은 부모가 아니라 **앞 형제**의 브레이스라 형제의 `disabled` 에 걸렸다(헛짚기 3).
  const enclosingOpen = (open) => {
    let depth = 0;
    for (let k = open - 1; k >= 0; k--) {
      if (flat[k] === "}") depth++;
      else if (flat[k] === "{") {
        if (depth === 0) return k;
        depth--;
      }
    }
    return -1;
  };
  for (const m of flat.matchAll(/^\s*opacity:/gm)) {
    const own = selectorOf(m.index);
    const p = enclosingOpen(own.open);
    const parent = p >= 0 ? selectorOf(p) : { text: "" };
    if (/disabled|readonly/.test(own.text + " " + parent.text)) {
      problems.push(
        `${file}: 비활성·읽기 전용 블록 안에 'opacity' — 색으로만 표현한다 (tokens.md §3-9)`,
      );
    }
  }

  // 6-c) 그라디언트 금지 (design-system.md §2-5)
  if (/gradient\(/.test(code))
    problems.push(
      `${file}: 그라디언트 — 고도는 표면색·그림자·선으로 (design-system.md §2-5)`,
    );

  // 6-d) 타이포 리터럴 금지 — 크기·굵기·행간·자간은 typo() 와 토큰 (tokens.md §3-3 · KRDS B1~B4)
  for (const m of code.matchAll(
    /^\s*(font-weight|font-size|line-height|letter-spacing):\s*[0-9.]+(px|rem|em|%)?\s*;/gm,
  )) {
    problems.push(
      `${file}: '${m[1]}' 에 리터럴 — typo() 매트릭스와 토큰을 쓴다 (design-system.md §5)`,
    );
  }

  // 6-e) radius 는 토큰 · 훅 · 내부 변수만 (tokens.md §3-2 — 높이 × ⅛ · 최대 12 는 토큰이 이미 담고 있다)
  for (const m of code.matchAll(/^\s*border-radius:\s*([^;]+);/gm)) {
    if (!/radius-|hook\(|iv\(|inherit|^\s*0\s*$/.test(m[1])) {
      problems.push(
        `${file}: border-radius 에 토큰 아닌 값 '${m[1].trim()}' (tokens.md §3-2)`,
      );
    }
  }

  // 6-f) 300ms 초과 · 하드코딩 시간 금지 (motion.md §5-2 · a11y.md §6)
  if (/duration-[78]\)/.test(code))
    problems.push(
      `${file}: duration-7·8(350·400ms) 사용 — UI 는 300ms 아래 (motion.md §5-2)`,
    );
  for (const m of code.matchAll(/\b([0-9]+)ms\b/g)) {
    problems.push(
      `${file}: 시간 하드코딩 '${m[1]}ms' — duration 토큰이나 motion() 을 쓴다 (a11y.md §6)`,
    );
  }
}

// 6-g · 6-h) TSX 쪽 — autoComplete="off" 기본값 금지 (a11y.md §7) · 16 미만 아이콘 금지 (design-system.md §5-2)
const TSX_DIR = join(COMPONENTS_DIR, "../../components");
const tsxFiles = [];
(function walk(d) {
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(f.name)) tsxFiles.push(p);
  }
})(TSX_DIR);
ruleChecks += 2;
for (const p of tsxFiles) {
  const src = readFileSync(p, "utf8").replace(/^\s*\/\/.*$/gm, "");
  const name = p.slice(TSX_DIR.length + 1);
  if (/autoComplete\s*=\s*(\{\s*)?"off"/.test(src)) {
    problems.push(
      `${name}: autoComplete="off" 를 기본값으로 넣는다 — 끄는 것은 소비자가 명시한다 (a11y.md §7)`,
    );
  }
  if (/size-icon-md\b/.test(src)) {
    problems.push(
      `${name}: 14px 아이콘(size-icon-md) — 아이콘 최소 16 (design-system.md §5-2 · KRDS 164쪽)`,
    );
  }
}
for (const file of readdirSync(COMPONENTS_DIR).filter((f) =>
  f.endsWith(".scss"),
)) {
  if (/size-icon-md\b/.test(readFileSync(join(COMPONENTS_DIR, file), "utf8"))) {
    problems.push(
      `${file}: 14px 아이콘(size-icon-md) — 아이콘 최소 16 (design-system.md §5-2 · KRDS 164쪽)`,
    );
  }
}
console.log(
  `  정본 규칙 grep — SCSS ${readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".scss")).length}파일 × 6항 · TSX ${tsxFiles.length}파일 × 2항`,
);

// 5) deprecated 토큰 사용 — 경고만 한다(이행 중이므로 실패시키지 않는다)
const warnings = [];

for (const file of readdirSync(COMPONENTS_DIR).filter((f) =>
  f.endsWith(".scss"),
)) {
  const css = readFileSync(join(COMPONENTS_DIR, file), "utf8");

  // ⚠️ 문자 클래스에 `_` 가 있어야 한다 — 없으면 `radius-1_5` 같은 옛 이름을 영원히 못 잡는다 (리뷰 2026-09-11)
  for (const m of css.matchAll(/v\("([a-z0-9_-]+)"\)/g)) {
    const next = DEPRECATED[m[1]];
    if (next) warnings.push(`${file}: '${m[1]}' → '${next}'`);
  }
  for (const m of css.matchAll(/@include typo\(\s*"([a-z-]+)"/g)) {
    const next = DEPRECATED_SCALE.typo[m[1]];
    if (next) warnings.push(`${file}: typo("${m[1]}", …) → typo("${next}", …)`);
  }
  for (const m of css.matchAll(/@include motion\([^)]*?"([a-z]+)"\s*\)/g)) {
    const next = DEPRECATED_SCALE.motion[m[1]];
    if (next)
      warnings.push(`${file}: motion(…, "${m[1]}") → motion(…, "${next}")`);
  }
}

// 영수증 — 마지막 줄. 이 줄이 없으면 스크립트가 끝까지 돌지 않은 것이다 (출력 잘림 · 타임아웃 · 중간 크래시).
// 호출자는 「통과」 문구가 아니라 이 줄로 완주를 판정한다 (2026-09-11).
const count = readdirSync(COMPONENTS_DIR).filter((f) =>
  f.endsWith(".scss"),
).length;
const receipt = (exit) =>
  `RECEIPT check-token-layers files=${count + tsxFiles.length} checks=${ruleChecks} problems=${problems.length} warnings=${warnings.length} exit=${exit}`;

if (problems.length > 0) {
  console.error(`❌ 토큰 계층 검사 실패 — ${problems.length}건\n`);
  for (const p of problems) console.error(`   ${p}`);
  console.log(receipt(1));
  process.exit(1);
}

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
  console.warn("   대응표는 이 스크립트의 DEPRECATED 맵이다\n");
  for (const [file, n] of [...byFile].sort((a, b) => b[1] - a[1])) {
    console.warn(`   ${String(n).padStart(3)}건  ${file}`);
  }
  console.warn(
    "\n   전체 목록: VERBOSE=1 npm run verify:tokens -w @nui-kit/react",
  );
  if (process.env.VERBOSE) {
    console.warn("");
    for (const w of warnings) console.warn(`   ${w}`);
  }
}
console.log(receipt(0));
