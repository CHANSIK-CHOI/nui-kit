# Button

> 액션 트리거. 같은 시각 계약을 아이콘 전용(`IconButton`)·링크(`ButtonLink`)·가로 배치
> (`ButtonGroup`)까지 한 벌의 클래스로 공유한다.

## 0. 파일 배치

- **본체**: `src/components/Button/{Button,IconButton,ButtonGroup,ButtonLink}.tsx`
- **배럴**: `src/components/Button/index.ts`
- **서브패스**: `src/button.ts` → `@chansikchoi/next-ui/button`
- **스타일**: `src/styles/components/_button.scss` + `entries/button.scss`
- **RHF 래퍼**: 없음 — 값을 소유하지 않는다
- **문서**: `apps/docs/src/app/components/button/`

---

## 1. 개요

색·형태·크기 조합을 토큰으로 고정한 액션 트리거다. 누르는 것은 `Button`,
이동하는 것은 `ButtonLink`(`next/link`)로 나눈다.

### 라이브러리 등록 근거

원본(`../next-ui-components-guide`)에서 이식. 파일럿 3종 중 하나다.

---

## 2. 영역 구성

- ① **루트** — `<button>` 또는 `<a>`. 크기·배경·테두리를 소유 / 필수
- ② **wrap** — 내용 정렬 컨테이너. 글자색·타이포를 소유 / 필수
- ③ **icon** — 아이콘 슬롯. 고정 크기 / 선택

---

## 3. 공개 API

### 3-1. Props

**Button** — `ButtonBaseProps & ButtonDesignProps & ButtonHTMLAttributes<HTMLButtonElement>`

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — (필수) | 라벨 |
| `icon` | `ReactNode` | — | 라벨 앞 아이콘 |
| `color` | `"black" \| "primary" \| "secondary" \| "point"` | `"black"` | |
| `variant` | `"solid" \| "line" \| "text"` | `"solid"` | |
| `shape` | `"round" \| "square"` | `"square"` | `variant="text"` 에서는 타입으로 금지 |
| `size` | `"large" \| "medium" \| "small"` | `"large"` | `variant="text"` 에서는 타입으로 금지 |
| `className` | `string` | — | 생성 클래스 뒤에 병합 |
| 그 외 | `ButtonHTMLAttributes` | — | `disabled` `onClick` `aria-*` 등 DOM 전달 |

`ButtonDesignProps` 는 **판별 유니온**이다. `variant: "text"` 분기에서 `shape?: never` /
`size?: never` 이므로 `{ variant: "text", size: "small" }` 은 컴파일 에러다.

**IconButton** — `Omit<ButtonProps, "icon" | "variant"> & { variant?: "solid" | "line" }`

`children` 이 **아이콘 자체**다. 항상 `.nui-button--icon` 이 붙는다.

**ButtonLink** — `ButtonBaseProps & ButtonDesignProps & Omit<ComponentProps<typeof Link>, "children" | "className">`

렌더 결과가 `<a>` 라 `type`·`disabled` 개념이 없다.

**ButtonGroup / ButtonGroup.Item**

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `Item.shouldAutoWidth` | `boolean` | `false` | `true` 면 내용 폭 |

**값 소유권** — 없음. 값을 소유하지 않는 순수 표현 컴포넌트다.

**받지 않는 prop** — 없음. `type` 은 `"button"` 을 먼저 쓰고 `{...rest}` 를 뒤에 펼치므로
소비자가 `type="submit"` 으로 덮을 수 있다(의도).

### 3-2. 합성 구조

| dot notation | named export | 렌더 |
| --- | --- | --- |
| `ButtonGroup.Item` | `ButtonGroupItem` | `div.nui-button-group__item` |

`Button` / `IconButton` / `ButtonLink` 는 합성이 없다.

### 3-3. 배럴에서 나가는 것

