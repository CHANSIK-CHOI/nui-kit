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

echo "RECEIPT check-changeset lib=${lib_n} changesets=${sets_n} changelog=${changelog_n} exit=${status}"
exit "$status"
