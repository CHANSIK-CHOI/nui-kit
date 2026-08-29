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

/** 파일명 → 문서에 보일 컴포넌트 이름. 없으면 파일명을 그대로 쓴다. */
const LABEL = {
  accordion: "Accordion",
  button: "Button · IconButton · ButtonLink",
  "choice-base": "Checkbox · Radio · Switch",
  datepicker: "Datepicker 계열",
  popup: "Popup 계열",
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

const OPTION_LABEL = {
  lg: "large",
  md: "medium (기본)",
  sm: "small",
  round: "round",
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

/** 훅 이름을 {컴포넌트}-{옵션?}-{요소?}-{속성} 으로 쪼갠다 */
function parse(name) {
  const prop = PROPS.find((p) => name === p || name.endsWith(`-${p}`));
  if (!prop) return { prop: name, option: null };

  const parts = name
    .slice(0, name.length - prop.length)
    .split("-")
    .filter(Boolean);
  const option = parts[1] && OPTION_LABEL[parts[1]] ? parts[1] : null;
  return { prop, option };
}

const files = readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".scss"));
const groups = [];
let count = 0;

for (const file of files.sort()) {
  const key = file.replace(/^_/, "").replace(/\.scss$/, "");
  const scss = readFileSync(join(COMPONENTS_DIR, file), "utf8");

  const seen = new Map();
  // ⚠️ `hook(\s*"` — 줄바꿈까지 잡는다. `hook("` 로 세면 놓친다.
  for (const m of scss.matchAll(/hook\(\s*"([a-z0-9-]+)"\s*,/g)) {
    const name = m[1];
    const rawFallback = readArgument(scss, m.index + m[0].length);
    if (seen.has(name)) {
      seen.get(name).places += 1;
      continue;
    }
    const { prop, option } = parse(name);
    seen.set(name, {
      name: `--nui-${name}`,
      fallback: readable(rawFallback),
      prop,
      option: option ? OPTION_LABEL[option] : null,
      places: 1,
    });
  }

  if (seen.size === 0) continue;
  groups.push({
    key,
    label: LABEL[key] ?? key,
    hooks: [...seen.values()].sort((a, b) => a.name.localeCompare(b.name)),
  });
  count += seen.size;
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ count, groups }, null, 2) + "\n", "utf8");
console.log(
  `✅ 공개 훅 추출 완료 — ${count}개 / ${groups.length}개 파일 → src/generated/hooks.json`,
);
