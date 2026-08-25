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
npm run verify:pkg     # verify:css + publint + attw
npm run build:ui       # tsup + tsc + sass
npm run build:docs     # generate(props/토큰 추출) + next build
npm run refs:check     # Context7 캐시 신선도
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
| `.claude/rules/references.md` | **Context7 로컬 캐시(TTL 7일)** — 매번 MCP 호출하지 않는다 |

## 진행 상황

| 단계 | 내용 | 상태 |
| --- | --- | --- |
| 0 | 모노레포 스캐폴딩 + 툴체인 + MCP | ✅ |
| 1 | 스타일 시스템 재정비 (프리픽스 / @layer / 토큰) | ✅ |
| 2 | 파일럿 3종 이식 + 서브패스 패키징 | ✅ |
| 3 | `.claude` 자동화 | ✅ |
| 4 | 문서 사이트 (props/토큰 자동생성) | ✅ |
| 5 | 컴포넌트 계열별 이전 | 🔄 진행 중 |
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
| **Datepicker** | **Datepicker / DateRangePicker / DateMultiplePicker (+RHF 3종)** | ⬜ **다음 작업** |

RHF 래퍼는 이식된 컴포넌트 전부에 대해 `/rhf` 서브패스로 제공 중이다.

---

## 다음 작업 — Datepicker (서드파티 래핑)

### 원본 위치

```
../next-ui-components-guide/src/components/Datepicker/  Datepicker, DateRangePicker,
                                                        DateMultiplePicker, DatepickerBase,
                                                        Datepicker.utils, RHF*
../next-ui-components-guide/src/styles/components/_datepicker.scss
```

### 핵심 과제 — `rules/styles.md` §8 의 진짜 시험대

Select 은 원본이 이미 `unstyled` + `classNamePrefix` 를 쓰고 있어서 전역 침범이
애초에 없었다. **Datepicker 는 다르다.** 원본이 `.rdp-day` 같은
react-day-picker 클래스를 **전역에서 덮고 있다.** 그대로 배포하면 소비자가 같은
라이브러리를 쓸 때 그쪽까지 깨진다.

```scss
#{cls("datepicker")} .rdp-day { }   // ✅ 우리 스코프 안에서만
.rdp-day { }                        // ❌ 전역 침범
```

react-day-picker v9 는 `classNames` prop 을 지원한다 — 클래스를 통째로 우리
`nui-datepicker__*` 로 바꿔 끼우면 Select 과 같은 구조가 된다. **그 방식을 먼저
검토할 것.** `.rdp-*` 를 자손 셀렉터로 덮는 건 차선이다.

**Context7 캐시 규칙을 따른다** (`rules/references.md`) — react-day-picker 문서를
`.claude/references/` 에 받아두고 7일간 재사용한다.
`.claude/references/websites-react-select/` 에 Select 작업 때 받은 2건이 있다.

### 반복 절차 (앞 계열에서 확립된 순서)

```
1. 원본 소스·SCSS 읽기 → 부족한 토큰 파악
2. 토큰 추가 (tokens/_seed.scss)
3. 스타일 이식 — 프리픽스 / @layer / 공개훅·내부배선 분리 / camelCase→kebab
4. entries/<name>.scss 추가 + entries/index.scss 등록
5. 컴포넌트 이식 — "use client" / px()·pv() / .js 확장자 / 합성이면 named export 동반
6. 배럴 5곳 갱신: components/<N>/index.ts, src/<n>.ts, tsup.config.ts entry,
   package.json exports, src/index.ts (RHF 는 src/rhf.ts)
7. apps/docs/scripts/extract-props.mjs TARGETS 등록
8. 문서 페이지 + 데모(Client Component) 작성, nav.ts / components/page.tsx 등록
9. 게이트: typecheck → build:ui → verify:pkg → build:docs → verify:console
10. 브라우저로 실제 조작 검증 (playwright 스크립트)
11. changeset 작성 → 커밋
```

### 이전 계열에서 반복해서 나온 함정

| 함정 | 증상 | 대응 |
| --- | --- | --- |
| 전역 reset 의존 | input/button 에 UA 기본 스타일 잔존, box-sizing 없음 | 컴포넌트 자체 정규화 |
| 상태 우선순위 | error 가 readonly 에 덮임 | `:not()` 으로 명시 (disabled > error > readonly) |
| RSC dot notation | 런타임에만 `undefined` | named export 동반 |
| portal 컨테이너 | 없으면 조용히 렌더 안 됨 | Host 가 직접 생성 |
| controlled 경고 | `checked` + `disabled` 만으로는 React 경고 | `readOnly` 를 DOM 에 전달 |
| Prettier 재포맷 | 문자열 치환이 **조용히** 실패 | 포맷된 파일은 부분 치환 대신 전체 재작성 |
| **서드파티 CSS-in-JS** | **emotion 클래스가 우리 `@layer` 를 항상 이긴다** | **충돌 속성만 라이브러리 쪽에서 제거 → CSS 로 넘긴다** |
| **중첩 min-height** | **자식에도 같은 min-height 를 주면 border 만큼 밀린다** | **높이는 한 요소만 소유** |
| **서드파티 aria 덮어쓰기** | **라이브러리가 `aria-describedby` 를 자체 계산** | **컨테이너 컴포넌트에서 자식 aria 를 병합** |
| **`forwardRef` 타입 추론** | **`--emitDeclarationOnly` 만 TS2883 으로 실패** | **`ForwardRefExoticComponent` 명시** |

**정적 검사를 전부 통과하고 브라우저에서만 드러난 결함이 계열마다 나왔다.**
`verify:console` 과 playwright 조작 검증을 생략하지 말 것.

#### Select 계열에서 배운 것 — 서드파티 CSS-in-JS 를 감쌀 때

`@layer nui.components` 는 소비자가 우리를 쉽게 덮게 해주는 장치인데,
**같은 성질 때문에 서드파티 emotion/styled-components 도 우리를 덮는다.**
상세도를 아무리 올려도 진다 (cascade 는 `layer` 를 `specificity` 보다 먼저 본다).

원본 프로젝트는 `@layer` 를 쓰지 않아 상세도 싸움이었고 `!important` 로 뚫었다.
우리는 `!important` 를 쓰면 소비자 커스터마이징까지 막으므로 쓰지 않는다.
→ **라이브러리의 `styles` API 로 충돌 속성만 걷어내고 CSS 가 책임진다.**
   (`Select.utils.ts` 의 `CSS_OWNED_PROPERTIES` 참조)

단, **기능 스타일은 걷어내면 안 된다** — 메뉴 배치(`position`/`top`/`width`),
`maxMenuHeight`, `valueContainer` 의 `display` 전환 등. 이런 값은 CSS 로 덮지 말고
라이브러리의 prop 으로 조정한다.

`Select.utils.ts` 와 `styles/components/_select.scss` 는 **짝을 이룬다.**
한쪽만 고치면 조용히 깨진다.

---

## 배포 전 남은 일 (6단계)

- 파일럿 3종(Button/Field/Textfield)에 spec 이 없다 → `/component-audit` 역추출
- `packages/ui/README.md` 를 전 컴포넌트 기준으로 갱신
- npm 계정 준비 + Trusted Publishing(OIDC) 설정
- `.changeset/` 에 쌓인 큐를 `/docs-sync` → `/release` 로 소비
- 최초 배포는 반드시 `--tag next` 프리릴리즈 → 빈 프로젝트 설치 스모크 테스트 후 latest
