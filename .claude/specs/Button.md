# Button

> 구현에서 역추출한 명세다. **구현이 정본**이며, 여기 적힌 값은 모두 아래 파일에서 읽어낸 사실이다.
> 근거: `src/components/Button/{Button,IconButton,ButtonGroup,ButtonLink,index}.tsx|ts`,
> `src/styles/components/_button.scss`, `src/styles/entries/button.scss`, `package.json`

## 목적

색·형태·크기 조합을 토큰으로 고정한 액션 트리거를 제공하고, 같은 시각 계약을 아이콘 전용 버튼(`IconButton`)·링크(`ButtonLink`)·가로 배치(`ButtonGroup`)까지 한 벌의 클래스로 공유한다.

## 공개 API

### Button

`ButtonProps = ButtonBaseProps & ButtonDesignProps & ButtonHTMLAttributes<HTMLButtonElement>`

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — (필수) | 라벨. `.nui-button__wrap` 안에 들어간다 |
| `icon` | `ReactNode` | `undefined` | 있으면 라벨 앞에 `.nui-button__icon` 으로 감싸 렌더 |
| `color` | `"black" \| "primary" \| "secondary" \| "point"` | `"black"` | `black` 은 클래스 없음(기본), 나머지는 `--<color>` modifier |
| `variant` | `"solid" \| "line" \| "text"` | `"solid"` | `solid` 는 클래스 없음(기본) |
| `shape` | `"round" \| "square"` | `"square"` | `variant: "text"` 일 때는 타입으로 금지 |
| `size` | `"large" \| "medium" \| "small"` | `"large"` | `variant: "text"` 일 때는 타입으로 금지 |
| `className` | `string` | `undefined` | 생성된 클래스 뒤에 합쳐진다 |
| 그 외 | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `disabled` `onClick` `aria-*` 등 그대로 DOM 에 전달 |

- **uncontrolled 개념 없음** — 값을 소유하지 않는 순수 표현 컴포넌트다. RHF 래퍼도 없다.
- `type` 은 `"button"` 을 먼저 쓰고 `{...rest}` 를 **뒤에** 펼치므로 소비자가 `type="submit"` 으로 덮을 수 있다.
- `className` 은 `rest` 에서 제외한 뒤 `getButtonClassName()` 결과로 다시 지정하므로 **항상 병합된 값이 최종**이다.
- `ButtonDesignProps` 는 판별 유니온이다. `variant: "text"` 분기에서 `shape?: never` / `size?: never` 이며, `{ variant: "text", size: "small" }` 은 컴파일 에러다(확인 완료).

### 공개 헬퍼 (배럴에서 export)

| export | 시그니처 | 용도 |
| --- | --- | --- |
| `getButtonClassName` | `(params: ButtonClassNameParams) => string` | 버튼 클래스 문자열 생성. `size/color/variant/shape` 기본값은 Button 과 동일 |

`getButtonContentElement` 는 **export 되지 않는다**(`Button.tsx` 안에서만 export, `index.ts` 미노출). `ButtonLink` 가 내부적으로 쓴다.

### IconButton

`IconButtonProps = Omit<ButtonProps, "icon" | "variant"> & { variant?: "solid" | "line" }`

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — (필수) | **아이콘 자체**. `.nui-button__icon` 으로 감싼다. 라벨 텍스트 없음 |
| `variant` | `"solid" \| "line"` | `"solid"` | `text` 는 타입에서 제거 |
| `color` / `size` / `shape` / `className` | Button 과 동일 | `black` / `large` / `undefined` / `undefined` | `shape` 는 기본값을 주지 않고 `getButtonClassName` 의 기본(`square`)에 위임 |

- `Omit` 은 유니온을 분배하지 않으므로 `IconButtonProps` 에서는 **text 배타 규칙이 사라지고 `size`/`shape` 가 항상 허용**된다(확인 완료). `variant: "text"` 자체는 타입에서 막힌다.
- 항상 `.nui-button--icon` 이 `className` 에 합쳐진다.

### ButtonLink

`ButtonLinkProps = ButtonBaseProps & ButtonDesignProps & Omit<ComponentProps<typeof Link>, "children" | "className">`

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `href` | `next/link` 의 `href` | — (필수) | `next/link` 타입을 그대로 상속 |
| `children` / `icon` / `color` / `variant` / `size` / `shape` / `className` | Button 과 동일 | 동일 (`shape` 만 미지정 → 헬퍼 기본 `square`) | |

