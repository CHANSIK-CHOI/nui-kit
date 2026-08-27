# 토큰 체계 — 이름과 계층의 정본

이 문서는 **토큰이 어떻게 생겼는가**를 정한다.
**어떤 상황에 무엇을 고르는가**는 [design-system.md](./design-system.md) 의 매트릭스가 정한다.

기계 검사: `npm run verify:tokens` (`packages/ui/scripts/check-token-layers.mjs`)

---

## 1. 3계층 — 우리가 SEED 와 다른 이유 ★

```
Primitive        →  Semantic        →  Component
color-gray-900      text-primary       --nui-button-bg (공개 훅)
                                       --nui-_button-main (내부 배선)
```

| 계층 | 예 | 컴포넌트에서 |
| --- | --- | --- |
| **Primitive** | `color-gray-500` `color-primary` | ❌ **색은 직접 참조 금지** |
| **Semantic** | `control-bg` `text-primary` `action-primary` `layer-floating` | ✅ 이것만 쓴다 |
| **Component** | `hook()` 공개 / `iv()` 내부 | ✅ variant 배선 |

> **당근 SEED 는 2계층(Scale → Semantic)이고 Component 계층이 없다.**
> 사내 시스템이라 **소비자가 덮어쓰는 시나리오를 상정하지 않기 때문**이다.
> 우리는 npm 배포 라이브러리이고 "컴포넌트별로 소비자가 디자인을 바꿀 수 있게 한다"가
> 목표이므로 Component 계층이 **필수**다. 이것이 두 시스템의 구조적 차이다.
> 공개/내부 분리 규칙은 [styles.md §3](./styles.md) 을 따른다.

**색이 아닌 primitive(`space-*` `radius-*` `size-*` `duration-*`)는 직접 써도 된다.**
치수·모션에는 역할 계층을 두지 않는다 — 이름이 이미 역할이다.

색만 계층을 강제하는 이유: 색은 브랜드·테마 교체의 대상이고, 컴포넌트가 primitive 를
직접 잡으면 **테마를 바꿔도 그 컴포넌트만 안 바뀐다.**

## 2. 이름 짓는 규칙 — 숫자 스케일과 역할 이름 ★

| 성격 | 이름 | 대상 |
| --- | --- | --- |
| **등간격 스케일** | **숫자** — `space-4` `radius-2` `font-size-3` | space · radius · font-size · line-height · duration · shadow |
| **불규칙 실측값** | **역할** — `size-control-md` `size-field` | size 계열 전부 |
| **의미** | **역할** — `control-bg` `layer-floating` | 색 semantic, 의미 간격 |

숫자 스케일의 이점은 두 가지다 — **값이 이름에서 계산되고**, **중간값을 넣어도 기존
이름이 안 바뀐다**(`space-1` 과 `space-2` 사이에 `space-1_5`).
`size-icon-*` 처럼 값이 10·14·16·20·24px 로 불규칙한 것에는 **두 이점이 모두 없다.**
그래서 거기에는 숫자를 쓰지 않는다.

> t-shirt 사이즈(`md` `lg`)를 쓰지 않는 이유는 **중간값을 넣을 때마다 이름 논쟁이
> 벌어지기 때문**이다. `md` 와 `lg` 사이에 무엇을 넣을 것인가에는 답이 없다.

## 3. 스케일 정의

### 3-1. space — 4px 기준

| 토큰 | 값 |
| --- | --- |
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |

`space-7`·`space-9` 는 없다. **쓰이지 않아서 만들지 않았다** — 스케일은 기계적으로
채우는 것이 아니라 실사용에서 나온다. 필요해지면 이름 충돌 없이 추가한다.

#### 의미 간격 — "정해진 게 없으면 이것" ★

| 토큰 | 참조 | 언제 |
| --- | --- | --- |
| `space-component-gap` | `space-3` (12px) | **컴포넌트 내부 요소 사이에 규칙이 따로 없을 때의 기본값** |
| `space-panel-compact` | `space-4` (16px) | 좁은 패널·헤더 내부 여백 |
| `space-panel-card` | `space-6` (24px) | 카드·팝업 본문 여백 |

`space-component-gap` 이 있는 이유 — 모든 조합에 간격을 정의하려다 실패하는 대신
**fallback 을 명시적 토큰으로 만든다.** 그러면 임의의 값이 코드에 들어가는 경로가 막힌다.
(당근 SEED 의 `$dimension.spacing-y.component-default` 와 같은 장치다.)

