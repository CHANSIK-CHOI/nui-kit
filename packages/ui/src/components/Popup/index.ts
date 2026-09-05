// ⚠️ `PopupBase` 는 내보내지 않는다. 다섯 셸(Alert · Confirm · LayerPopup ·
//    BottomSheet · FullPopup)이 소비자가 쓰는 것이고, 공통 골격은 내부 구현이다.
//    공개하면 `PopupVariant` 에 값을 하나 더하는 것도 공개 API 변경이 된다
//    (`DatepickerBase` · `SelectBase` 와 같은 규칙).
export { default as Alert } from "./Alert.js";
export { default as Confirm } from "./Confirm.js";
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
  AlertProps,
  BottomSheetComponentProps,
  BottomSheetOptions,
  BottomSheetProps,
  ConfirmPopupOptions,
  ConfirmProps,
  FullPopupComponentProps,
  FullPopupOptions,
  FullPopupProps,
  LayerPopupComponentProps,
  LayerPopupOptions,
  LayerPopupProps,
  PopupContentAlign,
  PopupRuntimeProps,
  PopupSize,
  PopupVariant,
} from "./Popup.types.js";
