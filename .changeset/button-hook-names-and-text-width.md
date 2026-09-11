---
"@nui-kit/react": minor
---

Button 계열의 CSS 변수 이름을 컴포넌트·옵션·속성 셋으로 나누고, `variant="text"` 를 글자 폭으로 바꿨습니다.

**BREAKING — 변수 이름 열 개가 바뀝니다.** `:root` 나 `className` 으로 아래를 덮어쓰고 있었다면 새 이름으로 옮겨야 합니다. 옮기지 않으면 값이 조용히 무시됩니다.

| 이전 | 지금 |
| --- | --- |
| `--nui-button--lg-height` | `--nui-button--large-height` |
| `--nui-button--md-height` | `--nui-button--medium-height` |
| `--nui-button--sm-height` | `--nui-button--small-height` |
| `--nui-button--lg-padding-x` | `--nui-button--large-padding-x` |
| `--nui-button--md-padding-x` | `--nui-button--medium-padding-x` |
| `--nui-button--sm-padding-x` | `--nui-button--small-padding-x` |
| `--nui-button--radius` | `--nui-button--medium-radius` · `--large-radius` · `--small-radius` (둥글기가 크기를 따릅니다) |
| `--nui-button--radius` (아이콘 버튼) | `--nui-icon-button--medium-radius` · `--large-radius` · `--small-radius` |
| `--nui-button--round-radius` (아이콘 버튼) | `--nui-icon-button--round-radius` |
| `--nui-button--border-width` (아이콘 버튼) | `--nui-icon-button--border-width` |

아래 셋은 `IconButton` 이 자기 변수를 갖기 전에 `Button` 것을 **상속해서 읽던** 자리입니다. `Button` 쪽 이름은 그대로 남아 있으니 버튼에 준 값은 계속 듣습니다. 아이콘 버튼만 새 이름으로 옮기면 됩니다.

옵션 이름이 prop 값과 같아졌습니다. `size="large"` 를 쓰면 변수도 `--large-` 입니다. 예전에는 코드에서는 `large`, CSS 에서는 `lg` 라 같은 개념을 두 낱말로 찾아야 했습니다.

**IconButton 과 ButtonGroup 이 자기 변수를 갖습니다.** 예전에는 `IconButton` 의 크기를 열어 두지 않아 바꿀 수 없었고, 모양과 선 두께는 `Button` 과 같은 이름을 써서 하나를 바꾸면 둘이 함께 움직였습니다.

- `--nui-icon-button--large-size` · `-medium-size` · `-small-size` — 하나가 가로와 세로를 함께 먹여 정사각을 지킵니다
- `--nui-icon-button--medium-radius` · `-large-radius` · `-small-radius` · `-round-radius` · `-border-width`
- `--nui-button-group--gap` — 항목 사이 간격. 항목의 기준 폭도 같이 따라갑니다

**Button 에 변수 셋이 늘었습니다.** `--nui-button--gap`(아이콘과 라벨 사이) · `--nui-button--text-padding-x` · `-text-padding-y`.

**`variant="text"` 가 부모 폭을 채우지 않고 글자 폭이 되고 **좌우 여백이 12px 에서 8px 로 줄어듭니다.**** 면도 테두리도 없어서 폭을 채우면 눌리는 범위만 넓어지고 보이는 것은 글자 하나였습니다. 최소 폭 120px 도 걸려서 「닫기」 같은 짧은 라벨이 그만큼 자리를 차지했습니다. 이제 문장 안이나 목록 행 안에 그대로 넣을 수 있습니다. 위아래 여백은 4px 그대로입니다. `ButtonGroup` 안에서도 글자 폭을 지킵니다.

문서 사이트의 props 표가 타입 별칭 대신 **값을 보여줍니다.** `ButtonShape` 라고만 적혀 있던 자리에 `"round" | "square"` 가 들어갑니다.
