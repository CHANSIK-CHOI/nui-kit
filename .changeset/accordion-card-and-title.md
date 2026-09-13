---
"@nui-kit/react": minor
---

**BREAKING** `Accordion` 의 `variant="box"` 가 항목마다 카드가 아니라 **목록 전체를 카드
하나**로 그립니다. 열림은 테두리 대신 **제목**이 말합니다.

- **BREAKING** `--nui-accordion--gap` 을 없앴습니다. `box` 의 항목이 구분선으로 이어지고
  사이 간격이 없어서 이 변수는 할 일이 없습니다. 항목마다 카드인 모양이 필요하면 새
  `variant="separated"` 를 씁니다 — 그쪽 간격은 `--nui-accordion--separated-gap`(12px)입니다.
- **BREAKING** `--nui-accordion--radius` 가 **`--nui-accordion--box-radius`** 로 바뀝니다
  (카드 루트 · 12px). 옛 이름은 아무 자리도 움직이지 않으니 덮어쓰던 코드는 이름을 바꿉니다.
  `separated` 항목의 모서리는 `--nui-accordion--separated-radius`(10px)입니다.
- `variant="separated"` 가 생겼습니다 — 항목마다 카드(`--nui-layer-default` 면 ·
  `--nui-border-form` 외곽 · 10px 모서리 · 항목 사이 12px). 열림은 `box` 와 같이 제목이 말합니다.
- **BREAKING** `--nui-border-brand` · `--nui-border-brand-subtle` 을 없앴습니다. 열린
  항목의 테두리가 유일한 자리였고 그 자리가 사라졌습니다. 이 변수를 `var()` 로 참조하던
  코드는 값이 비게 되니 다른 선 토큰으로 바꿉니다.
- `box` 의 면 · 외곽선 · 둥글기가 항목(`.nui-accordion__item`)에서 **루트**로 올라갔습니다.
  항목에는 아래쪽 `--nui-border-divider` 만 남고 마지막 항목은 선이 없습니다. `className` 으로
  항목의 테두리나 배경을 덮던 코드는 루트를 덮어야 합니다.
- 열린 항목의 헤더와 본문 사이에 있던 선이 사라졌습니다(`box` · `line` 둘 다).
  `--nui-accordion--border-width` 가 먹이는 자리는 넷입니다 — `box` 루트 외곽 · `line` 루트
  위쪽 선 · 항목 구분선 · `separated` 항목 외곽.
- 열린 항목은 테두리 색이 아니라 **제목이 `--nui-text-brand` 색 · 굵게(700)** 바뀝니다.
  화살표만 버튼인 `buttonIndex` 헤더는 제목이 바뀌지 않고 화살표만 돕니다. 제목의 기본
  굵기가 700 → **400** 이 되어 닫힌 항목이 가벼워집니다.
- 화살표 뒤의 회색 원이 사라졌고 화살표가 16px → **20px** 로 커졌습니다. `buttonIndex` 버튼은
  hover · 포커스 · 눌림 어디서도 면을 그리지 않고, 눌림은 `--nui-scale-90` 으로 화살표가 줄어드는
  것만으로 말합니다.
- 새 토큰 `--nui-text-brand`(brand-11) — 브랜드로 강조하는 글자.
