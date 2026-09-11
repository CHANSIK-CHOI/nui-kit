---
"@nui-kit/react": minor
---

입력 컨트롤에 `size` 가 생겼습니다. `Textfield` · `Search` · `Password` · `Select` · `MultiSelect` · `Datepicker` · `DateRangePicker` · `DateMultiplePicker` 가 `size="medium" | "large"` 를 받습니다. `Button` 의 같은 이름과 같은 높이(medium 48px · large 56px)라 폼 한 줄에 나란히 놓을 때 `size` 를 안 적어도 높이가 맞습니다.

**BREAKING — 기본 높이가 56px 에서 48px 로 바뀝니다.** `size` 를 안 준 모든 입력이 8px 낮아집니다. 예전 높이를 유지하려면 `size="large"` 를 줍니다.

**BREAKING — 공개 변수 이름이 갈라집니다.** 한 이름으로 두 단계를 덮으면 소비자가 값을 넣는 순간 두 단계가 같아지기 때문입니다. 옛 이름은 아무것도 바꾸지 않습니다.

| 이전 | 지금 |
| --- | --- |
| `--nui-textfield--height` | `--nui-textfield--medium-height` (48px) · `--nui-textfield--large-height` (56px) |
| `--nui-textfield--radius` | `--nui-textfield--medium-radius` (6px) · `--nui-textfield--large-radius` (8px) |
| `--nui-select--height` | `--nui-select--medium-height` · `--nui-select--large-height` |
| `--nui-select--radius` | `--nui-select--medium-radius` · `--nui-select--large-radius` |

- `large` 의 둥글기는 8px 입니다(KRDS 산식 높이 × ⅛). `medium` 은 6px 그대로입니다
- `Textfield` 의 `size` 는 HTML 의 글자 폭(`size={20}`)이 아니라 높이 단계입니다. 숫자를 넘기던 코드는 타입 에러가 납니다. 폭은 원래 `100%` 라 화면 효과는 없던 자리입니다
- `MultiSelect` 의 값 영역 세로 여백이 8px 에서 4px 로 줄어 칩이 48px 안에 섭니다. `large` 에서는 8px 입니다
- 새 타입 `TextfieldSize` · `SelectSize` 를 내보냅니다
- 글자 크기 · 안쪽 버튼 · 좌우 여백 · 메뉴 · 옵션은 두 단계가 같습니다
