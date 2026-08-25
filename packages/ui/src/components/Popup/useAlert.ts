"use client";

import { useMemo } from "react";
import type { AlertPopupOptions } from "./Popup.types.js";
import { usePopupStack, usePopupStore } from "./popup.store.js";

/** Alert 을 명령형으로 열고 닫는다. PopupHost 가 앱 어딘가에 있어야 한다. */
export default function useAlert() {
  const openAlert = usePopupStore((state) => state.openAlert);
  const closePopupType = usePopupStore((state) => state.closePopupType);
  const closePopup = usePopupStore((state) => state.closePopup);
  const popupStack = usePopupStack();

  const stack = useMemo(
    () => popupStack.filter((item) => item.type === "alert"),
    [popupStack],
  );

  const open = (options: AlertPopupOptions) => openAlert(options);

  /** id 를 주지 않으면 가장 최근에 연 것을 닫는다 */
  const close = (id?: string) => {
    const targetId = id ?? stack[stack.length - 1]?.id;
    if (!targetId) return;

    closePopup(targetId);
  };

  return {
    open,
    close,
    closeAll: () => closePopupType("alert"),
    alerts: stack,
  };
}
