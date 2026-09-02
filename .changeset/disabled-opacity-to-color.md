---
"@chansikchoi/next-ui": minor
---

비활성 표현에서 투명도를 걷어내고 색으로만 나타냅니다.

Datepicker 와 Select 에 `opacity: 0.3`·`0.45`·`0.7` 이 남아 있었습니다. 같은
"비활성"에 세 값을 쓰고 있었고, 어느 것도 토큰이 아니었습니다.

| 자리 | 전 | 후 |
| --- | --- | --- |
| Datepicker 년월 셀렉트 | `opacity .45` | `control-bg-disabled` · `control-border-disabled` · `control-text-disabled` |
| Datepicker 이전·다음 | `opacity .3` | `action-fg-disabled` |
| Datepicker 날짜 | 색 + `opacity .45` | 색만 |
| Select 태그 | `opacity .7` | `control-bg-disabled` · `control-text-disabled` |

**대비가 두 방향으로 바뀝니다.**

- **Datepicker 날짜 1.60 → 3.30** — 색 위에 투명도를 덧칠해 거의 보이지 않던 것이
  제자리를 찾습니다
- **Select 태그 5.63 → 2.96** — 배경이 바뀌지 않는 자리라 글자만 흐려집니다.
  비활성이 비활성처럼 보이게 된 것이고, 비활성 요소는 WCAG 대비 요구에서 빠집니다

이것으로 규칙 밖 `opacity` 가 전부 사라졌습니다. 남은 토큰은 아이콘 두 개
(`opacity-icon-disabled` · `-readonly`)와 text 버튼 두 개(`opacity-hover` ·
`-pressed`)뿐입니다.
