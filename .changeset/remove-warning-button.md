---
"@nui-kit/react": minor
---

**BREAKING** — `Button` · `IconButton` · `ButtonLink` 에서 `color="warning"` 을 없앤다.

**왜.** 노랑은 **면이 있어야 하는 색**이다. 채워진 버튼에서는 노란 배경 + 어두운 글자로
성립하지만, `line` 과 `text` 는 면이 없어서 노랑이 그대로 글자와 테두리가 된다 —
흰 바탕에서 1.5 : 1 로 사실상 안 보였다. 대비를 맞추려고 어둡게 하면 갈색이 되어
"주의"라는 의미 자체를 잃는다. **세 variant 중 둘에서 색을 못 지키는 색은 축을 채우지
못한다.**

경고는 원래 버튼 색이 아니라 흐름이 맡는다.

| 하려던 것 | 이제 |
| --- | --- |
| 되돌릴 수 없는 행동 | `color="danger"` |
| 진행 전에 확인을 받아야 하는 행동 | `Confirm` 으로 묻는다 |
| 계속 보여야 하는 주의 문구 | `Message` · `Toast` |

**옮기는 법** — `color="warning"` 을 `color="danger"` 로 바꾸거나, 확인이 필요한
행동이면 `Confirm` 으로 감싼다. 타입에서 빠지므로 컴파일 시점에 전부 드러난다.

역할은 넷이다 — `neutral` · `primary` · `secondary` · `danger`.
색 자체(`--nui-color-warning-*`)와 은은한 면색(`--nui-status-warning-soft`)은 남는다.
