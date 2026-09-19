#!/usr/bin/env node
/**
 * 공개 훅(`hook()`)을 **컴포넌트 SCSS 소스**에서 뽑아 문서용 JSON 으로 만든다.
 *
 * 왜 손으로 쓰지 않는가 — 훅 목록을 문서에 적어두면 코드가 바뀔 때 반드시 어긋난다.
 * 실제로 색 훅 19개를 없앤 뒤 문서 사이트 8개 페이지가 없어진 훅을 계속 광고하고 있었다.
 *
 * 왜 빌드된 CSS 가 아니라 소스인가 — `npm run dev` 는 docs 만 띄우므로
 * `packages/ui/styles/*.css` 가 없을 수 있다. 소스는 항상 있다.
 *
 * ⚠️ `hook(` 과 이름 사이에 줄바꿈이 들어간다 (Prettier 가 긴 줄을 접는다).
 *    `\s*` 로 줄바꿈까지 잡지 않으면 조용히 놓친다.
 */
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ⚠️ 한글 경로가 percent-encoding 되므로 fileURLToPath 를 쓴다.
const HERE = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(
  HERE,
  "..",
  "..",
  "..",
  "packages",
  "ui",
  "src",
  "styles",
  "components",
);
const OUT = join(HERE, "..", "src", "generated", "hooks.json");

/**
 * 훅 접두어 → 문서에 보일 컴포넌트 이름.
 *
 * ⚠️ **파일이 아니라 접두어로 묶는다** (2026-09-09). `_button.scss` 한 파일이
 *    `Button` · `IconButton` · `ButtonGroup` 셋을 그리는데, 파일로 묶으면 셋의 훅이
 *    한 표에 섞여 소비자가 "IconButton 은 무엇을 열어 뒀나"를 못 읽는다.
 *    접두어가 곧 컴포넌트이므로 그것이 묶는 단위다.
 */
const LABEL = {
  accordion: "Accordion",
  // `_popup.scss` 가 내는 둘째 접두어 — 손잡이 훅 (2026-09-15 · G1). 소비자가 import 하는 이름을 따른다
  "bottom-sheet": "BottomSheet",
  button: "Button · ButtonLink",
  "button-group": "ButtonGroup",
  checkbox: "Checkbox",
  datepicker: "Datepicker 계열",
  field: "Field",
  "icon-button": "IconButton",
  popup: "Popup 계열",
  radio: "Radio",
  select: "Select · MultiSelect",
  switch: "Switch",
  textarea: "Textarea",
  textfield: "Textfield · Search · Password",
  toast: "Toast",
  tooltip: "Tooltip",
};

