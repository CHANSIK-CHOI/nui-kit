#!/usr/bin/env node
/**
 * 문서 사이트 구조 검사.
 *
 * ⚠️ **문자열 하나로 판정이 나는 것만 넣는다** (docs-voice 규칙 §6).
 *    「층이 섞였는가」 · 「말투가 맞는가」는 사람이 읽어야 안다. 그런 것을 넣으면
 *    헛짚기만 늘고 아무도 검사를 안 믿게 된다.
 *
 * 규칙을 더할 때는 **먼저 돌려서 헛짚는 비율을 재고** 0 이 아니면 넣지 않는다.
 * 여섯 규칙 전부 도입 시점에 헛짚기 0 이었다 (2026-09-08).
 *
 *   node apps/docs/scripts/check-docs.mjs
 *   npm run verify:docs
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { globSync } from "node:fs";

// ⚠️ 한글 경로가 `import.meta.url` 에서 percent-encoding 된다 — fileURLToPath 를 쓴다
const HERE = dirname(fileURLToPath(import.meta.url));
const DOCS = join(HERE, "..");
const APP = join(DOCS, "src", "app");

const read = (p) => readFileSync(p, "utf8");
const glob = (pattern) =>
  globSync(pattern, { cwd: DOCS }).map((p) => join(DOCS, p));

/** 코드 샘플(템플릿 리터럴)은 화면이 아니라 글이다. 반례(❌)도 거기 산다 */
const stripSamples = (s) => s.replace(/`(?:[^`\\]|\\.)*`/gs, "``");

const failures = [];
const fail = (rule, detail) => failures.push({ rule, detail });
let checked = 0;

// ── nav 가 단일 출처다
const nav = read(join(DOCS, "src/site/nav.ts"));
const navHrefs = [...nav.matchAll(/href: "([^"]+)"/g)].map((m) => m[1]);

const pageFileFor = (href) => {
  if (href === "/") return join(APP, "page.tsx");
  const seg = href.replace(/^\//, "");
  for (const ext of ["tsx", "mdx"]) {
    const p = join(APP, seg, `page.${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
};

console.log("\n■ 사이드바 ↔ 페이지 파일");
for (const href of navHrefs) {
  if (href.includes("[")) continue;
  checked++;
  if (!pageFileFor(href))
    fail("nav→파일", `${href} 에 해당하는 page 파일이 없다`);
}
console.log(`  ${navHrefs.length}개 항목`);

console.log("\n■ 페이지 파일 ↔ 사이드바");
const pageFiles = [
  ...glob("src/app/**/page.tsx"),
  ...glob("src/app/**/page.mdx"),
];
let pageCount = 0;
for (const p of pageFiles) {
  const rel = relative(APP, p).replace(/\/page\.(tsx|mdx)$/, "");
  if (rel.includes("[")) continue;
  const href = rel === "page.tsx" || rel === "" ? "/" : `/${rel}`;
  checked++;
  pageCount++;
  if (!navHrefs.includes(href))
    fail("파일→nav", `${href} 가 nav.ts 에 없다 — 사이드바에서 닿지 않는다`);
}
console.log(`  ${pageCount}개 페이지`);

console.log("\n■ 컴포넌트 개요의 카드 링크");
const overview = read(join(APP, "components/page.tsx"));
const cardHrefs = [...overview.matchAll(/href: "(\/components\/[^"]+)"/g)].map(
  (m) => m[1],
);
for (const href of cardHrefs) {
  checked++;
  if (!navHrefs.includes(href))
    fail(
      "개요 카드",
      `${href} 가 nav.ts 에 없다 — 페이지를 나눌 때 놓친 자리다`,
    );
}
console.log(`  ${cardHrefs.length}개 카드`);

console.log("\n■ 접근성 검사가 보는 경로");
const a11y = read(join(HERE, "check-a11y.mjs"));
const a11yPaths = new Set(
  [...a11y.matchAll(/"(\/components\/[a-z-]+)"/g)].map((m) => m[1]),
);
// ⚠️ 0건이면 정규식이 늙은 것이다 — 「검사한 것만 통과」가 되지 않게 막는다
if (a11yPaths.size === 0)
  fail(
    "검사 경로",
    "check-a11y.mjs 에서 경로를 하나도 못 읽었다 — 정규식을 확인하라",
  );
