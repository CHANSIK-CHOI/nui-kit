---
description: 기존 컴포넌트를 검수만 한다. 코드를 바꾸지 않는다
---

# /component-audit [ComponentName | --all]

검수 전용. **코드를 수정하지 않는다.** 발견 사항을 보고만 한다.

## 1단계 · spec 확인

`.claude/specs/<Name>.md` 가 없으면 `component-planner` 를 **역추출 모드**로 호출한다
(코드를 읽어 현재 상태를 spec 으로 정리). 이때도 저장은 사용자 승인 후 Claude 가 한다.

## 2단계 · 기계 검사

```bash
npm run build:ui
npm run typecheck
npm run verify:pkg
```

## 3단계 · 에이전트 검수

`component-qa` 와 `react-reviewer` 를 호출한다.

## 4단계 · 보고

```markdown
## 감사 결과: <Name>
| 항목 | 결과 |
| 기계 검사 | typecheck / verify:css / publint / attw |
| 실동작 | |
| 접근성 | |
| 코드 리뷰 | |

### BLOCKER / WARN / INFO
각 항목에 **수정 제안**을 붙이되 실제로 고치지는 않는다.

### 권장 다음 행동
`/component-revise <Name>` 로 수정할지 사용자에게 묻는다.
```
