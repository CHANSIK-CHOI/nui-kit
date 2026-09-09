"use client";

import { useMemo } from "react";
import { create } from "zustand";
import type {
  ToastOpenOptions,
  ToastSnapshot,
  ToastStatus,
} from "./Toast.types.js";

type ToastItem = {
  id: string;
  status: ToastStatus;
  props: ToastOpenOptions;
};

type ToastStore = {
  items: ToastItem[];
  openToast: (options: ToastOpenOptions) => string;
  closeToast: (id: string) => void;
  removeToast: (id: string) => void;
  closeAllToasts: () => void;
};

function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function appendToastItem(items: ToastItem[], nextItem: ToastItem) {
  const isDuplicateId = items.some((item) => item.id === nextItem.id);

  if (isDuplicateId) {
    throw new Error(
      `Toast with id "${nextItem.id}" already exists. openToast only creates new toasts.`,
    );
  }

  return [...items, nextItem];
}

/**
 * 큐의 맨 앞 하나만 화면에 올린다 (TO2).
 *
 * 앞의 것이 사라져 배열에서 빠지면 다음 것이 맨 앞이 되고, 여기서 `open` 으로 승격한다.
 * 나머지는 `queued` 로 되돌린다 — 순서가 바뀌어도 상태가 따라온다.
 * 이미 `closing` 인 맨 앞은 건드리지 않는다. 나가는 모션이 끝나야 배열에서 빠진다.
 */
function syncQueue(items: ToastItem[]): ToastItem[] {
  return items.map((item, index) => {
    const next: ToastStatus =
      index === 0 ? (item.status === "closing" ? "closing" : "open") : "queued";

    return next === item.status ? item : { ...item, status: next };
  });
}

export const useToastStore = create<ToastStore>()((set) => ({
  items: [],
  openToast: (options) => {
    const id = options.id ?? createToastId();

    set((state) => {
      return {
        items: syncQueue(
          appendToastItem(state.items, {
            id,
            // 맨 앞이면 syncQueue 가 곧바로 open 으로 올린다
            status: "queued",
            props: options,
          }),
        ),
      };
    });

    return id;
  },
  closeToast: (id) => {
    set((state) => {
      const target = state.items.find((item) => item.id === id);

      // 차례를 기다리던 것은 나가는 모션이 없다 — 화면에 오른 적이 없으므로 그냥 뺀다.
      // 렌더된 적이 없어 `onCloseComplete` 도 오지 않는다 (spec Toast.md §6-1).
      if (target?.status === "queued") {
        return { items: state.items.filter((item) => item.id !== id) };
      }

      return {
        items: state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "closing",
              }
            : item,
        ),
      };
    });
  },
  removeToast: (id) => {
    set((state) => {
      // 빠지고 나면 다음 것이 맨 앞이 된다 — syncQueue 가 그것을 open 으로 올린다
      return {
        items: syncQueue(state.items.filter((item) => item.id !== id)),
      };
    });
  },
  closeAllToasts: () => {
    set((state) => {
      // 보이는 것만 나가는 모션을 탄다. 기다리던 것들은 그냥 버린다
      return {
        items: state.items
          .filter((item) => item.status !== "queued")
          .map((item) => ({ ...item, status: "closing" as const })),
      };
    });
  },
}));

export function useToastItems() {
  return useToastStore((state) => state.items);
}

export function useToastStack() {
  const items = useToastItems();

  return useMemo<ToastSnapshot[]>(
    () =>
      items.map(({ id, status, props }) => ({
        id,
        status,
        tone: props.tone ?? "default",
      })),
    [items],
  );
}
