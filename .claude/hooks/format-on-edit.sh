#!/usr/bin/env bash
# PostToolUse(Edit|Write) — 편집한 파일을 즉시 Prettier 로 포맷한다. 비차단.
set -uo pipefail

payload=$(cat)
file=$(printf '%s' "$payload" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)

[ -z "$file" ] && exit 0
[ -f "$file" ] || exit 0

case "$file" in
  *.ts|*.tsx|*.js|*.mjs|*.jsx|*.json|*.scss|*.css) ;;
  *) exit 0 ;;
esac

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0
npx --no-install prettier --write "$file" >/dev/null 2>&1 || true
exit 0
