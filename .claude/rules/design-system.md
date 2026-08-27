# 디자인 시스템 — 컴포넌트 공통 스타일 계약

이 문서의 목적은 하나다. **컴포넌트를 만들 때 "무슨 색을 쓸까"를 고민하지 않게 하는 것.**
상태와 역할이 정해지면 쓸 토큰이 **하나로 결정**된다. 고를 여지를 남기지 않는다.

| 문서 | 담당 |
| --- | --- |
| [tokens.md](./tokens.md) | 토큰이 **어떻게 생겼는가** — 계층·이름·스케일 값 |
| **이 문서** | 어떤 상황에 **무엇을 고르는가** — 매트릭스 |

> 왜 필요했나 — 계열별 이식을 마친 뒤 측정했더니 hover 배경에 세 가지 토큰이,
> 포커스 링에 세 가지 크기가 **기준 없이** 섞여 있었다. 토큰은 충분했지만
> **선택 규칙이 없어서** 컴포넌트마다 다르게 골랐다.

기계 검사: `npm run verify:tokens` · 관련: [styles.md](./styles.md) · [a11y.md](./a11y.md)

---

## 1. 컴포넌트는 Semantic 색만 참조한다

계층 정의는 [tokens.md §1](./tokens.md) 에 있다. 요지만 다시 적는다.

- **색 primitive(`color-*`) 직접 참조 금지.** semantic 을 쓴다
- 색이 아닌 primitive(`space-*` `radius-*` `size-*` `duration-*`)는 직접 써도 된다
- variant 가 갈아끼우는 값은 공개 훅 `hook()` / 내부 배선 `iv()` 로 분리한다 ([styles.md §3](./styles.md))

역할군 ↔ CSS 속성 일치도 [tokens.md §4-2](./tokens.md) 를 따른다.
❌ `background-color: var(--nui-text-primary)` — 글자색을 배경에 쓰지 않는다.

## 2. 상태 × 속성 매트릭스 — **이 표가 정본이다** ★

컴포넌트를 두 부류로 나눈다. 어느 쪽인지만 정하면 색은 표에서 읽는다.

- **입력 컨트롤** — 값을 타이핑하거나 목록에서 고르는 것
  `Textfield` `Textarea` `Search` `Password` `Select` `MultiSelect` `Datepicker` 계열
- **선택 컨트롤** — 켜고 끄는 것
  `Checkbox` `Radio` `Switch`

### 2-1. 입력 컨트롤

| 상태 | 배경 | 테두리 | 글자 | 아이콘 |
| --- | --- | --- | --- | --- |
| default | `control-bg` | `control-border` | `control-text` | `control-icon` |
| **hover** | (변화 없음) | `control-border-hover` | — | `control-icon-strong` |
| **focus** | — | `focus-color` + `focus-width` + `focus-ring*` | — | — |
| **disabled** | `control-bg-disabled` | `control-border-disabled` | `control-text-disabled` | (opacity 0.2) |
| **readonly** | `control-bg-readonly` | `control-border-disabled` | `control-text-muted` | (opacity 0.6) |
| **error** | `control-bg` | `control-border-error` | `control-text-error` | — |
| placeholder | — | — | `control-text-placeholder` | — |

### 2-2. 선택 컨트롤

| 상태 | 배경 | 테두리 | 표시(체크·썸) |
| --- | --- | --- | --- |
| default | `control-bg` | `control-border` | — |
| **hover** | (변화 없음) | **`control-accent`** | — |
| **focus** | — | `focus-color` + `focus-ring-strong` | — |
| **checked** | `control-accent` | `control-accent` | `text-inverse-strong` |
| **checked + error** | `control-accent-error` | `control-accent-error` | — |
| **checked + disabled** | `control-selection-disabled` | `control-selection-disabled` | — |
| disabled | `control-bg-subtle` | `control-border-disabled` | — |
| readonly | `control-bg-readonly` | (default 유지) | — |

> **hover 테두리가 두 부류에서 다른 것은 의도다.**
> 입력 컨트롤은 회색(`control-border-hover`), 선택 컨트롤은 초록(`control-accent`).
> "입력하는 것"과 "고르는 것"의 차이를 색으로 드러낸다.
> 선택 컨트롤은 hover 직후 클릭으로 값이 확정되므로 미리 강조한다.

### 2-3. 표면 hover (행·패널·아이콘 버튼)

목록 행, 패널 헤더, 아이콘 전용 버튼처럼 **면 전체가 반응**하는 경우.

| 상태 | 배경 |
| --- | --- |
| hover | **`control-bg-hover`** |
| 선택/활성 유지 | `control-accent-soft` |

`Accordion` 헤더, `Select` 옵션, `Datepicker` 날짜, `Popup` 닫기 버튼이 여기 해당한다.
❌ `surface-neutral-soft` / `surface-neutral-subtle` 을 hover 에 쓰지 않는다 —
그 둘은 **정적인 면**(카드·구분 영역)의 배경이다.