### 3-2. radius — 4px 기준

| 토큰 | 값 | |
| --- | --- | --- |
| `radius-1` | 4px | |
| `radius-2` | 8px | |
| `radius-3` | 12px | |
| `radius-4` | 16px | |
| `radius-6` | 24px | |
| `radius-full` | 9999px | **pill** — 양끝이 완전한 반원 |
| `radius-circle` | 50% | **정사각 전용** |

⚠️ **`radius-circle`(50%)을 비정사각 요소에 쓰지 않는다.** 타원이 된다.
Switch 트랙(46×26)처럼 가로세로가 다른 것은 반드시 `radius-full` 이다.

### 3-3. font — 크기·행간·자간이 같은 번호로 묶인다 ★

| 번호 | `font-size-*` | `line-height-*` (배수) | `letter-spacing-*` |
| --- | --- | --- | --- |
| **1** | 12px | 1.5 → 18px | `0.08em` (작은 라벨은 넓힌다) |
| **2** | 13px | 1.46 → 19px | — |
| **3** | 14px | 1.5 → 21px | `-0.01em` |
| **4** | 16px | 1.5 → 24px | `-0.02em` |
| **5** | 18px | 1.44 → 26px | — |
| **6** | 20px | 1.4 → 28px | `-0.04em` |
| **8** | 32px | 1.19 → 38px | `-0.06em` |

**같은 번호끼리 짝지어 쓴다.** 배수가 일정하지 않은 것은 의도다 — 큰 글자일수록
줄 높이 배수를 줄이는 **광학 보정**이다. 단일 배수를 전 스케일에 적용하면 큰 제목이 헐거워진다.
자간은 반대로 큰 글자일수록 좁힌다.

`line-height` 를 배수(unitless)로 둔 것은 **소비자가 `font-size` 를 덮어도 비율이
유지되게** 하기 위함이다. 절대값(rem)이면 크기만 바뀌었을 때 행간이 깨진다.

| 두께 | 값 |
| --- | --- |
| `font-weight-regular` | 400 |
| `font-weight-medium` | 500 |
| `font-weight-semi-bold` | 600 |
| `font-weight-bold` | 700 |

800(extra-bold)은 두지 않는다. **4단계로 제한한다.**

> **시맨틱 타이포 토큰(`font-size-label` 등)을 새로 만들지 않는 이유** —
> 어느 컴포넌트가 어느 스케일을 쓰는지는 [design-system.md §6](./design-system.md) 의
> **타이포 매트릭스**가 정한다. 토큰으로 한 겹 더 감싸면 매트릭스와 토큰이 **두 개의 출처**가
> 되어 어긋난다.

#### ⚠️ 현재 상태 — `typo()` 믹스인이 토큰을 우회한다

`abstracts/_mixins.scss` 의 `typo($scale, $weight, $line-height, $letter-spacing)` 는
뒤의 두 인자를 **원시값으로 받는다.** 그리고 호출부 20곳이 거의 전부 그렇게 쓴다:

```scss
@include typo("body", "semi-bold", 1.2, -0.01em);   // ← line-height 가 토큰이 아니다
@include typo("body-sm", "regular", 1.7);
@include typo("title", "bold", 1.15);
```

그 결과 **`1.12` `1.15` `1.2` `1.35` `1.4` `1.45` `1.5` `1.55` `1.6` `1.7` —
행간 10종이 기준 없이 흩어져 있다.** `line-height-*` 토큰은 선언되어 있지만
거의 참조되지 않는다.

이는 [design-system.md](./design-system.md) 가 만들어진 이유(hover 배경 3종이 기준
없이 섞임)와 **같은 형태의 문제**다. 믹스인과 호출부를 숫자 스케일로 옮기는 것은
컴포넌트 반영 단계에서 처리한다. 그때까지 구 스케일 키(`label` `body-sm` `body`
`title` `display`)가 alias 로 살아 있다(§6).

### 3-4. size — 역할 이름을 유지한다

값이 불규칙하므로 숫자를 쓰지 않는다.

| 그룹 | 토큰 |
| --- | --- |
| 아이콘 | `size-icon-sm`(10px) `-md`(14) `-lg`(16) `-2xl`(20) `-3xl`(24) |
| 컨트롤 높이 | `size-control-sm`(32) `-md`(36) `-lg`(40) `-xl`(48) |
| 폼 | `size-field`(56) `size-control-option`(44) |
| 선택 컨트롤 | `size-selector`(22) `size-switch-track-w`(46) `-h`(26) `size-dot-xs`(6) `-sm`(8) |

