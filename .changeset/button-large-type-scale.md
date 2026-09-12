---
"@nui-kit/react": minor
---

`size="large"` 버튼의 글자와 아이콘이 한 단계 커진다.

`Button` · `ButtonLink` · `IconButton` 의 `large` 에서 글자가 16px 에서 **18px**, 아이콘이
20px 에서 **24px** 로 오른다. 네 variant(`solid` · `soft` · `line` · `text`) 전부에 걸린다.
높이 56px · 좌우 여백 24px · 둥글기 8px 은 그대로다.

| | 전 | 후 |
| --- | --- | --- |
| large 글자 | 16px | **18px** |
| large 아이콘 | 20px | **24px** |
| medium · small | 16 / 20 · 14 / 16 | 그대로 |

`variant="text"` 는 높이를 선언하지 않고 글자가 높이를 만드므로, 보이는 높이가 32px 에서
**35px** 로 바뀐다. 그전까지 `large` 와 `medium` 이 같은 모양이었던 것이 여기서 갈린다.
`IconButton` 의 `large` 도 56px 정사각 안의 아이콘이 24px 이 된다.

**글자·아이콘 크기에는 공개 훅이 없다.** 되돌리려면 `className` 으로 덮어야 한다.
`--nui-button--large-height` 로 높이만 줄여 둔 곳은 상자가 줄어도 글자가 18px 로 남으므로
함께 확인한다.

입력 컨트롤(`Textfield` · `Select` · Datepicker 계열)의 글자는 두 size 에서 16px 그대로다.
액션 라벨과 입력값은 다른 역할이라 같은 `size="large"` 라도 고르는 크기가 다르다.
