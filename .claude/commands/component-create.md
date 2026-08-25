---
description: 신규 컴포넌트를 명세 → 구현 → 검수 순으로 제작하고 변경 큐(changeset)까지 남긴다
---

# /component-create <ComponentName>

신규 컴포넌트를 만든다. **문서 사이트 갱신과 배포는 하지 않는다** — changeset 으로 넘긴다.

## 1단계 · 명세 (plan mode)

`component-planner` 에이전트를 Agent 도구로 호출해 spec 본문을 받는다.
Claude 가 직접 spec 본문을 쓰지 않는다.

받은 본문을 **가공하지 않고 그대로** 사용자에게 보여주고 승인을 받는다.
승인 후 `.claude/specs/<Name>.md` 에 Write 한다 (저장은 Claude 가 한다).

> spec 승인 후 코드 변경을 위해 `Shift+Tab` 으로 accept mode 전환이 필요하다.

## 2단계 · 구현

`.claude/rules/` 를 따라 직접 구현한다. 아래를 **모두** 갱신한다
(`packaging.md` 의 "새 컴포넌트 추가 시 갱신 목록"):

1. `src/components/<Name>/` + `index.ts`
2. `src/<name>.ts` 서브패스 엔트리
3. `tsup.config.ts` entry
4. `package.json` exports
5. `src/index.ts` 배럴 (RHF 래퍼는 `rhf.ts` 로만)
6. `styles/components/_<name>.scss` + `styles/entries/<name>.scss` + `entries/index.scss` 등록
7. `packages/ui/README.md` — 사용법, 합성 컴포넌트 대응표, 공개 훅

## 3단계 · 자체 검증 (에이전트 호출 전)

```bash
npm run build:ui
npm run typecheck
npm run verify:pkg          # verify:css + publint + attw
```

`apps/docs/src/app/preview/` 에 데모를 추가한다 —
**Server Component 경로와 Client Component 경로를 모두** 포함시킨다.

## 4단계 · 검수

`component-qa` 와 `react-reviewer` 를 Agent 도구로 호출한다. 건너뛰지 않는다.
dev server 가 필요하면 사용자에게 `npm run dev` 를 요청한다.

BLOCKER 가 나오면 수정 후 재검수한다 (최대 2회, 이후 사용자에게 판단을 넘긴다).

## 5단계 · 변경 큐

```bash
npm run changeset
```

`packaging.md` 의 semver 기준을 따르고, 본문은 **소비자 관점**으로 쓴다.

## 6단계 · 보고

- 만든 파일 목록
- 검수 결과 요약 (BLOCKER/WARN 처리 내역)
- 실행한 검증 명령과 결과
- 남긴 changeset
- **다음 할 일**: `/docs-sync` (문서 반영), `/release` (배포) — 이번에는 하지 않았음을 명시

## 금지

- 문서 사이트 갱신·배포를 이 명령에서 하지 않는다
- 검수 에이전트 호출을 건너뛰고 "검수 완료"라고 하지 않는다
- 확인하지 않은 것을 통과했다고 보고하지 않는다
