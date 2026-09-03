---
"@chansikchoi/next-ui": minor
---

**BREAKING** — `Textarea` 에서 지우기 버튼을 뺍니다. `isClearable` · `onClear` prop 이
사라지고 `RHFTextarea` 도 같습니다.

여러 줄 본문은 실수로 지우면 잃는 것이 크고, 값을 통째로 되돌리는 버튼은 검색어나
태그처럼 짧은 값 하나의 장치입니다. 주요 디자인 시스템 대부분이 textarea 에 지우기를
두지 않습니다. 원본에서 넘어온 기능이었지만 수요 근거가 없어 배포 전에 닫습니다 —
닫아 둔 것을 나중에 여는 것은 non-breaking 이지만, 열어 둔 것을 닫는 것은 breaking 입니다.

입력 영역의 오른쪽 여백(버튼 자리 50px)도 사라져 글이 끝까지 찹니다.
