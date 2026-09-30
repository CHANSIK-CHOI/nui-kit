#!/usr/bin/env bash
# 라이브러리 소스가 바뀐 PR 에 changeset 이 있는지 본다 — 로컬 Stop 훅 `changeset-reminder` 의 CI 판.
#
#   bash .github/scripts/check-changeset.sh <base-ref>     # 예: origin/dev
#
# 대상은 로컬 훅과 같다 — `packages/ui/src/**` · `packages/ui/package.json`.
# 통과 조건(셋 중 하나):
#   1. 대상 파일이 안 바뀌었다
#   2. `.changeset/*.md` 가 추가·수정됐다 (README.md 제외). 릴리스 노트가 필요 없는 변경은
#      `npx changeset --empty` 로 빈 changeset 을 남긴다 — 「일부러 안 남겼다」가 기록된다
#   3. `packages/ui/CHANGELOG.md` 가 바뀌었다 — `changeset version` 이 changeset 을 소비한 릴리스 PR 이다
#
# ⚠️ `changeset status --since` 를 쓰지 않는 이유 — 패키지 폴더의 **어느 파일이든**(scripts · README ·
#    tsup 설정) 바뀌면 changeset 을 요구하고, 릴리스 PR(changeset 을 이미 소비함)에서 실패한다.
#
# 대기 큐 검사 — 위 판정과 따로 돈다(라이브러리 소스가 안 바뀐 PR 도). PR 에 새로 든 것만 보면 이름만 바꾼(R)
# changeset 이 비켜 가므로 HEAD 의 큐 전부를 본다.
#   대상  `.changeset/*.md` + `.changeset/pre/*.md`(한 단계만). 파일명이 `.` 으로 시작하는 것과 대소문자 무시로
#         `readme.md` 인 것은 뺀다 — changesets 의 readChangesets 가 읽는 범위와 같다. 그 밖(AGENTS.md 등)은 넣는다
#   A0  읽기 검사(fail-closed) — 아래 꼴이 아니면 A1 · A2 에 세지 않고 「읽지 못한 changeset」으로 실패한다.
#       changesets CLI 와 저장소 템플릿이 쓰는 꼴만 받는다. YAML 이 허용해도 그 밖의 꼴(flow · 앵커 · 별칭 · 태그 ·
#       이스케이프 · 여러 줄 값 · 주석 · 줄 머리 공백 · BOM · 여는 줄의 키 · 첫 `---` 앞의 글)은 실패다
#       - 첫 비지 않은 줄이 `---` (없거나 파일이 비었으면 no-open) · 그 뒤에 닫는 `---` (없으면 no-close)
#       - 그 사이 비지 않은 줄마다 `<키>[ \t]*:[ \t]+<값>` 정확히 (아니면 bad-line)
#         키 = `"<이름>"` · `'<이름>'` · 따옴표 없는 `<이름>`(단 `@` 로 시작하면 안 된다 — YAML 예약 문자)
#         이름 = `[A-Za-z0-9@/._-]+` · 값 = major|minor|patch|none, 따옴표 없거나 같은 따옴표 한 쌍 · 대소문자 무시
#       - 이름(소문자)이 워크스페이스 패키지 이름 가운데 하나여야 한다 (아니면 unknown-package). 이름은
#         `packages/*` · `apps/*` 의 package.json 에서 읽는다 — 루트 package.json 의 workspaces 글롭이 바뀌면
#         `ws_dirs=` 줄도 바꾼다. 하나도 못 읽으면 큐가 1장 이상일 때 실패한다
#       - 빈 frontmatter(`---` ⏎ `---` · `changeset --empty`)는 읽힌다
#   A1  version 이 `0.` 으로 시작하는 동안 `"@nui-kit/react": major` 금지 → minor + 본문 **BREAKING**
#       (packages/ui/README.md 「버전 정책」). major 한 장이면 `changeset version` 이 1.0.0 을 낸다.
#       ⚠️ 1.0 은 이 줄을 걷는 PR 로만 간다 — 0.x 에서는 major changeset 이 여기서 막힌다
#   A2  `"@nui-kit/react": patch` 인데 본문(닫는 `---` 뒤)에 BREAKING(대소문자 무시) — patch 는 `^0.y.z` 로
#       모든 소비자에게 간다
#   CRLF 는 줄 끝 `\r` 을 벗겨 받는다.
#   못 보는 것:
#   - HEAD 에서 packages/ui/package.json 의 version 을 못 읽으면 A1 을 건너뛴다
#   - 커밋하지 않은 changeset — HEAD 만 본다(CI 는 PR 병합 커밋이 HEAD 다)
#   - A2 는 부분 문자열이라 `non-breaking` 도 걸린다(받아들인 헛짚기)
#   - 줄바꿈이 든 파일명 — `ls-tree -z` 뒤 tr 로 줄 단위가 된다
#   - 위 판정 2 의 `sets=`(PR 에 changeset 이 들었나)는 대문자 README.md 만 빼고 pre/ · 점 파일도 센다 —
#     개수만 보는 판정이라 그대로 둔다
set -euo pipefail

