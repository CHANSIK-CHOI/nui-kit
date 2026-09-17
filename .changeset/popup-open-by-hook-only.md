---
"@nui-kit/react": minor
---

**BREAKING** — 팝업은 **훅으로만** 엽니다. 여는 길이 하나가 되면서, 팝업이 떠 있는 동안에는 **언제나** 배경 스크롤이 잠기고 배경이 `inert` 가 됩니다.

### `Alert` · `Confirm` — 컴포넌트가 없어집니다

훅에 넘기는 옵션이 곧 내용입니다.

| 옛 | 새 |
| --- | --- |
| `import { Alert, Confirm } from "@nui-kit/react"` (`/popup` 도 같다) | `useAlert().open(options)` · `useConfirm().open(options)` / `openAsync(options)` |
| `AlertProps` · `ConfirmProps` 타입 | `AlertPopupOptions` · `ConfirmPopupOptions` |

```tsx
const alert = useAlert();
alert.open({ title: "저장했습니다", confirmLabel: "닫기" });

const confirm = useConfirm();
if (await confirm.openAsync({ title: "이 글을 삭제할까요?", confirmLabel: "삭제", tone: "danger" })) remove();
```

### `LayerPopup` · `BottomSheet` · `FullPopup` — 컴포넌트를 만들고 훅으로 엽니다

`<LayerPopup open={isOpen} onRequestClose={…}>` 처럼 앱 안에서 직접 렌더하던 길이 없어집니다. `PopupHost` 밖에서 렌더한 셸은 **그려지지 않습니다**(개발 모드에서 콘솔에 한 줄). 타입은 통과하므로 화면에서 드러납니다.

| 옛 | 새 |
| --- | --- |
| `<BottomSheet open={isOpen} onRequestClose={close} title="정렬">…</BottomSheet>` | 아래처럼 컴포넌트로 만들어 `useBottomSheet().open({ component })` |
| 겹칠 때 아래쪽에 `isTopmost={false}` | 없음 — `PopupHost` 가 스택 순서로 계산 |

```tsx
function SortSheet(runtime: BottomSheetComponentProps) {
  return (
    <BottomSheet {...runtime} title="정렬">
      <Button variant="line" onClick={runtime.onRequestClose}>최신순</Button>
    </BottomSheet>
  );
}

useBottomSheet().open({ component: SortSheet });
```

- `LayerPopupProps` · `BottomSheetProps` · `FullPopupProps` 의 `id` · `open` · `isTopmost` · `onRequestClose` · `onCloseComplete` 가 **required** 가 됩니다. `PopupHost` 가 넣어 주는 값을 `{...runtime}` 으로 그대로 펼치면 되고, 하나라도 빠뜨리면 타입 에러가 납니다
- 새 타입 `LayerPopupContentProps` · `BottomSheetContentProps` · `FullPopupContentProps` — runtime 다섯을 뺀, 쓰는 쪽이 적는 props 입니다
- 같은 팝업을 다른 값으로 열 때는 컴포넌트를 만드는 함수(팩토리)나 클로저를 씁니다. `open()` 에 props 를 실어 보내는 필드는 없습니다

### `PopupHost` 는 이제 필수입니다

앱 루트에서 한 번 감쌉니다. 없으면 팝업이 그려지지 않고, 개발 모드에서 `open()` 을 부를 때 콘솔에 한 줄이 납니다.

### 함께 좋아지는 것

- 어떤 팝업이든 떠 있는 동안 배경 스크롤 잠금 · 배경 `inert` · 닫힌 뒤 포커스 복원이 따라옵니다. 예전에 앱 안에서 직접 렌더한 팝업에는 셋 다 없었습니다
