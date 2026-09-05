---
"@nui-kit/react": minor
---

모션 값을 한 벌로 맞추고 duration 스케일을 8단계로 늘렸습니다.

framer-motion 은 CSS 변수를 읽지 못해 같은 값을 TypeScript 로 한 벌 더 갖습니다.
그런데 실제로는 `duration` 일곱 개 중 둘만 일치했고 `easing` 두 개가 달랐습니다.
CSS 전환과 framer-motion 이 다른 속도로 움직이고 있었습니다.

**`--nui-duration-7`(350ms) · `-8`(400ms) 추가**

팝업과 시트 개폐가 이 구간을 씁니다. 6단계로는 매크로가 250·300 둘뿐이라
여유가 없었습니다.

**`--nui-easing-enter-emphasized` 값 변경**

`cubic-bezier(0.03, 0.4, 0.1, 1)` → `cubic-bezier(0.16, 1, 0.3, 1)`

실측으로 골랐습니다. 예전 값은 300ms 기준 첫 프레임에 38%를 쓰고 두 번째에
15.8%로 급락했고, 새 값은 31% → 22.5% → 15.3% 로 완만합니다.

**움직임이 바뀌는 곳**

| 컴포넌트 | 전 → 후 |
| --- | --- |
| Popup dialog | 300ms 유지 · 곡선 변경 |
| Popup bottomSheet | 380 → 400ms |
| Popup fullPopup | 340 → 350ms |
| Popup dim | 220 → 250ms |
| Tooltip · Datepicker 팝오버 | 180 → 200ms, 닫힘 120 → 150ms |
| Toast | 240 → 250ms |

**Accordion 항목이 더 부드러워졌습니다.** `AccordionItem` 이 `layout` prop 없이
`transition={{ layout: … }}` 만 갖고 있어 아무 일도 하지 않는 `motion.div` 였습니다.
평범한 `div` 로 바꾸니 펼침의 프레임당 최대 증분이 11px 에서 7px 로 내려갑니다.