### 2-4. 액션 (Button 계열)

| 상태 | solid | line | text |
| --- | --- | --- | --- |
| default | 배경·테두리 `action-*` / 글자 `action-fg` | 테두리·글자 `action-*` | 글자 `action-*` |
| hover | 그림자 `shadow-2` + `-1px` | 배경 `action-bg-hover` | `opacity .72` |
| active | 그림자 `shadow-press` + `+1px` | 배경 `action-bg-active` | `opacity .56` |
| disabled | 배경 `action-bg-disabled` / 글자 `action-fg-disabled` | 테두리 `action-border-disabled` / 글자 `action-fg-line-disabled` | 동일 |

`action-*` 의미색: `action-bg`(기본 검정) · `action-primary` · `action-secondary` · `action-point`

### 2-5. 컨테이너 표면 (layer)

패널·팝업·시트처럼 **콘텐츠를 담는 것**의 배경.

| 층 | 토큰 | 예 |
| --- | --- | --- |
| 바닥 | `layer-basement` | 패널 안쪽 바닥, 비활성 영역 |
| 기본 | `layer-default` | 카드·리스트 표면 |
| 떠 있음 | `layer-floating` | 팝업·드롭다운·툴팁·달력 |
| 딤 | `layer-overlay` | 모달 뒤 배경 |

`surface-*` 는 **layer 가 아니다** — 콘텐츠 위에 얹는 톤(강조면·구분면)이다. 혼용하지 않는다.

## 3. 상태 × 상태 조합 — 우선순위와 합성 ★

상태는 겹친다. **어느 것이 이기는지**와 **함께 그릴 수 있는지**를 나눠 정한다.

### 3-1. 우선순위 — 하나만 이긴다

```
disabled  >  error  >  readonly
```

`.nui-is-*` 는 **상세도가 같아서** 소스 순서가 결과를 바꾼다. `:not()` 으로 명시한다
([styles.md §7](./styles.md)). 실제로 Switch 에서 `readonly` 가 `error` 를 덮어
에러 스위치가 초록으로 렌더된 적이 있다 — 정적 검사를 전부 통과했다.

### 3-2. 합성 — 함께 그린다

| 조합 | 결과 |
| --- | --- |
| `checked` + `error` | `control-accent-error` (2-2 매트릭스) |
| `checked` + `disabled` | `control-selection-disabled` (2-2 매트릭스) |
| **`hover` + `error`** | **테두리는 `control-border-error` 유지.** hover 로 덮지 않는다 — 에러가 사라진 것처럼 보인다 |
| **`focus` + `error`** | 테두리 `control-border-error` + 링 **`focus-ring-error`** (§4) |
| **`focus` + `readonly`** | readonly 도 포커스를 받는다. 링을 **그린다**. 배경은 `control-bg-readonly` 유지 |
| `hover` + `disabled` | **아무것도 그리지 않는다.** disabled 는 상호작용 상태와 합성하지 않는다 |
| `hover` + `readonly` | 테두리 변화 **없음** — 바꿀 수 없는 값에 반응을 주지 않는다 |

> **`disabled` 와 `readonly` 를 언제 쓰나** —
> `disabled` 는 "지금은 안 되지만 **조건이 맞으면 된다**"(필수 항목 미입력 시 제출 버튼).
> `readonly` 는 "**값은 보여주되 바꿀 수 없다**"(조회 전용 필드).
> 영구적으로 쓸 수 없는 것은 애초에 렌더하지 않는다.

## 4. 포커스 링 — 크기로 고른다 ★

`:focus-visible` 로만 그린다. `:focus` 를 쓰지 않는다 ([a11y.md §5](./a11y.md)).

| 컨트롤 높이 | 링 토큰 | 쓰는 곳 |
| --- | --- | --- |
| **36px 미만** | `focus-ring-sm` | 달력 날짜 버튼, 년/월 셀렉트 |
| **36px 이상** | `focus-ring` | Textfield · Select · Datepicker 입력 · Button |
| **선택 컨트롤** | `focus-ring-strong` | Checkbox · Radio · Switch (작지만 강조가 필요) |
| error 상태 | `focus-ring-error` | 위 크기 규칙과 **무관하게** 에러면 이것 |

테두리 색은 항상 `focus-color`, 두께는 `focus-width`.
`outline` 방식이든 `border` 방식이든 **같은 두께 토큰**을 쓴다.

⚠️ 포커스 링은 **elevation 이 아니다.** `shadow-*` 가 아니라 `focus-ring-*` 이다.

## 5. 타이포 매트릭스 — 역할이 정해지면 스케일이 결정된다 ★

