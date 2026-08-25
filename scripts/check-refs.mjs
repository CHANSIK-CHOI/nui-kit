#!/usr/bin/env node
/**
 * Context7 로컬 문서 캐시의 신선도를 검사한다.
 *
 * 이 저장소는 Context7 MCP 를 매번 호출하지 않는다.
 * 한 번 받아 `.claude/references/` 에 저장하고, **1주일간 그 파일을 읽어 팩트체크**한다.
 * 만료되면 다시 받는다.
 *
 * 사용:
 *   node scripts/check-refs.mjs           만료 목록 출력 (만료 있어도 exit 0)
 *   node scripts/check-refs.mjs --strict  만료가 있으면 exit 1
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REFS = join(ROOT, ".claude", "references");
const TTL_DAYS = 7;
const strict = process.argv.includes("--strict");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".md") && entry.name !== "INDEX.md")
      out.push(full);
  }
  return out;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return meta;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

let files = [];
try {
  files = walk(REFS);
} catch {
  console.log("📚 캐시된 참조 문서 없음 (.claude/references/)");
  process.exit(0);
}

if (files.length === 0) {
  console.log("📚 캐시된 참조 문서 없음 (.claude/references/)");
  process.exit(0);
}

const fresh = [];
const stale = [];
const broken = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  const meta = parseFrontmatter(readFileSync(file, "utf8"));

  if (!meta?.fetched || !meta?.library) {
    broken.push({ rel, reason: "frontmatter 에 library/fetched 누락" });
    continue;
  }

  // "2026-08-25" 를 그냥 new Date 로 파싱하면 UTC 자정으로 잡혀
  // 로컬 자정(KST)과 비교할 때 하루가 어긋난다. 명시적으로 로컬 시각으로 파싱한다.
  const fetched = new Date(`${meta.fetched}T00:00:00`);
  if (Number.isNaN(fetched.getTime())) {
    broken.push({ rel, reason: `fetched 날짜 파싱 불가: ${meta.fetched}` });
    continue;
  }

  const ageDays = Math.floor((today - fetched) / 86_400_000);
  const record = {
    rel,
    library: meta.library,
    ageDays,
    topic: meta.topic ?? "",
  };
  (ageDays >= TTL_DAYS ? stale : fresh).push(record);
}

console.log(`📚 참조 문서 ${files.length}건 (TTL ${TTL_DAYS}일)\n`);

if (fresh.length) {
  console.log("  유효:");
  for (const f of fresh.sort((a, b) => b.ageDays - a.ageDays)) {
    console.log(`    ✅ ${f.rel}  (${f.ageDays}일 경과, ${f.library})`);
  }
}

if (stale.length) {
  console.log("\n  만료 — Context7 로 다시 받을 것:");
  for (const f of stale) {
    console.log(`    ⏰ ${f.rel}  (${f.ageDays}일 경과, ${f.library})`);
  }
}

if (broken.length) {
  console.log("\n  형식 오류:");
  for (const f of broken) console.log(`    ❌ ${f.rel} — ${f.reason}`);
}

if (strict && (stale.length || broken.length)) process.exit(1);
