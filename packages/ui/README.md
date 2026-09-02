# @chansikchoi/next-ui

Next.js **App Router 전용** React UI 컴포넌트 라이브러리.
모든 컴포넌트는 클라이언트 컴포넌트(`"use client"`)로 배포된다.

> 🚧 개발 중 (v0.0.0). 아직 npm 에 배포되지 않았습니다.

## 설치

```bash
npm install @chansikchoi/next-ui
```

`react` / `react-dom` 외에 **추가로 설치할 것은 없습니다.**
`react-hook-form` 은 RHF 래퍼(`/rhf`)를 사용할 때만 필요합니다.

```jsonc
"peerDependencies": {
  "react": "^18 || ^19",
  "react-dom": "^18 || ^19",
  "react-hook-form": ">=7.50.0",  // optional — /rhf 사용 시에만
  "next": ">=14"                  // optional — ButtonLink 사용 시에만
}
```

## 스타일 불러오기

### 전체

```ts
import "@chansikchoi/next-ui/styles/index.css";
```

### 온디맨드

```ts
import "@chansikchoi/next-ui/styles/tokens.css"; // 1회 필수
import "@chansikchoi/next-ui/styles/button.css";
```

### reset (선택)

기본 배포 CSS 에는 reset 이 **포함되어 있지 않습니다.** 필요할 때만 명시적으로:

```ts
import "@chansikchoi/next-ui/styles/preflight.css";
```

## 소비자 프로젝트에 영향을 주지 않는 이유

| 장치 | 내용 |
| --- | --- |
| 네임스페이스 | 모든 클래스가 `nui-` 프리픽스 (`.nui-button`) |
| Cascade Layers | 모든 CSS 가 `@layer nui.*` 안에 있어, 여러분의 unlayered CSS 가 **항상 우선** |
| reset 분리 | 전역 태그 셀렉터는 opt-in `preflight.css` 에만 존재 |
| 서드파티 격리 | 내부 사용 라이브러리 스타일도 `.nui-*` 스코프 안에서만 오버라이드 |

## 커스터마이징

**`!important` 는 필요 없습니다.** 이 라이브러리의 CSS 는 전부 `@layer nui.*` 안에
있고, 여러분이 그냥 쓴 CSS 는 레이어 밖입니다. Cascade 는 상세도보다 레이어를 **먼저**
보므로, 레이어 밖 규칙이 상세도와 무관하게 항상 이깁니다.

```css
/* 이것으로 충분합니다 */
.my-button {
  border-radius: 0;
}
```

오히려 `!important` 를 붙이면 자기 규칙끼리 부딪힙니다 —
`.my-button { border-radius: 0 !important }` 를 쓰면 `.my-button:hover` 의 값이 안 먹습니다.

### 색은 CSS 변수로 열지 않습니다

**색 변수는 공개 API 가 아닙니다.** 컴포넌트별(`--nui-button-bg`)이든
역할별(`--nui-action-primary`)이든 덮어쓰기를 권하지 않습니다.

배경과 글자는 짝이기 때문입니다. 배경만 바꾸면 글자색은 우리 값이 그대로 남아
대비가 깨지는데, **그 사실이 화면에 드러나지 않습니다.** 저시력 사용자에게만 영향을
줍니다.

색을 바꾸는 방법은 둘입니다.

| 범위 | 방법 |
| --- | --- |
| **한 컴포넌트만** | `className` 으로 직접 씁니다 |
| **전체** | 브랜드 색 프리셋 — **준비 중** |

```css
/* 한 컴포넌트만 — 배경과 글자를 같은 자리에 쓰게 되므로 짝을 놓치지 않습니다 */
.my-tooltip {
  background: #222;
  color: #fff;
}
```

**전체 브랜드 색은 프리셋으로 제공할 예정입니다.** 준비된 색 중 하나를 고르면
버튼·입력창·선택 컨트롤·회색까지 **대비를 유지한 채** 함께 바뀝니다.
그때까지는 색 변경을 `className` 으로 해주세요.

### 치수·모양·선 두께는 컴포넌트별로 엽니다

바꾸면 결과가 바로 보이고 짝이 없는 값들입니다. 이름은
`--nui-{컴포넌트}-{옵션?}-{요소?}-{속성}` 규칙을 따릅니다.