base="${1:?usage: check-changeset.sh <base-ref>}"
merge_base=$(git merge-base "$base" HEAD)

lib=$(git diff --name-only "$merge_base" HEAD -- packages/ui/src packages/ui/package.json)
lib_n=$(printf '%s' "$lib" | grep -c . || true)

sets=$(git diff --name-only --diff-filter=AM "$merge_base" HEAD -- '.changeset/*.md' |
  grep -v '^\.changeset/README\.md$' || true)
sets_n=$(printf '%s' "$sets" | grep -c . || true)

changelog_n=$(git diff --name-only "$merge_base" HEAD -- packages/ui/CHANGELOG.md | grep -c . || true)

echo "base=$base merge-base=${merge_base:0:7}"
echo "라이브러리 소스 변경 ${lib_n}건 · changeset 추가·수정 ${sets_n}건 · CHANGELOG 변경 ${changelog_n}건"

status=0
if [ "$lib_n" -eq 0 ]; then
  echo "✅ 라이브러리 소스가 안 바뀌었다 — changeset 불필요"
elif [ "$sets_n" -gt 0 ]; then
  echo "✅ changeset 있음:"
  printf '   %s\n' $sets
elif [ "$changelog_n" -gt 0 ]; then
  echo "✅ 릴리스 PR — packages/ui/CHANGELOG.md 가 바뀌었다 (changeset version 이 소비함)"
else
  status=1
  echo "❌ 라이브러리 소스가 바뀌었는데 changeset 이 없다:"
  printf '   %s\n' $lib | head -20
  echo
  echo "   npm run changeset 으로 남긴다. 릴리스 노트가 필요 없는 변경이면 npx changeset --empty"
  # GitHub Actions 주석 — PR 화면에 뜬다
  if [ -n "${GITHUB_ACTIONS:-}" ]; then
    echo "::error title=changeset 없음::packages/ui 소스가 ${lib_n}건 바뀌었는데 .changeset/*.md 가 없다 — npm run changeset (필요 없으면 npx changeset --empty)"
  fi
fi

# ── 대기 큐의 bump 검사 (A1 · A2 — 머리 주석) ────────────────────────────────
# 배열을 쓰지 않는다 — macOS bash 3.2 는 set -u 에서 빈 배열을 펼치면 죽는다
pkg_json=$(git show HEAD:packages/ui/package.json 2>/dev/null || true)
version=$(sed -n 's/^[[:space:]]*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' <<<"$pkg_json")
version=${version%%$'\n'*}

# -z — 기본 출력은 core.quotepath 로 ASCII 밖 경로를 "\355\225…" 처럼 따옴표 친 8진수로 내서
# `.changeset/한글이름.md` 가 아래 grep 에 안 맞고 큐에서 빠졌다
# 대상 — 머리 주석 「대상」. `.changeset/pre` 트리 줄 자체는 아래 정규식에 안 맞는다.
# 빼는 것은 readChangesets 와 같다 — 점으로 시작하는 파일명 · 대소문자 무시 readme.md
queue=$(git ls-tree -z --name-only HEAD .changeset/ .changeset/pre/ | tr '\0' '\n' |
  grep -E '^\.changeset/(pre/)?[^/]+\.md$' | grep -Ev '/\.[^/]*$' | grep -Eiv '/readme\.md$' || true)
queue_n=$(printf '%s' "$queue" | grep -c . || true)

