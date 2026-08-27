# LayerPopup

> 구현에서 역추출한 명세다. **구현이 정본**이다.
> 근거: `src/components/Popup/{LayerPopup,PopupBase,PopupHost,Popup.types,popup.store,usePopupPanelA11y,usePopupHostA11y}.tsx|ts`,
> `src/styles/components/_popup.scss`, `src/internal/motion.ts`

## 목적

화면 중앙에 떠서 배경 상호작용을 차단하는 모달 다이얼로그 셸 — `PopupBase` 의 `dialog` variant 를 고정한 얇은 프리셋이다.

## 공개 API

### 컴포넌트

`LayerPopup.tsx` 는 `variant="dialog"` 를 고정하고 `contentAlign` / `dialogLabel` 의 기본값만 바꿔 `PopupBase` 로 넘긴다. 나머지 prop 은 전부 `PopupBase` 의 것을 그대로 통과시킨다.

타입: `LayerPopupProps = Omit<PopupBaseProps, "variant" | "size"> & Pick<PopupBaseProps, "size">`
→ 실질적으로 **`variant` 만 제외한 `PopupBaseProps` 전부**다. (`size` 는 `Pick` 으로 되살린다. `BottomSheet` / `FullPopup` 은 `size` 도 없다 — 이 셋을 구분하는 유일한 타입 차이다.)

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | — (필수) | 열림 여부. **controlled 전용**, `defaultOpen` 없음 |
| `children` | `ReactNode` | — | `__body` 안, `icon`·`description` 다음에 렌더 |
| `id` | `string` | — | 루트 `.nui-popup` 요소의 DOM id |
| `className` | `string` | — | 루트에 추가. `nui-layer-popup` 뒤에 붙는다 |
| `panelClassName` | `string` | — | `__panel`(role=dialog) 에 추가 |
| `bodyClassName` | `string` | — | `__body` 에 추가 |
| `footerClassName` | `string` | — | `__foot` 에 추가 |
| `size` | `"small" \| "regular" \| "large"` | `"regular"` | 패널 폭. `regular` 일 때는 modifier 클래스를 붙이지 않는다 |
| `contentAlign` | `"left" \| "center"` | **`"left"`** | `LayerPopup` 이 덮어쓴 기본값 (`PopupBase` 자체 기본값은 `"center"`) |
| `title` | `ReactNode` | — | 헤더 제목. 있으면 `aria-labelledby` 로 연결된다 |
| `icon` | `ReactNode \| null` | — | `__body` 최상단 원형 슬롯. `null`/`undefined` 면 렌더하지 않는다 |
| `description` | `ReactNode` | — | 있으면 `aria-describedby` 로 연결된다 |
| `footer` | `ReactNode` | — | 없으면 `--no-footer` modifier 가 붙는다 |
| `hasCloseButton` | `boolean` | `true` | `title` 도 없고 이것도 `false` 면 헤더 전체가 렌더되지 않는다 |
| `closeButtonLabel` | `string` | `"팝업 닫기"` | 닫기 버튼의 `aria-label` |
| `shouldCloseOnBackdrop` | `boolean` | `true` | dim 클릭 시 `onRequestClose` 호출 여부 |
| `shouldCloseOnEscape` | `boolean` | `true` | ESC 처리 여부. `isTopmost` 일 때만 유효 |
| `dialogLabel` | `string` | **`"레이어 팝업"`** | `title` 이 없을 때 쓰는 접근 이름. `LayerPopup` 이 덮어쓴 기본값 |
| `onRequestClose` | `() => void` | — | 닫기 요청(dim·ESC·닫기 버튼). **닫는 주체는 소비자다** |
| `onClickClose` | `() => void` | — | 닫기 버튼 전용 훅. `onRequestClose` **보다 먼저** 호출되고 둘 다 호출된다 |
| `onExited` | `() => void` | — | 닫힘 애니메이션이 끝난 뒤(`AnimatePresence.onExitComplete`) |
| `isTopmost` | `boolean` | `false` | 스택 최상단 여부. **`false` 면 ESC·포커스 트랩·최초 포커스가 전부 동작하지 않는다** |

### 값 소유권

- **완전 controlled.** `open` 을 컴포넌트가 소유하지 않는다. 닫기 트리거는 `onRequestClose` 통보뿐이고, 실제로 `open` 을 내리는 건 소비자(선언형) 또는 popup store(명령형)다.
- RHF 래퍼 없음. 폼 값을 다루는 컴포넌트가 아니다.
- ⚠️ `isTopmost` 의 기본값이 `false` 이므로 **선언형으로 직접 쓸 때는 소비자가 `isTopmost` 를 명시해야 한다.** 주지 않으면 ESC 로 닫히지 않고 포커스도 갇히지 않는다. (`PopupHost` 경유일 때는 Host 가 계산해서 주입한다. `Popup.types.ts` 에 이 prop 을 `Omit` 하지 않는 이유가 주석으로 못박혀 있다 — 원본 프로젝트의 결함이었다.)

