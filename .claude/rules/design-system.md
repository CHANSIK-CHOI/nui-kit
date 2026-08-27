# 디자인 시스템 — 컴포넌트 공통 스타일 계약

이 문서의 목적은 하나다. **컴포넌트를 만들 때 "무슨 색을 쓸까"를 고민하지 않게 하는 것.**
상태와 역할이 정해지면 쓸 토큰이 **하나로 결정**된다. 고를 여지를 남기지 않는다.

> 왜 필요했나 — 계열별 이식을 마친 뒤 측정했더니 hover 배경에 세 가지 토큰이,
> 포커스 링에 세 가지 크기가 **기준 없이** 섞여 있었다. 토큰은 충분했지만
> **선택 규칙이 없어서** 컴포넌트마다 다르게 골랐다.

관련: [tokens.md](./tokens.md) · [styles.md](./styles.md) · [a11y.md](./a11y.md)

---

## 1. 토큰 3계층 — 컴포넌트는 Semantic 만 참조한다 ★

```
Primitive  →  Semantic  →  Component
색 원시값      역할 이름      공개 훅 / 내부 배선
color-primary  action-primary  --nui-button-primary-bg / --nui-_button-main
```

| 계층 | 예 | 컴포넌트에서 |
| --- | --- | --- |
| **Primitive** | `color-gray-500` `color-primary` `space-md` `radius-sm` | ❌ **색은 직접 참조 금지** |
| **Semantic** | `control-bg` `text-primary` `action-primary` `focus-color` | ✅ 이것만 쓴다 |
| **Component** | `--nui-button-bg`(공개 훅) / `--nui-_button-main`(내부 배선) | ✅ `hook()` / `iv()` |

**색이 아닌 primitive(`space-*` `radius-*` `size-*` `duration-*`)는 직접 써도 된다.**
치수·모션에는 역할 계층을 두지 않는다 — 이름이 이미 역할이다.

색만 계층을 강제하는 이유: 색은 브랜드·테마 교체의 대상이고, 컴포넌트가 primitive 를
직접 잡으면 **테마를 바꿔도 그 컴포넌트만 안 바뀐다.**

## 2. 역할군 ↔ CSS 속성 일치 ★

토큰 이름의 역할군과 쓰는 속성을 맞춘다. 교차 사용 금지.

| 역할군 | 토큰 | 쓰는 속성 |
| --- | --- | --- |
| 배경 | `*-bg*` `surface-*` | `background-color` |
| 테두리 | `*-border*` `border-*` | `border-color` `outline-color` |
| 글자 | `text-*` `*-text*` | `color` |
| 아이콘 | `control-icon*` | 아이콘의 `color` / `fill` |
| 강조 | `*-accent*` `action-*` | 배경·테두리 양쪽 (선택 상태를 채우는 색) |

❌ `background-color: var(--nui-text-primary)` — 글자색을 배경에 쓰지 않는다.
`verify:css` 가 기계 검사한다.

## 3. 상태 × 속성 매트릭스 — **이 표가 정본이다** ★

컴포넌트를 두 부류로 나눈다. 어느 쪽인지만 정하면 색은 표에서 읽는다.

- **입력 컨트롤** — 값을 타이핑하거나 목록에서 고르는 것
  `Textfield` `Textarea` `Search` `Password` `Select` `MultiSelect` `Datepicker` 계열
- **선택 컨트롤** — 켜고 끄는 것
  `Checkbox` `Radio` `Switch`

### 3-1. 입력 컨트롤

| 상태 | 배경 | 테두리 | 글자 | 아이콘 |
| --- | --- | --- | --- | --- |
| default | `control-bg` | `control-border` | `control-text` | `control-icon` |
| **hover** | (변화 없음) | `control-border-hover` | — | `control-icon-strong` |
| **focus** | — | `focus-color` + `border-width-focus` + `shadow-focus*` | — | — |
| **disabled** | `control-bg-disabled` | `control-border-disabled` | `control-text-disabled` | (opacity 0.2) |
| **readonly** | `control-bg-readonly` | `control-border-disabled` | `control-text-muted` | (opacity 0.6) |
| **error** | `control-bg` | `control-border-error` | `control-text-error` | — |
| placeholder | — | — | `control-text-placeholder` | — |

### 3-2. 선택 컨트롤

| 상태 | 배경 | 테두리 | 표시(체크·썸) |
| --- | --- | --- | --- |
| default | `control-bg` | `control-border` | — |
| **hover** | (변화 없음) | **`control-accent`** | — |
| **focus** | — | `focus-color` + `shadow-focus-strong` | — |
| **checked** | `control-accent` | `control-accent` | `text-inverse-strong` |
| **checked + error** | `control-accent-error` | `control-accent-error` | — |
| **checked + disabled** | `control-selection-disabled` | `control-selection-disabled` | — |
| disabled | `control-bg-subtle` | `control-border-disabled` | — |
| readonly | `control-bg-readonly` | (default 유지) | — |

> **hover 테두리가 두 부류에서 다른 것은 의도다.**
> 입력 컨트롤은 회색(`control-border-hover`), 선택 컨트롤은 초록(`control-accent`).
> "입력하는 것"과 "고르는 것"의 차이를 색으로 드러낸다.
> 선택 컨트롤은 hover 직후 클릭으로 값이 확정되므로 미리 강조한다.

### 3-3. 표면 hover (행·패널·아이콘 버튼)

목록 행, 패널 헤더, 아이콘 전용 버튼처럼 **면 전체가 반응**하는 경우.

