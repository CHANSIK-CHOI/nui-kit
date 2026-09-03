---
"@chansikchoi/next-ui": minor
---

아이콘을 `lucide-react` 로 바꿉니다.

컴포넌트가 쓰는 아이콘 일곱 개(`DelIcon` · `SearchIcon` · `ShowPwIcon` · `HidePwIcon` ·
`CloseIcon` · `CalendarIcon` · `AttentionIcon`)가 자체 SVG 에서 lucide 아이콘으로
바뀝니다. 이름과 props 는 그대로라 가져다 쓰던 코드는 고칠 것이 없습니다. `title` 을
주면 `role="img"` + `<title>`, 없으면 `aria-hidden` 인 접근성 계약도 같습니다.

**모양이 바뀝니다.** 24px 격자에 stroke 2 인 lucide 선 스타일입니다. 예전 SVG 는
20px 격자에 1.6~1.8 이었습니다.

**서드파티가 그리던 화살표도 같은 세트가 됩니다.** Select 의 화살표·지우기·태그 ×,
Datepicker 의 이전/다음과 년/월 화살표, Accordion 의 펼침 화살표가 lucide 로 통일됩니다.
네 가지 선 스타일이 섞여 있던 것이 하나가 됩니다. Select 의 인디케이터는 `components`
로 여전히 갈아끼울 수 있습니다.

Textfield · Search · Password · Datepicker 의 지우기 버튼이 Select 의 지우기와 같은 골격이
됩니다 — 24px 원형
면(`control-bg-subtle`) 위 16px 글리프. 비밀번호 토글과 달력 열기 버튼도 같은 여백을 써서
글리프가 24px 에서 16px 로 작아집니다.

`lucide-react` 가 dependency 로 추가됩니다. 쓰는 아이콘만 번들에 들어갑니다. 직접 넣을
아이콘도 `lucide-react` 에서 가져오면 라이브러리와 선 굵기가 맞습니다 —
`size` 는 14 · 16 · 20 · 24 입니다.
