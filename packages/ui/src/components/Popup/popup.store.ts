"use client";

import { useMemo } from "react";
import { create } from "zustand";
import type {
  AlertPopupOptions,
  BottomSheetOptions,
  ConfirmPopupOptions,
  FullPopupOptions,
  LayerPopupOptions,
} from "./Popup.types.js";

export type PopupType =
  "alert" | "confirm" | "layerPopup" | "bottomSheet" | "fullPopup";
export type PopupStatus = "open" | "closing";

type AlertPopupItem = {
  id: string;
  type: "alert";
  status: PopupStatus;
  props: AlertPopupOptions;
};

type ConfirmPopupItem = {
  id: string;
  type: "confirm";
  status: PopupStatus;
  props: ConfirmPopupOptions;
};

type LayerPopupItem = {
  id: string;
  type: "layerPopup";
  status: PopupStatus;
  props: LayerPopupOptions;
};

type BottomSheetItem = {
  id: string;
  type: "bottomSheet";
  status: PopupStatus;
  props: BottomSheetOptions;
};

type FullPopupItem = {
  id: string;
  type: "fullPopup";
  status: PopupStatus;
  props: FullPopupOptions;
};

export type PopupItem =
  | AlertPopupItem
  | ConfirmPopupItem
  | LayerPopupItem
  | BottomSheetItem
  | FullPopupItem;

export type PopupSnapshot = Pick<PopupItem, "id" | "type" | "status">;

type PopupStore = {
  items: PopupItem[];
  openAlert: (options: AlertPopupOptions) => string;
  openConfirm: (options: ConfirmPopupOptions) => string;
  openLayerPopup: (options: LayerPopupOptions) => string;
  openBottomSheet: (options: BottomSheetOptions) => string;
  openFullPopup: (options: FullPopupOptions) => string;
  closePopup: (id: string) => void;
  removePopup: (id: string) => void;
  closeAll: () => void;
  closePopupType: (type: PopupType) => void;
};

function createPopupId(type: PopupType) {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function appendPopupItem(
  items: PopupItem[],
  nextItem: PopupItem,
  actionName: string,
) {
  const isDuplicateId = items.some((item) => item.id === nextItem.id);

  if (isDuplicateId) {
    throw new Error(
      `Popup with id "${nextItem.id}" already exists. ${actionName} only creates new popups.`,
    );
  }

  return [...items, nextItem];
}

export const usePopupStore = create<PopupStore>()((set) => ({
  items: [],
  openAlert: (options) => {
    const id = options.id ?? createPopupId("alert");

    set((state) => {
      return {
        items: appendPopupItem(
          state.items,
          {
            id,
            type: "alert",
            status: "open",
            props: options,
          },
          "openAlert",
        ),
      };
    });

    return id;
  },
  openConfirm: (options) => {
    const id = options.id ?? createPopupId("confirm");

    set((state) => {
      return {
        items: appendPopupItem(
          state.items,
          {
            id,
            type: "confirm",
            status: "open",
            props: options,
          },
          "openConfirm",
        ),
      };
    });

    return id;
  },
  openLayerPopup: (options) => {
    const id = options.id ?? createPopupId("layerPopup");

    set((state) => ({
      items: appendPopupItem(
        state.items,
        {
          id,
          type: "layerPopup",
          status: "open",
          props: options,
        },
        "openLayerPopup",
      ),
    }));

    return id;
  },
  openBottomSheet: (options) => {
    const id = options.id ?? createPopupId("bottomSheet");

    set((state) => ({
      items: appendPopupItem(
        state.items,
        {
          id,
          type: "bottomSheet",
          status: "open",
          props: options,
        },
        "openBottomSheet",
      ),
    }));

    return id;
  },
  openFullPopup: (options) => {
    const id = options.id ?? createPopupId("fullPopup");

    set((state) => ({
      items: appendPopupItem(
        state.items,
        {
          id,
          type: "fullPopup",
          status: "open",
          props: options,
        },
        "openFullPopup",
      ),
    }));

    return id;
  },
  closePopup: (id) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "closing",
            }
          : item,
      ),
    }));
  },
  removePopup: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  closeAll: () => {
    set((state) => ({
      items: state.items.map((item) => ({
        ...item,
        status: "closing",
      })),
    }));
  },
  closePopupType: (type) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.type === type
          ? {
              ...item,
              status: "closing",
            }
          : item,
      ),
    }));
  },
}));

export function usePopupItems() {
  return usePopupStore((state) => state.items);
}

export function usePopupStack() {
  const items = usePopupItems();

  return useMemo(
    () =>
      items.map(({ id, type, status }) => ({
        id,
        type,
        status,
      })),
    [items],
  );
}