```css
:root {
  --nui-button-lg-height: 3.75rem; /* 버튼 · large 옵션 · 높이 */
  --nui-button-radius: 0;
  --nui-button-border-width: 2px;
}
```

| 컴포넌트 | 공개 변수 |
| --- | --- |
| Button | `-lg-height` `-md-height` `-sm-height` · `-lg-padding-x` `-md-padding-x` `-sm-padding-x` · `-min-width` · `-radius` `-round-radius` · `-border-width` |
| Popup | `-lg-width` `-md-width` `-sm-width` · `-radius` · `-border-width` |
| Textfield | `-height` · `-radius` · `-border-width` |
| Textarea | `-min-height` · `-radius` · `-border-width` |
| Select | `-height` · `-radius` · `-border-width` |
| Datepicker | `-dropdown-radius` · `-day-size` `-day-button-size` `-day-radius` · `-border-width` |
| Accordion | `-gap` · `-radius` · `-border-width` |
| Toast | `-width` · `-radius` |
| Tooltip | `-max-width` · `-radius` |
| Checkbox · Radio · Switch | `--nui-selector-size` · `--nui-selector-border-width` · `--nui-switch-width` `--nui-switch-height` |

크기 옵션이 있는 것은 옵션별로 이름이 나뉩니다. `--nui-button-md-height` 하나만 두면
`:root` 에 값을 넣는 순간 large·medium·small 이 전부 같은 높이가 되어 크기 variant 가
죽기 때문입니다.

> ⚠️ **`--nui-_` 로 시작하는 변수는 내부 배선입니다.** variant 가 갈아끼우는 수단이므로
> 덮어쓰면 variant 가 무력화됩니다. 공개 API 가 아니며 예고 없이 바뀔 수 있습니다.

## 컴포넌트

| 컴포넌트 | 서브패스 | 온디맨드 CSS |
| --- | --- | --- |
| `Button` · `IconButton` · `ButtonGroup`(`.Item`) · `ButtonLink` | `/button` | `button.css` |
| `Field`(`.Item` `.Grid` `.Label` `.Description` `.Message`) | `/field` | `field.css` |
| `Textfield` · `Search` · `Password` · `TextfieldBtn` · `Message` | `/textfield` | `textfield.css` |
| `Textarea` | `/textarea` | `textarea.css` |
| `Checkbox` · `CheckboxGroup` | `/checkbox` | `checkbox.css` |
| `Radio` · `RadioGroup` | `/radio` | `radio.css` |
| `Switch` | `/switch` | `switch.css` |
| `Select` · `MultiSelect` | `/select` | `select.css` |
| `Datepicker` · `DateRangePicker` · `DateMultiplePicker` | `/datepicker` | `datepicker.css` |
| `Accordion`(`.Item` `.Head` `.Button` `.Panel`) | `/accordion` | `accordion.css` |
| `PopupBase` · `Alert` · `Confirm` · `LayerPopup` · `BottomSheet` · `FullPopup` · `PopupHost` | `/popup` | `popup.css` |
| `Toast` · `ToastHost` | `/toast` | `toast.css` |
| `Tooltip` | `/tooltip` | `tooltip.css` |
| `Icon` | `/icon` | `icon.css` |

**서브패스 이름과 CSS 이름은 항상 같습니다.** 온디맨드로 쓸 때 헷갈릴 일이 없습니다.

`Toast` 와 팝업 계열을 **명령형으로**(`useToast()` · `useAlert()` · `useConfirm()` ·
`useLayerPopup()`) 쓰려면 Host 로 앱을 **감싸야** 합니다. 앱 루트에서 한 번만 합니다.

```tsx
// app/layout.tsx
import { PopupHost, ToastHost } from "@chansikchoi/next-ui";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <PopupHost>
          <ToastHost>{children}</ToastHost>
        </PopupHost>
      </body>
    </html>
  );
}
```

두 Host 모두 `children` 을 **필수**로 받는 래퍼입니다. portal 컨테이너는 없으면
직접 만들므로 따로 심을 필요가 없습니다.

**Host 가 없으면 명령형 팝업·토스트는 조용히 렌더되지 않습니다** — 에러도 경고도
나지 않습니다. `<LayerPopup open={...} />` 처럼 선언형으로 직접 렌더할 때는 Host 가
필요 없지만, 그 경우 배경 스크롤 잠금과 배경 `inert` 도 걸리지 않습니다.

