---
description: 기존 컴포넌트를 수정한다. spec diff → 구현 → 검수 → changeset
---

# /component-revise <ComponentName>

기존 컴포넌트를 고친다. **문서 사이트 갱신과 배포는 하지 않는다.**

## 1단계 · 변경 명세 (plan mode)

`component-planner` 를 호출해 **기존 spec 대비 diff** 를 받는다.
spec 이 없으면 먼저 `/component-audit` 의 역추출을 거친다.

diff 를 사용자에게 보여주고 승인받은 뒤 `.claude/specs/<Name>.md` 를 갱신한다.

**공개 API 가 바뀌면** 여기서 breaking 여부를 확정한다 — 5단계 changeset 등급의 근거가 된다.

## 2단계 · 구현

변경 범위만 고친다. 요청하지 않은 리팩터를 끼워 넣지 않는다.

공개 API(prop 이름·클래스명·공개 토큰)가 바뀌면 함께 갱신한다:
- `packages/ui/README.md`
- `apps/docs/src/app/preview/` 데모
- 해당 컴포넌트를 쓰는 다른 컴포넌트

## 3단계 · 자체 검증

```bash
npm run build:ui && npm run typecheck && npm run verify:pkg
```

## 4단계 · 검수

`component-qa` + `react-reviewer` 호출. **회귀 확인이 핵심**이다 —
바꾼 것뿐 아니라 기존 동작이 유지되는지 본다.

## 5단계 · changeset + 보고

`/component-create` 5·6단계와 동일. 공개 API 변경은 본문에 **BREAKING** 을 명시한다.
