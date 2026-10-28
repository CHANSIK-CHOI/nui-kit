#!/usr/bin/env node
// PR 이 바꾼 파일에 걸린 knip 지적만 경고로 보인다 — 안 쓰는 export · 파일 · 의존. CI `lint` 잡이 부른다.
//
//   node .github/scripts/knip-changed.mjs --base <ref>     # 예: origin/dev. merge-base(ref, HEAD)..HEAD
//
// 왜 바뀐 파일에만인가 — 지금 트리에 지적이 이미 48 건 있다(2026-10-27, origin/dev 7b7cdde). 한꺼번에 고치지
//   않고 고치는 파일부터 맞춘다. 트리 전체는 `npm run knip` 으로 본다. 목록 규칙은 lint-changed.sh 의 --base 와
//   같고, 의존 지적이 package.json 에 붙어 그 파일도 목록에 넣는다.
// 왜 경고인가 — knip 은 저장소 안의 import 만 본다. 문자열로 가져오는 곳(esbuild stdin, 소스를 이름으로 읽는
//   문서 추출기)은 못 봐 헛짚는다. 입구 설정(knip.jsonc) 뒤 헛짚기는 48 건 가운데 1 건이었고 그 자리도 입구에
//   넣었다. 새 헛짚기가 커밋을 막지 않게 처음엔 경고로 둔다.
// 못 보는 것 — 파일 A 의 import 를 지워 파일 B 의 export 가 안 쓰이게 된 PR 은 B 가 안 바뀌어 안 보인다.
//   트리 전체 실행이 잡는다.
// 영수증 — 마지막 줄 `RECEIPT knip-changed mode=base:<ref> files=N issues=N exit=N`. 목록이 0 이면 knip 을
//   부르지 않고 `files=0` 으로 통과한다(코드 파일이 안 바뀐 PR 은 정상이다).
// exit — 지적이 있어도 0(경고). 인자가 틀렸거나 knip 이 없거나 knip 이 실패하면 2.
// KNIP_BIN — 저장소 밖에서 시험할 때 바이너리를 바꿔 끼우는 자리다.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const CODE_FILE = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$|(^|\/)package\.json$/;
const receipt = { mode: "base:?", files: 0, issues: 0 };

process.on("exit", (code) => {
  console.log(
    `RECEIPT knip-changed mode=${receipt.mode} files=${receipt.files} issues=${receipt.issues} exit=${code}`,
  );
});

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(2);
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function changedFiles(ref) {
  const base = git(["merge-base", ref, "HEAD"]);
  const out = git(["diff", "--name-only", "--diff-filter=ACMR", base, "HEAD"]);
  return out.split("\n").filter((f) => f && CODE_FILE.test(f));
}

function runKnip(root) {
  const bin = process.env.KNIP_BIN || join(root, "node_modules/.bin/knip");
  if (!existsSync(bin)) fail(`knip 이 설치되지 않았다 — npm ci (${bin})`);
  const args = [
    "--reporter",
    "json",
    "--no-progress",
    "--no-config-hints",
    "--no-exit-code",
  ];
  const res = spawnSync(bin, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (res.status !== 0) fail(`knip 실패 rc=${res.status}\n${res.stderr}`);
  return JSON.parse(res.stdout).issues;
}

function flatten(row) {
  const found = [];
  for (const [type, list] of Object.entries(row)) {
    if (type === "file" || type === "owners" || !Array.isArray(list)) continue;
    for (const item of list) {
      const first = Array.isArray(item) ? item[0] : item;
      const name = Array.isArray(item)
        ? item.map((i) => i.name).join("|")
        : item.name;
      found.push({ type, name, line: first?.line ?? 1, col: first?.col ?? 1 });
    }
  }
  return found;
}

const [flag, ref, ...rest] = process.argv.slice(2);
if (flag !== "--base" || !ref || rest.length > 0)
  fail("usage: knip-changed.mjs --base <ref>");
receipt.mode = `base:${ref}`;

const root = git(["rev-parse", "--show-toplevel"]);
process.chdir(root);
const files = changedFiles(ref);
receipt.files = files.length;
if (files.length === 0) {
  console.log("⏭️ 바뀐 코드 파일 0개 — knip 범위 밖");
  process.exit(0);
}

console.log(`바뀐 코드 파일 ${files.length}개 (base:${ref})`);
const changed = new Set(files);
for (const row of runKnip(root)) {
  if (!changed.has(row.file)) continue;
  for (const it of flatten(row)) {
    receipt.issues += 1;
    console.log(
      `::warning file=${row.file},line=${it.line},col=${it.col}::knip ${it.type} ${it.name}`,
    );
  }
}
console.log(`knip 지적 ${receipt.issues}건 (바뀐 파일만, 경고)`);
process.exit(0);