### 명령형 API — `useLayerPopup()`

| 반환 | 타입 | 설명 |
| --- | --- | --- |
| `open` | `(options: LayerPopupOptions) => string` | 팝업을 스택에 등록하고 생성된 id 를 반환 |
| `close` | `(id?: string) => void` | id 를 주지 않으면 **가장 최근에 연 layerPopup** 을 닫는다 |
| `closeAll` | `() => void` | `layerPopup` 타입만 전부 `closing` 으로 |
| `layerPopups` | `PopupSnapshot[]` | `{ id, type, status }` 만 뽑은 스택 (props 는 노출하지 않는다) |

```ts
type LayerPopupOptions = {
  id?: string;                                  // 없으면 `layerPopup-<Date.now()>-<rand6>`
  component: ComponentType<PopupRuntimeProps>;  // PopupHost 가 런타임 props 를 주입해 렌더
};

type PopupRuntimeProps = {
  id?: string;
  open: boolean;
  onRequestClose?: () => void;
  onExited?: () => void;
  isTopmost?: boolean;
};
```

`id` 를 직접 주고 같은 id 가 이미 스택에 있으면 **store 가 `Error` 를 던진다** (`openLayerPopup only creates new popups.`). 열려 있는 팝업의 내용을 갱신하는 용도가 아니다.

`PopupRuntimeProps` 의 `open` 은 **필수**다. 소비자가 만드는 내용 컴포넌트는 `open` 을 받아 `LayerPopup` 에 넘겨야 한다.

## 합성 구조

dot notation 없음. 슬롯은 `title` / `icon` / `description` / `children` / `footer` prop 으로 받는다.
따라서 `.claude/rules/components.md` §2(RSC 프록시에서 정적 프로퍼티가 `undefined`) 의 대상이 아니다.

`/popup` 서브패스와 배럴에서 나가는 것:

| export | 종류 |
| --- | --- |
| `LayerPopup` | 컴포넌트 (default → named 재export) |
| `PopupBase` | 공통 골격. 직접 쓰기보다 프리셋을 쓴다 |
| `PopupHost` | 명령형 팝업의 렌더링 지점 |
| `useLayerPopup` | 명령형 훅 |
| `usePopupStore` / `usePopupStack` | store 직접 접근 |
| `LayerPopupProps` / `LayerPopupComponentProps` / `LayerPopupOptions` | 타입. `LayerPopupComponentProps` = `PopupRuntimeProps` 별칭 |

## PopupHost 와의 관계

```
useLayerPopup().open({ component })   ── zustand store(items) 에 push
                                              │
PopupHost  ── store 구독 ── createPortal ──> #nui-popup-root (body 직계)
                                              │
                                          <component id open isTopmost
                                                     onRequestClose onExited />
```

- **앱 루트에 한 번만 렌더한다** (App Router 라면 `app/layout.tsx`). `PopupHost` 는 `children: ReactNode` 를 **필수**로 받는 래퍼다 — 자식을 감싸는 형태로 쓴다.
- **없으면 명령형 팝업은 조용히 아무 것도 렌더하지 않는다.** store 에는 항목이 쌓이지만 그리는 주체가 없다. 에러도 경고도 나지 않는다.
- portal 컨테이너(`#nui-popup-root`)는 **없으면 Host 가 직접 만든다.** 소비자가 빈 div 를 심을 필요가 없다. 우리가 만든 경우에 한해, 비어 있을 때만 언마운트에서 제거한다.
- 컨테이너 조회는 `useEffect` 안에서 한다 — 렌더 중(`useState` initializer)에 `document` 를 읽으면 하이드레이션 불일치가 난다.
- ⚠️ **선언형으로 `<LayerPopup open={...}/>` 를 직접 쓰면 `PopupHost` 를 거치지 않는다.** 그 경우 portal 을 쓰지 않고 **제자리에 렌더되며, 배경 스크롤 잠금과 배경 inert 도 걸리지 않는다** (둘 다 `PopupHost` 의 책임이고 store 항목 수로만 판단한다). 패널 자체는 `position: fixed` 라 화면 중앙에 뜬다.

## 상태

폼 컨트롤이 아니므로 `disabled` / `readonly` / `error` 상태가 없다. 상태는 **팝업 생명주기**와 **스택 위치**다.

