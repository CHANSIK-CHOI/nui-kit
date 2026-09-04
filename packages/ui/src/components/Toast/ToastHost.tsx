"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { px } from "../../internal/prefix.js";
import { PORTAL_ROOT_ATTRIBUTE } from "../../internal/portal.js";
import Toast from "./Toast.js";
import { useToastStore } from "./toast.store.js";

const TOAST_ROOT_ID = px("toast-root");
const PORTAL_CLASS = px("toast-portal");
const STACK_CLASS = px("toast-stack");

type ToastHostProps = {
  children: ReactNode;
};

/**
 * `useToast()` 로 띄운 토스트의 렌더링 지점. 앱 루트에서 한 번만 감싼다.
 *
 * PopupHost 와 마찬가지로 portal 컨테이너가 없으면 직접 만든다 —
 * 원본은 컨테이너가 없으면 **아무것도 렌더하지 않고 조용히 실패**했다.
 */
export default function ToastHost({ children }: ToastHostProps) {
  const items = useToastStore((state) => state.items);
  const closeToast = useToastStore((state) => state.closeToast);
  const removeToast = useToastStore((state) => state.removeToast);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let root = document.getElementById(TOAST_ROOT_ID);
    let createdByUs = false;

    if (!root) {
      root = document.createElement("div");
      root.id = TOAST_ROOT_ID;
      document.body.appendChild(root);
      createdByUs = true;
    }

    // 컨테이너를 소비자가 미리 심어둔 경우에도 레이어 스타일은 우리가 보장한다
    root.classList.add(PORTAL_CLASS);
    // 팝업이 배경을 inert 처리할 때 건너뛰게 한다 — 팝업 안에서 띄운 토스트도
    // 눌리고 읽혀야 한다 (design-system.md §10)
    root.setAttribute(PORTAL_ROOT_ATTRIBUTE, "");
    setPortalRoot(root);

    return () => {
      if (createdByUs && root && root.childElementCount === 0) {
        root.remove();
      }
    };
  }, []);

  return (
    <>
      {children}
      {portalRoot
        ? createPortal(
            <div className={STACK_CLASS}>
              {items.map((item) => {
                const { onCloseComplete, ...toastProps } = item.props;

                return (
                  <Toast
                    key={item.id}
                    {...toastProps}
                    open={item.status === "open"}
                    onRequestClose={() => closeToast(item.id)}
                    onExited={() => {
                      onCloseComplete?.();
                      removeToast(item.id);
                    }}
                  />
                );
              })}
            </div>,
            portalRoot,
          )
        : null}
    </>
  );
}
