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
| `react-docgen-typescript` 도 TypeScript 7 에서 크래시 | props 추출기를 직접 작성 + `apps/docs` 에 typescript 5.9 격리 설치 |

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
npm run verify:pkg     # verify:css + verify:tokens + publint + attw
npm run build:ui       # tsup + tsc + sass
npm run build:docs     # generate(props/토큰 추출) + next build
npm run refs:check     # Context7 캐시 신선도

# dev server 가 떠 있어야 하는 것 (npm run dev)
npm run verify:console     # 전 페이지 콘솔 에러·경고
npm run verify:select-rhf  # RHF 연동 Select 의 remount 회귀
npm run verify:datepicker  # Datepicker 개폐·포커스·팝업 클리핑·RHF 회귀
npm run verify:a11y        # prefers-reduced-motion 대응 + 명도 대비(AA)
```

**문서는 손으로 쓰지 않는 부분이 있다.** `apps/docs/scripts/extract-props.mjs` 가 컴포넌트
타입에서 props 표를, `extract-tokens.mjs` 가 `_seed.scss` 에서 토큰 표를 생성한다.
두 스크립트는 `npm run dev`/`build` 앞단에서 자동 실행되므로 문서가 코드를 따라간다.

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

- **Context7** — ⚠️ **매번 호출하지 않는다.** 받은 문서를 `.claude/references/` 에 저장하고
  **7일간 로컬 파일로 팩트체크**한다. 만료되면 다시 받는다. 상태 확인은 `npm run refs:check`,
  절차는 `.claude/rules/references.md`. React 19 / Next 16 자체 문법은 애초에 호출하지 않는다
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
| `.claude/rules/tokens.md` | **토큰 체계의 정본** — 3계층, 숫자 스케일 네이밍, 스케일 값, deprecated 대응표 |
| `.claude/rules/design-system.md` | **무엇을 고르는가** — 상태×속성 매트릭스, 상태 조합, 포커스, 타이포 매트릭스, 모션 |
| `.claude/rules/spec-scope.md` | spec 규율 — What/How 경계, 현행만 남기기, Open Questions 라이프사이클 |
| `.claude/rules/references.md` | **Context7 로컬 캐시(TTL 7일)** — 매번 MCP 호출하지 않는다 |

## 진행 상황

| 단계 | 내용 | 상태 |
| --- | --- | --- |
| 0 | 모노레포 스캐폴딩 + 툴체인 + MCP | ✅ |
| 1 | 스타일 시스템 재정비 (프리픽스 / @layer / 토큰) | ✅ |
| 2 | 파일럿 3종 이식 + 서브패스 패키징 | ✅ |
| 3 | `.claude` 자동화 | ✅ |
| 4 | 문서 사이트 (props/토큰 자동생성) | ✅ |
| 5 | 컴포넌트 계열별 이전 | ✅ |
| 5.5 | 디자인 시스템 계약 + spec 체계 + 접근성 | 🔄 **재정비 예정** |
| 6 | npm 최초 배포 | ⬜ |

### 5단계 — 계열별 이전 현황

| 계열 | 컴포넌트 | 상태 |
| --- | --- | --- |
| Button | Button / IconButton / ButtonGroup / ButtonLink | ✅ |
| Form 입력 | Field / Textfield / Textarea / Search / Password | ✅ |
| Form 선택 | Checkbox / Radio / Switch (+Group) | ✅ |
| Popup | PopupBase / Alert / Confirm / LayerPopup / BottomSheet / FullPopup / PopupHost | ✅ |
| Feedback | Toast / ToastHost / Tooltip | ✅ |
| Disclosure | Accordion | ✅ |
| Select | Select / MultiSelect (+RHF 2종) | ✅ |
| Datepicker | Datepicker / DateRangePicker / DateMultiplePicker (+RHF 3종) | ✅ |

RHF 래퍼는 이식된 컴포넌트 전부에 대해 `/rhf` 서브패스로 제공 중이다.

---

## 다음 작업 — 디자인 시스템 재정비 **2단계 진행 중** (2026-08-29)

### 계획서가 정본이다 ★

**모든 결정과 근거는 두 HTML 문서에 있다. 작업 전에 반드시 읽는다.**

| 문서 | 내용 |
| --- | --- |
| `design-plan.html` | **확정 기준 전량** — 원칙 · 결정 D-01~D-14 · before/after · 실행 계약 |
| `brand-color-plan.html` | `D-02` 브랜드 색 생성기 (별도 기능, 2단계 이후) |

두 문서는 **확정 기준만** 담는다. 논의 과정은 넣지 않는다 — 이력은 Git 이 갖는다.
**계획서 수정은 반드시 `eli5` 스킬을 호출해서** 한다 (사용자 지시).

### 세운 원칙 — 계층과 창구는 다른 축이다

- **축 1 계층** — 값이 어디서 오는가. 색만 2계층(Primitive → Semantic)
- **축 2 창구** — 소비자가 어디를 만지는가. 컴포넌트별 훅

> **소비자가 잘못 바꿨을 때 자기 눈으로 알아챌 수 있으면 열고, 없으면 막는다.**

- **색** — 배경↔글자가 짝이라 배경만 바꾸면 대비가 보이지 않게 깨진다 → **막는다**
- **포커스 링 두께** — 키보드 사용자만 겪는다 → **막는다**
- **radius · 간격 · 크기 · 선 두께** — 바꾸면 바로 보인다 → **연다**

훅 이름은 `--nui-{컴포넌트}-{옵션?}-{요소?}-{속성}` — "버튼의 lg 옵션의 높이"로 읽힌다.

### 2단계 진행 상황

```
✅ 1. _seed.scss          선 색 3분할 · border-width-1/2 · opacity-* 4 · scale-* 3
✅ 2. 검사 스크립트         check-token-layers.mjs 에 색 훅 금지 · 이름 규칙 추가
🔄 3. 컴포넌트 SCSS         선 색 재편만 완료(Accordion·Popup). 나머지가 다음 작업
   4. rules/ 문서 3개      tokens.md · design-system.md · styles.md
   5. Foundations 페이지
   6. changeset + 전체 검증
