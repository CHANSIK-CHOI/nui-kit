---
"@nui-kit/react": minor
---

`Checkbox` 의 `shape="ghost"` 가 마우스를 올리거나 누를 때도 면을 그리지 않습니다.

이전에는 hover 와 눌림에 옅은 회색 면이 잠깐 떴습니다. ghost 는 「배경 없이 체크만」인
모양이라 그 면을 뺐습니다. 눌림은 체크가 작아지는 것으로만 말합니다.

면이 없어 배율이 유일한 눌림 신호라, ghost 만 한 단계 더 줄입니다. 새 토큰
`--nui-scale-90`(0.90) 이 생겼고 ghost 의 눌림이 이것을 씁니다. 24px 의 10% 입니다.
`square` 와 다른 24px 요소(Textfield 지우기 · Select 화살표 · Toast 닫기)는 눌림 면이
있어 `--nui-scale-94` 그대로입니다.

공개 API · 클래스 · 기존 CSS 변수 이름은 바뀌지 않았습니다.
