---
"@nui-kit/react": minor
---

**BREAKING** `DateRangePicker` · `DateMultiplePicker` 에 확정 버튼이 생겼다. 날짜를 골라도 **확정을 누를 때까지 값이 나가지 않는다.**

```tsx
// 전 — 둘 다 고르는 순간 값이 나가고 닫혔다
// 후 — 고른 것은 달력 안에만 있고, 확정을 누를 때 한 번 나간다
<DateRangePicker selected={range} onSelectedChange={setRange} />
```

| | |
| --- | --- |
| `hasConfirmButton` | 기본 `true`. `false` 면 예전처럼 즉시 반영된다 |
| `confirmLabel` | 기본 `"선택 완료"` |

**미완성이면 버튼이 잠긴다** — 기간은 종료일이 없을 때, 다중은 아무것도 안 골랐을 때다. 확정하지 않고 `Escape` · 바깥 클릭으로 닫으면 고른 것을 버리고 열기 전 값으로 돌아간다.

**함께 고쳐진 것** — 기간 선택 중 시작일만 고르면 `onSelectedChange(undefined)` 가 불려 **소비자가 갖고 있던 기간이 지워졌다.** 이제 확정 전까지 값을 건드리지 않는다.

`Datepicker`(하루)에는 확정 버튼이 없다. 고른 순간 결과가 확정되므로 두 번 누르게 하지 않는다.