/** 훅 이름의 속성 부분. **긴 것부터** 매칭한다 (`max-width` 가 `width` 보다 먼저) */
const PROPS = [
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
 * 옵션 낱말 → 표에 보일 이름과 **종류**.
 *
 * 낱말은 prop 값 그대로다 (`size="large"` → `--large-`). 종류를 함께 두는 이유는
 * 비고 칸이 "크기 large" 인지 "모양 round" 인지 "변형 text" 인지 말해야 하기
 * 때문이다 — 예전에는 전부 「크기」로 찍혀 `round-radius` 가 "크기 round" 였다.
 *
 * ⚠️ `lg` · `md` · `sm` 은 **Popup 이 아직 쓰는 구 낱말**이다. Popup 이행이 끝나면
 *    지운다.
 */
const OPTION_LABEL = {
  large: { label: "large", kind: "크기" },
  medium: { label: "medium (기본)", kind: "크기" },
  small: { label: "small", kind: "크기" },
  square: { label: "square (기본)", kind: "모양" },
  round: { label: "round", kind: "모양" },
  text: { label: "text", kind: "변형" },
  // Accordion (2026-09-13)
  box: { label: "box (기본)", kind: "변형" },
  separated: { label: "separated", kind: "변형" },
  row: { label: "row", kind: "방향" },
  // Popup 이행 대기
  lg: { label: "large", kind: "크기" },
  md: { label: "medium (기본)", kind: "크기" },
  sm: { label: "small", kind: "크기" },
};

/** `var(#{v("size-field")})` → `var(--nui-size-field)` · 공백 정리 */
function readable(raw) {
  return raw
    .replace(/var\(#\{v\("([^"]+)"\)\}\)/g, (_, ref) => `var(--nui-${ref})`)
    .replace(/#\{v\("([^"]+)"\)\}/g, (_, ref) => `--nui-${ref}`)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * `hook(` 의 두 번째 인자를 읽는다. **괄호를 세어서** 닫는 위치를 찾는다 —
 * 기본값 자체가 `var(#{v("size-field")})` 처럼 괄호를 품기 때문에
 * 정규식으로 첫 `)` 까지 자르면 값이 잘린다.
 */
function readArgument(text, from) {
  let depth = 1;
  let i = from;
  while (i < text.length && depth > 0) {
    if (text[i] === "(") depth += 1;
    else if (text[i] === ")") depth -= 1;
    i += 1;
  }
  return text.slice(from, i - 1);
}

/** 훅 이름을 {컴포넌트}--{옵션?}-{요소?}-{속성} 으로 쪼갠다. 컴포넌트 뒤는 대시 두 개다 (KRDS 214쪽) */
function parse(name) {
  const sep = name.indexOf("--");
  const component = sep > 0 ? name.slice(0, sep) : name;
  const rest = sep > 0 ? name.slice(sep + 2) : name;
  const prop = PROPS.find((p) => rest === p || rest.endsWith(`-${p}`));
  if (!prop) return { component, prop: rest, option: null };

  const parts = rest
    .slice(0, rest.length - prop.length)
    .split("-")
    .filter(Boolean);
  const option = parts[0] && OPTION_LABEL[parts[0]] ? parts[0] : null;
  return { component, prop, option };
}

const files = readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".scss"));

/** 훅 접두어 → 훅 목록. 파일이 아니라 **컴포넌트**가 묶는 단위다. */
const byComponent = new Map();
/** 훅 이름 → 항목. 한 훅이 여러 자리·여러 파일에 걸치면 `places` 만 는다. */
const byName = new Map();

// ⚠️ 한 훅이 **한 파일 안에서 여러 자리**에 걸치는 경우가 있다. `switch--height` 는
//    트랙 높이이면서 썸의 이동 거리 계산에도 들어간다. 자리별로 세면 목록에 두 번
//    올라가고, 소비자는 같은 이름의 훅이 둘 있는 줄 안다.
//    접두어로 묶으므로 이름이 같으면 처음 만난 자리가 소유자다.
for (const file of files.sort()) {
  const scss = readFileSync(join(COMPONENTS_DIR, file), "utf8");

  // ⚠️ `hook(\s*"` — 줄바꿈까지 잡는다. `hook("` 로 세면 놓친다.
  for (const m of scss.matchAll(/hook\(\s*"([a-z0-9-]+)"\s*,/g)) {
    const name = m[1];
    const existing = byName.get(name);
    if (existing) {
      existing.places += 1;
      continue;
    }
    const rawFallback = readArgument(scss, m.index + m[0].length);
    const { component, prop, option } = parse(name);
    const entry = {
      name: `--nui-${name}`,
      fallback: readable(rawFallback),
      prop,
      option: option ? OPTION_LABEL[option].label : null,
      optionKind: option ? OPTION_LABEL[option].kind : null,
      places: 1,
    };
    byName.set(name, entry);
    if (!byComponent.has(component)) byComponent.set(component, []);
    byComponent.get(component).push(entry);
  }
}

const groups = [...byComponent.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, hooks]) => ({
    key,
    label: LABEL[key] ?? key,
    hooks: hooks.sort((a, b) => a.name.localeCompare(b.name)),
  }));
const count = byName.size;

// 라벨을 안 붙인 컴포넌트가 있으면 표에 접두어가 그대로 나온다 — 알린다.
const unlabeled = groups.filter((g) => !LABEL[g.key]).map((g) => g.key);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ count, groups }, null, 2) + "\n", "utf8");
console.log(
  `✅ 공개 훅 추출 완료 — ${count}개 / 컴포넌트 ${groups.length}개 → src/generated/hooks.json`,
);
for (const key of unlabeled) {
  console.warn(`  ⚠️ 접두어 '${key}' 에 표시 이름(LABEL)이 없다`);
}
if (count === 0) {
  console.error("❌ 훅을 하나도 못 찾았다 — 정규식이 낡았다");
  process.exit(1);
}
