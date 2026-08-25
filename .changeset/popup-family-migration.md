---
"@chansikchoi/next-ui": minor
---

Popup 계열을 추가했습니다.

**컴포넌트**
- `PopupBase` — 모든 팝업의 공통 골격 (dim · 포커스 트랩 · ESC · 모션)
- `Alert` / `Confirm` — 메시지형. dim 클릭·ESC 로 닫히지 않습니다
- `LayerPopup` / `BottomSheet` / `FullPopup` — 셸

**명령형 API** (`PopupHost` 로 앱을 감싸야 합니다)
`useAlert` / `useConfirm` / `useLayerPopup` / `useBottomSheet` / `useFullPopup`
`useConfirm().openAsync()` 는 사용자의 선택을 `Promise<boolean>` 으로 돌려줍니다.

**새 서브패스** `/popup` · **새 온디맨드 CSS** `styles/popup.css`

**동작 수정 (원본 대비)**
- `LayerPopup` / `BottomSheet` / `FullPopup` 이 `isTopmost` 를 받지 못해
  **ESC 로 닫히지 않고 포커스 트랩도 걸리지 않던 문제**를 고쳤습니다.
- `PopupHost` 가 portal 컨테이너(`#nui-popup-root`)를 **없으면 직접 생성**합니다.
  더 이상 소비자가 빈 div 를 미리 심어둘 필요가 없습니다.
- 배경 inert 처리가 Pages Router 의 `#__next` 에 의존하던 것을,
  **body 직계 자식 중 portal 을 제외한 전부**로 바꿔 App Router 에서 동작합니다.
- 스크롤 잠금 클래스가 `is-prevent-scroll` → `nui-is-prevent-scroll`,
  CSS 변수가 `--scroll-lock-top` → `--nui-scroll-lock-top` 로 바뀌었습니다.
