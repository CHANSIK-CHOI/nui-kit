---
"@nui-kit/react": minor
---

한국어 `placeholder` 기본값을 없앴습니다.

**⚠️ BREAKING**

| 컴포넌트 | 전 | 후 |
| --- | --- | --- |
| `Textfield` · `Textarea` | `"내용을 입력해주세요"` | 없음 |
| `Select` · `MultiSelect` | `"항목을 선택해주세요"` | 없음 |
| `Datepicker` 계열 | `"날짜를 선택해주세요"` | 없음 |

기본값이 있으면 라벨 없이도 칸이 채워져 보여 **라벨 대용을 유도합니다.** 그리고
"내용을 입력해주세요" 는 어떤 필드에도 맞지 않는 말이고, 다국어 앱에서는 한국어가
그대로 노출됩니다.

placeholder 가 필요하면 그 필드에 맞는 문구를 직접 넘겨주세요. 이름은 `Field.Label`
이 맡습니다.

```tsx
<Field>
  <Field.Label>이름</Field.Label>
  <Textfield placeholder="홍길동" />
</Field>
```

`Select` · `MultiSelect` 는 `placeholder` 를 주지 않아도 **비어 있습니다** —
react-select 의 영어 기본값(`"Select..."`)이 나오지 않도록 막아 두었습니다.
