---
"@nui-kit/react": minor
---

**BREAKING** 팝업에 이름을 붙이지 않으면 타입이 막는다. 그리고 크기·문구 prop 이름을 다른 컴포넌트와 맞췄다.

**이름 붙이기** — `LayerPopup` · `BottomSheet` · `FullPopup` · `Alert` · `Confirm` 은 이제 `title` 이나 `dialogLabel` 중 하나를 반드시 받는다. 둘 다 없으면 컴파일이 실패한다.

예전에는 셸마다 「레이어 팝업」 · 「바텀시트 팝업」 · 「전체 팝업」 같은 기본 이름이 들어 있었다. 타입이 통과하니 이름을 붙일 이유가 없었고, 스크린리더는 서로 다른 팝업 다섯을 같은 이름으로 읽었다. 그 기본값을 없앴다.

```tsx
// 전 — 통과했지만 스크린리더는 "레이어 팝업" 이라고만 읽었다
<LayerPopup open onRequestClose={close} />

// 후 — 둘 중 하나를 준다
<LayerPopup open title="배송지 변경" onRequestClose={close} />
<LayerPopup open dialogLabel="배송지 변경" onRequestClose={close} />
```

**이름 바꾸기**

| 전 | 후 |
| --- | --- |
| `size="regular"` | `size="medium"` |
| `confirmText` | `confirmLabel` |
| `cancelText` | `cancelLabel` |

크기 값은 `Button` 계열 네 곳이 이미 `medium` 을 쓰고 있었고 `Popup` 만 `regular` 였다. 문구 prop 은 다른 자리가 전부 `*Label` 이다.
