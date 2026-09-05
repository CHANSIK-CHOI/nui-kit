---
"@nui-kit/react": patch
---

마우스로 띄운 `Tooltip` 도 `Escape` 로 닫힙니다.

`Escape` 를 툴팁 루트의 `onKeyDown` 에서만 듣고 있어서, **마우스 hover 로 연 툴팁은
닫을 수 없었습니다** — 포커스가 트리거에 없으니 키 이벤트가 툴팁을 지나가지 않습니다.
WCAG 1.4.13 은 포인터를 치우지 않고 닫을 수단(Dismissible)을 요구합니다.

이제 툴팁이 열려 있는 동안 `document` 에서 `Escape` 를 듣습니다. 바깥 클릭으로 닫는
리스너와 같은 방식이고, `Datepicker` 의 달력도 이렇게 동작합니다.
