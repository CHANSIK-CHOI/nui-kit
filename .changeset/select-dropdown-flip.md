---
"@nui-kit/react": minor
---

`Select` · `MultiSelect` 의 메뉴와 `Datepicker` · `DateRangePicker` · `DateMultiplePicker` 의 달력이
**아래 공간이 모자라면 위로 뒤집힙니다.** 둘이 같은 규칙으로 열립니다.

- 화면 가장자리와 8px 를 띄웁니다
- 위아래 모두 모자라면 넓은 쪽으로 열리고, 높이는 줄지 않습니다
- 페이지는 스크롤하지 않습니다
- `hasPortal` 을 켜도 같습니다. 뒤집히면 메뉴 · 달력이 트리거 쪽에서 자랍니다

```tsx
<Select options={OPTIONS} />                        // 아래가 모자라면 위로 뒤집힌다 — 기본
<Select options={OPTIONS} menuPlacement="bottom" /> // 언제나 아래
<Select options={OPTIONS} menuPlacement="top" />    // 언제나 위
<Datepicker selected={date} onSelectedChange={setDate} /> // 달력도 같은 규칙
```

## BREAKING — 넷

**`Select` 의 `menuPlacement` 기본값이 `"bottom"` 에서 `"auto"` 로 바뀝니다.** 화면 아래쪽에 놓인 Select 를
열면 메뉴가 컨트롤 위에 뜹니다. 언제나 아래에 두려면 `menuPlacement="bottom"` 을 줍니다. `Datepicker` 계열은
방향을 고정하는 prop 이 없고 언제나 이 규칙을 따릅니다.

**`menuPlacement` 의 값은 `react-select` 문서와 뜻이 다릅니다.** `"auto"` 는 위치 모드(`absolute` · `fixed`)와
상관없이 화면 기준으로 뒤집고, `"bottom"` · `"top"` 은 그 방향에 고정합니다. `react-select` 에서는 `"bottom"`
이어도 `menuPosition="fixed"` 면 뒤집혔고, `"auto"` 여도 문서 중간에서는 뒤집히지 않았습니다.

**메뉴 목록의 높이가 줄어들지 않습니다.** 공간이 모자라면 예전에는 목록 높이를 남은 공간까지 줄였고, 이제는
뒤집거나 넓은 쪽으로 열린 채 `maxMenuHeight` 높이를 유지합니다. `styles.menuList` 의 `maxHeight` 와
`styles.menuPortal` 의 `height` · `pointerEvents` 는 이 라이브러리의 기본값이 갖습니다. 덮으면 방향
판정과 보이는 높이가 어긋납니다.

**portal 로 나간 메뉴의 래퍼를 이 라이브러리가 그립니다.** `components.MenuPortal` 의 기본값이 바뀌어 래퍼가
컨트롤을 직접 따라갑니다. `styles.menuPortal` 함수는 여전히 불리지만 결과가 **인라인 `style`** 로 들어가므로
`"&:hover"` · `"@media …"` 같은 키는 무시됩니다. 함수가 받는 `offset` 은 언제나 컨트롤의 윗변입니다 — 예전에는
메뉴가 열린 쪽의 변이었습니다. `components.MenuPortal` 을 자기 것으로 갈아끼우면 위로 뒤집힌 메뉴의 자리가 맞지
않습니다.

## 고친 것

- `hasPortal` 을 켠 `Datepicker` 계열의 달력이 열리고 닫힐 때 모션 없이 나타나고 사라지던 것을 고쳤습니다.
  이제 제자리 달력과 같은 등장 · 퇴장 모션이 재생됩니다
