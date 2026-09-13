---
"@nui-kit/react": patch
---

`Accordion` 의 헤더와 화살표 버튼을 누르면 눌린 것이 보입니다.

눌림이 자리마다 다른 범위로 걸립니다 — *줄어들 여백이 있으면 누르는 것이 줄고, 없으면
내용만 줄어듭니다.* 헤더 전체가 버튼인 항목은 제목과 화살표만 `--nui-scale-98` 로 줄고
hover 면은 카드 테두리에 붙은 채 제자리입니다. `buttonIndex` 로 화살표만 버튼으로 둔
항목은 화살표 버튼 전체가 줄어듭니다. 시간과 곡선은 다른 컴포넌트의 눌림과 같은
`--nui-duration-pressed` · `--nui-easing-pressed` 입니다.

hover · 눌림 면을 칠하는 요소가 `.nui-accordion__head` 에서 `.nui-accordion__button` 으로
옮겨 갔습니다. `className` 으로 `__head` 의 배경을 덮어 hover 를 바꾸거나 지우고 있었다면
`__button` 을 덮어야 합니다.

공개 API · 클래스 이름은 바뀌지 않았습니다.
