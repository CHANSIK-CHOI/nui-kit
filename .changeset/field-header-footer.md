---
"@nui-kit/react": minor
---

`Field` 가 Header · Input · Footer 세 영역이 됐습니다. 라벨 오른쪽에 보조 자리(`Field.Header suffix`)가 열리고, 도움말 · 에러 · 글자 수가 Footer 한 줄에 모입니다. 공개 변수 셋이 생겼고 `required` 가 안쪽 항목까지 내려갑니다.

**BREAKING — `Field.Description` 이 없어집니다.** 도움말은 `infoMessage` 로 줍니다. 자기 컨트롤을 만들며 `FieldContextValue.registerDescription` 을 읽었다면 그 값도 없습니다.

| 이전 | 지금 |
| --- | --- |
| `<Field.Description>본인 확인에만 사용해요</Field.Description>` | `<Field infoMessage="본인 확인에만 사용해요">` |
| `FieldDescription` (named export) | `FieldHeader` 가 대신 들어왔습니다. 도움말은 위와 같이 prop 으로 |
| `FieldContextValue.registerDescription` | 없음. 도움말 id 는 Footer 가 `describedByIds` 에 넣습니다 |

**BREAKING — Field 안 컨트롤의 메시지 줄이 Field 의 Footer 로 옮겨 갑니다.** `Textfield` · `Search` · `Password` · `Textarea` · `Select` · `MultiSelect` · Datepicker 계열이 `Field`(또는 `Field.Item`) 안에 있으면 자기 `.nui-message` 를 그리지 않고 `Field` 가 `.nui-field__footer > .nui-message` 하나로 그립니다. `.nui-textfield .nui-message` 처럼 컨트롤 안의 메시지를 직접 가리키던 CSS 는 Field 안에서 더는 맞지 않습니다. Field 밖에서는 지금과 같습니다.

- 빈 `Field` · `Field.Item` 에도 `div.nui-field__footer > div.nui-message` 가 항상 렌더됩니다(자리를 차지하지 않습니다). `.nui-field > :last-child` 같은 CSS 나 DOM 스냅샷 테스트가 이것을 봅니다
- Field 안 `Textarea` 의 `.nui-textarea__foot` 이 사라집니다 — 카운터도 Footer 로 갑니다
- 컨트롤에 준 `errorMessage` 로 `Field` 라벨도 빨개집니다. 예전에는 라벨이 그대로였습니다
- 컨트롤에 준 정적 `errorMessage` · `infoMessage` · 글자 수는 hydration 뒤에 그려집니다. `Field` 에 준 것은 서버 HTML 에 바로 들어갑니다. 손으로 검증하는 메시지는 `Field` 에 주고, 컨트롤에는 RHF 래퍼가 넘기게 두는 것이 맞습니다

**BREAKING — `direction="row"` 가 flex 에서 grid 로 바뀝니다.** `.nui-field--row` 에 flex 속성을 덮어쓰던 CSS 는 무효가 됩니다. 라벨 열은 `--nui-field--row-label-width`(기본 120px)로 고정되고 Footer 는 입력 열 아래에 섭니다.

**BREAKING — `.nui-message` 의 왼쪽 여백 8px 가 없어지고 폭이 부모를 채웁니다.** Field 밖의 컨트롤 메시지에도 적용됩니다. 글자 수 카운터가 오른쪽 끝에 서기 위해서입니다.

**새로 열린 것**

- `Field.Header` · `FieldHeader` — 좌 `Field.Label`, 우 `suffix`(툴팁 아이콘 · `Button variant="text"` · 글자). suffix 에 버튼이 들어와도 Header 높이는 라벨 한 줄로 고정되어 `Field.Grid` 이웃과 입력 라인이 맞습니다. `suffix` 는 `<label>` 밖이라 눌러도 입력으로 포커스가 가지 않습니다
- 공개 변수 — `--nui-field--gap`(라벨↔컨트롤 · 12px) · `--nui-field--grid-gap`(필드 사이 · 16px) · `--nui-field--row-label-width`(row 라벨 열 · 120px)
- `Field.Grid` · `Field.Message` 가 `id` · `style` · `data-*` · `aria-*` 를 DOM 에 넘깁니다. 여섯 컴포넌트 전부 `ref` 를 받습니다
- `<Field required>` 안의 `Field.Item` 컨트롤에도 `aria-required` 가 갑니다. 점은 부모 라벨 하나입니다 — `Item` 에 `required` 를 다시 주지 않습니다
- `FieldContextValue.footerId` · `registerFooter` · `FieldFooterEntry` — 자기 컨트롤을 Field 의 Footer 에 물릴 때 씁니다
- `CheckboxGroup` · `RadioGroup` 의 `direction="row"` 안에서 `Field.Item` 도 가로로 섭니다. 예전에는 세로로 쌓였습니다
