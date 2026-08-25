"use client";

import { useMemo } from "react";
import type { ConfirmPopupOptions } from "./Popup.types.js";
import { usePopupStack, usePopupStore } from "./popup.store.js";

const confirmPromiseResolvers = new Map<string, (value: boolean) => void>();

function createConfirmPromiseId() {
  return `confirm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function settleConfirmPromise(id: string, value: boolean) {
  const resolver = confirmPromiseResolvers.get(id);

  if (!resolver) {
    return;
  }

  confirmPromiseResolvers.delete(id);
  resolver(value);
}

/**
 * Confirm 을 명령형으로 연다. `openAsync` 는 사용자의 선택을
 * Promise<boolean> 으로 돌려주므로 `await` 로 분기할 수 있다.
 */
export default function useConfirm() {
  const openConfirm = usePopupStore((state) => state.openConfirm);
  const closePopupType = usePopupStore((state) => state.closePopupType);
  const closePopup = usePopupStore((state) => state.closePopup);
  const popupStack = usePopupStack();

  const confirmStack = useMemo(
    () => popupStack.filter((item) => item.type === "confirm"),
    [popupStack],
  );

  const open = (options: ConfirmPopupOptions) => openConfirm(options);

  const openAsync = (options: ConfirmPopupOptions) => {
    const id = options.id ?? createConfirmPromiseId();

    return new Promise<boolean>((resolve, reject) => {
      confirmPromiseResolvers.set(id, resolve);

      try {
        openConfirm({
          ...options,
          id,
          onCancel: () => {
            options.onCancel?.();
            settleConfirmPromise(id, false);
          },
          onConfirm: () => {
            options.onConfirm?.();
            settleConfirmPromise(id, true);
          },
        });
      } catch (error) {
        confirmPromiseResolvers.delete(id);
        reject(error);
      }
    });
  };

  const close = (id?: string) => {
    const targetId = id ?? confirmStack[confirmStack.length - 1]?.id;

    if (!targetId) {
      return;
    }

    settleConfirmPromise(targetId, false);
    closePopup(targetId);
  };

  return {
    open,
    openAsync,
    close,
    closeAll: () => {
      confirmStack.forEach(({ id }) => {
        settleConfirmPromise(id, false);
      });
      closePopupType("confirm");
    },
    confirms: confirmStack,
  };
}