for (const path of a11yPaths) {
  checked++;
  if (!navHrefs.includes(path))
    fail(
      "검사 경로",
      `check-a11y.mjs 가 ${path} 를 본다 — 그 페이지가 없다. 페이지를 옮기면 검사도 옮긴다`,
    );
}
console.log(`  ${a11yPaths.size}개 경로`);

console.log("\n■ 컴포넌트 라우트마다 예시가 있나");
const routes = globSync("src/app/components/*/", { cwd: DOCS });
for (const dir of routes) {
  // ⚠️ globSync 의 `*/` 결과에는 끝 슬래시가 없다 — 붙여야 자식을 찾는다
  const files = globSync(`${dir}/*.tsx`, { cwd: DOCS });
  const s = files.map((f) => read(join(DOCS, f))).join("\n");
  checked++;
  if (!/code=\{`|<Example\b|doc-code/.test(s))
    fail("예시 없음", `${dir} 에 예제가 하나도 없다`);
}
console.log(`  ${routes.length}개 라우트`);

console.log("\n■ 라벨이 행동을 말하나");
let labelCount = 0;
// design-system.md §11-1 — 버튼은 행동 동사다. 예시가 곧 소비자가 베끼는 문장이다.
const BAN = new Set(["확인", "예", "아니오", "라벨", "텍스트", "버튼", "클릭"]);
for (const p of glob("src/app/**/*.tsx")) {
  const s = stripSamples(read(p));
  const rel = relative(APP, p);
  for (const m of s.matchAll(
    /<(Button|ButtonLink)\b[^>]*>\s*([^<>{}\n]{1,12}?)\s*<\/\1>/g,
  )) {
    checked++;
    labelCount++;
    if (BAN.has(m[2].trim()))
      fail(
        "라벨",
        `${rel} — <${m[1]}>${m[2].trim()}</${m[1]}> 는 행동이 아니다`,
      );
  }
  for (const m of s.matchAll(
    /(confirmLabel|cancelLabel|closeLabel)="([^"]{1,10})"/g,
  )) {
    checked++;
    labelCount++;
    if (BAN.has(m[2]))
      fail("라벨", `${rel} — ${m[1]}="${m[2]}" 는 행동이 아니다`);
  }
}

console.log(`  라벨 ${labelCount}개`);

console.log("\n■ 설치 안내가 required peer 를 전부 담았나");
// ⚠️ 2026-09-09 — `lucide-react` 를 peer 로 올렸을 때 README 만 고치고 문서 사이트
//    두 곳을 놓쳤다. 안내대로 설치한 pnpm · yarn 소비자는 빌드가 깨진다.
//    peer 목록은 package.json 이 정본이다 — 손으로 적은 목록을 믿지 않는다.
{
  const pkg = JSON.parse(
    read(join(DOCS, "..", "..", "packages", "ui", "package.json")),
  );
  const optional = new Set(Object.keys(pkg.peerDependenciesMeta ?? {}));
  const required = Object.keys(pkg.peerDependencies ?? {}).filter(
    (name) => !optional.has(name),
  );
  // 설치 명령을 담은 페이지 — 여기가 늘면 목록에 더한다.
  // README 둘도 본다 (2026-09-15) — 루트 README 의 `npm i @nui-kit/react` 가 lucide-react 를 빠뜨린 채
  // 석 달 있었다. 루트는 GitHub 첫 화면, packages/ui 는 npm 에 실리는 것(package.json `files`)이다.
  const ROOT = join(DOCS, "..", "..");
  const INSTALL_PAGES = [
    ["get-started/page.mdx", join(APP, "get-started/page.mdx")],
    ["page.tsx", join(APP, "page.tsx")],
    ["README.md", join(ROOT, "README.md")],
    ["packages/ui/README.md", join(ROOT, "packages", "ui", "README.md")],
  ];
  for (const [rel, file] of INSTALL_PAGES) {
    if (!existsSync(file)) {
      fail("설치 안내", `${rel} — 파일이 없다. 목록을 고친다`);
      continue;
    }
    const body = read(file);
    for (const name of required) {
      checked++;
      // react·react-dom 은 소비자가 이미 갖고 있으므로 설치 명령에 안 적는다.
      if (name === "react" || name === "react-dom") continue;
      if (!body.includes(name))
        fail("설치 안내", `${rel} — required peer \`${name}\` 이 안 적혀 있다`);
    }
  }
  console.log(
    `  required peer ${required.length}개 × 페이지 ${INSTALL_PAGES.length}`,
  );

  // 루트 README 가 손으로 적은 수 — 컴포넌트 N종 ↔ props.json · 래퍼 N종 ↔ rhf.ts (2026-09-15 · 40/13 이 41/12 였다)
  {
    const readme = read(join(ROOT, "README.md"));
    const props = JSON.parse(read(join(DOCS, "src/generated/props.json")));
    const rhf = read(join(ROOT, "packages", "ui", "src", "rhf.ts"));
    const rhfCount = (rhf.match(/export \{ default as RHF/g) ?? []).length;
    const claims = [
      [
        /컴포넌트 \*\*(\d+)종\*\*/,
        Object.keys(props).length,
        "컴포넌트 (props.json)",
      ],
      [/래퍼 \*\*(\d+)종\*\*/, rhfCount, "RHF 래퍼 (rhf.ts)"],
    ];
    let n = 0;
    for (const [re, real, what] of claims) {
      const m = readme.match(re);
      checked++;
      n++;
      if (!m)
        fail(
          "README 수",
          `README.md — 「${what}」 문장을 못 읽었다. 정규식을 확인하라`,
        );
      else if (Number(m[1]) !== real)
        fail(
          "README 수",
          `README.md — ${what} 이 ${real} 인데 ${m[1]} 이라고 적혀 있다`,
        );
    }
    console.log(`  README 의 수 ${n}개`);
  }
}