### react-hook-form 래퍼

`@chansikchoi/next-ui/rhf` 에서 가져옵니다. `control` 만 넘기면 값과 에러를
스스로 소유합니다.

`RHFTextfield` · `RHFSearch` · `RHFPassword` · `RHFTextarea` ·
`RHFCheckbox` · `RHFRadio` · `RHFSwitch` ·
`RHFSelect` · `RHFMultiSelect` ·
`RHFDatepicker` · `RHFDateRangePicker` · `RHFDateMultiplePicker`

```tsx
import { useForm } from "react-hook-form";
import { RHFTextfield } from "@chansikchoi/next-ui/rhf";

const { control } = useForm<{ name: string }>();

<RHFTextfield control={control} name="name" rules={{ required: "필수입니다" }} />;
```

값과 변경 콜백은 RHF 가 소유하므로 `value` · `onChange` · `name` · `onBlur` 는
받지 않습니다 (날짜 계열은 `selected` · `onSelectedChange`).

## 사용

```tsx
// 배럴
import { Button, Field, Textfield } from "@chansikchoi/next-ui";

// 컴포넌트별 서브패스 (트리셰이킹)
import { Button } from "@chansikchoi/next-ui/button";
import { Textfield } from "@chansikchoi/next-ui/textfield";

// react-hook-form 래퍼 (react-hook-form 설치 필요)
import { RHFTextfield } from "@chansikchoi/next-ui/rhf";
```

배럴로 가져오든 서브패스로 가져오든 **같은 React Context 를 공유**하므로
`Field` + `Textfield` 조합을 서로 다른 경로에서 import 해도 정상 동작합니다.

### ⚠️ Server Component 에서 쓸 때 — dot notation 불가

모든 컴포넌트는 `"use client"` 로 배포됩니다. Server Component 에서 이들을 import 하면
React 는 client reference 프록시로 치환하는데, **정적 프로퍼티(dot notation)는 `undefined`
가 됩니다.** 그래서 서브 컴포넌트를 named export 로도 함께 제공합니다.

```tsx
// ❌ Server Component — 런타임 에러 (Element type is invalid)
<Field.Label>이름</Field.Label>

// ✅ Server Component — named export 사용
import { Field, FieldLabel } from "@chansikchoi/next-ui";
<FieldLabel>이름</FieldLabel>

// ✅ Client Component ("use client") — dot notation 사용 가능
<Field.Label>이름</Field.Label>
```

| dot notation | named export |
| --- | --- |
| `Field.Item` | `FieldItem` |
| `Field.Grid` | `FieldGrid` |
| `Field.Label` | `FieldLabel` |
| `Field.Description` | `FieldDescription` |
| `Field.Message` | `FieldMessage` |
| `ButtonGroup.Item` | `ButtonGroupItem` |
| `Accordion.Item` | `AccordionItem` |
| `Accordion.Head` | `AccordionHead` |
| `Accordion.Button` | `AccordionButton` |
| `Accordion.Panel` | `AccordionPanel` |

### ButtonLink 와 `next`

`ButtonLink` 만 `next/link` 를 사용합니다. `next` 는 optional peer 이므로
`ButtonLink` 를 쓰지 않으면 설치할 필요가 없습니다.

### Select / MultiSelect 와 `react-select`

`Select` 와 `MultiSelect` 는 내부적으로 `react-select` 을 씁니다. `react-select` 은
**dependency 이므로 따로 설치할 필요가 없고**, 소비자 프로젝트가 같은 라이브러리를
쓰더라도 서로 간섭하지 않습니다 — 우리 스타일은 `nui-select__*` 클래스만 겨냥합니다.

값은 옵션 객체가 아니라 **원시값**으로 주고받습니다.

```tsx
import { Select, MultiSelect } from "@chansikchoi/next-ui";

const OPTIONS = [
  { label: "서울", value: "seoul" },
  { label: "부산", value: "busan" },
];

<Select options={OPTIONS} value={city} onChange={setCity} />;
<MultiSelect options={OPTIONS} value={cities} onChange={setCities} />;
```

