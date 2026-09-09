---
"@nui-kit/react": minor
---

`LayerPopup` · `BottomSheet` · `FullPopup` 에 표준 푸터를 열었다. 그리고 `Confirm` 의 두 버튼을 3:7 로 놓는다.

`confirmLabel` · `cancelLabel` · `onConfirm` · `onCancel` 을 주면 취소(line) · 확인(solid) 버튼 묶음을 그린다. 하나만 줘도 된다. 둘 다 있으면 취소 : 확인 = 3 : 7 이다. `onCancel` 을 생략하면 `onRequestClose` 가 불린다. 그동안은 버튼 하나를 두려 해도 `footer` 에 직접 그려야 했다.

`footer` 는 그대로 있다. 확인 · 취소 둘로 안 되는 자리(진행 버튼 · 셋째 액션 · 링크)에 쓴다. 라벨 넷과 `footer` 를 같이 주면 타입이 막는다.

```tsx
// 전
<LayerPopup open title="약관 동의" footer={<Button onClick={agree}>동의합니다</Button>} />

// 후
<LayerPopup open title="약관 동의" confirmLabel="동의합니다" onConfirm={agree} />
<BottomSheet open title="필터" cancelLabel="닫기" confirmLabel="적용" onConfirm={apply} />
```

`Confirm` 은 취소와 확인이 균등 폭이었는데 같은 규칙(첫 항목이 취소면 3:7)으로 맞췄다. 보이는 폭이 바뀐다.