# 워크스페이스 패키지 이름(소문자 · 공백 구분) — A0 의 unknown-package 판정. 하드코딩하지 않는다.
# ⚠️ 루트 package.json 의 workspaces 글롭(`packages/*` · `apps/*`)이 바뀌면 이 줄도 바꾼다
ws_dirs=$(git ls-tree -z -d --name-only HEAD packages/ apps/ | tr '\0' '\n' || true)
ws_names=""
while IFS= read -r d; do
  [ -n "$d" ] || continue
  ws_json=$(git show "HEAD:$d/package.json" 2>/dev/null || true)
  [ -n "$ws_json" ] || continue
  ws_name=$(sed -n 's/^[[:space:]]*"name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' <<<"$ws_json")
  ws_name=${ws_name%%$'\n'*}
  [ -n "$ws_name" ] || continue
  ws_names="${ws_names} $(printf '%s' "$ws_name" | tr '[:upper:]' '[:lower:]')"
done <<<"$ws_dirs"

major_hits=""
pb_hits=""
ur_hits=""
ws_missing=0
if [ "$queue_n" -gt 0 ] && [ -z "${ws_names// /}" ]; then ws_missing=1; fi
while IFS= read -r f; do
  [ -n "$f" ] || continue
  [ "$ws_missing" = 0 ] || break
  content=$(git show "HEAD:$f")
  # 출력: <읽힘> <major 있음> <patch 있음> <본문 BREAKING 있음> <못 읽은 이유|-> — 앞 넷은 0|1
  # POSIX awk 만 — BSD awk · gawk · mawk 공통(`\x` · 간격 `{n}` · gawk 전용 함수 없음)
  read -r ok has_major has_patch has_breaking reason <<<"$(awk -v q="'" -v pkgs="$ws_names" '
    BEGIN {
      nm = "[a-z0-9@/._-]+"
      bare = "[a-z0-9/._-][a-z0-9@/._-]*"
      bump = "(major|minor|patch|none)"
      line = "^(\"" nm "\"|" q nm q "|" bare ")[ \t]*:[ \t]+(" bump "|\"" bump "\"|" q bump q ")[ \t]*$"
      np = split(pkgs, P, " ")
      for (i = 1; i <= np; i++) W[P[i]] = 1
    }
    { sub(/\r$/, "") }
    s == 0 && /^[ \t]*$/ { next }
    s == 0 { if ($0 ~ /^[ \t]*---[ \t]*$/) { s = 1; next } else { r = "no-open"; exit } }
    s == 1 && /^[ \t]*---[ \t]*$/ { s = 2; next }
    s == 1 {
      if ($0 ~ /^[ \t]*$/ || r != "") next
      l = tolower($0)
      if (l !~ line) { r = "bad-line"; next }
      k = l; sub(/[ \t]*:.*$/, "", k); gsub("[\"" q "]", "", k)
      if (!(k in W)) { r = "unknown-package"; next }
      v = l; sub(/^[^:]*:[ \t]+/, "", v); sub(/[ \t]+$/, "", v); gsub("[\"" q "]", "", v)
      if (k == "@nui-kit/react") { if (v == "major") m = 1; if (v == "patch") p = 1 }
      next
    }
    s == 2 && toupper($0) ~ /BREAKING/ { b = 1 }
    END {
      if (r == "" && s == 0) r = "no-open"
      if (r == "" && s == 1) r = "no-close"
      o = 0; if (r == "") { o = 1; r = "-" }
      print o, m + 0, p + 0, b + 0, r
    }
  ' <<<"$content")"
  # `[ ] && …` 로 쓰지 않는다 — 루프 본문의 마지막 실패가 set -e 로 스크립트를 죽인다
  if [ "$ok" != 1 ]; then
    ur_hits="${ur_hits}${reason}"$'\t'"${f}"$'\n'
    continue
  fi
  case "$version" in
    0.*) if [ "$has_major" = 1 ]; then major_hits="${major_hits}${f}"$'\n'; fi ;;
  esac
  if [ "$has_patch" = 1 ] && [ "$has_breaking" = 1 ]; then pb_hits="${pb_hits}${f}"$'\n'; fi
done <<<"$queue"

major_n=$(printf '%s' "$major_hits" | grep -c . || true)
pb_n=$(printf '%s' "$pb_hits" | grep -c . || true)
ur_n=$(printf '%s' "$ur_hits" | grep -c . || true)

