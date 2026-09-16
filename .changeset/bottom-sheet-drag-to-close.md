---
"@nui-kit/react": minor
---

`BottomSheet` 에 **끌어서 닫기**가 생기고, **팝업 계열 전체의 열림·닫힘 모션이 달라집니다.**

### 끌어서 닫기 — `shouldCloseOnDrag`

```tsx
<BottomSheet open={isOpen} onRequestClose={close} shouldCloseOnDrag title="정렬">
  …
</BottomSheet>
```

켜면 시트 위에 손잡이가 생기고, **위쪽 44px 띠**를 아래로 끌면 시트가 손가락을 따라옵니다.
놓았을 때 시트 높이의 40% 를 넘게 내려왔거나 빠르게 튕겼으면 닫히고, 아니면 제자리로 돌아옵니다.

- **기본은 꺼져 있습니다.** 이 prop 을 쓰지 않으면 시트의 동작은 그대로입니다.
- 제목과 본문은 끄는 면이 아닙니다. 제목은 긁을 수 있고 본문은 스크롤합니다.
- 끌어서 닫는 것도 `onRequestClose` 를 부릅니다. 그 prop 이 없으면 끌려도 제자리로 돌아옵니다.
- **켜면 닫기 버튼이 기본으로 사라집니다.** 손잡이가 닫는 자리라 × 가 중복이기 때문입니다.
  둘을 함께 두려면 `hasCloseButton` 을 적습니다. 딤과 `Esc` 는 그대로라 드래그를 못 하는
  사용자의 출구는 남습니다.
- `hasDragHandle={false}` 로 손잡이 막대만 감출 수 있습니다. 띠는 남아 끌리지만 **24px 로 줄고**
  끌 수 있다는 것을 알릴 길도 없어져 권하지 않습니다.
- 모션 감소 설정에서도 끌립니다. 놓으면 즉시 제자리이거나 즉시 닫힙니다.
- `shouldCloseOnDrag` · `hasDragHandle` 은 `BottomSheet` 에만 있습니다. `FullPopup` · `LayerPopup` ·
  `Alert` · `Confirm` 의 타입에는 나타나지 않습니다.

새 공개 훅 둘 — `--nui-bottom-sheet--handle-width`(36px) · `--nui-bottom-sheet--handle-height`(4px).

### 모션 — 팝업 다섯 모두에 걸립니다

`shouldCloseOnDrag` 를 쓰지 않아도 보이는 변화입니다. 화면만 달라지고 API 는 그대로입니다.

| | 전 | 후 |
| --- | --- | --- |
| 딤 | 팝업 종류와 무관하게 100ms | **패널과 같은 시간·곡선** — 딤과 패널이 한 면으로 움직입니다 |
| `BottomSheet` 열림 | 스프링 0.3 | 스프링 **0.25** |
| `BottomSheet` 닫힘 | 250ms | **200ms** · 끌어서 닫으면 놓은 속도를 이어받습니다 |
| `FullPopup` 열림 | 300ms · 첫 프레임에 화면 폭의 31% | 300ms · **더 고른 곡선**으로 첫 프레임 14% |
| `Alert` · `Confirm` · `LayerPopup` | — | 그대로입니다 |

### 스크롤

팝업 본문이 끝에 닿아도 **뒤 페이지가 따라 스크롤되지 않습니다**(`overscroll-behavior: contain`).
팝업 계열 전부에 걸립니다. 지금까지 본문 끝에서 배경이 밀리던 동작에 기대고 있었다면 달라집니다.