| 상태 | 무엇이 바뀌는가 |
| --- | --- |
| 닫힘 | `AnimatePresence` 안에서 트리 전체가 렌더되지 않는다 (DOM 없음) |
| 열림(`open`) | dim `opacity 0→1`, 패널 `opacity 0 / y 24 / scale .96 → 1 / 0 / 1` |
| `closing`(store) | store 의 `status` 만 바뀌고 `open=false` 로 내려간다. 이 동안 **topmost 후보에서 빠진다** |
| exited | exit 애니메이션 완료 → `onExited` → (Host 경유면) `removePopup` → 언마운트 → 포커스 복원 |
| `isTopmost=true` | 최초 포커스 이동 · Tab 트랩 · ESC 처리를 **이 팝업만** 수행 |
| `isTopmost=false` | 위 셋이 전부 early-return 된다. 화면에는 그대로 보인다 |

닫기 버튼(`__close`)의 인터랙션 상태:

| 상태 | 변화 |
| --- | --- |
| default | `color: text-secondary`, 배경 투명, 투명 테두리 |
| hover | `color: text-primary`, `background: control-bg-subtle`, `border-color: border-subtle` |
| focus-visible | `outline: focus-ring-width solid focus-color`, `outline-offset: .125rem` |
| active | `transform: scale(.96)` |

## 클래스 계약

루트에는 `nui-layer-popup` 과 `nui-popup` 계열 클래스가 **함께** 붙는다.

```
.nui-layer-popup.nui-popup.nui-popup--dialog[…modifier]
└ .nui-popup__dim
└ .nui-popup__positioner
  └ .nui-popup__panel            role="dialog"
    ├ .nui-popup__head           (title 또는 닫기버튼이 있을 때만)
    │ ├ .nui-popup__header-content > .nui-popup__title
    │ └ .nui-popup__close
    ├ .nui-popup__body
    │ ├ .nui-popup__icon
    │ └ .nui-popup__description
    └ .nui-popup__foot           (footer 가 있을 때만)
```

| 클래스 | 조건 |
| --- | --- |
| `.nui-layer-popup` | 항상. **`_popup.scss` 에 대응 규칙이 없다** — 소비자 식별·오버라이드용 순수 훅 클래스다 |
| `.nui-popup--dialog` | 항상 (variant 고정) |
| `.nui-popup--small` / `--large` | `size` 가 `regular` 가 아닐 때. `regular` 는 클래스를 붙이지 않는다 |
| `.nui-popup--align-center` | `contentAlign === "center"` — `__body` 를 `align-items: center` + `text-align: center` 로 |
| `.nui-popup--no-header` | `title` 없고 `hasCloseButton=false` — `__body` 상단 패딩 보정 |
| `.nui-popup--no-footer` | `footer` 없음 — `__body` 하단 패딩 보정 |
| `.nui-popup__head--no-title` | 닫기 버튼만 있을 때 — `justify-content: flex-end` |

문서 전역에 붙는 것:

| 대상 | 클래스/속성 | 주체 |
| --- | --- | --- |
| `body` | `.nui-is-prevent-scroll` | `usePopupHostA11y` (store 에 항목이 있을 때) |
| `body` 직계 자식 | `inert` + `aria-hidden="true"` | 같음. portal 컨테이너와 그 조상은 제외 |
| portal 컨테이너 | `id="nui-popup-root"` | `PopupHost` |

## 토큰

### 공개 훅

| 훅 | 기본값 | 적용 위치 |
| --- | --- | --- |
| `--nui-popup-width` | `min(100%, 30rem)` / small `min(100%, 22.5rem)` / large `min(100%, 40rem)` | `__panel` 의 `width` |
| `--nui-popup-bg` | `var(--nui-surface-panel-strong)` | `__panel` 배경 |
| `--nui-popup-radius` | `var(--nui-radius-xl)` | `__panel` 반경 |
| `--nui-popup-dim` | `var(--nui-surface-overlay-dim)` | `__dim` 배경 |

⚠️ `--nui-popup-width` 는 `regular` / `small` / `large` **세 규칙 모두**에서 같은 이름의 훅으로 읽는다. 소비자가 이 변수를 상위에 한 번 설정하면 **size variant 가 전부 같은 폭이 된다.** `styles.md` §3 이 경고하는 형태이고, 현재 구현이 그렇다. (→ Open Questions)

`--nui-scroll-lock-top` 은 `PopupHost` 가 `body` 인라인 스타일에 기록하고 `base/_scroll-lock.scss` 가 읽는 **배선 값**이다. 소비자가 설정할 대상이 아니다.

