#!/usr/bin/env bash
# PostToolUse(Edit|Write) — SCSS/TSX 편집 시 이 프로젝트의 1원칙(격리)을 즉시 검사한다.
#
# 소스 단계에서 잡는다. 빌드된 CSS 검사는 npm run verify:css 가 담당한다.
set -uo pipefail

payload=$(cat)
file=$(printf '%s' "$payload" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)

[ -z "$file" ] && exit 0
[ -f "$file" ] || exit 0
case "$file" in
  */packages/ui/src/*) ;;
  *) exit 0 ;;
esac

problems=""

case "$file" in
  *.scss)
    # 프리픽스 헬퍼를 거치지 않은 클래스 셀렉터
    if grep -nE '^\s*\.[a-zA-Z_][a-zA-Z0-9_-]*' "$file" | grep -qv '#{'; then
      hits=$(grep -nE '^\s*\.[a-zA-Z_][a-zA-Z0-9_-]*' "$file" | grep -v '#{' | head -3)
      problems="${problems}\n  · 클래스를 문자열로 직접 씀 — cls()/state() 헬퍼를 쓸 것\n${hits}"
    fi
    # @layer 없이 스타일을 출력하는 파일
    if grep -qE '^\s*(#\{cls|#\{state|\.)' "$file" && ! grep -q '@layer' "$file"; then
      problems="${problems}\n  · @layer nui.* 블록 없이 스타일을 출력함"
    fi
    # 보류된 브레이크포인트 사용
    if grep -qE '@media[^{]*(min-width|max-width)|respond-to\(' "$file"; then
      problems="${problems}\n  · 브레이크포인트는 현재 보류 상태다 (rules/styles.md §6)"
    fi
    ;;
  *.tsx)
    # "use client" 누락 (컴포넌트 파일만)
    if grep -qE '^\s*(export default function|export function|const .* = forwardRef)' "$file" \
       && ! head -3 "$file" | grep -q '"use client"'; then
      problems="${problems}\n  · \"use client\" 누락 (rules/components.md §1)"
    fi
    # 프리픽스 문자열 하드코딩
    if grep -qE '"nui-|`nui-' "$file"; then
      problems="${problems}\n  · 프리픽스를 문자열로 하드코딩 — px()/pv() 헬퍼를 쓸 것"
    fi
    ;;
esac

# 상대 import 의 .js 확장자 누락 (ts/tsx 공통)
case "$file" in
  *.ts|*.tsx)
    if grep -nE 'from "\.\.?/[^"]*"' "$file" | grep -vE '\.(js|json|css|scss)"' | grep -q .; then
      hits=$(grep -nE 'from "\.\.?/[^"]*"' "$file" | grep -vE '\.(js|json|css|scss)"' | head -3)
      problems="${problems}\n  · 내부 상대 import 에 .js 확장자 누락 (rules/components.md §4)\n${hits}"
    fi
    ;;
esac

if [ -n "$problems" ]; then
  printf '⚠️  스타일/컴포넌트 규칙 위반 — %s%b\n' "${file##*/}" "$problems" >&2
  exit 2
fi
exit 0
