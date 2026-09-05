---
"@nui-kit/react": minor
---

**날짜를 직접 칠 수 있습니다.** `Datepicker` 와 `DateRangePicker` 의 입력창이 더 이상
읽기 전용이 아닙니다. 달력이 있어도 입력 필드를 사용 불가·읽기 전용으로 만들지 않는다는
KRDS 기준(가이드 675쪽 접근성 01)을 따른 것입니다.

**⚠️ 동작이 바뀝니다.** 예전에는 입력창이 `readonly` 라 달력으로만 값이 들어왔습니다.
예전 동작이 필요하면 `isTextInputBlocked` 를 주면 됩니다.

```tsx
<Datepicker isTextInputBlocked />        {/* 달력으로만 고르기 */}
```

**치는 규칙**

- 형식은 `displayFormat`(기본 `yyyy.MM.dd`). 기간은 `2026.09.01 - 2026.09.05` 처럼
  앞뒤 공백을 둔 대시로 잇습니다
- `2026.9.5` 처럼 자릿수를 줄여 쳐도 읽고, 입력창을 벗어나면 `2026.09.05` 로 정리합니다
- 읽을 수 없는 글자 · 없는 날짜(`2026.02.31`) · 절반만 친 기간은 입력창을 벗어나는 순간
  **치기 전 값으로 되돌립니다.** 에러 메시지는 띄우지 않습니다 — 검증은 소비자 몫입니다
- `dayPickerProps` 의 `disabled` · `startMonth` · `endMonth` 가 타이핑에도 적용됩니다.
  달력으로 고를 수 없는 날짜는 쳐서도 넣을 수 없습니다
- 치는 동안 달력이 그 날짜의 달로 따라 이동합니다

**같이 바뀐 것**

- `Enter` 와 `Space` 가 달력을 열지 않습니다. 여는 키는 `ArrowDown` 하나이고,
  `Enter` 는 열려 있는 달력을 닫습니다. 그래서 `Enter` 로 폼을 제출할 수 있게 됐습니다
- `parseDisplayValue` prop 이 생겼습니다. `formatDisplayValue` 의 역방향이고,
  형식을 바꿨을 때 파서도 함께 바꾸는 자리입니다
- `DateMultiplePicker` 는 그대로 읽기 전용입니다. 날짜 목록의 구분자 규칙이 따로
  필요해 다음 단계로 미뤘고, 열 수 없는 `isTextInputBlocked` 도 타입에서 뺐습니다
