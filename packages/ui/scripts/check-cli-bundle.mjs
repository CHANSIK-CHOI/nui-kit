#!/usr/bin/env node
/**
 * `nui-theme` 번들(`dist/cli.js`)이 **소비자 명령 하나만** 도는가를 잰다. `verify:pkg` 안에서 돈다.
 *
 * ── 무엇을 못 보고 있었나 (scripts.md 「새 스크립트를 쓸 때」 1)
 *    `cli.mjs` 는 `generate.mjs` · `gates.mjs` 를 import 해 파일 하나로 번들된다. 번들 안에서는
 *    모든 모듈의 `import.meta.url` · `process.argv` 가 **CLI 의 것**이 된다. 그래서 라이브러리 모듈에
 *    남아 있던 「직접 실행되면」 판정(`fileURLToPath(import.meta.url) === process.argv[1]`)과
 *    `process.argv.includes("--self-test")` 가 소비자 명령 안에서 참이 될 수 있었다.
 *    publint · attw 는 이것을 못 본다 — 파일 구조와 타입만 보기 때문이다.
 *
 * ── 실제로 났던 일 (v0.2.0 · 2026-09-26 실측)
 *    `pnpm dlx` · `yarn dlx` · yarn 4 PnP 는 심볼릭 `.bin` 없이 **실제 경로**로 `dist/cli.js` 를 부른다.
 *    그때 generate 의 명령 블록까지 돌아 `--preset 42` 는 패키지 밖 `presets.json` ENOENT 로 죽고,
 *    `--accent` 는 패키지 안에 `dist/nui-theme.css` 를 썼다(읽기 전용이면 EROFS).
 *    npm · pnpm 설치 프로젝트는 `.bin` 링크를 거쳐 argv[1] 이 달라서 드러나지 않았다.
 *
 * ── 무엇을 보나
 *    ■ 정적 — 번들에 `process.argv[1]` 비교와 `--self-test` 판정이 없다
 *    ■ 실행 — 실제 경로 · 심볼릭 링크 두 꼴로 `--preset` · `--accent` 를 부른다. 셋을 본다:
 *      exit 0 · 기본 출력 `./nui-theme.css` 가 생겼다 · **패키지 폴더에 새 파일이 없다**
 *
 * 검출력 시험: `node scripts/check-cli-bundle.mjs --selftest`
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const PKG = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLI = join(PKG, "dist", "cli.js");
const SELFTEST = process.argv.includes("--selftest");

let checks = 0;
let failures = 0;
let runs = 0;
let pkgWrites = 0;
process.on("exit", (code) => {
  console.log(
    `RECEIPT check-cli-bundle${SELFTEST ? "-selftest" : ""} checks=${checks} runs=${runs} pkgWrites=${pkgWrites} failures=${failures} exit=${code}`,
  );
});

const ok = (msg) => {
  checks += 1;
  console.log(`  ✅ ${msg}`);
};
const bad = (msg) => {
  checks += 1;
  failures += 1;
  console.log(`  ❌ ${msg}`);
};

/** 번들 문자열에서 「라이브러리 모듈이 스스로 도는」 흔적을 찾는다. 걸린 규칙 이름을 돌려준다. */
const RULES = [
  {
    name: "argv[1] 비교 — 직접 실행 판정",
    // 압축본: `Hr(import.meta.url)===process.argv[1]` · 원본: `=== process.argv[1]`
    // `process.argv[10]` 같은 다른 자리는 잡지 않는다
    re: /process\.argv\[1\](?!\d)/,
  },
  {
    name: "--self-test 판정 — 검사용 진입점",
    re: /["'`]--self-?test["'`]/,
  },
];
const scan = (src) => RULES.filter((r) => r.re.test(src)).map((r) => r.name);

if (SELFTEST) {
  // 위반 둘 · 통과 둘 · 함정 하나 (scripts.md §4)
  const cases = [
    [
      "위반 1 · v0.2.0 압축본의 isMain",
      "Sp=Hr(import.meta.url)===process.argv[1];if(Sp){let o=process.argv.slice(2)",
      1,
    ],
    [
      "위반 2 · v0.2.0 압축본의 self-test",
      'process.argv.includes("--self-test")&&await mp()',
      1,
    ],
    [
      "통과 1 · cli.mjs 의 인자 읽기",
      'let o=process.argv.slice(2);o[0]==="theme"&&o.shift()',
      0,
    ],
    ["통과 2 · 도움말 플래그", 'o.includes("--help")', 0],
    ["함정 · 다른 자리의 argv", "let x=process.argv[10]", 0],
  ];
  console.log("■ 검출력 — 합성 번들 문자열");
  for (const [name, src, want] of cases) {
    const got = scan(src).length;
    got === want
      ? ok(`${name} — 걸림 ${got}/${want}`)
      : bad(`${name} — 걸림 ${got}/${want}`);
  }
  process.exit(failures ? 1 : 0);
}

if (!existsSync(CLI)) {
  console.log(
    `❌ ${relative(process.cwd(), CLI)} 가 없다 — npm run build:js 부터`,
  );
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
console.log("■ 정적 — 번들 안에 라이브러리 모듈의 진입점이 없다");
const bundle = readFileSync(CLI, "utf8");
const hits = scan(bundle);
for (const r of RULES) {
  hits.includes(r.name)
    ? bad(
        `${r.name} 이 dist/cli.js 에 남았다 — 진입점을 라이브러리 모듈 밖으로 뺀다`,
      )
    : ok(`${r.name} 없음`);
}

// ─────────────────────────────────────────────────────────────
console.log("■ 실행 — 실제 경로(pnpm dlx · yarn dlx · PnP 꼴)와 링크(.bin 꼴)");

/** 패키지 폴더의 파일 목록 — node_modules 는 빼고 dist · styles · 루트만 본다 */
function listPkg() {
  const out = new Set();
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name === "src") continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else out.add(relative(PKG, p));
    }
  };
  walk(PKG);
  return out;
}