⚠️ **터치 영역은 `size-control-option`(44px) 이 하한이다** — [a11y.md §8](./a11y.md).

### 3-5. duration — 0.2초가 마이크로/매크로 경계 ★

| 토큰 | 값 | 구분 |
| --- | --- | --- |
| `duration-1` | 50ms | 마이크로 |
| `duration-2` | 100ms | 마이크로 |
| `duration-3` | 150ms | 마이크로 |
| `duration-4` | 200ms | **경계** |
| `duration-5` | 250ms | 매크로 |
| `duration-6` | 300ms | 매크로 |

- **마이크로 모션** — 버튼 눌림, 포커스, 색 전환. `duration-4` **이하**
- **매크로 모션** — 팝업 개폐, 페이지 전환, 시트 슬라이드. `duration-4` **초과**

무엇이 움직이는지 정하면 얼마나 오래인지가 따라온다. 고를 여지를 남기지 않는다.

`prefers-reduced-motion: reduce` 에서 전 duration 이 `1ms` 로 무력화된다.
**컴포넌트에서 duration 을 하드코딩하면 이 장치를 우회한다.**

### 3-6. easing — enter 와 exit 은 대칭이 아니다 ★

| 토큰 | 값 | 언제 |
| --- | --- | --- |
| `easing-linear` | `linear` | 등속(스피너 등) |
| `easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` | 기능적 마이크로 모션 — 색·테두리 전환 |
| `easing-enter` | `cubic-bezier(0, 0, 0.15, 1)` | **나타남** — 빠르게 시작해 천천히 안착 |
| `easing-exit` | `cubic-bezier(0.35, 0, 1, 1)` | **사라짐** — 천천히 시작해 빠르게 빠짐 |
| `easing-enter-emphasized` | `cubic-bezier(0.03, 0.4, 0.1, 1)` | 강조가 필요한 등장 |
| `easing-exit-emphasized` | `cubic-bezier(0.35, 0, 0.95, 0.55)` | 강조가 필요한 퇴장 |

**하나의 easing 으로 개폐 양방향을 처리하지 않는다.**
나타날 때는 결과를 인지할 시간을 주고(느리게 끝남), 사라질 때는 이미 끝난 것에
시간을 쓰지 않는다(빠르게 끝남). 같은 곡선을 쓰면 이 차이가 사라진다.

### 3-7. shadow — 고도(elevation)와 포커스 링은 다른 것이다 ★

| 토큰 | 용도 |
| --- | --- |
| `shadow-1` | 낮은 부양 — 카드, 인라인 드롭다운 |
| `shadow-2` | 중간 — 팝오버, 메뉴, 달력 |
| `shadow-3` | 최상단 — 모달, 토스트 |
| `shadow-press` | 눌림 |

포커스 링은 `focus-ring-*` 이다. **`shadow-*` 가 아니다** — 고도를 표현하지 않기 때문이다.

| 토큰 | 언제 |
| --- | --- |
| `focus-ring` | 컨트롤 높이 **36px 이상** |
| `focus-ring-sm` | **36px 미만** (달력 날짜, 년/월 셀렉트) |
| `focus-ring-strong` | 선택 컨트롤 (Checkbox·Radio·Switch) |
| `focus-ring-error` | 에러 상태 — **크기 규칙과 무관하게 우선** |

컴포넌트 내부 전용 그림자(`shadow-thumb` `shadow-inset-*`)는 공개 훅으로 문서화하지 않는다.

## 4. 색 semantic

### 4-1. layer — 컨테이너 표면 ★

| 토큰 | 역할 |
| --- | --- |
| `layer-basement` | 가장 깊은 배경. 화면·패널의 바닥 |
| `layer-default` | 기본 표면. 대부분의 콘텐츠가 이 위에 놓인다 |
| `layer-floating` | 떠 있는 표면. 팝업·드롭다운·툴팁 |
| `layer-overlay` | 딤 |

**`layer-*` 는 '콘텐츠를 담는 컨테이너'의 표면색만 정의한다.** 텍스트·아이콘 같은
개별 요소가 아니라 UI 의 캔버스와 계층을 만드는 데만 쓴다.

