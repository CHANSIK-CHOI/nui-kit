---
"@chansikchoi/next-ui": minor
---

`Datepicker` · `DateRangePicker` · `DateMultiplePicker` 를 추가했습니다.

입력 필드와 캘린더를 묶은 날짜 선택 컨트롤입니다. 값은 `Date` 객체로 주고받습니다.

```tsx
import { Datepicker, DateRangePicker } from "@chansikchoi/next-ui";

<Datepicker selected={date} onSelectedChange={setDate} />;
<DateRangePicker selected={range} onSelectedChange={setRange} />;
```

**구성**
- `Datepicker` 하나 / `DateRangePicker` 기간(`{ from, to }`) / `DateMultiplePicker` 여러 개(`Date[]`)
- `disabled` / `readOnly` / `isError` 상태, `infoMessage` · `errorMessage`
- `Field` 안에서 라벨 `htmlFor` · 컨트롤 `id` · `aria-describedby` 가 자동 연결됩니다
- `dayPickerProps` 로 `react-day-picker` 설정(`disabled` · `startMonth` · `locale` 등)을
  그대로 전달합니다
- 기본값: `placeholder="날짜를 선택해주세요"`, `displayFormat="yyyy.MM.dd"`,
  locale 은 `date-fns` 의 `ko`

**입력창은 직접 타이핑할 수 없습니다.** 달력으로만 값을 바꿉니다 — 잘못된 형식의
문자열이 값으로 들어오는 경로를 없앴습니다.

**`DateRangePicker` 는 기간이 완성되기 전까지 `undefined` 를 넘깁니다.** 시작일만
고른 상태가 폼에 들어가지 않습니다. 그동안 입력창에는 `2026.08.03 -` 처럼 표시됩니다.

**새 서브패스** `/datepicker` · **새 온디맨드 CSS** `styles/datepicker.css`
**RHF 래퍼** `RHFDatepicker` · `RHFDateRangePicker` · `RHFDateMultiplePicker` (`/rhf`)

**새 토큰** `--nui-shadow-dropdown-strong` · `--nui-shadow-focus-sm` · `--nui-text-info`
**새 아이콘** `CalendarIcon` (`TextfieldBtn` 의 `icon="date"`)

**공개 CSS 변수**
`--nui-datepicker-dropdown-bg` / `-dropdown-radius` /
`--nui-datepicker--day-size` / `-day-button-size` / `-day-radius`

**`react-day-picker` 의 기본 CSS 는 불러오지 않습니다.** 이 컴포넌트는 라이브러리의
`classNames` 를 통째로 `nui-daypicker__*` 로 갈아끼운 뒤 우리 CSS 로 그립니다.
소비자 프로젝트가 같은 라이브러리를 따로 쓰더라도 서로 간섭하지 않습니다.
달력 세부 스타일을 직접 손보려면 `nui-daypicker__day` 처럼 우리 클래스를 대상으로
하면 됩니다.

**클래스 블록이 둘입니다** — `nui-datepicker`(입력 필드와 캘린더 팝업),
`nui-daypicker`(달력 내부). `react-day-picker` 의 `dropdown`(년/월 셀렉트)과
캘린더 팝업이 이름을 다투지 않도록 분리했습니다.

**`DateRangePicker` 를 쓸 때 알아둘 것**
- 기간은 **최소 2일**입니다. 같은 날을 두 번 눌러 하루짜리 기간을 만들 수 없습니다
  (`dayPickerProps.min` 기본값 `1`)
- 캘린더가 열려 있는 동안에는 편집 중인 선택이 우선하므로, 그때 밖에서 `selected` 를
  바꿔도 화면에 반영되지 않습니다. 닫으면 넘긴 값으로 돌아옵니다
- `from` 만 고른 중간 상태에서는 `undefined` 가 통지됩니다. react-hook-form 과 함께
  `mode: "onChange"` 를 쓰면 종료일을 고르는 동안 에러 메시지가 잠깐 보일 수 있습니다 —
  `mode: "onBlur"` 나 `"onSubmit"` 을 권합니다

**받지 않는 prop**
- `animate` — 월 전환 애니메이션. `react-day-picker` 의 기본 CSS 를 배포하지 않아
  정리 시점(`animationend`)이 오지 않고 이전 달 DOM 이 쌓입니다
- RHF 래퍼에서는 `onSelectedChange` 도 받지 않습니다 (`RHFSelect` 가 `onChange` 를
  막는 것과 같은 정책)

**접근성**
- 달력 컨트롤(년/월 선택, 이전·다음 달)의 접근 이름을 한국어로 채웁니다.
  `dayPickerProps.labels` 로 덮을 수 있습니다
- 캘린더 팝업의 접근 이름은 `calendarLabel` prop 으로 바꿉니다
- 입력창은 `role="combobox"` 입니다 — `textbox` 는 `aria-expanded` 를 지원하지 않아
  펼침 상태가 보조기술에 전달되지 않습니다
- 날짜를 고르거나 `Esc` 로 닫으면 포커스가 입력창으로 돌아옵니다.
  바깥을 클릭해 닫을 때는 포커스를 가져오지 않습니다
- 검증 실패로 폼이 포커스를 옮길 때는 캘린더가 열리지 않습니다 — 에러 메시지를
  가리지 않기 위해서입니다
- `prefers-reduced-motion` 에서 팝업 애니메이션이 꺼집니다

**팝업은 portal 을 쓰지 않습니다.** `overflow: hidden` 인 조상 안에서는 캘린더가
잘릴 수 있습니다 (`Select` 의 메뉴도 같습니다).

**`DatepickerBase` 는 공개하지 않습니다.** 세 컴포넌트만 씁니다.
`DateRange` · `Matcher` · `Modifiers` · `DayPickerProps` 타입과 기본 포맷터
(`formatSingleDateValue` 등)는 배럴에서 함께 내보냅니다 — `react-day-picker` 가
dependency 라 소비자가 직접 import 할 수 없기 때문입니다.
