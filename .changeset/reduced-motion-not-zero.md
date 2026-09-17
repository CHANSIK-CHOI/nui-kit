---
"@nui-kit/react": patch
---

OS 의 **동작 줄이기**(`prefers-reduced-motion: reduce`)를 켠 사용자에게 팝업 · 메뉴 · 토스트 · 툴팁 · 아코디언이 **한 프레임에 툭 나타나고 사라지지 않고, 제자리에서 페이드**합니다. 동작 줄이기를 끈 사용자의 화면은 그대로입니다.

- 위치 이동과 확대는 빠지고 투명도만 남습니다. 시간은 각 컴포넌트의 원래 값 그대로입니다 — 툴팁 150/100ms · Select · Datepicker 200/150ms · 토스트 250ms · LayerPopup · FullPopup 300/200ms · BottomSheet 250/200ms
- `BottomSheet` · `FullPopup` 패널도 페이드합니다(예전에는 딤만 페이드되고 패널은 한 프레임에 나타났습니다)
- `Accordion` — 펼치면 칸이 한 번에 열리고 내용만 페이드, 접으면 내용이 페이드된 뒤 칸이 한 번에 닫힙니다
- `BottomSheet` 를 끌 때 손가락과 1:1 로 따라옵니다(탄성 없음). 조금만 끌고 놓으면 즉시 제자리, 끝까지 끌고 놓으면 그 자리에서 페이드로 닫힙니다
- `Select` · `Datepicker` 가 닫히는 페이드 동안에도 옵션 · 날짜가 눌리지 않습니다
- `Tooltip` 을 `defaultOpen` 으로 두고 동작 줄이기를 켠 브라우저로 처음 열 때 나던 hydration 경고가 없어졌습니다