- 렌더 결과는 `<a>`(next/link)다. `type`·`disabled` 개념이 없다.

### ButtonGroup / ButtonGroup.Item

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `ButtonGroup.children` | `ReactNode` | — (필수) | `.nui-button-group__wrap` 안에 배치 |
| `ButtonGroup.className` | `string` | `undefined` | 루트에 병합 |
| `Item.children` | `ReactNode` | — (필수) | 보통 `Button` 하나 |
| `Item.className` | `string` | `undefined` | item 에 병합 |
| `Item.shouldAutoWidth` | `boolean` | `false` | `true` 면 `--auto` modifier → 내용 폭 |

## 합성 구조

| dot notation | named export | 렌더 |
| --- | --- | --- |
| `ButtonGroup` | `ButtonGroup` (default) | `div.nui-button-group > div.nui-button-group__wrap` |
| `ButtonGroup.Item` | `ButtonGroupItem` | `div.nui-button-group__item` |

`ButtonGroup` 은 `Object.assign(ButtonGroupRoot, { Item })` 이다. RSC 에서 client reference 프록시의 정적 프로퍼티는 `undefined` 이므로 **Server Component 에서는 `ButtonGroupItem` 을 쓴다**(`.claude/rules/components.md` §2).

Button / IconButton / ButtonLink 는 합성 구조가 없다.

## 상태

`.nui-is-*` 상태 클래스를 **쓰지 않는다.** 상태는 전부 네이티브 속성/의사클래스로 표현한다.

| 상태 | 셀렉터 | 변화 |
| --- | --- | --- |
| default | `.nui-button` | `--nui-_button-shadow`(= `shadow-soft`), 배경/테두리 = `--nui-_button-main` |
| hover | `:not([disabled]):hover` | 그림자 `shadow-base`, `translateY(-1px)` |
| | `--line:not([disabled]):hover` | 추가로 배경 `surface-neutral-soft` |
| | `--text:not([disabled]):hover` | `opacity: .72`, **`transform: none`** (들림 취소) |
| focus-visible | `:focus-visible` | `outline: focus-ring-width solid focus-color` + `focus-ring-offset`, `box-shadow: shadow-focus, hover 그림자`. `:focus` 는 쓰지 않는다 |
| active | `:not([disabled]):active` | 그림자 `shadow-press`, `translateY(1px)` |
| | `--line:not([disabled]):active` | 배경 `surface-neutral-subtle` |
| | `--text:not([disabled]):active` | `opacity: .56`, `transform: none` |
| disabled | `[disabled]` | `main → control-bg-disabled`, `fg → control-text-muted`, `box-shadow: none`, `opacity: .72`, `cursor: not-allowed` |
| | `[disabled].nui-button--line` | `main → control-border-disabled`, `fg → control-text-placeholder` |
| readonly / error | 없음 | 버튼에 해당 상태가 없다 |

**우선순위 처리**: disabled 가 hover/active 를 이기는 것을 소스 순서가 아니라 **모든 hover/active 규칙의 `:not([disabled])`** 로 보장한다(`.claude/rules/styles.md` §7). `focus-visible` 은 `[disabled]` 로 막지 않는데, 네이티브 `disabled` 버튼은 포커스를 받지 못하므로 실질적으로 도달하지 않는다.

## 클래스 계약

```
.nui-button                     블록 (Button / IconButton / ButtonLink 공통)
.nui-button__wrap               내용 정렬 컨테이너 (색·타이포 소유)
.nui-button__icon               아이콘 슬롯 (고정 크기)
.nui-button--primary            color=primary
.nui-button--secondary          color=secondary
.nui-button--point              color=point
.nui-button--line               variant=line
.nui-button--text               variant=text
.nui-button--round              shape=round      (variant=text 에서는 붙지 않는다)
.nui-button--medium             size=medium
.nui-button--small              size=small
.nui-button--icon               IconButton 전용 (정사각 고정)

.nui-button-group               ButtonGroup 루트
.nui-button-group__wrap         flex 컨테이너
.nui-button-group__item         2분할 기본(flex-basis: calc(50% - space-xs))
.nui-button-group__item--auto   shouldAutoWidth=true → fit-content
```

