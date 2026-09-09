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
  // 설치 명령을 담은 페이지 — 여기가 늘면 목록에 더한다
  const INSTALL_PAGES = ["get-started/page.mdx", "page.tsx"];
  for (const rel of INSTALL_PAGES) {
    const file = join(APP, rel);
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
  console.log(`  required peer ${required.length}개 × 페이지 ${INSTALL_PAGES.length}`);
}

console.log("\n■ 폭 규칙의 예외에 배지가 있나");
// design-system.md §7 표 — 부모 폭을 채우지 않는 것은 페이지 머리에 예외 배지를 둔다
// (docs-voice §4 「공통 규칙에서 벗어나면 배지」). 2026-09-09 에 「상한이 있는 폭」 다섯이
// 통째로 빠져 있었다. 표가 바뀌면 이 목록을 같이 고친다 — 규칙 문서는 프라이빗이라
// 여기서 읽지 못한다.
{
  const WIDTH_BADGES = {
    // 자기 치수
    switch: "ownSize", checkbox: "ownSize", radio: "ownSize", "icon-button": "ownSize",
    // 상한이 있는 폭 — Toast(420) · Popup 패널(360·480·640)
    toast: "cappedWidth", "layer-popup": "cappedWidth", alert: "cappedWidth",
    confirm: "cappedWidth", "bottom-sheet": "cappedWidth",
    // 내용 폭
    tooltip: "contentWidth", button: "contentWidth", "button-link": "contentWidth",
  };
  let n = 0;
  for (const [slug, kind] of Object.entries(WIDTH_BADGES)) {
    checked++; n++;
    const file = join(APP, "components", slug, "page.tsx");
    if (!existsSync(file)) { fail("폭 배지", `${slug} — 페이지가 없다. 목록을 고친다`); continue; }
    if (!read(file).includes(`kind: "${kind}"`))
      fail("폭 배지", `/components/${slug} — \`${kind}\` 배지가 없다 (design-system.md §7)`);
  }
  console.log(`  ${n}개 페이지`);
}

console.log(`\n검사 ${checked}건`);
if (failures.length === 0) {
  console.log("\n✅ 문서 구조 검사 통과\n");
  process.exit(0);
}
console.log("");
for (const f of failures) console.log(`  ❌ [${f.rule}] ${f.detail}`);
console.log(`\n❌ ${failures.length}건\n`);
process.exit(1);
