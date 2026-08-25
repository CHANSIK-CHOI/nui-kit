---
description: 쌓인 changeset 을 읽어 API 문서 사이트에 반영한다
---

# /docs-sync

`.changeset/` 의 변경 큐를 읽어 **문서 사이트(`apps/docs`)에 반영**한다.
컴포넌트 코드는 고치지 않는다.

## 1단계 · 큐 확인

```bash
ls .changeset/*.md
npx changeset status
```

changeset 이 없으면 여기서 멈추고 "반영할 변경 없음"으로 보고한다.

## 2단계 · 영향 범위 산출

각 changeset 을 읽어 아래로 분류한다.

| 변경 | 문서 반영 대상 |
| --- | --- |
| 컴포넌트 추가 | Components 목록 + 신규 페이지 + 네비게이션 |
| prop 추가·변경 | 해당 컴포넌트의 Props 표 + 예제 |
| 공개 토큰 추가·변경 | Foundations 해당 페이지 + 컴포넌트 커스터마이징 절 |
| 클래스명 변경 | 커스터마이징 문서 |
| 내부 리팩터 | **반영 없음** — 소비자에게 안 보이면 문서화하지 않는다 |

## 3단계 · 반영

- **Props 표는 손으로 쓰지 않는다.** 타입에서 생성된 것을 쓴다
  (문서 사이트 구축 시 `react-docgen-typescript` 파이프라인을 붙인다)
- 예제는 실제로 렌더되는 코드여야 한다. 문자열로만 적힌 예제를 만들지 않는다
- `packages/ui/README.md` 와 문서 사이트 내용이 어긋나면 README 를 정본으로 맞춘다

## 4단계 · 검증

```bash
npm run build:docs
```

`component-qa` 를 호출해 문서 페이지의 예제가 실제로 동작하는지 확인한다.

## 5단계 · 보고

- 반영한 changeset 목록과 각각의 문서 반영 위치
- **반영하지 않은 것과 이유**
- changeset 파일은 **삭제하지 않는다** — `/release` 의 버전 산정에 쓰인다