### z-index 계층에서의 위치

| 토큰 | 값 | 비고 |
| --- | --- | --- |
| `--nui-z-tooltip` | 20 | |
| `--nui-z-layer` | 1010 | |
| `--nui-z-overlay-dimmed` | 1020 | |
| **`--nui-z-overlay-layer`** | **1030** | **`.nui-popup` 루트가 쓰는 값** |
| `--nui-z-portal-menu` | 1031 | Select 메뉴·Datepicker 달력 — 팝업 안에서도 보여야 해서 위 |
| `--nui-z-toast` | 1031 | 팝업 안에서 띄운 토스트도 보여야 해서 위 |

팝업끼리는 **같은 z-index** 다. 겹칠 때의 상하는 `PopupHost` 가 `items` 배열 순서대로 렌더하므로 **DOM 순서**가 결정한다 — 나중에 연 것이 위다.

### 사용하는 seed 토큰

`surface-overlay-dim` `surface-panel-strong` `surface-space-card` `surface-space-compact` `space-md` `space-sm` `border-width` `border-default` `border-subtle` `radius-xl` `radius-pill` `shadow-overlay` `shadow-inset-soft` `gradient-panel-soft` `text-primary` `text-secondary` `control-bg-subtle` `color-info` `size-control-lg` `size-field` `font-family-base` `focus-color` `focus-ring-width` `z-overlay-layer` — 그리고 `motion()` / `typo()` 믹스인 경유의 duration·easing·타이포 토큰.

## 접근성

### 역할·이름

- `__panel` 이 `role="dialog"` + `aria-modal="true"` + `tabIndex={-1}`
- 접근 이름: `title` 이 있으면 `aria-labelledby={useId()}`, 없으면 `aria-label={dialogLabel ?? "팝업"}` (`LayerPopup` 기본값 `"레이어 팝업"`). **둘은 배타적**이다 — `title` 이 있으면 `aria-label` 을 붙이지 않는다
- `description` 이 있을 때만 `aria-describedby` 를 연결한다. 없으면 속성 자체를 생략
- 닫기 버튼은 `<button type="button">` + `aria-label={closeButtonLabel}`, 안의 `CloseIcon` 은 `title` 이 없어 `aria-hidden` 이다 (`a11y.md` §4)

### 키보드

| 키 | 동작 | 조건 |
| --- | --- | --- |
| `Escape` | `preventDefault()` 후 `onRequestClose()` | `open && isTopmost && shouldCloseOnEscape` |
| `Tab` | 마지막 → 첫 요소로 순환 | 같은 조건 |
| `Shift+Tab` | 첫 요소(또는 패널 자신) → 마지막 요소로 순환 | 같은 조건 |
| `Tab` (포커스가 패널 밖일 때) | 첫(또는 `Shift` 면 마지막) 요소로 끌어온다 | 같은 조건 |
| `Tab` (포커스 가능 요소 0개) | 패널 자신에 포커스 | 같은 조건 |

리스너는 `document` 의 `keydown` 이다. focusable 판정 셀렉터는 `a[href]` `button:not([disabled])` `input/select/textarea:not([disabled])` `[tabindex]:not([tabindex="-1"])` 이며 `aria-hidden="true"` 인 요소를 추가로 걸러낸다.

### 포커스 생명주기

1. 열릴 때 `requestAnimationFrame` 뒤에 패널 안 **첫 focusable** 로 이동. 없으면 패널 자신
2. 열기 직전의 `document.activeElement` 를 기억했다가, **`PopupBase` 언마운트 시** `requestAnimationFrame` 으로 복원. `isConnected` 를 두 번(등록 시점·실행 시점) 확인한다
3. ⚠️ **복원 기준이 `open` 이 아니라 마운트/언마운트다.** 명령형(Host 경유)에서는 `onExited → removePopup` 으로 언마운트되므로 정상 동작한다. 반면 **선언형으로 항상 마운트해 두고 `open` 만 토글하면 닫아도 포커스가 복원되지 않는다.**

### 배경 격리 (`PopupHost` 책임)

- `body` 직계 자식 중 portal 컨테이너와 그 조상을 뺀 전부에 `inert` + `aria-hidden="true"`. 이미 남이 `inert` 를 건 요소는 건드리지 않고, 해제할 때 `aria-hidden` 원래 값을 복원한다
  - 원본은 Pages Router 의 `#__next` 를 특정했지만 App Router 에는 그 요소가 없어 **프레임워크 비의존 방식**으로 바꿨다