**기본값에는 modifier 를 붙이지 않는다** — `color="black"`, `variant="solid"`, `shape="square"`, `size="large"` 는 클래스가 생성되지 않는다.

⚠️ 원본의 camelCase `.buttonGroup` 은 **`.nui-button-group`(kebab)으로 정규화**했다. 프로젝트 내 다른 그룹 컴포넌트(`checkbox-group` 등)와 표기를 통일하기 위함이며, 클래스명 변경이므로 이식 시점의 **breaking** 에 해당한다(코드 주석에 근거 기록됨).

## 토큰

### 공개 훅 (`--nui-button-*`, 소비자가 덮어써도 안전)

| 훅 | fallback | 적용 위치 |
| --- | --- | --- |
| `--nui-button-bg` | `var(--nui-text-primary)` | 기본(black) 배경/테두리 |
| `--nui-button-color` | `var(--nui-text-inverse-strong)` | 라벨 색 |
| `--nui-button-primary-bg` | `var(--nui-color-primary)` | `--primary` |
| `--nui-button-secondary-bg` | `var(--nui-color-secondary)` | `--secondary` |
| `--nui-button-point-bg` | `var(--nui-color-point)` | `--point` |
| `--nui-button-radius` | 기본 `var(--nui-radius-xs)` / `--round` 에서 `var(--nui-radius-pill)` | 모서리 |
| `--nui-button-min-width` | `7.5rem` (120px) | 최소 폭 |
| `--nui-button-min-height` | large `var(--nui-size-field)` / medium `--nui-size-control-xl` / small `--nui-size-control-md` | 높이 |
| `--nui-button-padding-x` | large·medium `var(--nui-space-lg)` / small `var(--nui-space-md)` | 좌우 여백 |

⚠️ `--nui-button-radius` / `-min-height` / `-padding-x` 는 **size·shape modifier 가 같은 훅 이름을 재사용**한다. 소비자가 이 훅을 지정하면 modifier 별 차이가 사라지고 모든 size(또는 shape)가 같은 값이 된다 — 의도된 "전 사이즈 일괄 덮어쓰기" 동작이다.

### 내부 배선 (`--nui-_*`, 문서화 대상 아님 · 덮어쓰지 말 것)

`--nui-_button-main` · `--nui-_button-fg` · `--nui-_button-shadow` · `--nui-_button-shadow-hover` · `--nui-_button-shadow-active`

variant/color modifier 가 갈아끼우는 배선이다. 공개 훅과 이름을 분리한 이유는 unlayered 선언이 우리 레이어보다 항상 우선하기 때문이다(`.claude/rules/styles.md` §3).

### 사용하는 seed 토큰

- 색: `text-primary` `text-inverse-strong` `color-primary` `color-secondary` `color-point` `surface-neutral-soft` `surface-neutral-subtle` `control-bg-disabled` `control-text-muted` `control-border-disabled` `control-text-placeholder`
- 치수: `size-field`(56px) `size-control-xl`(48px) `size-control-md`(36px) `size-icon-2xl`(20px) `size-icon-lg`(16px) `space-2xs` `space-xs` `space-sm` `space-md` `space-lg` `border-width`
- 형태/그림자: `radius-xs` `radius-pill` `shadow-soft` `shadow-base` `shadow-press` `shadow-focus`
- 포커스: `focus-color` `focus-ring-width` `focus-ring-offset`
- 타이포: `font-family-base` `font-weight-regular`, `typo("body", "semi-bold", 1.2, -0.01em)` / small 은 `typo("body-sm", …)`
- 모션: `motion((background-color, border-color, color, box-shadow, transform, opacity))` → `duration-base` + `easing-standard`

### 자체 정규화 (전역 reset 미배포 대응)

`.nui-button` 안에서만 `appearance: none` · `margin: 0` · `font-family: var(--nui-font-family-base)` · `cursor: pointer` 를 지정한다. `box-sizing` 은 `base/_normalize.scss` 가 `[class^="nui-"]` 로 처리한다.

## 접근성

