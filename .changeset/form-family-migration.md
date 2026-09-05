---
"@nui-kit/react": minor
---

Form 계열 컴포넌트 8종을 추가했습니다.

**입력**
- `Textarea` — 여러 줄 텍스트 입력. `resize` 로 사용자 크기 조절 제어
- `Search` — 검색 버튼이 붙은 Textfield 파생. `onSearch` 유무로 버튼 type 이 결정된다
- `Password` — 표시/숨김 토글. 값을 지우면 표시 상태가 숨김으로 되돌아간다

**선택**
- `Checkbox` / `CheckboxGroup` — 다중 선택
- `Radio` / `RadioGroup` — 단일 선택. 그룹이 `name` 을 전파한다
- `Switch` — 즉시 적용되는 켬/끔

**react-hook-form 래퍼** (`@nui-kit/react/rhf`)
`RHFTextarea` / `RHFSearch` / `RHFPassword` / `RHFCheckbox` / `RHFRadio` / `RHFSwitch`

**새 서브패스**
`/textarea` `/checkbox` `/radio` `/switch`

**새 온디맨드 CSS**
`styles/textarea.css` `styles/choice.css` (Checkbox·Radio·Switch 공용)

**주의**
`checked` 를 주면서 `onChange` 가 없으면 React 가 콘솔 경고를 냅니다.
`disabled` 로는 막히지 않으므로, 표시 전용으로 쓸 때는 `readOnly` 를 함께 주세요.
