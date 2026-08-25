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

export const useToastStore = create<ToastStore>()((set) => ({
  items: [],
  openToast: (options) => {
    const id = options.id ?? createToastId();

    set((state) => {
      return {
        items: appendToastItem(state.items, {
          id,
          status: "open",
          props: options,
        }),
      };
    });

    return id;
  },
  closeToast: (id) => {
    set((state) => {
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
      return {
        items: state.items.filter((item) => item.id !== id),
      };
    });
  },
  closeAllToasts: () => {
    set((state) => {
      return {
        items: state.items.map((item) => ({
          ...item,
          status: "closing",
        })),
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
