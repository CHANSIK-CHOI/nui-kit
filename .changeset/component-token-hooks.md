---
"@nui-kit/react": minor
---

컴포넌트가 여는 CSS 변수(공개 훅)를 재정비했습니다. **BREAKING** 이 포함됩니다.

기준은 하나입니다 — **잘못 바꿨을 때 자기 눈으로 알아챌 수 있으면 열고, 없으면 막는다.**

**⚠️ 색 변수 19개를 제거했습니다 (BREAKING)**

배경과 글자는 짝입니다. `--nui-button-primary-bg` 로 배경만 연하게 바꾸면 글자색은
우리 것이 그대로 남아 대비가 깨지는데, 그 사실이 화면에 드러나지 않고 저시력 사용자에게만
영향을 줍니다. 그래서 컴포넌트별 색 변수를 두지 않습니다.

```
--nui-button-bg           --nui-button-color
--nui-button-primary-bg   --nui-button-primary-color
--nui-button-danger-bg    --nui-button-danger-color
--nui-button-warning-bg   --nui-button-warning-color
--nui-datepicker-dropdown-bg  --nui-popup-bg  --nui-popup-dim
--nui-select-bg     --nui-select-border-color
--nui-textarea-bg   --nui-textarea-border-color
--nui-textfield-bg  --nui-textfield-border-color
--nui-toast-bg      --nui-tooltip-bg
```

색을 바꾸는 창구는 **둘**입니다.

| 범위 | 방법 |
| --- | --- |
| 전체 | **브랜드 색 프리셋** — 준비된 185색 중 하나를 고릅니다 |
| 한 컴포넌트만 | `.my-tooltip { background: #222; color: #fff }` |

`:root` 에서 색 변수를 직접 덮어쓰는 방식은 **지원하지 않습니다.**
`--nui-action-primary` 만 바꾸면 짝인 `--nui-action-primary-fg`(글자)는 우리 값이
남아 대비가 조용히 깨집니다 — 컴포넌트별 색 변수를 없앤 이유와 같은 문제입니다.

`className` 으로 바꾸면 배경과 글자를 같은 자리에 쓰게 되므로 짝을 놓치기 어렵습니다.
**`!important` 는 필요 없습니다** — 우리 CSS 는 전부 `@layer nui.*` 안에 있어
여러분의 레이어 밖 CSS 가 항상 이깁니다.

**⚠️ 크기 변수 이름이 나뉩니다 (BREAKING)**

이름이 하나뿐이면 `:root` 에 값을 넣는 순간 크기 variant 가 통째로 죽었습니다.
`--nui-button-min-height` 는 large·medium·small 세 자리에 같은 이름으로 뚫려 있었습니다.

| 이전 | 이후 |
| --- | --- |
| `--nui-button-min-height` | `--nui-button--lg-height` `-md-height` `-sm-height` |
| `--nui-button-padding-x` | `--nui-button--lg-padding-x` `-md-padding-x` `-sm-padding-x` |
| `--nui-button--radius` (round 겸용) | `--nui-button--radius` · `--nui-button--round-radius` |
| `--nui-popup-width` | `--nui-popup--lg-width` `-md-width` `-sm-width` |

이름 규칙은 `--nui-{컴포넌트}-{옵션?}-{요소?}-{속성}` 입니다 — "버튼의 lg 옵션의 높이".

**⚠️ Button 의 기본 크기가 large → medium 으로 바뀝니다 (시각 변화)**

기본 버튼 높이가 **56px → 48px** 로 작아집니다. 56px 을 쓰려면 `size="large"` 를
명시하세요. 기본이 가장 큰 것은 표준적이지 않고(위아래로 large·small 이 있는 형태가
표준입니다), 소비자가 `small` 을 "가장 작은 것"으로 읽는 것과도 어긋났습니다.
`IconButton` · `ButtonLink` 도 같습니다.

```tsx
<Button>확인</Button>              {/* 56px → 48px */}
<Button size="large">확인</Button>  {/* 56px 유지 */}
```

**선 두께 변수 8개를 새로 엽니다**

`--nui-button--border-width` · `-popup-` · `-textfield-` · `-textarea-` · `-select-` ·
`-accordion-` · `-datepicker-` · `--nui-selector--border-width`(Checkbox·Radio·Switch 공용).

한 컴포넌트 안의 테두리 두께는 **투명한 테두리까지 포함해** 하나로 묶었습니다.
선택 시에만 색이 생기는 자리를 빼놓으면, 두께를 2px 로 바꿨을 때 그 자리만 1px 로 남아
선택하는 순간 요소가 밀립니다.

포커스 링 두께(`--nui-focus-width`)에는 컴포넌트 훅을 두지 않습니다. 얇아지면 키보드
사용자만 영향을 받고 그 사실이 드러나지 않습니다 — 색과 같은 성격입니다.

**테두리가 사라져 있던 문제를 고쳤습니다**

토큰 이름이 `--nui-border-width` → `--nui-border-width-1` 로 바뀌었는데 참조 12자리가
따라오지 않았습니다. 선언되지 않은 변수를 읽으면 `border` **shorthand 전체가 무효**가
되어 `border-style` 이 `none` 으로 돌아갑니다 — 테두리가 그려지지 않고 요소 높이도
2px 줄어듭니다(브라우저에서 `borderTopStyle: "none"` · `borderTopWidth: "0px"` 확인).
Button · Textfield · Textarea · Select · Datepicker · Popup · Accordion ·
Checkbox · Radio · Switch 가 해당합니다.

**매직 넘버 6자리가 토큰이 됐습니다** (값은 그대로, 시각 변화 없음)

`--nui-opacity-icon-disabled`(0.2) · `-icon-readonly`(0.6) · `-hover`(0.72) ·
`-pressed`(0.56).
