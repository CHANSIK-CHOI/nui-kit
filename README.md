# Next UI System

Next.js **App Router 전용** React UI 컴포넌트 시스템.
라이브러리(npm 배포)와 API 문서 사이트를 하나의 모노레포에서 관리한다.

## 구조

```
next-ui-system/
├─ packages/ui      @chansikchoi/next-ui  — npm 에 배포되는 컴포넌트 라이브러리
└─ apps/docs        문서 사이트 (Next.js App Router)
```

## 핵심 원칙

1. **소비자 프로젝트 스타일을 오염시키지 않는다**
   - 모든 클래스에 `nui-` 프리픽스 (`.nui-button`)
   - 모든 CSS 를 `@layer nui.*` 안에 배치 → 소비자의 unlayered CSS 가 항상 우선
   - reset 은 기본 배포에 포함하지 않음 (`styles/preflight.css` 로 opt-in)
2. **온디맨드 / 전체 CSS 둘 다 제공**
3. **2계층 CSS 변수로 커스터마이징** — seed 토큰 + 컴포넌트 토큰
4. **모든 컴포넌트는 클라이언트 컴포넌트** (`"use client"`)
5. **컴포넌트 작업 ≠ 문서 갱신 ≠ 배포** — 셋을 원스텝으로 묶지 않는다.
   변경 사항은 `.changeset/` 에 큐로 쌓아두고 나중에 넘긴다.

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 문서 사이트 개발 서버 |
| `npm run build:ui` | 라이브러리 빌드 (JS + CSS) |
| `npm run build:docs` | 문서 사이트 빌드 |
| `npm run typecheck` | 전 워크스페이스 타입 검사 |
| `npm run format` | Prettier 포맷 |
| `npm run verify:pkg` | 배포 정합성 검증 (publint + attw) |
| `npm run changeset` | 변경 큐 적재 |
| `npm run release` | 빌드 → 검증 → npm 배포 |

> 라이브러리 소스를 고치면서 문서를 보려면 터미널 두 개가 필요하다.
> `npm run build:ui -- --watch` 는 아직 미설정 — 현재는 `npm run build:ui` 후 `npm run dev`.

## 로드맵

| 단계 | 내용 | 상태 |
| --- | --- | --- |
| 0 | 모노레포 스캐폴딩 + 툴체인 + MCP | ✅ 완료 |
| 1 | 스타일 시스템 재정비 (프리픽스 / @layer / 토큰 확정) | ⬜ |
| 2 | 컴포넌트 이전 + 패키징 (파일럿: Button / Field / Textfield) | ⬜ |
| 3 | `.claude/` 자동화 (rules / commands / agents / hooks) | ⬜ |
| 4 | 문서 사이트 (Foundations=MDX, Components=TSX + props 자동생성) | ⬜ |
| 5 | npm 최초 배포 → 컴포넌트 증설 | ⬜ |

원본 컴포넌트는 형제 폴더 `next-ui-components-guide` (Pages Router) 에 있으며,
**읽기 전용 참조**로만 사용한다.
