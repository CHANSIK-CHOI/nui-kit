#!/usr/bin/env bash
# 바뀐 코드 파일에만 Biome 린트를 돌린다 — CI `lint` 잡과 커밋 전 훅이 같은 목록 규칙을 쓰려고 하나로 둔다.
#
#   bash .github/scripts/lint-changed.sh --staged          # 커밋 전 훅 — index 에 든 내용
#   bash .github/scripts/lint-changed.sh --base <ref>      # CI — 예: origin/dev. merge-base(ref, HEAD)..HEAD
#
# 왜 바뀐 파일에만인가 — 지금 트리에는 위반이 이미 있다(오류 7 · 경고 97). 한꺼번에 고치지 않고 고치는
#   파일부터 맞춘다. 트리 전체는 `npm run lint` 로 본다.
# 규칙 수준(biome.json) — 자동 수정이 safe 인 규칙(useNamingConvention)은 오류, 자동 수정이 unsafe 거나 없는
#   규칙(안 쓴 import · 변수 · 인자, 선언 안 한 의존)은 경고, 크기 넷은 경고. 예외로 지금 위반 0 인 공개 계약
#   규칙(noExplicitAny · noImportCycles · 공개 엔트리 default export · 컴포넌트 index.ts 의 export * ·
#   라이브러리→문서 import)은 오류 — 0 건이라 지금 막히는 커밋이 없고, 경고로 두면 공개 API 경계가 새는 것을
#   못 막는다. 예외 둘째 — 스크립트 폴더 .mjs 의 끝날 때 훅 직접 쓰기(플러그인 .github/lint/no-direct-exit-hook.grit)
#   는 지금 13 곳이 있어도 오류다. 고치는 법이 한 줄로 정해져 있어(script-kit 의 onExitReceipt) 그 파일을 고치는
#   PR 이 함께 옮긴다(규칙 문서 scripts.md §11).
# 왜 index 를 꺼내나 — Biome 의 `--staged` 는 작업 트리 내용을 읽는다(실측: index 에 위반을 넣고 작업 트리를
#   고치면 통과한다). 그래서 index 를 통째로 임시 폴더에 꺼내 거기서 목록을 넘긴다. 한 파일만 꺼내면 순환 ·
#   의존 검사에 쓸 나머지 파일이 없다. 임시 폴더엔 .git 이 없어 `--vcs-enabled=false` 를 준다 — 꺼낸 것이 이미
#   추적 파일뿐이라 무시 목록이 필요 없다.
# 영수증 — 마지막 줄 `RECEIPT lint-changed mode=… files=N exit=N`. 목록이 0 이면 Biome 을 부르지 않고
#   `files=0 exit=0` 으로 통과한다 — 「수 0 이면 실패」의 예외다. 코드 파일이 안 바뀐 커밋 · PR 은 정상이다.
# exit — Biome 의 것을 그대로(오류가 있으면 1, 경고만이면 0). 인자가 틀렸거나 Biome 이 없거나 임시 폴더를
#   못 만들면 2.
# 못 보는 것 — package.json 에서 의존을 빼는 커밋은 그 의존을 가져오는 파일이 안 바뀌면
#   noUndeclaredDependencies 가 못 본다. library 잡이 깨지는 쪽으로 드러난다.
# BIOME_BIN — 저장소 밖에서 시험할 때 바이너리를 바꿔 끼우는 자리다.
set -euo pipefail

usage() {
  echo "usage: lint-changed.sh --staged | --base <ref>" >&2
  exit 2
}

mode=""
ref=""
case "${1:-}" in
  --staged)
    [ "$#" -eq 1 ] || usage
    mode="staged"
    ;;
  --base)
    [ "$#" -eq 2 ] && [ -n "$2" ] || usage
    ref="$2"
    mode="base:$ref"
    ;;
  *) usage ;;
esac

cd "$(git rev-parse --show-toplevel)"

BIOME="${BIOME_BIN:-$PWD/node_modules/.bin/biome}"
if [ ! -x "$BIOME" ]; then
  echo "❌ Biome 이 설치되지 않았다 — npm ci ($BIOME)" >&2
  exit 2
fi

ext='\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$'
if [ "$mode" = "staged" ]; then
  list=$(git diff --cached --name-only --diff-filter=ACMR | grep -E "$ext" || true)
else
  merge_base=$(git merge-base "$ref" HEAD)
  list=$(git diff --name-only --diff-filter=ACMR "$merge_base" HEAD | grep -E "$ext" || true)
fi

# mapfile 은 macOS bash 3.2 에 없다
files=()
while IFS= read -r f; do
  [ -n "$f" ] || continue
  files+=("$f")
done <<<"$list"
n=${#files[@]}

if [ "$n" -eq 0 ]; then
  echo "⏭️ 바뀐 코드 파일 0개 — 린트 범위 밖"
  echo "RECEIPT lint-changed mode=${mode} files=0 exit=0"
  exit 0
fi

echo "바뀐 코드 파일 ${n}개 (${mode})"

extra=()
if [ "$mode" = "staged" ]; then
  # 템플릿을 꼭 준다 — macOS mktemp 는 템플릿이 없으면 TMPDIR 을 보지 않고 /var/folders/…/T 에 만든다.
  #   쓰기 범위를 좁힌 sandbox 셸은 그 자리를 막고 쓸 수 있는 TMPDIR 을 준다(2026-10-28 실측 — 템플릿 없이는 mkdtemp 거부).
  tmp=$(mktemp -d "${TMPDIR:-/tmp}/lint-changed.XXXXXX") || {
    echo "❌ 임시 폴더를 만들지 못했다 (${TMPDIR:-/tmp})" >&2
    exit 2
  }
  trap 'rm -rf "$tmp"' EXIT
  git checkout-index -a --prefix="$tmp/"
  cd "$tmp"
  extra=(--vcs-enabled=false)
fi

set +e
"$BIOME" lint --no-errors-on-unmatched --files-ignore-unknown=true --max-diagnostics=200 ${extra[@]+"${extra[@]}"} "${files[@]}"
code=$?
set -e

echo "RECEIPT lint-changed mode=${mode} files=${n} exit=${code}"
exit "$code"
