---
"@nui-kit/react": patch
---

터치 기기에서 `Button` 계열(`Button` · `IconButton` · `ButtonLink` · `ButtonGroup` 항목)과 `Checkbox` · `Radio` · `Switch` 를 누를 때 **브라우저 기본 하이라이트가 더는 겹치지 않습니다.**

- 탭을 뗄 때 회색(iOS) · 하늘색(Chrome) 면이 순간 덮이던 것이 사라집니다. 눌림 표시는 라이브러리의 면과 배율만 남습니다
- 꾹 눌러도 라벨 글자가 선택되거나 iOS 콜아웃 메뉴가 뜨지 않습니다
- 누르는 요소 자신에만 걸립니다. `Popup` · `Toast` 안에 넣은 소비자 콘텐츠의 선택·하이라이트는 그대로입니다
- 다른 컴포넌트(입력 보조 버튼 · Select 옵션 · 달력 · Accordion · 팝업 닫기 등)는 이 판에 없습니다 — 다음 판에서 같은 방식으로 갑니다

공개 API 는 그대로입니다.
