---
"@nui-kit/react": patch
---

`Accordion` 헤더에서 `nui-accordion__head--with-button` 클래스를 제거했습니다.

붙기만 하고 대응하는 스타일 규칙이 없었습니다. 이 클래스를 겨냥한 CSS 가 있다면
`nui-accordion__head` 와 버튼 유무를 함께 보는 선택자로 바꿔주세요.