**스타일을 더 손볼 때 알아둘 것.** `react-select` 은 emotion 으로 스타일을
주입하는데, 그 클래스는 CSS 레이어 밖에 있어 `@layer nui.components` 안의 규칙보다
항상 우선합니다. 그래서 이 컴포넌트는 `unstyled` 로 구동하면서 **충돌하는 속성만
emotion 쪽에서 걷어내** CSS 가 책임지게 합니다.

- 치수·모양은 위 커스터마이징 절의 CSS 변수로 조정합니다
  (`--nui-select-height` / `-radius` / `-border-width`). 색은 `className` 으로 씁니다
- `styles` prop 을 직접 넘기면 그 정리된 값 위에 얹히므로 의도대로 덧칠됩니다
- 다만 **메뉴 최대 높이는 CSS 가 아니라 `maxMenuHeight` prop** 으로 조정합니다.
  `react-select` 이 메뉴 배치를 계산할 때 이 값을 참조하므로, CSS 로 덮으면
  실제 높이와 계산이 어긋납니다 (기본값 `240`)

**`value` 는 `options` 안에 존재하는 값이어야 합니다.** 옵션을 비동기로 불러오는
동안처럼 `options` 에 없는 값을 넣으면 선택이 표시되지 않고 placeholder 가 보입니다
(원시값 API 의 구조적 특성입니다).

**`components` 는 렌더 밖에서 선언하세요.** `react-select` 공식 권고이기도 합니다 —
매 렌더 새 컴포넌트 함수를 넘기면 내부 input 이 remount 되어 포커스와 입력 중이던
검색어가 사라집니다.

```tsx
// ❌ 렌더 안에서 컴포넌트를 새로 만든다
<Select components={{ Option: (props) => <CustomOption {...props} /> }} />

// ✅ 모듈 스코프에 한 번만 선언한다
const SELECT_COMPONENTS = { Option: CustomOption };
<Select components={SELECT_COMPONENTS} />
```

`styles` 는 컴포넌트가 아니라 함수 객체라 인라인으로 넘겨도 remount 되지 않습니다.

### Datepicker 계열과 `react-day-picker`

`Datepicker` · `DateRangePicker` · `DateMultiplePicker` 는 내부적으로
`react-day-picker` 를 씁니다. **dependency 이므로 따로 설치할 필요가 없고,
기본 CSS(`react-day-picker/style.css`)도 불러올 필요가 없습니다.**

```tsx
import { Datepicker, DateRangePicker } from "@chansikchoi/next-ui";

<Datepicker selected={date} onSelectedChange={setDate} />;
<DateRangePicker selected={range} onSelectedChange={setRange} />;
```

- 입력창은 직접 타이핑할 수 없습니다. 달력으로만 값을 바꿉니다
- `DateRangePicker` 는 시작·종료가 모두 정해지기 전까지 `undefined` 를 넘깁니다
- `dayPickerProps` 로 `react-day-picker` 설정을 그대로 전달합니다

**클래스 이름이 겹치지 않는 이유.** 라이브러리의 `classNames` 를 통째로
`nui-daypicker__*` 로 갈아끼운 뒤 우리 CSS 로 그립니다. 소비자 프로젝트가 같은
라이브러리를 따로 쓰더라도 서로 간섭하지 않습니다. 달력 세부 스타일을 손보려면
`nui-daypicker__day` 처럼 우리 클래스를 대상으로 하면 됩니다.

블록이 둘입니다 — `nui-datepicker`(입력 필드와 캘린더 팝업),
`nui-daypicker`(달력 내부).

`DateRange` 같은 타입과 기본 포맷터는 배럴에서 함께 내보냅니다.

```tsx
import { DateRangePicker, type DateRange } from "@chansikchoi/next-ui";
```

**알려진 제약**
- 기간(`DateRangePicker`)은 최소 2일입니다 — 하루짜리 기간은 만들 수 없습니다
- 캘린더 팝업은 portal 을 쓰지 않으므로 `overflow: hidden` 인 조상 안에서 잘릴 수
  있습니다 (`Select` 의 메뉴도 같습니다)
- 월 전환 애니메이션(`animate`)은 지원하지 않습니다
- 달력 컨트롤의 접근 이름은 한국어가 기본입니다. 다른 언어를 쓰려면
  `dayPickerProps.labels` 와 `calendarLabel` 을 함께 넘깁니다

## 라이선스

MIT
