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

  /**
   * id 를 주지 않으면 **지금 보이는 것**을 닫는다.
   *
   * 토스트는 한 번에 하나만 보이므로 큐의 맨 앞이 그 대상이다 (TO2).
   * 배열의 마지막을 고르면 아직 차례가 오지 않은 것을 닫게 된다.
   * 이미 나가는 중이면 아무것도 하지 않는다 — 연속 호출이 큐를 갉아먹지 않게.
   */
  const close = (id?: string) => {
    const targetId = id ?? toasts.find((item) => item.status === "open")?.id;
    if (!targetId) return;

    closeToast(targetId);
  };

  return { open, close, closeAll: closeAllToasts, toasts };
}
