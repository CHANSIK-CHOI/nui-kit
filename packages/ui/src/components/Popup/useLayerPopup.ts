"use client";

import { useMemo } from "react";
import type { LayerPopupOptions } from "./Popup.types.js";
import { usePopupStack, usePopupStore } from "./popup.store.js";

/** LayerPopup 을 명령형으로 열고 닫는다. PopupHost 가 앱 어딘가에 있어야 한다. */
export default function useLayerPopup() {
  const openLayerPopup = usePopupStore((state) => state.openLayerPopup);
  const closePopupType = usePopupStore((state) => state.closePopupType);
  const closePopup = usePopupStore((state) => state.closePopup);
  const popupStack = usePopupStack();

  const stack = useMemo(
    () => popupStack.filter((item) => item.type === "layerPopup"),
    [popupStack],
  );

  const open = (options: LayerPopupOptions) => openLayerPopup(options);

  /** id 를 주지 않으면 가장 최근에 연 것을 닫는다 */
  const close = (id?: string) => {
    const targetId = id ?? stack[stack.length - 1]?.id;
    if (!targetId) return;

    closePopup(targetId);
  };

  return {
    open,
    close,
    closeAll: () => closePopupType("layerPopup"),
    layerPopups: stack,
  };
}
