---
"@chansikchoi/next-ui": minor
---

눌림을 토큰으로 통일하고 Button 의 행간·자간·비활성 표현을 바로잡았습니다.

**눌림 — 네 자리를 토큰으로 모았습니다**

원시값으로 흩어져 있던 눌림 표현이 하나의 규칙을 따릅니다. 시간과 곡선도 함께
바뀌어 눌린 순간이 조금 더 빠르게 반응합니다(200ms → 150ms).

| 컴포넌트 | 전 | 후 |
| --- | --- | --- |
| `Button` | `translateY(1px)` | `scale(var(--nui-scale-98))` |
| `Select` 인디케이터 | `scale(0.94)` | `scale(var(--nui-scale-94))` |
| `Textfield` 버튼 | `scale(0.94)` | `scale(var(--nui-scale-94))` |
| `Popup` 닫기 | `scale(0.96)` | `scale(var(--nui-scale-96))` |

Button 의 눌림이 아래로 밀리던 것에서 살짝 줄어드는 것으로 바뀝니다.

**Button 행간·자간 (시각 변경)**

`line-height` 가 `1.2` 에서 `1.5` 로, `letter-spacing` 이 `-0.01em` 에서
`-0.02em` 으로 바뀝니다. 크기와 짝이 맞는 값을 쓰도록 정리한 결과입니다.
버튼 높이는 `min-height` 로 고정돼 있어 한 줄 라벨에서는 차이가 보이지 않지만,
**라벨이 두 줄로 넘어가면 줄 간격이 넓어집니다.**

**Button 비활성 (시각 변경)**

`opacity: 0.72` 를 제거했습니다. 비활성은 `action-bg-disabled` 와
`action-fg-disabled` 색으로만 표현합니다. 두 색은 이미 그 조합에서 대비를 맞춰
고른 값이라 투명도를 덧칠하면 그 계산이 깨집니다.

실측으로 대비가 **2.08:1 에서 2.96:1 로** 올랐습니다. 비활성 버튼이 이전보다
또렷하게 보입니다.

**함께 고친 결함**

`Textfield` 가 `@include motion(...)` 바로 뒤에 `transition:` 을 직접 선언해
믹스인 결과를 통째로 덮어쓰고 있었습니다. 눌림 전용 믹스인(`motion-press`)으로
정리했습니다.
