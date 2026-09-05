---
"@nui-kit/react": minor
---

색 체계를 KRDS(디지털 정부서비스 UI/UX 가이드라인)에 맞췄습니다. 브랜드 색은 그대로이고
상태와 대비 규칙이 바뀝니다.

**보조 색(secondary)이 생겼습니다.** 브랜드 프리셋을 고르면 같은 색조에서 채도를 절반으로
낮춘 보조 색 12단계가 함께 만들어집니다. `Button` 의 `color="secondary"` 와 토큰
`--nui-color-secondary-*` · `--nui-action-secondary` · `-fg` · `-hover` · `-active` 로 씁니다.

**⚠️ 시각 변화가 있습니다**

- **채움 버튼의 hover·pressed 가 색 단계로 바뀝니다.** 그림자와 1px 떠오름 대신 같은 색조의
  다음 단계로 진해집니다. `--nui-action-{역할}-hover` · `-active` 토큰이 새로 생겼습니다.
- **입력 테두리가 진해집니다.** `control-border` 가 회색 7 → 9 단계로 올라 배경과 3:1 을
  넘깁니다(WCAG 1.4.11). 스위치 꺼짐 트랙과 포커스 표시 색도 같은 기준으로 올렸습니다.
- **비활성 아이콘이 투명도 대신 색으로 표현됩니다.** `--nui-opacity-*` 토큰 넷을 지웠습니다.

**BREAKING** — 지운 토큰: `--nui-opacity-icon-disabled` · `-icon-readonly` · `-hover` · `-pressed`.
`_button` 내부 배선 `--nui-_button-shadow*` 도 없어졌습니다(내부 변수라 공개 API 는 아닙니다).
