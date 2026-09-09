---
"@nui-kit/react": minor
---

**BREAKING** `TextfieldBtn` 을 더 이상 내보내지 않는다.

입력 안의 보조 버튼(지우기 · 검색 · 비밀번호 보기/숨기기 · 달력)은 `Textfield` · `Search` · `Password` · `Datepicker` 가 자기 슬롯에 그리는 내부 부품이다. 아이콘 다섯이 이름으로 고정돼 있어 소비자가 다른 자리에 쓸 방법이 없었고, 공개된 채로 두면 아이콘을 하나 더하는 것도 공개 API 변경이 됐다. 공개하지 않는 골격 셋(`PopupBase` · `SelectBase` · `DatepickerBase`)과 같은 규칙으로 내린다. `TextfieldBtnProps` · `TextfieldBtnIcon` 타입도 함께 빠진다.

입력 안에 버튼이 필요하면 `Search`(검색) · `Password`(토글) · `isClearable`(지우기) · `Datepicker`(달력)가 그 자리다. 입력 밖의 아이콘 버튼은 `IconButton` 이다.