```

### 다음에 할 일 — 컴포넌트 SCSS

**`npm run verify:tokens` 가 지금 21건으로 실패한다. 그 목록이 곧 작업 목록이다.**

1. **색 훅 19개 삭제** (21자리) — `hook("button-bg", X)` → `var(X)`. 목록은 계획서 5-1
2. **이름 분리** — `button-min-height`(3자리) → `button-lg/md/sm-height` 등. 계획서 5-2
3. **선 두께 훅 8개 신설** — `border` 를 쓰는 8개 컴포넌트에. 계획서 5-2
4. **Button 클래스 재편** — `--large` 신설, 기본이 48px(md)가 된다. **시각 변경**

### 이번 범위의 시각 변경은 둘뿐이다

나머지는 전부 "이름만 바뀌고 화면은 그대로"여야 한다.

1. **선 색 위계 교정** — Accordion `line` 구분선이 연해진다 ✅ 적용 완료
2. **Button 기본 높이** — 56px → 48px (미적용)

### 검증 — CSS diff 가 핵심이다

빌드된 `styles/*.css` 를 변경 전후로 비교하고, **토큰 이름을 되돌리는 치환을 걸면 diff 가 0**이어야 한다.
위 두 가지 의도된 변경만 예외다. 자세한 것은 계획서 6-2.

### 알아둘 함정

- **`grep 'hook("..."` 로 훅을 세지 마라.** Prettier 가 줄을 접어서 13개를 놓쳤다.
  `hook\(\s*"` 로 줄바꿈까지 잡아야 한다. 검사 스크립트가 정확히 센다
- **`selector-size` 는 쪼개지 않는다** — Checkbox·Radio 의 width/height 를 묶어 정사각형을 보장한다
- **한 컴포넌트 안의 테두리 두께도 하나로 묶는다** — 같은 이유
- **`transparent` 테두리에도 두께 훅을 적용한다** — 안 하면 선택 시 요소가 밀린다
- **`opacity` 는 매트릭스에 있는 4개만 토큰화했다.** 규칙 밖 4자리(Datepicker 0.3·0.45×2,
  Button disabled 0.72)는 남겨뒀다 — 어느 값으로 모을지는 컴포넌트 반영 단계에서 판단한다

### 보류 — 이번에 하지 않는 것

`D-02` 브랜드 색 생성기 · `D-03` DESIGN.md · `D-08` elevation ·
`D-12` 아이콘 라이브러리 · opacity·pressed 값 통일 · 반응형

### 조사 자료 (gitignore — 로컬에만 있다)

- `research/seed-design/` — 당근 SEED 파운데이션 14편 분석
- `research/figma-palettes/palettes.json` — Figma 400색. 브랜드 생성기 검증용
- `design/design-system.pen` — pen.dev 캔버스

## 배포 전 남은 일 (6단계)

**끝난 것** — LICENSE 파일, `engines`, README 전 컴포넌트 갱신, 문서 사이트
Components 목록, 서브패스↔CSS 이름 1:1 일치(`choice.css` 분리)

**남은 것**

- `repository` / `homepage` / `bugs` 가 비어 있다. **git remote 가 없어 URL 을 모른다** —
  사용자에게 GitHub 저장소 주소를 받아야 한다. `publishConfig.provenance: true` 라
  provenance 서명에도 필요하다
- npm 계정 준비 + Trusted Publishing(OIDC) 설정 — **사용자만 할 수 있다**
- `.changeset/` 큐 8건을 `/docs-sync` → `/release` 로 소비
  (`changeset version` 이 0.0.0 → **0.1.0**)
- 최초 배포는 반드시 `--tag next` 프리릴리즈 → 빈 프로젝트 설치 스모크 테스트 후 latest
- 파일럿 3종 중 Field / Textfield spec 미작성 (Button 은 완료)
