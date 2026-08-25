# next-ui-system — Claude 설정

## 프로젝트 목적

**높은 품질의 React 컴포넌트를 만들고 관리하며, 그 API 문서를 최신으로 유지한다.**
최종 산출물은 두 가지다 — npm 패키지 `@chansikchoi/next-ui` 와 API 문서 사이트.

서비스 화면·페이지를 만드는 프로젝트가 아니다. 컴포넌트 제작·검수·문서화에 집중한다.

## 환경

- Next **16.3.2 (App Router 전용)** / React **19.2.8** / TypeScript **7.0.2** / Sass
- npm workspaces 모노레포 — `packages/ui` (배포) + `apps/docs` (문서)
- macOS / zsh / hook 스크립트는 bash

### 이 조합에서 알려진 제약

| 제약 | 대응 |
| --- | --- |
| tsup 의 `dts` 가 TypeScript 7 에서 크래시 | `dts: false` + `tsc --emitDeclarationOnly` |
| rollup treeshake 패스가 `"use client"` 를 제거 | `treeshake: false` |
| 한글 경로가 `import.meta.url` 에서 percent-encoding | Node 스크립트는 `fileURLToPath` 사용 |

## 응답 방식

- **결론 먼저, 이유는 뒤에**
- 모르면 "모른다"고 한다. 확인하지 않은 것을 확인했다고 하지 않는다
- 답변·산출물은 **한국어**
- 검증 결과는 실제 실행한 명령과 출력으로 보인다

## 절대 하지 않는 것

1. **원본 프로젝트를 수정하지 않는다** — `../next-ui-components-guide` 는 읽기 전용 참조다
2. **배포하지 않는다** — `npm publish` 는 deny. `/release` 로 명시 승인 후에만
3. **컴포넌트 작업에 문서 갱신·배포를 묶지 않는다** — changeset 으로 넘긴다
4. 검수 에이전트를 건너뛰고 "검수 완료"라고 보고하지 않는다

## 핵심 설계 결정

- **소비자 프로젝트 스타일을 오염시키지 않는다** — 이 라이브러리의 1원칙
  - 전 클래스 `nui-` 프리픽스 / 전 CSS `@layer nui.*` / reset 미배포(opt-in) / 컴포넌트 자체 정규화
- **모든 컴포넌트는 클라이언트 컴포넌트** (`"use client"`)
- **ESM 단일 포맷** — 듀얼 패키지 해저드 차단
- **공개 훅 `--nui-*` / 내부 배선 `--nui-_*` 분리** — variant 보호
- **합성 컴포넌트는 named export 동반** — RSC 에서 dot notation 이 `undefined` 가 되므로
- **치수는 16px 루트 기준 rem**
- ⏸️ **반응형(브레이크포인트)은 보류** — 인프라만 두고 사용처 없음. 별도 단계에서 일괄 적용

## 워크플로우

```
신규 컴포넌트   /component-create   planner(spec) → 구현 → 자체검증 → QA + 리뷰 → changeset
기존 수정      /component-revise   planner(diff) → 구현 → 자체검증 → QA + 리뷰 → changeset
검수만         /component-audit    (spec 없으면 역추출) → 기계검사 → QA + 리뷰 → 보고
문서 반영      /docs-sync          changeset 큐 → apps/docs 반영
배포           /release            빌드 → 검증 → 승인(BLOCKING) → publish
커밋           /git-commit
```

`defaultMode: "plan"` 이므로 세션은 plan mode 로 시작한다.
1단계 승인 후 코드 변경을 위해 사용자가 `Shift+Tab` 으로 accept mode 로 전환해야 한다.

## 에이전트

| 에이전트 | 역할 | 수정 권한 |
| --- | --- | --- |
| `component-planner` | spec 작성 / 역추출 | 없음 (본문만 출력) |
| `component-qa` | Playwright 실동작 + Context7 API 사실 검증 | 없음 (보고만) |
| `react-reviewer` | React·RSC 메커니즘, 공개 API 안정성 리뷰 | 없음 (권고만) |

