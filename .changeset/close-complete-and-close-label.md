---
"@nui-kit/react": minor
---

**BREAKING** 닫힘 모션이 끝났을 때의 콜백과 닫기 버튼 접근 이름의 prop 이름을 다른 컴포넌트와 맞췄다.

| 전 | 후 | 어디 |
| --- | --- | --- |
| `onExited` | `onCloseComplete` | `Alert` · `Confirm` · `LayerPopup` · `BottomSheet` · `FullPopup` · `Toast` |
| `closeButtonLabel` | `closeLabel` | `LayerPopup` · `BottomSheet` · `FullPopup` |

`Toast` 는 명령형 `toast.open({ onCloseComplete })` 과 선언형 `<Toast onExited />` 가 같은 순간을 다른 이름으로 부르고 있었다. 열림 쪽은 이미 둘 다 `onOpenComplete` 였다. 닫기 버튼 이름도 `Toast` 는 `closeLabel`, 팝업은 `closeButtonLabel` 이었다.

`PopupHost` 가 등록한 컴포넌트에 넣어 주는 prop 도 함께 바뀐다. `LayerPopupComponentProps` 를 받는 컴포넌트는 `onExited` 대신 `onCloseComplete` 를 받아 셸에 넘긴다.

```tsx
// 전
function ProfilePopup({ open, onRequestClose, onExited, isTopmost }: LayerPopupComponentProps) {
  return <LayerPopup open={open} onRequestClose={onRequestClose} onExited={onExited} isTopmost={isTopmost} closeButtonLabel="닫기" title="프로필" />;
}

// 후
function ProfilePopup({ open, onRequestClose, onCloseComplete, isTopmost }: LayerPopupComponentProps) {
  return <LayerPopup open={open} onRequestClose={onRequestClose} onCloseComplete={onCloseComplete} isTopmost={isTopmost} closeLabel="닫기" title="프로필" />;
}
```