`getButtonClassName` — 버튼 클래스 문자열 생성기. 소비자가 버튼처럼 보이는 다른 요소를
만들 때 쓴다. `getButtonContentElement` 는 **공개하지 않는다**(`ButtonLink` 내부 전용).

---

## 4. Variant

| 축 | 값 | 비고 |
| --- | --- | --- |
| `color` | black / primary / secondary / point | `black` 이 기본, modifier 없음 |
| `variant` | solid / line / text | `solid` 가 기본, modifier 없음 |
| `shape` | square / round | `square` 가 기본 |
| `size` | large / medium / small | `large` 가 기본 |

**기본값에는 modifier 클래스를 붙이지 않는다.**

---

## 5. 상태

`.nui-is-*` 상태 클래스를 **쓰지 않는다.** 네이티브 속성과 의사클래스로만 표현한다.

| 상태 | 변화 |
| --- | --- |
| hover | 그림자 상승 + `translateY(-1px)`. `text` 는 `opacity .72` + 들림 없음 |
| active | 그림자 눌림 + `translateY(1px)`. `text` 는 `opacity .56` |
| focus-visible | 포커스 링 (design-system.md §4) |
| disabled | 네이티브 `disabled`. 그림자 제거 + `cursor: not-allowed` |

**우선순위** — disabled 가 hover/active 를 이기는 것을 소스 순서가 아니라 **모든 hover/active
규칙의 `:not([disabled])`** 로 보장한다 (styles.md §7). `focus-visible` 은 막지 않는데,
네이티브 `disabled` 버튼은 포커스를 받지 못해 실질적으로 도달하지 않는다.

`readonly` / `error` 는 **해당 없음** — 값을 갖지 않는 컴포넌트다.

---

## 6. 동작 규칙

- `className` 은 `rest` 에서 분리한 뒤 `getButtonClassName()` 결과와 병합해 다시 지정한다.
  그래서 소비자 클래스가 항상 최종에 남는다
- `icon` 이 있으면 라벨 앞에 `.nui-button__icon` 으로 감싸 렌더한다. 없으면 슬롯 자체가 없다

---

## 7. 접근성

| 항목 | 구현이 보장하는 것 |
| --- | --- |
| 시맨틱 | `<button type="button">` / `ButtonLink` 는 `<a>`. **누르는 것과 이동하는 것을 분리** |
| 접근 이름 | `Button`·`ButtonLink` 는 `children` 텍스트가 이름이 된다 |
| 키보드 | 네이티브 동작(Enter·Space / Enter). 커스텀 키 핸들링 없음 |
| 포커스 | `:focus-visible` 에서만 링. `outline` 을 제거하지 않고 **추가**한다 |
| 상태 전달 | 네이티브 `disabled` — `aria-disabled` 를 쓰지 않으므로 포커스 대상에서 빠지고 클릭이 발생하지 않는다 |
| 모션 | `motion()` 믹스인 → CSS duration 토큰. `prefers-reduced-motion` 에서 1ms 로 무력화된다 |

**소비자가 책임지는 것**
- **`IconButton` 의 접근 이름** — 텍스트가 없어 이름이 자동으로 생기지 않는다.
  `aria-label` 을 주어야 하며 **컴포넌트가 강제하지 않는다** (→ §13)
- `ButtonGroup` 의 그룹 이름 — `role="group"` 을 부여하지 않는다 (순수 레이아웃)

---

## 8. 외부 라이브러리

| 라이브러리 | 분류 | 근거 |
| --- | --- | --- |
| `classnames` | dep | 내부 클래스 조립 전용 |
| `next` (`next/link`) | **peer (optional)** | `ButtonLink` 한 파일만 사용. 라우터 인스턴스를 소비자와 공유해야 하므로 peer, 안 쓰는 소비자를 위해 optional |

---

## 9. 스타일

> 색·상태 토큰은 [design-system.md](../rules/design-system.md) §3 매트릭스를 따른다.

