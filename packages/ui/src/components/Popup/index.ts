// ⚠️ `PopupBase` 는 내보내지 않는다. 셸 셋(LayerPopup · BottomSheet · FullPopup)이
//    소비자가 쓰는 것이고, 공통 골격은 내부 구현이다. 공개하면 `PopupVariant` 에 값을
//    하나 더하는 것도 공개 API 변경이 된다 (`DatepickerBase` · `SelectBase` 와 같은 규칙).
//
// ⚠️ **`Alert` · `Confirm` 컴포넌트도 내보내지 않는다** (2026-09-17 · spec §3-3). 둘은
//    훅 옵션이지 컴포넌트가 아니다 — `useAlert().open(options)` · `useConfirm().open(options)`.
//    컴포넌트가 나가면 훅 없이 여는 둘째 길이 생기고, 그 길은 Host 를 안 지나 잠금 · inert ·
//    포커스 복원이 없다. 파일은 남아 `PopupHost` 가 안에서 그린다.
export { default as LayerPopup } from "./LayerPopup.js";
export { default as BottomSheet } from "./BottomSheet.js";
export { default as FullPopup } from "./FullPopup.js";
export { default as PopupHost } from "./PopupHost.js";

export { default as useAlert } from "./useAlert.js";
export { default as useConfirm } from "./useConfirm.js";
export { default as useLayerPopup } from "./useLayerPopup.js";
export { default as useBottomSheet } from "./useBottomSheet.js";
export { default as useFullPopup } from "./useFullPopup.js";
export { usePopupStack, usePopupStore } from "./popup.store.js";
export type {
  PopupItem,
  PopupSnapshot,
  PopupType,
  PopupStatus,
} from "./popup.store.js";

export type {
  AlertPopupOptions,
  BottomSheetComponentProps,
  BottomSheetContentProps,
  BottomSheetOptions,
  BottomSheetProps,
  ConfirmPopupOptions,
  FullPopupComponentProps,
  FullPopupContentProps,
  FullPopupOptions,
  FullPopupProps,
  LayerPopupComponentProps,
  LayerPopupContentProps,
  LayerPopupOptions,
  LayerPopupProps,
  PopupContentAlign,
  PopupRuntimeProps,
  PopupSize,
  PopupTone,
  PopupVariant,
} from "./Popup.types.js";
