---
"@chansikchoi/next-ui": minor
---

`Select` · `MultiSelect` 의 스크린리더 안내가 한국어로 나옵니다.

react-select 이 소유한 문자열 가운데 **눈에 보이지 않는 것만 영어로 남아 있었습니다.**
`placeholder` 나 `noOptionsMessage` 는 한국어였지만, 스크린리더 전용인
`ariaLiveMessages` 와 `screenReaderStatus` 는 기본값이 그대로여서 한국어 앱에서
목록을 훑을 때마다 영어가 읽혔습니다.

| 무엇 | 전 | 후 |
| --- | --- | --- |
| 결과 개수 | `"8 results available"` | `"8개 항목이 있습니다"` |
| 조작 안내 | `"Use Up and Down to choose options…"` | `"위아래 화살표로 항목을 고르고 Enter 로 선택합니다…"` |
| 선택 알림 | `"option 서울, selected."` | `"서울, 선택했습니다."` |
| 위치 안내 | `"서울, 1 of 8."` | `"서울, 8개 중 1번째."` |
| 로딩 | `"Loading..."` | `"불러오는 중..."` |

전부 prop 으로 덮을 수 있습니다. 한국어가 아닌 앱이라면 `ariaLiveMessages` ·
`screenReaderStatus` · `loadingMessage` 를 넘겨주세요.

**번역에서 신경 쓴 것**

- 라벨에 조사를 붙이지 않습니다. `"서울을 선택했습니다"` 로 쓰면 받침에 따라
  `"부산을"`·`"대구를"` 이 어긋나므로 쉼표로 끊었습니다
- `"1 / 8"` 대신 `"8개 중 1번째"` 입니다. 슬래시는 스크린리더가 "나누기" 로 읽을
  수 있습니다
- 고른 값이 없을 때는 아무 말도 하지 않습니다. react-select 은 이 경우에도
  `"option , selected."` 를 읽습니다