| 상태 | 배경 |
| --- | --- |
| hover | **`control-bg-hover`** |
| 선택/활성 유지 | `control-accent-soft` |

`Accordion` 헤더, `Select` 옵션, `Datepicker` 날짜, `Popup` 닫기 버튼이 여기 해당한다.
❌ `surface-neutral-soft` / `surface-neutral-softest` 를 hover 에 쓰지 않는다 —
그 둘은 **정적인 면**(카드·구분 영역)의 배경이다.

### 3-4. 액션 (Button 계열)

| 상태 | solid | line | text |
| --- | --- | --- | --- |
| default | 배경·테두리 `action-*` / 글자 `action-fg` | 테두리·글자 `action-*` | 글자 `action-*` |
| hover | 그림자 `shadow-base` + `-1px` | 배경 `action-bg-hover` | `opacity .72` |
| active | 그림자 `shadow-press` + `+1px` | 배경 `action-bg-active` | `opacity .56` |
| disabled | 배경 `action-bg-disabled` / 글자 `action-fg-disabled` | 테두리 `action-border-disabled` / 글자 `action-fg-line-disabled` | 동일 |

`action-*` 의미색: `action-bg`(기본 검정) · `action-primary` · `action-secondary` · `action-point`

## 4. 포커스 링 — 크기로 고른다 ★

`:focus-visible` 로만 그린다. `:focus` 를 쓰지 않는다 ([a11y.md](./a11y.md) §5).

| 컨트롤 높이 | 링 토큰 | 쓰는 곳 |
| --- | --- | --- |
| **36px 미만** | `shadow-focus-sm` | 달력 날짜 버튼, 년/월 셀렉트 |
| **36px 이상** | `shadow-focus` | Textfield · Select · Datepicker 입력 · Button |
| **선택 컨트롤** | `shadow-focus-strong` | Checkbox · Radio · Switch (작지만 강조가 필요) |
| error 상태 | `shadow-focus-error` | 위 크기 규칙과 무관하게 에러면 이것 |

테두리 색은 항상 `focus-color`, 두께는 `border-width-focus`.

## 5. 너비 — 컴포넌트가 스스로 정한다 ★

**모든 컴포넌트가 `width: 100%` 는 아니다.** 아래 표가 정본이다.

| 너비 | 컴포넌트 | 이유 |
| --- | --- | --- |
| **`100%`** | `Textfield` `Textarea` `Search` `Password` `Select` `MultiSelect` `Datepicker` 계열 `Field` `Button` `ButtonLink` `Accordion` | 폼·블록 요소는 부모 폭을 채우는 것이 기본 레이아웃이다 |
| **자기 치수** | `Switch`(46×26) `Checkbox`·`Radio`(22×22) `IconButton`(정사각) `Toast` `Tooltip` | 내용과 무관하게 고정된 크기를 갖는다 |
| **내용 폭** | `ButtonGroup.Item--auto` | 소비자가 명시적으로 요청했을 때만 |

- **고정 폭과 외부 레이아웃은 컴포넌트가 소유하지 않는다.** `margin` 으로 바깥 간격을
  만들지 않는다 — 배치는 부모의 책임이다.
- `fullWidth` 같은 레이아웃 prop 을 두지 않는다. 폭을 바꿔야 하면 소비자가 `className`
  이나 공개 훅으로 한다.

## 6. 모션 ★

| 수단 | 규칙 |
| --- | --- |
| **CSS 전환** | `motion()` 믹스인 또는 `--nui-duration-*` 토큰. 하드코딩 금지 |
| **framer-motion** | **반드시 `useReducedMotion()` 을 함께 쓴다** |

⚠️ **CSS 토큰의 `prefers-reduced-motion` 무력화(1ms)를 framer-motion 은 읽지 않는다.**
framer-motion 의 `reducedMotion` 기본값은 `"never"` 다. `motion.div` 에 `y`·`scale` 을
직접 주는 컴포넌트는 `useReducedMotion()` 으로 분기하지 않으면 **모션 감소 설정이 무시된다.**

```tsx
const shouldReduceMotion = useReducedMotion();

<motion.div
  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
  transition={shouldReduceMotion ? { duration: 0 } : motionTransition.popover}
/>
```

## 7. 새 컴포넌트를 추가하기 전에

아래를 **전부** 만족할 때만 라이브러리에 넣는다. 일회성 화면 요소를 컴포넌트로 만들지 않는다.

1. **반복 수요** — 둘 이상의 사용처 또는 명확한 재사용 시나리오
2. **책임 소유** — 무엇(상태·구조·표현)을 소유하는지 한 문장으로 설명 가능
3. **토큰 적합성** — 색·간격·치수가 위 매트릭스로 표현된다. 새 색이 필요하면 먼저 합의
4. **변형 예산** — variant 축 3개 이하. 넘으면 하위 컴포넌트나 slot 으로 분리
5. **상태 정의** — default/hover/focus/disabled 중 해당하는 것과 **해당 없는 것의 근거**
6. **검증 가능** — 문서 사이트 데모와 브라우저 확인 방법이 있다

## 8. 토큰이 없으면 만들지 말고 묻는다

매트릭스에 없는 색이 필요하면 **임의로 primitive 를 끌어다 쓰지 않는다.**
(a) 기존 semantic 중 가장 가까운 것을 쓸지, (b) 새 semantic 을 만들지 사용자에게 확인하고
결정을 spec 에 남긴다. 값이 같아도 **역할이 다르면 이름을 나눈다** —
`control-bg-hover` 와 `control-bg-subtle` 은 지금 같은 값이지만 역할이 다르므로 별개다.
