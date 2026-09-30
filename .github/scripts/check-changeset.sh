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
# 대기 큐 검사 — 위 판정과 따로 돈다(라이브러리 소스가 안 바뀐 PR 도). 대상은 HEAD 의 `.changeset/*.md` 전부
# (README.md 제외)다. PR 에 새로 든 것만 보면 이름만 바꾼(R) changeset 이 비켜 간다.
#   A1  version 이 `0.` 으로 시작하는 동안 `"@nui-kit/react": major` 금지 → minor + 본문 **BREAKING**
#       (packages/ui/README.md 「버전 정책」). major 한 장이면 `changeset version` 이 1.0.0 을 낸다.
#       ⚠️ 1.0 은 이 줄을 걷는 PR 로만 간다 — 0.x 에서는 major changeset 이 여기서 막힌다
#   A2  `"@nui-kit/react": patch` 인데 본문에 BREAKING(대소문자 무시) — patch 는 `^0.y.z` 로 모든 소비자에게 간다
#   frontmatter 는 첫 `---` 과 둘째 `---` 사이만, 본문은 그 뒤만 본다. 키·값의 따옴표(" ' 없음) · 콜론 앞뒤 공백 ·
#   대소문자 · CRLF 를 무시한다.
#   못 보는 것:
#   - YAML flow 꼴(`{"@nui-kit/react": major}`) · 태그(`!!str major`) — changesets CLI 가 쓰지 않는 꼴이다
#   - HEAD 에서 packages/ui/package.json 의 version 을 못 읽으면 A1 을 건너뛴다
#   - 커밋하지 않은 changeset — HEAD 만 본다(CI 는 PR 병합 커밋이 HEAD 다)
#   - A2 는 부분 문자열이라 `non-breaking` 도 걸린다(받아들인 헛짚기)
#   - 줄바꿈이 든 파일명 — `ls-tree -z` 뒤 tr 로 줄 단위가 된다
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
queue=$(git ls-tree -z --name-only HEAD .changeset/ | tr '\0' '\n' | grep -E '^\.changeset/[^/]+\.md$' |
  grep -v '^\.changeset/README\.md$' || true)
queue_n=$(printf '%s' "$queue" | grep -c . || true)

major_hits=""
pb_hits=""
while IFS= read -r f; do
  [ -n "$f" ] || continue
  content=$(git show "HEAD:$f")
  # 출력: <major 있음> <patch 있음> <본문 BREAKING 있음> — 각 0|1
  read -r has_major has_patch has_breaking <<<"$(awk -v q="'" '
    BEGIN {
      key = "^[ \t]*[\"" q "]?@nui-kit/react[\"" q "]?[ \t]*:"
      head = "^[^:]*:[ \t]*[\"" q "]?"
      tail = "[\"" q " \t#].*$"
    }
    { sub(/\r$/, "") }
    s == 0 && /^[ \t]*$/ { next }
    s == 0 { if ($0 ~ /^[ \t]*---[ \t]*$/) { s = 1; next } else exit }
    s == 1 && /^[ \t]*---[ \t]*$/ { s = 2; next }
    s == 1 {
      l = tolower($0)
      if (l ~ key) { v = l; sub(head, "", v); sub(tail, "", v); if (v == "major") m = 1; if (v == "patch") p = 1 }
      next
    }
    s == 2 && toupper($0) ~ /BREAKING/ { k = 1 }
    END { print m + 0, p + 0, k + 0 }
  ' <<<"$content")"
  # `[ ] && …` 로 쓰지 않는다 — 루프 본문의 마지막 실패가 set -e 로 스크립트를 죽인다
  case "$version" in
    0.*) if [ "$has_major" = 1 ]; then major_hits="${major_hits}${f}"$'\n'; fi ;;
  esac
  if [ "$has_patch" = 1 ] && [ "$has_breaking" = 1 ]; then pb_hits="${pb_hits}${f}"$'\n'; fi
done <<<"$queue"

major_n=$(printf '%s' "$major_hits" | grep -c . || true)
pb_n=$(printf '%s' "$pb_hits" | grep -c . || true)

echo
echo "대기 changeset ${queue_n}장 · @nui-kit/react version ${version:-(읽지 못함)}"
if [ "$queue_n" -eq 0 ]; then
  echo "⏭️ 대기 changeset 0장 — bump 검사 범위 밖"
else
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
  if [ "$major_n" -eq 0 ] && [ "$pb_n" -eq 0 ]; then
    echo "✅ 대기 큐 — 0.x 의 major 없음 · patch 의 BREAKING 없음"
  fi
fi

echo "RECEIPT check-changeset lib=${lib_n} changesets=${sets_n} changelog=${changelog_n} queue=${queue_n} major=${major_n} patch_breaking=${pb_n} exit=${status}"
exit "$status"
