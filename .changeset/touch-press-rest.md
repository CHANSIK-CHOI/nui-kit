---
"@nui-kit/react": patch
---

터치 기기에서 누르는 자리 전부가 **브라우저 기본 하이라이트와 글자 선택을 끕니다.** `Button` · `Checkbox` · `Radio` · `Switch` 에 이어 나머지도 같아졌습니다.

- 대상 — `Textfield` · `Search` · `Password` 의 입력 안 버튼 · `Select` · `MultiSelect` 의 옵션 · 지우기 · 화살표 · 칩 × · 달력의 날짜 · 이전/다음 · 년/월 선택 · `Accordion` 헤더 · `Toast` 의 액션 · 닫기 · `Field` 라벨
- 탭을 뗄 때 회색(iOS) · 하늘색(Chrome) 면이 덮이지 않고, 꾹 눌러도 글자가 선택되거나 콜아웃 메뉴가 뜨지 않습니다
- `Field` 없이 `Field.Item` 만 쓴 라벨(체크박스 · 스위치 옆)에서도 글자 선택이 막힙니다. 전에는 `Field` 안의 라벨에서만 막혔습니다
- 입력칸과 소비자 콘텐츠는 그대로입니다 — `Select` 검색 · `Textfield` 입력 · `Accordion` 본문 · `Toast` 메시지 · `Popup` 안 글은 선택할 수 있습니다

공개 API 는 그대로입니다.