| 항목 | 구현이 보장하는 것 |
| --- | --- |
| 시맨틱 | `Button`·`IconButton` 은 `<button type="button">` (rest 로 덮기 가능), `ButtonLink` 는 `next/link` → `<a>`. 누르는 것과 이동하는 것을 분리했다 |
| disabled | 네이티브 `disabled` 속성. `aria-disabled` 를 쓰지 않으므로 포커스 대상에서 제외되고 클릭 이벤트가 발생하지 않는다 |
| 포커스 | `:focus-visible` 에서만 링. `outline` 을 제거하지 않고 **추가**하며 `shadow-focus` 를 겸한다 |
| 모션 | duration/easing 을 하드코딩하지 않고 `motion()` 믹스인을 쓰므로 `prefers-reduced-motion: reduce` 에서 1ms 로 무력화된다 |
| 키보드 | 네이티브 button/anchor 기본 동작(Enter·Space / Enter). 커스텀 키 핸들링 없음 |
| 접근 이름 | `Button`·`ButtonLink` 는 `children` 텍스트가 이름이 된다. **`IconButton` 은 텍스트가 없어 이름이 자동으로 생기지 않는다** — 소비자가 `aria-label`(rest 로 전달됨)을 주어야 한다. 컴포넌트가 강제하지 않는다 |
| 아이콘 | `.nui-button__icon` 은 순수 래퍼다. `aria-hidden` 을 붙이지 않으며, 장식/의미 구분은 전달된 아이콘 컴포넌트(`Icon` 의 `title` 유무)가 결정한다 |
| 그룹 | `ButtonGroup` 은 `div` 레이아웃일 뿐 `role="group"` 이나 접근 이름을 부여하지 않는다 |

## 의존성

| 대상 | 분류 | 근거 |
| --- | --- | --- |
| `classnames` | **dep** | 내부 클래스 조립 전용. 소비자와 인스턴스를 공유할 필요 없음 |
| `next` (`next/link`) | **peer (optional)** | `ButtonLink` **한 파일만** 사용한다. 라우터 인스턴스를 소비자 앱과 공유해야 하므로 peer, 안 쓰는 소비자를 위해 optional. `peerDependenciesMeta.next.optional = true`, 범위 `>=14` |
| `react` / `react-dom` | peer | 라이브러리 공통 |

새로 추가되는 외부 라이브러리는 없다.

**패키징**: 서브패스 `@chansikchoi/next-ui/button` (`src/button.ts` → `components/Button/index.js` 재export), 배럴에서도 재export. CSS 는 `styles/button.css`(entry 가 `abstracts/layer` + `base/normalize` + `components/button` 을 함께 `@use`).

## 비범위

- `loading` / `pending` 상태와 스피너 — 구현 없음
- `asChild` · 폴리모픽 `as` prop — 렌더 태그는 컴포넌트마다 고정
- `.nui-is-*` 상태 클래스 — 버튼은 네이티브 속성으로만 상태를 표현한다
- `ButtonGroup` 의 세로 배치·3분할 이상 프리셋 — `__item` 은 2분할 기본 + `--auto` 만 제공
- 반응형(브레이크포인트) — 프로젝트 전체가 보류 상태
- Field/RHF 연동 — 값을 소유하지 않으므로 해당 없음

## Open Questions

1. `IconButton` 의 접근 이름을 **타입으로 강제**할지(`aria-label` 필수화 또는 `label` prop + `sr-only` 자동 삽입). 현재는 소비자 책임이며 누락이 조용히 통과한다.
2. `ButtonGroup` 에 `role="group"` + 접근 이름(`aria-label` / `aria-labelledby`)을 부여할지. 현재는 순수 레이아웃 컨테이너다.
3. `--nui-button-min-height` / `-padding-x` / `-radius` 가 size·shape modifier 와 훅 이름을 공유하는 설계를 유지할지, size 별 훅(`--nui-button-min-height-small` 등)으로 쪼갤지. 현재 구현은 "일괄 덮어쓰기"로만 동작한다.
4. `.nui-button` 의 `width: 100%` 기본값 — 단독 사용 시 부모 폭을 채우는 것이 의도된 계약인지, 폭 제어용 공개 훅/modifier 가 필요한지.
5. `IconButton` 이 `size`/`shape` 를 받는 것이 의도인지 — `Omit` 유니온 비분배의 부수 효과일 가능성이 있다. `--icon` 은 `--medium`/`--small` 과의 조합만 CSS 를 갖고 `--round` 조합도 유효하지만, 이 조합이 명시적으로 설계된 것인지는 구현만으로 판단할 수 없다.
