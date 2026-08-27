---
"@chansikchoi/next-ui": minor
---

접근성을 보완하고 브랜드 색 대비를 WCAG AA 로 올렸습니다.

**⚠️ 시각 변화가 있습니다**

- **`--nui-color-primary` 가 `#1ca673` → `#16815a` 로 어두워집니다.** 흰 글자 대비가
  3.11:1 로 WCAG 2.1 AA(4.5:1)에 미달했습니다. 이제 4.86:1 입니다.
  이 색을 쓰는 모든 곳(버튼·체크박스·스위치·포커스 링·달력 선택일)이 함께 바뀝니다.
- **`point` 버튼의 글자가 흰색 → 검정으로 바뀝니다.** 주황 배경에 흰 글자는 2.21:1 로
  크게 미달했습니다. 검정 글자는 8.03:1 이고 경고·주의 색의 관습에도 맞습니다.
  `--nui-button-point-color` 로 덮을 수 있습니다.

이전 색을 유지하려면 공개 훅으로 되돌릴 수 있습니다.

```css
:root {
  --nui-color-primary: #1ca673;
  --nui-button-point-color: #fff;
}
```

**`prefers-reduced-motion` 대응을 마쳤습니다**

`Popup` · `Toast` · `Tooltip` 이 모션 감소 설정을 무시하고 있었습니다.
framer-motion 은 CSS `--nui-duration-*` 의 1ms 무력화를 읽지 않는데
(`MotionConfig.reducedMotion` 기본값이 `"never"`), `useReducedMotion()` 을 쓰지 않아
설정이 **조용히** 무시됐습니다. 이제 5계열 전부 대응합니다 — 감소 설정에서는 이동·확대
없이 페이드만 남습니다.

**새 토큰** `--nui-action-fg-on-point`
**새 공개 훅** `--nui-button-point-color`
