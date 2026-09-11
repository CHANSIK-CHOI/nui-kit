---
"@nui-kit/react": minor
---

`Button` · `IconButton` · `ButtonLink` 에 셋이 더해지고 하나가 고쳐집니다.

- **`color="quiet"`** — neutral 보다 한 단계 조용한 색입니다. 취소 · 닫기 · 목록 행의 부차 액션처럼 눈에 덜 띄어야 하는 자리에 씁니다. 네 variant 전부에서 씁니다(solid 는 회색 채움에 흰 글자, line · text · soft 는 회색 글자)
- **`variant="text"` 가 `size` 를 받습니다.** 바뀌는 것은 글자와 아이콘뿐이고 높이는 잡지 않습니다. `small` 은 14px · 아이콘 16, `medium` 과 `large` 는 16px · 아이콘 20 으로 같은 모양입니다. 문장 안에 둘 때 주변 글자 크기에 맞추는 용도입니다. `shape` 는 여전히 받지 않습니다
- **둥글기가 크기를 따릅니다.** `large`(56px)가 8px 이 되고 `medium` · `small` 은 6px 그대로입니다. `IconButton` 도 같습니다
- **`ButtonLink` 의 밑줄이 없어집니다.** 브라우저 기본 `<a>` 밑줄이 네 variant 전부에 남아 있던 결함입니다. 밑줄이 필요하면 `className` 으로 다시 줍니다

**BREAKING — 둥글기 변수 이름이 갈라집니다.** 크기마다 값이 달라 한 이름으로 둘 수 없습니다. 옛 이름은 아무것도 바꾸지 않습니다.

| 이전 (0.1.2) | 지금 |
| --- | --- |
| `--nui-button--radius` | `--nui-button--medium-radius` (6px) · `--nui-button--large-radius` (8px) · `--nui-button--small-radius` (6px) |
| `--nui-button--radius` (아이콘 버튼이 상속해 읽던 것) | `--nui-icon-button--medium-radius` · `--nui-icon-button--large-radius` · `--nui-icon-button--small-radius` |

`--nui-button--round-radius` · `--nui-icon-button--round-radius` 는 그대로입니다.

새 토큰 한 벌 — `--nui-action-quiet` · `-hover` · `-active` · `-fg` · `-fg-line` · `-fg-line-strong` · `-soft` · `-soft-hover` · `-soft-active`.
