---
"@nui-kit/react": minor
---

Button 에 `soft` 를 더하고, `line` 의 테두리를 중립으로 바꾼다

**`variant="soft"` 가 늘었다.** 채워져 있지만 조용한 한 단계라, 눌러야 할 것이 둘일 때
두 번째를 맡는다. 위계가 넷이 된다 — `solid`(High) · `soft`(Medium) · `line`(Low) ·
`text`(Lowest). 채워진 버튼을 한 화면에 둘 놓지 않고도 두 번째 행동을 면으로 보여줄 수
있다.

```tsx
<Button color="primary">저장하기</Button>
<Button color="primary" variant="soft">복제하기</Button>
```

**`line` 의 테두리가 역할색에서 중립 회색으로 바뀐다.** 색은 글자와 아이콘에만 남는다.
목록 행마다 반복되는 자리라 색 테두리가 여러 번 겹치면 화면이 줄무늬처럼 보였다.
삭제 버튼은 여전히 빨간 글자이며, 되돌릴 수 없는 확인에는 `variant="solid"` 나
`Confirm` 을 쓴다.

시각만 바뀌고 기존 prop 은 그대로다. `soft` 는 새로 여는 값이라 쓰던 코드는 영향이 없다.

새 CSS 변수 — `--nui-action-{역할}-soft` 와 그 hover·active, `--nui-action-border` 와
그 hover·active·disabled. 색 변수는 공개 커스터마이징 창구가 아니다(브랜드 색 프리셋을
쓴다).