const work = mkdtempSync(join(tmpdir(), "nui-cli-bundle-"));
const link = join(work, "nui-theme");
symlinkSync(CLI, link);
const presetCss = readFileSync(
  join(PKG, "styles", "themes", "preset-42.css"),
  "utf8",
);

const scenarios = [
  ["실제 경로", CLI, ["--preset", "42"], (css) => css === presetCss],
  [
    "실제 경로",
    CLI,
    ["--accent", "#b1002a"],
    (css) => css.includes("--nui-color-brand-9:"),
  ],
  // 소비자가 우연히 같은 이름의 플래그를 넘겨도 검사용 진입점이 돌지 않는다
  [
    "실제 경로",
    CLI,
    ["--preset", "42", "--self-test"],
    (css) => css === presetCss,
  ],
  ["링크", link, ["--preset", "42"], (css) => css === presetCss],
  [
    "링크",
    link,
    ["--accent", "#b1002a"],
    (css) => css.includes("--nui-color-brand-9:"),
  ],
];

const before = listPkg();
try {
  scenarios.forEach(([how, bin, args, verify], i) => {
    // `--out` 은 주지 않는다 — 소비자의 기본 꼴(./nui-theme.css)이고, 옛 번들의 generate 블록도
    // `--out` 을 읽어 같은 자리에 써 버려서 패키지 쓰기가 가려진다(실측)
    const cwd = join(work, `run-${i}`);
    mkdirSync(cwd);
    const out = join(cwd, "nui-theme.css");
    const r = spawnSync(process.execPath, [bin, ...args, "--no-apply"], {
      cwd,
      encoding: "utf8",
    });
    runs += 1;
    const label = `${how} · ${args.join(" ")}`;
    const stray = (r.stdout + r.stderr).match(
      /색 102개 생성|ENOENT|EROFS|gates-self-test/,
    );
    if (r.status !== 0) {
      bad(
        `${label} — exit ${r.status}: ${(r.stderr || r.stdout).trim().split("\n")[0]}`,
      );
    } else if (!existsSync(out) || !verify(readFileSync(out, "utf8"))) {
      bad(`${label} — ./nui-theme.css 가 없거나 내용이 틀렸다`);
    } else if (stray) {
      bad(`${label} — 다른 진입점의 출력이 섞였다: 「${stray[0]}」`);
    } else {
      ok(`${label} — exit 0 · ./nui-theme.css 확인`);
    }
  });
} finally {
  const after = listPkg();
  const added = [...after].filter((f) => !before.has(f));
  pkgWrites = added.length;
  if (added.length) {
    bad(
      `패키지 폴더에 새 파일 ${added.length}개 — ${added.join(", ")} (지운다)`,
    );
    for (const f of added) rmSync(join(PKG, f), { force: true });
  } else {
    ok("패키지 폴더에 새 파일 0개");
  }
  rmSync(work, { recursive: true, force: true });
}

process.exit(failures ? 1 : 0);
