---
"@chansikchoi/next-ui": minor
---

`Select` · `MultiSelect` 를 추가했습니다.

**값은 옵션 객체가 아니라 원시값으로 주고받습니다** — 폼 상태에 그대로 넣을 수 있습니다.

```tsx
import { Select, MultiSelect } from "@chansikchoi/next-ui";

const OPTIONS = [
  { label: "서울", value: "seoul" },
  { label: "부산", value: "busan" },
];

<Select options={OPTIONS} value={city} onChange={setCity} />;
<MultiSelect options={OPTIONS} value={cities} onChange={setCities} />;
```

`onChange` 의 첫 인자가 원시값(`MultiSelect` 는 원시값 배열)이고, 두 번째·세 번째로
`react-select` 의 옵션 객체와 `actionMeta` 가 함께 옵니다.

**구성**
- `disabled` / `readOnly` / `isError` 상태. 우선순위는 `disabled` > `error` > `readonly`
- `readOnly` 는 값을 보여주되 메뉴를 열지 않습니다 (`disabled` 와 달리 포커스는 받습니다)
- `infoMessage` / `errorMessage` 를 컨트롤에 직접 붙일 수 있습니다
- `Field` 안에서 라벨 `htmlFor` · 컨트롤 `id` · `aria-describedby` 가 자동 연결됩니다
- 옵션 그룹(`{ label, options }`)과 `isDisabled` 옵션을 지원합니다
- 기본값: `placeholder="항목을 선택해주세요"`, `isSearchable=false`,
  `isClearable=false`, `maxMenuHeight=240`

**새 서브패스** `/select` · **새 온디맨드 CSS** `styles/select.css`
**RHF 래퍼** `RHFSelect` · `RHFMultiSelect` (`/rhf`)

**새 토큰** `--nui-control-selection-text` · `--nui-size-control-option` ·
`--nui-z-portal-menu`(1031 — portal 로 body 에 붙는 드롭다운·달력. 팝업 1030 위)

**공개 CSS 변수**
`--nui-select--height` / `--nui-select--radius` / `--nui-select-border-color` /
`--nui-select-bg`

**`react-select` 은 dependency 입니다** — 따로 설치하지 않습니다. 소비자 프로젝트가
같은 라이브러리를 쓰더라도 서로 간섭하지 않습니다. 우리 스타일은 `nui-select__*`
클래스만 겨냥하며 `react-select` 의 기본 클래스를 전역에서 덮지 않습니다.

**메뉴 최대 높이는 CSS 가 아니라 `maxMenuHeight` prop 으로 조정합니다.**
`react-select` 이 메뉴 배치를 계산할 때 이 값을 참조하므로, CSS `max-height` 로
덮으면 실제 높이와 계산이 어긋납니다.

**스타일을 더 손볼 때** — `react-select` 은 emotion 으로 스타일을 주입하는데 그
클래스는 CSS 레이어 밖이라 `@layer nui.components` 안의 규칙보다 항상 우선합니다.
그래서 이 컴포넌트는 `unstyled` 로 구동하면서 충돌하는 속성만 emotion 쪽에서 걷어내
CSS 가 책임지게 합니다. `styles` prop 을 직접 넘기면 그 정리된 값 위에 얹힙니다.

**`components` 는 렌더 밖에서 선언하세요.** 매 렌더 새 컴포넌트 함수를 넘기면 내부
input 이 remount 되어 포커스와 검색어가 사라집니다 (`react-select` 공식 권고).
`styles` 는 함수 객체라 인라인으로 넘겨도 안전합니다.

**`value` 는 `options` 안에 존재하는 값이어야 합니다.** 없으면 placeholder 가 보입니다.

**받지 않는 prop** — `defaultValue`(controlled 전용) · `getOptionValue`(원시값 매칭이
`option.value` 고정) · `theme`(`unstyled` 라 효과 없음). 타입에서 제외했습니다.