- **분류**: 액션 (§3-4)
- **너비**: `Button`·`ButtonLink` 는 `100%`, `IconButton` 은 자기 치수(정사각),
  `ButtonGroup.Item--auto` 는 내용 폭 (§5)
- **공개 훅**

  | 훅 | 기본값 |
  | --- | --- |
  | `--nui-button-bg` / `-color` | `action-bg` / `action-fg` |
  | `--nui-button-primary-bg` / `-secondary-bg` / `-point-bg` | `action-primary` / `-secondary` / `-point` |
  | `--nui-button-radius` | `radius-xs` (round 는 `radius-pill`) |
  | `--nui-button-min-width` | `7.5rem` |
  | `--nui-button-min-height` | size 별 `size-field` / `size-control-xl` / `size-control-md` |
  | `--nui-button-padding-x` | size 별 `space-lg` / `space-md` |

- **매트릭스 예외**: 없음
- **내부 배선**: `--nui-_button-main` / `-fg` / `-shadow*` — variant·color 가 갈아끼운다.
  공개 훅과 이름을 분리한 이유는 styles.md §3

⚠️ **`--nui-button-radius` / `-min-height` / `-padding-x` 는 size·shape modifier 가 같은 훅
이름을 재사용한다.** 소비자가 이 훅을 지정하면 modifier 별 차이가 사라진다 (→ §13)

---

## 10. 완료 조건

- [x] 4×3×2×3 조합이 서로 구분되게 렌더된다
- [x] `disabled` 에서 클릭 이벤트가 발생하지 않고 포커스를 받지 않는다
- [x] 마우스 클릭에는 포커스 링이 뜨지 않고 키보드 이동에는 뜬다
- [x] Server Component 에서 `ButtonGroupItem` 으로 렌더된다
- [x] `prefers-reduced-motion` 에서 전환이 멈춘다

---

## 11. 주요 위험과 검증 방법

| 위험 | 기대 결과 | 검증 방법 |
| --- | --- | --- |
| RSC dot notation | `ButtonGroup.Item` 이 Server Component 에서 `undefined` | named export 동반 (components.md §2) |
| 판별 유니온 | `variant="text"` + `size` 가 컴파일 에러 | `tsc --noEmit` |
| disabled 우선순위 | hover/active 가 disabled 를 덮지 않음 | 브라우저 (정적 검사로 안 잡힘) |

---

## 12. 제외 범위

- `loading` / 스피너 — 구현 없음
- `asChild` · 폴리모픽 `as` — 렌더 태그는 컴포넌트마다 고정
- `.nui-is-*` 상태 클래스 — 네이티브 속성으로만 표현
- `ButtonGroup` 의 3분할 이상 프리셋 — 2분할 + `--auto` 만
- 반응형 — 프로젝트 전체가 보류

---

## 13. Open Questions

1. **`IconButton` 의 접근 이름을 타입으로 강제할지.** 현재는 소비자 책임이고 누락이 조용히
   통과한다. `aria-label` 필수화 또는 `label` prop + `sr-only` 자동 삽입.
   → **타입을 조이는 것이므로 breaking.** 배포 전이 유일하게 싼 시점이다.
2. **`--nui-button-min-height` / `-padding-x` / `-radius` 가 size·shape 와 훅 이름을 공유하는
   설계를 유지할지.** 소비자가 한 번 설정하면 size variant 가 전부 무력화된다.
   size 별 훅으로 쪼개면 동작이 달라지므로 **breaking.**
3. **`ButtonGroup` 에 `role="group"` + 접근 이름을 부여할지.** 현재는 순수 레이아웃이다.
4. **`IconButton` 이 `size`/`shape` 를 받는 것이 의도인지.** `Omit` 이 유니온을 분배하지 않는
   부수 효과일 가능성이 있다. `--icon` 은 `--medium`/`--small` 조합만 CSS 를 갖는다.
