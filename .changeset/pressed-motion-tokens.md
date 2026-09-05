---
"@nui-kit/react": minor
---

눌림(pressed) 토큰을 세 축으로 완성하고 배율 값을 실측에 맞췄습니다.

**추가 — `--nui-duration-pressed` · `--nui-easing-pressed`**

지금까지 눌림에는 배율만 있었고 시간·곡선은 기본 전환값(200ms · standard)에 얹혀
있었습니다. 눌림은 세 축이 함께 움직여야 하나의 동작이 되므로 의미 토큰으로 묶었습니다.

```css
--nui-duration-pressed: var(--nui-duration-3);      /* 150ms */
--nui-easing-pressed: cubic-bezier(0, 0, 0.15, 1);
```

`easing-pressed` 는 `easing-enter` 와 값이 같지만 이름을 나눴습니다. 눌림은 대칭
곡선이 아니라 ease-out 계열이어야 누른 순간이 즉각 느껴지고, 나중에 한쪽만 조정할 수
있어야 하기 때문입니다.

`duration-pressed` 는 값을 복사하지 않고 `duration-3` 을 참조합니다. 그래야
`prefers-reduced-motion` 에서 1ms 로 무력화되는 장치가 그대로 따라옵니다.

**이름 변경 — `--nui-scale-95` → `--nui-scale-94`, `--nui-scale-97` → `--nui-scale-96`**

눌림 배율 값을 컴포넌트 실측에 맞췄습니다. 이름이 값을 담고 있어 값을 옮기면서 이름도
함께 옮겼습니다.

| 전 | 후 | 대상 |
| --- | --- | --- |
| `scale-95` (0.95) | `scale-94` (0.94) | 작은 요소 — 아이콘 버튼 · 칩 |
| `scale-97` (0.97) | `scale-96` (0.96) | 중간 |
| `scale-98` (0.98) | 그대로 | 큰 요소 — 전면 버튼 · 카드 |

두 토큰은 컴포넌트에서 참조된 적이 없어 시각 변화가 없습니다. `:root` 에서 직접
덮어쓰고 있었다면 새 이름으로 바꿔 주세요.

**컴포넌트 이행은 아직입니다.** `Button` 은 `translateY`, `Select`·`Textfield`·
`Popup` 은 원시값 `scale()` 로 눌림을 표현합니다. 두 방식을 이 토큰으로 모으는 작업은
다음 단계에서 합니다.