| 역할 | 크기 | 두께 | 쓰는 곳 |
| --- | --- | --- | --- |
| **입력값 · 본문** | `font-size-4` (16px) | regular | Textfield · Textarea · Select 값 · 옵션 |
| **보조 텍스트** | `font-size-3` (14px) | regular | Popup 본문 · Accordion 본문 · Tooltip |
| **라벨** | `font-size-3` (14px) | medium | Field 라벨 |
| **캡션 · 설명 · 메시지** | `font-size-1` (12px) | regular | Field 설명 · Message · 에러 문구 |
| **소제목 · 그룹 라벨** | `font-size-1` (12px) | semi-bold | Select 그룹 라벨 · Datepicker 요일 |
| **액션 라벨** | `font-size-4` (16px) | semi-bold | Button 기본 |
| **액션 라벨 (small)** | `font-size-3` (14px) | semi-bold | Button small · Datepicker 날짜 |
| **제목** | `font-size-6` (20px) | bold | Popup 제목 |

**행간·자간은 같은 번호의 짝 토큰을 쓴다** (`font-size-4` ↔ `line-height-4` ↔ `letter-spacing-4`).
값이 필요하면 [tokens.md §3-3](./tokens.md) 표에서 읽는다.

> ⚠️ **현재 `typo()` 믹스인 호출부가 행간을 원시값으로 하드코딩하고 있다** —
> `1.12`~`1.7` 사이 10종이 기준 없이 흩어져 있다. 위 매트릭스가 그것을 대체한다.
> 이행은 컴포넌트 반영 단계에서 한다. [tokens.md §3-3](./tokens.md) 참조.

## 6. 모션 ★

### 6-1. 시간 — 0.2초가 경계

| 종류 | 시간 | 예 |
| --- | --- | --- |
| **마이크로** | `duration-4`(200ms) **이하** | 버튼 눌림, 포커스, 색·테두리 전환 |
| **매크로** | `duration-4` **초과** | 팝업 개폐, 시트 슬라이드, 페이지 전환 |

무엇이 움직이는지 정하면 얼마나 오래인지가 따라온다.

### 6-2. 곡선 — enter 와 exit 은 대칭이 아니다

| 상황 | easing |
| --- | --- |
| 색·테두리 등 **기능적 마이크로** | `easing-standard` |
| **나타남** (팝업·드롭다운·토스트 등장) | `easing-enter` |
| **사라짐** (닫힘·퇴장) | `easing-exit` |
| 강조가 필요한 등장/퇴장 | `easing-enter-emphasized` / `easing-exit-emphasized` |

**하나의 곡선으로 개폐 양방향을 처리하지 않는다.**
나타날 때는 결과를 인지할 시간을 주고, 사라질 때는 이미 끝난 것에 시간을 쓰지 않는다.

### 6-3. 구현 수단

| 수단 | 규칙 |
| --- | --- |
| **CSS 전환** | `motion()` 믹스인 또는 `--nui-duration-*` 토큰. **하드코딩 금지** |
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

## 7. 너비 — 컴포넌트가 스스로 정한다 ★

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
- ⚠️ **자기 치수를 갖는 컴포넌트는 라벨이 길어질 때 찌그러지지 않아야 한다.**
  번역 시 짧은 라벨은 최대 2.5배까지 늘어난다. 컨트롤은 `flex-shrink: 0` 이어야 한다.

## 8. 새 컴포넌트를 추가하기 전에

아래를 **전부** 만족할 때만 라이브러리에 넣는다. 일회성 화면 요소를 컴포넌트로 만들지 않는다.

1. **반복 수요** — 둘 이상의 사용처 또는 명확한 재사용 시나리오
2. **책임 소유** — 무엇(상태·구조·표현)을 소유하는지 한 문장으로 설명 가능
3. **토큰 적합성** — 색·간격·치수가 위 매트릭스로 표현된다. 새 색이 필요하면 먼저 합의
4. **변형 예산** — variant 축 3개 이하. 넘으면 하위 컴포넌트나 slot 으로 분리
5. **상태 정의** — default/hover/focus/disabled 중 해당하는 것과 **해당 없는 것의 근거**
6. **검증 가능** — 문서 사이트 데모와 브라우저 확인 방법이 있다

## 9. 토큰이 없으면 만들지 말고 묻는다

매트릭스에 없는 색이 필요하면 **임의로 primitive 를 끌어다 쓰지 않는다.**
(a) 기존 semantic 중 가장 가까운 것을 쓸지, (b) 새 semantic 을 만들지 사용자에게 확인하고
결정을 spec 에 남긴다. 값이 같아도 **역할이 다르면 이름을 나눈다** —
`control-bg-hover` 와 `control-bg-subtle` 은 지금 같은 값이지만 역할이 다르므로 별개다.

**그리고 왜 나눴는지를 주석에 남긴다.** 값이 같은 두 토큰은 반드시 나중에
"이거 중복 아닌가?" 라는 질문을 받는다.
