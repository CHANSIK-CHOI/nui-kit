#!/usr/bin/env bash
# Stop — 라이브러리 소스가 바뀌었는데 changeset 이 없으면 알린다.
#
# 이 프로젝트는 "컴포넌트 작업 / 문서 갱신 / 배포"를 한 번에 묶지 않는다.
# 무엇이 바뀌었는지를 changeset 으로 남겨 다음 단계로 넘긴다.
set -uo pipefail

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

changed=$(git status --porcelain packages/ui/src packages/ui/package.json 2>/dev/null | wc -l | tr -d ' ')
[ "$changed" -eq 0 ] && exit 0

pending=$(git status --porcelain .changeset 2>/dev/null | grep -c '\.md$' || true)
[ "$pending" -gt 0 ] && exit 0

cat >&2 <<'MSG'
📝 라이브러리 소스가 변경되었는데 changeset 이 없다.
   `npm run changeset` 으로 변경 내용을 큐에 남기면
   나중에 /docs-sync 와 /release 가 그 큐를 소비한다.
   (문서 갱신·배포는 지금 하지 않는다)
MSG
exit 0