echo
echo "대기 changeset ${queue_n}장 · @nui-kit/react version ${version:-(읽지 못함)}"
if [ "$queue_n" -eq 0 ]; then
  echo "⏭️ 대기 changeset 0장 — bump 검사 범위 밖"
elif [ "$ws_missing" = 1 ]; then
  status=1
  echo "❌ 워크스페이스 패키지 이름을 읽지 못했다 — packages/*/package.json · apps/*/package.json 의 \"name\" (대기 큐 검사를 못 했다)"
  if [ -n "${GITHUB_ACTIONS:-}" ]; then
    echo "::error title=워크스페이스 패키지 이름::워크스페이스 패키지 이름을 읽지 못했다 — 대기 changeset ${queue_n}장을 검사하지 못했다"
  fi
else
  if [ "$ur_n" -gt 0 ]; then
    status=1
    echo "❌ 읽지 못한 changeset — changesets 는 이 꼴을 다르게 읽을 수 있다. npm run changeset 이 만드는 꼴로 다시 쓴다"
    while IFS=$'\t' read -r reason f; do
      [ -n "$f" ] || continue
      case "$reason" in
        no-open) why="첫 줄이 \`---\` 가 아니다" ;;
        no-close) why="닫는 \`---\` 가 없다" ;;
        bad-line) why="\`\"<패키지>\": major|minor|patch|none\` 꼴이 아닌 줄이 있다" ;;
        unknown-package) why="워크스페이스에 없는 패키지 이름" ;;
        *) why="$reason" ;;
      esac
      echo "   ${f} — ${why}"
      if [ -n "${GITHUB_ACTIONS:-}" ]; then
        echo "::error file=${f},title=읽지 못한 changeset::${why} — changesets 는 이 꼴을 다르게 읽을 수 있다. npm run changeset 이 만드는 꼴(\"@nui-kit/react\": minor)로 다시 쓴다"
      fi
    done <<<"$ur_hits"
    echo "   꼴: \"@nui-kit/react\": minor"
  fi
  case "$version" in
    0.*) ;;
    *) echo "⏭️ A1 — version 이 0.x 가 아니다 — 범위 밖" ;;
  esac
  if [ "$major_n" -gt 0 ]; then
    status=1
    echo "❌ 0.x 에서 BREAKING 은 minor 로 — packages/ui/README.md 「버전 정책」"
    while IFS= read -r f; do
      [ -n "$f" ] || continue
      echo "   ${f} — \"@nui-kit/react\": major → minor 로 바꾸고 본문에 **BREAKING** 을 적는다"
      if [ -n "${GITHUB_ACTIONS:-}" ]; then
        echo "::error file=${f},title=0.x 에 major changeset::0.x 에서 BREAKING 은 minor 로 — \"@nui-kit/react\": major → minor 로 바꾸고 본문에 **BREAKING** 을 적는다 (packages/ui/README.md 「버전 정책」)"
      fi
    done <<<"$major_hits"
  fi
  if [ "$pb_n" -gt 0 ]; then
    status=1
    echo "❌ patch changeset 에 BREAKING — patch 는 ^0.y.z 로 모든 소비자에게 간다. minor 로 올린다"
    while IFS= read -r f; do
      [ -n "$f" ] || continue
      echo "   ${f} — \"@nui-kit/react\": patch → minor"
      if [ -n "${GITHUB_ACTIONS:-}" ]; then
        echo "::error file=${f},title=patch 에 BREAKING::patch 는 ^0.y.z 로 모든 소비자에게 간다 — \"@nui-kit/react\": patch → minor 로 올린다"
      fi
    done <<<"$pb_hits"
  fi
  if [ "$ur_n" -eq 0 ] && [ "$major_n" -eq 0 ] && [ "$pb_n" -eq 0 ]; then
    echo "✅ 대기 큐 — 모두 읽힘 · 0.x 의 major 없음 · patch 의 BREAKING 없음"
  fi
fi

echo "RECEIPT check-changeset lib=${lib_n} changesets=${sets_n} changelog=${changelog_n} queue=${queue_n} major=${major_n} patch_breaking=${pb_n} unreadable=${ur_n} exit=${status}"
exit "$status"
