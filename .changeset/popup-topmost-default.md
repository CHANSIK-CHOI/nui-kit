---
"@nui-kit/react": minor
---

팝업의 `isTopmost` 기본값이 `false` → **`true`** 로 바뀝니다.

**⚠️ BREAKING (선언형으로 쓸 때만)**

`isTopmost` 는 "이 팝업이 스택 최상단인가" 이고, `false` 면 **ESC · 포커스 트랩 ·
최초 포커스 이동** 셋이 전부 동작하지 않습니다. 그런데 기본값이 `false` 라서
선언형으로 쓸 때 이 prop 을 빠뜨리면 **그 셋이 조용히 꺼졌습니다.**

화면도 마우스도 멀쩡하기 때문에 키보드 사용자만 겪는 문제였습니다.

```tsx
// 전 — ESC 도 포커스 트랩도 없다. 눈으로는 알 수 없다
<LayerPopup open={isOpen} onRequestClose={close} title="약관 동의">…</LayerPopup>

// 후 — 그대로 두면 ESC 와 포커스 트랩이 동작한다
<LayerPopup open={isOpen} onRequestClose={close} title="약관 동의">…</LayerPopup>
```

**바뀌는 것**

- 선언형으로 팝업을 **하나** 띄우고 `isTopmost` 를 넘기지 않았다면 → ESC 로 닫히고
  Tab 이 팝업 안에 갇히며 열 때 팝업 안 첫 요소로 포커스가 갑니다
- 선언형으로 **둘 이상을 겹쳐** 띄운다면 → 아래쪽 팝업에 `isTopmost={false}` 를
  넘겨주세요. 그러지 않으면 ESC 한 번에 둘 다 닫힙니다

```tsx
<BottomSheet open={sheetOpen} isTopmost={!alertOpen} …>…</BottomSheet>
<LayerPopup open={alertOpen} …>…</LayerPopup>
```

**바뀌지 않는 것** — `PopupHost` 를 쓰는 명령형(`useLayerPopup` · `useBottomSheet` ·
`useFullPopup` · `useAlert` · `useConfirm`)은 Host 가 값을 항상 계산해 넘기므로
동작이 그대로입니다.
