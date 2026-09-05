"use client";

import { useMemo } from "react";
import type { ConfirmPopupOptions } from "./Popup.types.js";
import { usePopupStack, usePopupStore } from "./popup.store.js";

const confirmPromiseResolvers = new Map<string, (value: boolean) => void>();

// 스택에서 사라진 confirm 의 약속을 닫는다.
//
// `close()`·`closeAll()` 은 훅이 직접 settle 하지만, 소비자가 store 를 직접 만져
// (`usePopupStore().closeAll()` · `closePopupType("confirm")`) 항목을 없애는 경로도 있다.
// 그때 resolver 를 거치지 않으면 `await` 가 영영 깨어나지 않는다.
// 모듈 스코프에서 한 번만 구독해 **어느 경로로 사라지든** 취소로 처리한다.
usePopupStore.subscribe((state) => {
  if (confirmPromiseResolvers.size === 0) return;

  const aliveIds = new Set(state.items.map((item) => item.id));

  for (const id of [...confirmPromiseResolvers.keys()]) {
    if (!aliveIds.has(id)) {
      settleConfirmPromise(id, false);
    }
  }
});

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
      // ⚠️ 등록은 `openConfirm` 이 성공한 **뒤에** 한다.
      //    먼저 등록하면 같은 id 로 두 번 열 때 두 번째 `set` 이 첫 resolver 를 덮고,
      //    이어지는 중복 에러 처리가 그것을 지워 **첫 약속이 영영 pending** 이 된다.
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
        reject(error);
        return;
      }

      confirmPromiseResolvers.set(id, resolve);
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
