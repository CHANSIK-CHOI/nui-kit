#!/usr/bin/env bash
# Stop — 종료 시 타입 검사. 실패하면 exit 2 로 수정을 유도한다.
# 끄기: .claude/hooks/.typecheck-off 파일 생성 / 켜기: 삭제
set -uo pipefail

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0
[ -f .claude/hooks/.typecheck-off ] && exit 0

# 무한 루프 가드 (최대 3회)
guard=.claude/hooks/.typecheck-count
count=$(cat "$guard" 2>/dev/null || echo 0)
if [ "$count" -ge 3 ]; then rm -f "$guard"; exit 0; fi

out=$(npm run typecheck 2>&1) || {
  echo $((count + 1)) > "$guard"
  printf '❌ 타입 검사 실패 — 수정이 필요하다.\n\n%s\n' \
    "$(printf '%s' "$out" | grep -E 'error TS' | head -20)" >&2
  exit 2
}

rm -f "$guard"
exit 0
