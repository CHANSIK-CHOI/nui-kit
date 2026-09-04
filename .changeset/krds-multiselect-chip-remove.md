---
"@chansikchoi/next-ui": minor
---

`MultiSelect` 칩의 삭제 버튼이 **키보드로 닿는 진짜 버튼**이 됐습니다. react-select 기본은
`<div role="button">` 에 `tabIndex` 가 없어 Tab 으로 갈 수 없었고, 초점 표시도 없었고,
접근 이름이 `"Remove 서울"` 로 **영어 고정**이라 바꿀 수단이 없었습니다. KRDS 가이드
566 · 568 · 569쪽 · 체크리스트 [태그 3·5] 기준으로 요소를 `<button>` 으로 바꿨습니다.

- **Tab 으로 칩의 × 에 앞에서부터 하나씩 닿습니다.** 칩을 다 지나면 입력창입니다
- <kbd>Enter</kbd> 와 <kbd>Space</kbd> 로 지웁니다
- 지우고 나면 포커스가 **이전 칩**으로, 없으면 입력창으로 갑니다. 예전에는 버튼이
  사라지면서 포커스가 `body` 로 떨어졌습니다
- 초점 표시가 생겼습니다
- 삭제 아이콘이 14 → **16px** 이 됩니다 (KRDS 아이콘 최소 크기, 가이드 164쪽)

**접근 이름을 바꾸는 prop 이 생겼습니다.**

```tsx
<MultiSelect removeButtonLabel={(label) => `${label} 옵션 삭제`} />   // 기본값
<MultiSelect removeButtonLabel={(label) => `Remove ${label}`} />      // 영어 제품
```

문자열이 아니라 함수인 이유는 라벨을 끼워 넣는 자리가 언어마다 다르기 때문입니다.

**⚠️ Tab 횟수가 늘어납니다.** 칩이 5개면 이 필드를 지나는 데 Tab 이 6번 필요합니다.
KRDS 568쪽이 요구하는 순서("첫 태그부터 순차적으로, 하나씩")입니다.

`readOnly` 일 때 × 를 숨기는 동작과 `Select`(단일)는 그대로입니다.
