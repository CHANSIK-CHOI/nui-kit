---
"@chansikchoi/next-ui": minor
---

공개 CSS 변수(훅) 이름을 KRDS 디자인 토큰 표기로 바꿨습니다. **컴포넌트 이름 뒤에
대시가 두 개**입니다.

**BREAKING** — 훅 40개 이름이 전부 바뀝니다. 옛 이름은 더 이상 읽히지 않습니다.

| 예전 | 지금 |
| --- | --- |
| `--nui-button-md-height` | `--nui-button--md-height` |
| `--nui-popup-radius` | `--nui-popup--radius` |
| `--nui-datepicker-day-size` | `--nui-datepicker--day-size` |
| `--nui-selector-size` | `--nui-selector--size` |

규칙은 `--nui-{컴포넌트}--{옵션?}-{요소?}-{속성}` 입니다. 소비자가 `button--` 로 검색하면
버튼 훅만 모입니다. 내부 배선 변수(`--nui-_*`)와 전역 토큰(`--nui-space-4` 등)은 그대로입니다.
