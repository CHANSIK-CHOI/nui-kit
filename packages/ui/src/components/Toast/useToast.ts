"use client";

import type { ToastOpenOptions } from "./Toast.types.js";
import { useToastStack, useToastStore } from "./toast.store.js";

/** 토스트를 명령형으로 띄운다. ToastHost 가 앱 어딘가에 있어야 한다. */
export default function useToast() {
  const openToast = useToastStore((state) => state.openToast);
  const closeToast = useToastStore((state) => state.closeToast);
  const closeAllToasts = useToastStore((state) => state.closeAllToasts);
  const toasts = useToastStack();

  const open = (options: ToastOpenOptions) => openToast(options);

  /** id 를 주지 않으면 가장 최근 토스트를 닫는다 */
  const close = (id?: string) => {
    const targetId = id ?? toasts[toasts.length - 1]?.id;
    if (!targetId) return;

    closeToast(targetId);
  };

  return { open, close, closeAll: closeAllToasts, toasts };
}
