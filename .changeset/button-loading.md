---
"@chansikchoi/next-ui": minor
---

`Button` · `IconButton` 에 로딩 상태를 더합니다.

```tsx
<Button isLoading={isSaving} onClick={save}>저장</Button>
```

`isLoading` 이면 아이콘 자리에 스피너가 돌고, 이 버튼을 거치는 클릭·Enter·Space 와 폼
제출이 막히며, `aria-busy="true"` 가 붙습니다. `form.requestSubmit()` 이나 핸들러 직접
호출은 막지 않습니다 — 재진입 방지는 핸들러 쪽 몫입니다. 라벨은 그대로 보이고
스크린리더에는 이름 뒤에 `loadingLabel`(기본 "처리 중")이 설명(`aria-describedby`)으로
읽힙니다. `aria-label` 을 쓰는 `IconButton` 에서도 같습니다.

**disabled 와 다릅니다.** 색이 바뀌지 않고 포커스도 남습니다. disabled 는 "조건이 맞으면
된다", loading 은 "지금 처리 중"이라 같은 색을 쓰면 왜 안 되는지로 읽힙니다. 둘 다 주면
색·커서는 disabled, 스피너와 `aria-busy` 는 남습니다.

`prefers-reduced-motion` 에서는 스피너가 돌지 않고 정지한 호로 보입니다.
`ButtonLink` 는 받지 않습니다 — 이동에는 처리 중이 없습니다.

`button.css` 를 온디맨드로 쓰던 분은 그 파일 하나에 스피너와 sr-only 스타일이 같이 들어갑니다.

같이 고친 것 — `textfield.css` · `datepicker.css` 를 온디맨드로만 쓰면 지우기·표시 버튼의
sr-only 라벨이 화면에 보이던 문제를 고쳤습니다(sr-only 유틸이 빠져 있었습니다).
