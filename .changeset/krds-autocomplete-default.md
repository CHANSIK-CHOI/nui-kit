---
"@nui-kit/react": minor
---

**입력 필드의 자동 완성을 더 이상 기본으로 끄지 않습니다.** `Textfield` 와 `Textarea` 가
`autoComplete="off"` 를 기본값으로 넣고 있었고, `Search` · `Password` · `Datepicker` 계열도
그 필드를 재사용하므로 **폼 입력 전체가 자동완성이 꺼진 채로** 동작했습니다.

WCAG 1.3.5(Identify Input Purpose · AA)와 KRDS 체크리스트 [텍스트 입력 필드 5] · [날짜 입력
필드 7] 은 개인정보 필드에 `autocomplete` 를 **제공하라**고 요구합니다. 우리는 정반대를
기본값으로 두고 있었고, 소비자가 알아채려면 라이브러리 소스를 읽어야 했습니다.

**⚠️ 동작이 바뀝니다.** 이제 브라우저 기본값을 따르므로 저장된 값이 제안될 수 있습니다.
끄고 싶은 자리는 명시하면 됩니다.

```tsx
<Textfield autoComplete="name" />                 // 켠다 (권장)
<Search autoComplete="off" />                     // 검색어 이력이 싫으면 끈다
<Datepicker autoComplete="bday" />                // 생년월일
<Password autoComplete="current-password" />      // 비밀번호 관리자
```

새 prop 은 없습니다. `autoComplete` 는 원래도 그대로 전달되던 표준 속성입니다.