**구현은 Claude 가 직접 한다.** 구현을 에이전트로 분리하지 않는 이유:
이 프로젝트에서 실제로 잡힌 결함들(UA reset 잔존, box-sizing 누락, 훅이 variant 를 덮음,
RSC dot notation)은 모두 `구현 → 빌드 → 브라우저 확인 → 수정` 루프를 짧게 돌려서 발견됐다.
그 루프에 에이전트 경계를 넣으면 발견이 늦어진다. **검증은 독립 에이전트로, 구현은 인라인으로.**

## 품질 게이트

```bash
npm run typecheck      # 전 워크스페이스
npm run verify:pkg     # verify:css + publint + attw
npm run build:ui       # tsup + tsc + sass
npm run build:docs
```

`verify:css` 는 빌드된 CSS 가 격리 원칙을 지키는지 기계 검사한다
(`packages/ui/scripts/check-css-isolation.mjs`) — 프리픽스 누락, 전역 셀렉터 유입,
`@layer` 누락, tokens 순수성.

## 자동화 hook

| hook | 시점 | 동작 |
| --- | --- | --- |
| `format-on-edit.sh` | PostToolUse | Prettier 자동 포맷. 비차단 |
| `style-guard.sh` | PostToolUse | 프리픽스 하드코딩·`"use client"` 누락·`.js` 확장자 누락·보류된 브레이크포인트 사용 검출 |
| `changeset-reminder.sh` | Stop | 라이브러리 소스가 바뀌었는데 changeset 이 없으면 안내 |
| `typecheck.sh` | Stop | 타입 검사. 실패 시 수정 유도 (최대 3회 가드) |

타입체크 끄기: `.claude/hooks/.typecheck-off` 생성 / 켜기: 삭제

## MCP

- **Context7** — 외부 라이브러리의 props/이벤트 정확도가 중요할 때 반드시 확인한다.
  React 19 / Next 16 자체 문법처럼 학습 데이터로 충분한 것은 호출하지 않는다
- **Playwright** — `component-qa` 의 실동작 검증 전용.
  dev server 는 사용자가 `npm run dev` 로 띄운다. 에이전트가 직접 기동하지 않는다
- **Chrome DevTools** — 성능·네트워크·콘솔 심층 조사가 필요할 때

## Rules

| 파일 | 내용 |
| --- | --- |
| `.claude/rules/architecture.md` | 저장소·폴더 구조, 공개 경로 3층, 새 컴포넌트 추가 위치 |
| `.claude/rules/components.md` | `"use client"`, RSC named export, `px()` 헬퍼, `.js` 확장자, controlled/RHF 소유권 |
| `.claude/rules/styles.md` | 프리픽스, `@layer`, 공개/내부 변수 분리, 자체 정규화, rem 기준 |
| `.claude/rules/packaging.md` | ESM 계약, dep/peer 판정, 갱신 목록, changeset, 배포 |
| `.claude/rules/a11y.md` | id 연결, `aria-describedby`, 에러 표현, 포커스, 모션 |

## 진행 상황

| 단계 | 내용 | 상태 |
| --- | --- | --- |
| 0 | 모노레포 스캐폴딩 + 툴체인 + MCP | ✅ |
| 1 | 스타일 시스템 재정비 (프리픽스 / @layer / 토큰) | ✅ |
| 2 | 파일럿 3종 이식 + 서브패스 패키징 | ✅ |
| 3 | `.claude` 자동화 | ✅ |
| 4 | 문서 사이트 (Foundations=MDX, Components=TSX + props 자동생성) | ⬜ |
| 5 | 나머지 컴포넌트 이전 → npm 배포 | ⬜ |

**파일럿 3종(Button / Field / Textfield)에는 spec 이 없다** — 원본 이식이라 건너뛰었다.
`/component-audit` 으로 역추출하는 것이 남은 과제다.