> ⏸️ **다크 테마는 아직 없다.** 다만 다크 테마를 넣을 때 필요한 축이 `layer-*` 다 —
> "고도가 높을수록 밝아진다"는 규칙은 색을 반전시켜서는 만들어지지 않는다.
> `[data-theme]` 축을 열게 되면 **`layer-*` 를 먼저 정의하고 나머지를 얹는다.**

### 4-2. 역할군 ↔ CSS 속성 (기계 검사)

| 역할군 | 토큰 | 쓰는 속성 |
| --- | --- | --- |
| 배경 | `layer-*` `*-bg*` `surface-*` `status-*` | `background-color` |
| 테두리 | `*-border*` `border-*` | `border-color` `outline-color` |
| 글자 | `text-*` `*-text*` | `color` |
| 아이콘 | `control-icon*` | 아이콘의 `color` / `fill` |
| 강조 | `*-accent*` `action-*` | 배경·테두리 양쪽 |

❌ `background-color: var(--nui-text-primary)` — 글자색을 배경에 쓰지 않는다.

## 5. 토큰을 추가·제거할 때

### 5-1. 값이 같아도 역할이 다르면 이름을 나눈다 ★

`control-bg-hover` 와 `control-bg-subtle` 은 지금 같은 값이지만 **역할이 다르므로 별개다.**

**그리고 왜 나눴는지를 주석에 남긴다.** 값이 같은 두 토큰은 반드시 나중에
"이거 중복 아닌가?" 라는 질문을 받는다. 답을 미리 심어두지 않으면 언젠가 누군가 합친다.

### 5-2. 없으면 만들지 말고 묻는다

매트릭스에 없는 색이 필요하면 **임의로 primitive 를 끌어다 쓰지 않는다.**
(a) 기존 semantic 중 가장 가까운 것을 쓸지, (b) 새 semantic 을 만들지 사용자에게 확인하고
결정을 spec 에 남긴다.

### 5-3. 죽은 토큰은 제거한다

**선언만 되고 아무도 참조하지 않는 토큰을 남기지 않는다.** 있으면 다음이 벌어진다 —
누군가 "이미 있으니 쓰면 되겠지" 하고 매트릭스를 우회한다.

`npm run verify:tokens` 가 미사용 토큰을 경고한다. 다만 **대칭이 규칙인 세트**
(`status-error/success/warning/info-soft` 4종)는 일부만 쓰여도 함께 남긴다 —
하나를 빼면 다음에 쓸 사람이 그것만 없는 이유를 알 수 없다.

## 6. 이전 이름 (deprecated)

배포(0.1.0) 전까지 구 이름을 alias 로 유지한다. **배포 시점에 제거한다.**

| 구 이름 | 새 이름 |
| --- | --- |
| `space-2xs` `-xs` `-sm` `-md` `-lg` | `space-1` `-2` `-3` `-4` `-6` |
| `space-xl` `space-2xl` `space-panel-section` | **제거** (미사용) |
| `radius-xs`(5px) | `radius-1`(**4px** — 값이 1px 바뀐다) |
| `radius-sm` `-md` `-lg` `-xl` | `radius-2` `-3` `-4` `-6` |
| `radius-pill` `radius-pill-fluid` | `radius-full` |
| `radius-round` | `radius-circle` |
| `font-size-label` `-body-sm` `-body` `-title` `-display` | `font-size-1` `-3` `-4` `-6` `-8` (값 동일) |
| `line-height-label/…/display` | `line-height-1/3/4/6/8` (**배수가 바뀐다**) |
| `letter-spacing-label/…/display` | `letter-spacing-1/3/4/6/8` (값 동일) |
| `font-weight-label/…/display` | 스케일별 fallback — `typo()` 가 `$weight` 를 생략할 때만 |
| `font-weight-extra-bold` | **제거 예정** (`display` fallback 에서만 쓰인다) |
| `duration-quick/fast/base/slow/deliberate` | `duration-2`~`-6` (값 재정렬) |
| `easing-emphasized` | `easing-enter-emphasized` |
| `shadow-soft` `-base` `-overlay` | `shadow-1` `-2` `-3` |
| `shadow-focus` `-sm` `-strong` `-error` | `focus-ring` `-sm` `-strong` `-error` |
| `shadow-strong` `-dropdown*` `-toast` `-brand` `-ring-*` | **제거** — `shadow-1~3` 으로 수렴 |
| `surface-panel-strong` `-muted` | `layer-floating` |
| `surface-overlay-dim` | `layer-overlay` |
| `surface-neutral-softest` | **제거** (미사용) |
