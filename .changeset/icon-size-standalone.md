---
"@nui-kit/react": patch
---

아이콘을 단독으로 두었을 때 `size` 가 무시되던 것을 고쳤다.

`<SearchIcon size={20} />` 처럼 이름 붙인 아이콘을 버튼 밖에 두면 크기가 `size` 대신 부모 폭을 채웠다. 버튼과 입력 안에서는 슬롯이 상자를 잡아 주어 드러나지 않았다. 이제 `size` 와 `width` · `height` 가 어디서나 그대로 적용된다. `Icon` 래퍼도 `size` 를 받는다.