console.log("\n■ 도움말·에러 문구가 다음 행동을 지시하나");
// design-system.md §11-1 · docs-voice.md §3 — 에러는 잘못을 알리는 것이 아니라 다음 행동을 알리는 것이다.
// 「번호가 잘못됐습니다」✗ 「10-11자리로 입력해 주세요」✓. 도입 전 실측 1건(「필수 입력 항목입니다.」) · 헛짚기 0 (2026-09-11).
let msgCount = 0;
for (const p of glob("src/app/**/*.tsx")) {
  const s = stripSamples(read(p));
  const rel = relative(APP, p);
  for (const m of s.matchAll(/(errorMessage|helpText)="([^"]{2,80})"/g)) {
    checked++;
    msgCount++;
    if (!/(세요|십시오|시오)\.?$/.test(m[2].trim()))
      fail(
        "문구",
        `${rel} — ${m[1]}="${m[2]}" 는 행동을 지시하지 않는다 (design-system.md §11-1)`,
      );
  }
}
console.log(`  문구 ${msgCount}개`);

console.log("\n■ 폭 규칙의 예외에 배지가 있나");
// design-system.md §7 표 — 부모 폭을 채우지 않는 것은 페이지 머리에 예외 배지를 둔다
// (docs-voice §4 「공통 규칙에서 벗어나면 배지」). 2026-09-09 에 「상한이 있는 폭」 다섯이
// 통째로 빠져 있었다. 표가 바뀌면 이 목록을 같이 고친다 — 규칙 문서는 프라이빗이라
// 여기서 읽지 못한다.
{
  const WIDTH_BADGES = {
    // 자기 치수
    switch: "ownSize",
    checkbox: "ownSize",
    radio: "ownSize",
    "icon-button": "ownSize",
    // 상한이 있는 폭 — Toast(420) · Popup 패널(360·480·640)
    toast: "cappedWidth",
    "layer-popup": "cappedWidth",
    alert: "cappedWidth",
    confirm: "cappedWidth",
    "bottom-sheet": "cappedWidth",
    // 내용 폭
    tooltip: "contentWidth",
    button: "contentWidth",
    "button-link": "contentWidth",
  };
  let n = 0;
  for (const [slug, kind] of Object.entries(WIDTH_BADGES)) {
    checked++;
    n++;
    const file = join(APP, "components", slug, "page.tsx");
    if (!existsSync(file)) {
      fail("폭 배지", `${slug} — 페이지가 없다. 목록을 고친다`);
      continue;
    }
    if (!read(file).includes(`kind: "${kind}"`))
      fail(
        "폭 배지",
        `/components/${slug} — \`${kind}\` 배지가 없다 (design-system.md §7)`,
      );
  }
  console.log(`  ${n}개 페이지`);
}

