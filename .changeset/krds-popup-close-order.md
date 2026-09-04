---
"@chansikchoi/next-ui": minor
---

팝업 닫기 버튼이 마크업의 가장 마지막으로 갔습니다. 보이는 자리는 오른쪽 위 그대로이고,
열었을 때 첫 포커스가 닫기 버튼이 아니라 **본문·푸터의 첫 요소**로 갑니다. Tab 을 끝까지
누르면 닫기 버튼이 잡힙니다. KRDS 가이드 397쪽 "닫기 버튼은 모달의 가장 마지막 요소로
마크업" 을 따른 것으로, `LayerPopup` · `BottomSheet` · `FullPopup` 이 해당합니다
(`Alert` · `Confirm` 은 닫기 버튼이 없어 그대로입니다).

**직접 스타일을 얹었다면 볼 것**

- `.nui-popup__close` 가 `.nui-popup__head` 밖으로 나와 `.nui-popup__panel` 의 마지막
  자식이 되고 `position: absolute` 로 자리를 잡습니다
- 닫기 버튼이 있는 팝업의 루트에 `.nui-popup--has-close` 가 붙습니다. 헤더의 높이와
  오른쪽 여백을 이 클래스가 잡습니다
- `.nui-popup__head--no-title` 은 클래스만 남고 우리 스타일에는 규칙이 없습니다

화면에 보이는 모양·여백은 바뀌지 않습니다.