- 스크롤 잠금: `body.nui-is-prevent-scroll` (`position: fixed; overflow: hidden`) + `--nui-scroll-lock-top` 에 기록한 위치를 해제 시 `window.scrollTo` 로 복원
- 언마운트 시 강제 원복 — 팝업이 열린 채 라우팅돼도 문서가 잠기지 않는다

### 모션 — `prefers-reduced-motion` 미적용 ⚠️

- 패널·dim 은 `framer-motion` 으로 움직인다. 값은 `internal/motion.ts` 의 `motionTransition.panelDialog`(0.3s / `[0.16,1,0.3,1]`) / `panelDialogExit`(0.2s) / `overlayDialog`(0.22s) / `overlayDialogExit`(0.18s)
- **`PopupBase` 는 `useReducedMotion()` 을 쓰지 않는다.** `framer-motion` 의 `reducedMotion` 기본값은 `"never"` 이고, seed 토큰의 `@media (prefers-reduced-motion: reduce)` 는 CSS `--nui-duration-*` 만 `1ms` 로 만든다. 즉 **팝업의 열기·닫기 모션은 모션 감소 설정을 따르지 않는다.** (같은 계열인 `Accordion` / `Datepicker` 는 `useReducedMotion()` 을 쓴다)
- 반면 닫기 버튼의 색·transform 전환은 `motion()` 믹스인 → CSS duration 토큰이므로 감소 설정을 따른다

## 의존성

새로 추가되는 것은 없다. 전부 기존 `dependencies` 다.

| 라이브러리 | 분류 | 근거 |
| --- | --- | --- |
| `framer-motion` | dep | `AnimatePresence` / `motion` — 내부 구현 전용. 소비자와 인스턴스를 공유할 필요가 없다 |
| `zustand` | dep | `popup.store` 는 우리 모듈 스코프의 싱글턴이다. 소비자가 같은 store 를 만들 일이 없다 |
| `classnames` | dep | 클래스 조합 |
| `react-dom` | peer | `createPortal`. React 와 같은 인스턴스여야 한다 |

스타일 엔트리는 `styles/popup.css` 이고 `abstracts/layer` + `base/normalize` + `base/scroll-lock` + `components/icon` + `components/button` + `components/popup` 을 포함한다 (Alert·Confirm 푸터가 Button·ButtonGroup 을 렌더하므로 단독 동작을 위해 함께 묶는다).

## 비범위

- **반응형**(브레이크포인트) — 보류 상태. 원본은 데스크톱에서 내부 여백을 `card → section` 으로 키웠으나 `card` 값으로 통일했다 (`_popup.scss` 주석)
- 드래그로 닫기 / 스와이프 제스처
- 중첩 스크롤 컨테이너의 스크롤 체이닝 제어
- 팝업 내용의 지연 로딩·프리페치
- 열려 있는 팝업의 props 갱신 — store 는 같은 id 재등록을 `Error` 로 막는다
- `LayerPopup` 전용 CSS — `.nui-layer-popup` 은 현재 규칙이 없는 훅 클래스다

## Open Questions

1. **`--nui-popup-width` 가 size variant 를 무력화한다.** `small` / `regular` / `large` 세 규칙이 같은 공개 훅 이름을 읽으므로, 소비자가 `:root` 에 한 번 설정하면 세 크기가 전부 같아진다. `styles.md` §3 의 `iv()` 분리 패턴(`--nui-_popup-width` 배선 + variant 별 훅)으로 바꿀지 결정 필요. 바꾸면 기존 오버라이드의 동작이 달라지므로 **breaking** 이다.
2. **팝업 모션에 `prefers-reduced-motion` 을 적용할지.** `Accordion` / `Datepicker` 는 `useReducedMotion()` 을 쓰는데 `PopupBase` 는 쓰지 않아 계열 간 정책이 갈린다. `a11y.md` §6 의 취지상 적용이 맞아 보이나, 적용하면 팝업 열림이 즉시 전환되므로 의도된 선택인지 확인 필요.
3. **선언형 사용 시 `isTopmost` 기본값.** 현재 `false` 라 소비자가 명시하지 않으면 ESC·포커스 트랩이 조용히 죽는다(문서 데모는 명시적으로 준다). 기본값을 `true` 로 두고 Host 가 `false` 를 주입하는 형태가 안전할 수 있으나, 이 역시 **breaking** 이다.
4. **선언형 팝업에 스크롤 잠금·배경 inert 가 없다.** 현재 두 기능은 store 항목 수(`items.length > 0`)로만 판단하므로 `<LayerPopup open>` 을 직접 쓰면 배경이 스크롤되고 inert 도 걸리지 않는다. 의도된 분업인지, `PopupBase` 로 내려야 하는지 확인 필요.