console.log("\n■ 문서가 적은 토큰 · 값 · export 가 생성물과 같은가");
// 2026-09-12 — Foundations 전수에서 여덟 페이지가 사실 오류였다. `font-size-1 (12px)` · `duration-7` ·
// `PopupBase` 처럼 전부 grep 한 번이면 잡히는 종류였는데 사람이 읽어서 찾았다.
// 정본은 생성물(tokens.json · hooks.json)과 컴포넌트 index.ts 다 — 손으로 적은 표를 믿지 않는다.
// 도입 전 실측: 첫 실행 헛짚기 5 (접두만 적은 `--nui-size-icon` · CSS 속성 `z-index` ×3 · JS 가 세우는
// `--nui-field-grid-columns`) → 셋을 좁혀 0. 합성 시험(위반 6 · 통과 5 · 함정 4) 통과. `--selftest` 로 다시 돈다.
// (e) 2026-09-15 — 문서가 적은 `@nui-kit/react/styles/…` 경로. `styles/presets/42.css` 가 두 페이지에 살아
//     있었다(실재는 `styles/themes/preset-42.css`). 정본은 `src/styles/entries/*.scss`(→ `styles/<name>.css`)와
//     presets.json 의 번호(→ `styles/themes/preset-<n>.css`). 도입 전 실측: 현재 트리 15건 · 헛짚기 0.
{
  const tokens = JSON.parse(read(join(DOCS, "src/generated/tokens.json")));
  const hooks = JSON.parse(read(join(DOCS, "src/generated/hooks.json")));
  const presets = JSON.parse(read(join(DOCS, "src/generated/presets.json")));
  const presetNumbers = new Set(presets.presets.map((p) => p.n));
  const cssEntries = new Set(
    globSync("../../packages/ui/src/styles/entries/*.scss", { cwd: DOCS }).map(
      (p) => p.replace(/^.*\//, "").replace(/\.scss$/, ""),
    ),
  );
  if (cssEntries.size === 0)
    fail(
      "styles 경로",
      "src/styles/entries 를 하나도 못 읽었다 — 경로를 확인하라",
    );
  /** `styles/<entry>.css` 또는 `styles/themes/preset-<n>.css` 만 실재한다. `*` 가 든 글로브는 판정하지 않는다 */
  const stylePathOk = (path) => {
    if (path.includes("*")) return null;
    const entry = path.match(/^([a-z]+)\.css$/);
    if (entry) return cssEntries.has(entry[1]);
    const theme = path.match(/^themes\/preset-(\d+)\.css$/);
    if (theme) return presetNumbers.has(Number(theme[1]));
    return false;
  };
  const tokenValue = new Map();
  for (const list of Object.values(tokens))
    for (const t of list)
      tokenValue.set(t.name.replace(/^--nui-/, ""), t.value);
  const known = new Set(tokenValue.keys());
  for (const g of Object.values(hooks.groups ?? {}))
    for (const h of g.hooks ?? g)
      if (h?.name) known.add(String(h.name).replace(/^--nui-/, ""));
  // 컴포넌트가 JS 로 세우는 변수(`pv("field-grid-columns")`)도 실재한다 — SCSS 훅 목록에는 없다
  for (const p of globSync("../../packages/ui/src/components/**/*.tsx", {
    cwd: DOCS,
  }))
    for (const m of read(join(DOCS, p)).matchAll(/\bpv\("([a-z0-9-]+)"\)/g))
      known.add(m[1]);
  // 접두만 적은 것(`startsWith("--nui-size-icon")`)은 이름이 아니다
  const isPrefixOnly = (name) => {
    for (const k of known) if (k.startsWith(name + "-")) return true;
    return false;
  };
  // 토큰처럼 생긴 CSS 속성 이름 — `<code>z-index</code>`
  const CSS_PROPS = new Set([
    "z-index",
    "text-align",
    "text-decoration",
    "border-color",
    "border-width",
    "border-radius",
    "color-scheme",
  ]);
  // 토큰 이름의 첫 마디 — 이것으로 시작하는 <code> · doc-token-name 만 토큰으로 본다
  const PREFIX =
    /^(space|radius|font-size|line-height|letter-spacing|font-weight|font-family|size|duration|easing|shadow|focus|z|layer|surface|text|border|control|action|status|color|scale)-[a-z0-9-]+$/;
  const pxOf = (name) => {
    const v = tokenValue.get(name);
    if (!v) return null;
    const m = v.match(/^([\d.]+)(rem|px)$/);
    if (!m) return null;
    return m[2] === "rem"
      ? Math.round(Number(m[1]) * 16 * 100) / 100
      : Number(m[1]);
  };
  // 서브패스 → 컴포넌트 폴더. get-started 의 export 표가 이것을 본다.
  // 폴더 index.ts 가 아니라 엔트리 파일에서만 나가는 것(`/next` · `/rhf`)은 `{ entry }` 로 적는다
  const SUBPATH_DIR = {
    button: "Button",
    next: { entry: "next.ts" },
    rhf: { entry: "rhf.ts" },
    field: "Field",
    textfield: "Textfield",
    textarea: "Textarea",
    checkbox: "Checkbox",
    radio: "Radio",
    switch: "Switch",
    popup: "Popup",
    toast: "Toast",
    tooltip: "Tooltip",
    accordion: "Accordion",
    select: "Select",
    datepicker: "Datepicker",
    icon: "Icon",
  };
  const exportsOf = (dir) => {
    const UI_SRC = join(DOCS, "..", "..", "packages", "ui", "src");
    const file =
      typeof dir === "string"
        ? join(UI_SRC, "components", dir, "index.ts")
        : join(UI_SRC, dir.entry);
    const src = read(file).replace(/export\s+type\s*\{[^}]*\}[^;]*;/g, ""); // 타입은 값이 아니다
    const names = new Set();
    for (const m of src.matchAll(/export\s*\{([^}]*)\}/g))
      for (const raw of m[1].split(",")) {
        const n = raw
          .trim()
          .replace(/^default as /, "")
          .replace(/^type /, "");
        if (n) names.add(n);
      }
    return names;
  };

  /** 한 파일의 위반을 돌려준다 — --selftest 가 합성 문자열로 같은 함수를 부른다 */
  const checkText = (s, rel) => {
    const out = [];
    const body = s.replace(/^\s*\/\/.*$/gm, ""); // 주석은 화면이 아니다
    // (a) --nui-… 전체 이름. 뒤가 잘린 것(동적 조립 · replace 접두)은 판정하지 않는다
    for (const m of body.matchAll(/--nui-([a-z0-9-]+)/g)) {
      const name = m[1];
      if (name.startsWith("_") || name.endsWith("-") || isPrefixOnly(name))
        continue;
      out.push([
        "tokens",
        `${rel} — \`--nui-${name}\` 은 토큰에도 훅에도 없다`,
        known.has(name),
      ]);
    }
    // (b) <code>·doc-token-name·백틱 안의 토큰 이름
    const spans = [
      ...[...body.matchAll(/<code>([^<]+)<\/code>/g)].map((m) => m[1]),
      ...[...body.matchAll(/doc-token-name">([^<]+)<\/span>/g)].map(
        (m) => m[1],
      ),
      ...[...body.matchAll(/`([^`\n]+)`/g)].map((m) => m[1]),
    ];
    for (const raw of spans) {
      const name = raw.trim().replace(/^--nui-/, "");
      if (!PREFIX.test(name) || CSS_PROPS.has(name)) continue;
      out.push([
        "tokens",
        `${rel} — \`${name}\` 은 토큰에도 훅에도 없다`,
        known.has(name),
      ]);
    }
    // (c) 토큰 옆에 적은 px — `font-size-1</code> (13px)` · `size-icon-lg</span> 16px`
    for (const m of body.matchAll(
      /(?:<code>|doc-token-name">)(?:--nui-)?([a-z0-9-]+)<\/(?:code|span)>\s*\(?\s*(\d+(?:\.\d+)?)px/g,
    )) {
      const real = pxOf(m[1]);
      if (real === null) continue;
      out.push([
        "tokens",
        `${rel} — \`${m[1]}\` 은 ${real}px 인데 ${m[2]}px 라고 적혀 있다`,
        real === Number(m[2]),
      ]);
    }
    // (d) 서브패스 export 표 — | `/button` | `Button` `IconButton` … |
    for (const m of body.matchAll(/^\|\s*`\/([a-z-]+)`\s*\|([^|\n]*)\|/gm)) {
      const dir = SUBPATH_DIR[m[1]];
      if (!dir) continue;
      const have = exportsOf(dir);
      for (const n of [...m[2].matchAll(/`([A-Za-z][A-Za-z0-9]*)`/g)].map(
        (x) => x[1],
      ))
        out.push([
          "export 표",
          `${rel} — \`/${m[1]}\` 에 \`${n}\` 이 없다 (index.ts)`,
          have.has(n),
        ]);
    }
    // (e) `@nui-kit/react/styles/…` 경로 — 코드 샘플 안도 본다. 소비자가 그대로 베끼는 줄이다
    for (const m of body.matchAll(
      /@nui-kit\/react\/styles\/([A-Za-z0-9/._*-]+)/g,
    )) {
      const ok = stylePathOk(m[1]);
      if (ok === null) continue;
      out.push([
        "styles 경로",
        `${rel} — \`styles/${m[1]}\` 은 패키지에 없다 (entries/*.scss · themes/preset-<n>.css)`,
        ok,
      ]);
    }
    // (f) 페이지 머리말의 import 예시 — `<GuideHeader named={[…]} subpath="…" />` (2026-09-17)
    //     `GuideHeader` 가 이 이름들로 `import { … } from "@nui-kit/react"` 를 **문자열로** 그린다.
    //     소비자가 그대로 베끼는 줄인데 문자열이라 tsc 도 빌드도 못 본다 — `Alert` · `Confirm` export 를
    //     지운 뒤 두 페이지가 없는 이름을 import 하라고 안내하고 있었다(qa 가 잡았다).
    //     서브패스가 없으면(배럴만) 대조할 폴더가 없어 판정하지 않는다.
    for (const m of body.matchAll(/<GuideHeader\b[\s\S]*?\/>/g)) {
      const named = m[0].match(/named=\{\[([^\]]*)\]\}/);
      const sub = m[0].match(/subpath="([a-z-]+)"/);
      const dir = sub && SUBPATH_DIR[sub[1]];
      if (!named || !dir) continue;
      const have = exportsOf(dir);
      for (const n of [...named[1].matchAll(/"([A-Za-z][A-Za-z0-9.]*)"/g)].map(
        (x) => x[1],
      ))
        out.push([
          "머리말 import",
          `${rel} — 머리말이 \`${n}\` 을 import 하라고 하는데 \`/${sub[1]}\` 에 없다 (index.ts)`,
          have.has(n.split(".")[0]),
        ]);
    }
    return out;
  };

  if (process.argv.includes("--selftest")) {
    // 검출력 시험 — 위반 6 · 통과 5 · 함정 4. 0건 통과는 증거가 아니다 (scripts.md §4)
    const cases = [
      ["<code>duration-7</code>", 1], // 위반 — 지운 토큰
      ["<code>font-size-1</code> (12px)", 1], // 위반 — 값이 틀렸다
      ["| `/popup` | `PopupBase` `LayerPopup` |", 1], // 위반 — 없는 export (`Alert` 는 2026-09-17 에 export 가 빠져 짝에서 뺐다)
      ["var(--nui-radius-sm)", 1], // 위반 — 옛 이름
      ['import "@nui-kit/react/styles/presets/42.css";', 1], // 위반 — 없는 경로 (2026-09-15 실제 사례)
      ['import "@nui-kit/react/styles/themes/preset-999.css";', 1], // 위반 — 없는 프리셋 번호
      ["<code>font-size-1</code> (13px)", 0], // 통과
      ['<span className="doc-token-name">size-icon-lg</span> 16px', 0], // 통과
      ["| `/select` | `Select` `MultiSelect` |", 0], // 통과
      ['import "@nui-kit/react/styles/index.css";', 0], // 통과 — 엔트리
      ['import "@nui-kit/react/styles/themes/preset-42.css";', 0], // 통과 — 프리셋
      ["var(--nui-font-size-${s.n})", 0], // 함정 — 동적 조립은 판정 안 함
      ['<code>variant="text"</code>', 0], // 함정 — 토큰 모양이 아니다
      ["<code>z-index</code> 를 직접 쓰지 않는다", 0], // 함정 — CSS 속성이지 토큰이 아니다
      ["`@nui-kit/react/styles/*.css` 로 열려 있다", 0], // 함정 — 글로브는 경로가 아니다
      [
        '<GuideHeader title="Alert" named={["useAlert", "Alert"]} subpath="popup" />',
        1,
      ], // 위반 — 지운 export (2026-09-17 실제 사례)
      [
        '<GuideHeader\n  title="X"\n  named={["Nope"]}\n  subpath="select"\n/>',
        1,
      ], // 위반 — 여러 줄
      ['<GuideHeader title="Alert" named={["useAlert"]} subpath="popup" />', 0], // 통과 — 훅
      [
        '<GuideHeader title="Search" named={["Search", "Password"]} subpath="textfield" />',
        0,
      ], // 통과 — 서브패스가 다른 폴더
      ['<GuideHeader title="Popup" named={["Nope"]} />', 0], // 함정 — 서브패스가 없으면 판정 안 함
    ];
    let bad = 0;
    for (const [text, expect] of cases) {
      const got = checkText(text, "selftest").filter(([, , ok]) => !ok).length;
      if (got !== expect) {
        bad++;
        console.log(`  ❌ selftest: ${text} → 위반 ${got} (기대 ${expect})`);
      }
    }
    console.log(
      bad ? `  selftest 실패 ${bad}건` : `  selftest 통과 ${cases.length}건`,
    );
    if (bad) process.exit(1);
  }

  let n = 0;
  for (const p of [...glob("src/app/**/*.tsx"), ...glob("src/app/**/*.mdx")]) {
    const rel = relative(APP, p);
    for (const [rule, detail, ok] of checkText(read(p), rel)) {
      checked++;
      n++;
      if (!ok) fail(rule, detail);
    }
  }
  if (n === 0)
    fail("tokens", "토큰 언급을 하나도 못 읽었다 — 정규식을 확인하라");
  console.log(`  토큰 · 값 · export 언급 ${n}개`);
}

console.log(`\n검사 ${checked}건`);
// 영수증 — 마지막 줄. 없으면 끝까지 안 돈 것이다. 호출자는 이 줄로 완주를 판정한다 (2026-09-11).
const receipt = (exit) =>
  `RECEIPT check-docs checks=${checked} failures=${failures.length} exit=${exit}`;
if (failures.length === 0) {
  console.log("\n✅ 문서 구조 검사 통과\n");
  console.log(receipt(0));
  process.exit(0);
}
console.log("");
for (const f of failures) console.log(`  ❌ [${f.rule}] ${f.detail}`);
console.log(`\n❌ ${failures.length}건\n`);
console.log(receipt(1));
process.exit(1);
