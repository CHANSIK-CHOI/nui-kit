---
"@nui-kit/react": patch
---

dim 을 눌러도 팝업이 닫히지 않던 것을 고쳤다.

`LayerPopup` · `BottomSheet` · `FullPopup` 은 `shouldCloseOnBackdrop` 이 기본 `true` 라 dim 을 누르면 닫혀야 한다. 그런데 패널을 가운데 놓는 상자가 화면 전체를 덮은 채 클릭을 받고 있어 dim 에 닿지 않았다. 문서를 다시 쓰며 브라우저로 확인하다 찾았다. `Alert` · `Confirm` 은 원래 dim 으로 닫히지 않으므로 그대로다.
