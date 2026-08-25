"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true",
  );
}

type UsePopupPanelA11yParams = {
  open: boolean;
  isTopmost: boolean;
  shouldCloseOnEscape: boolean;
  onRequestClose?: () => void;
};

/**
 * 팝업 패널의 접근성: 최초 포커스 이동, 포커스 트랩, ESC 닫기, 포커스 복원.
 * 스택 최상단(`isTopmost`)일 때만 동작한다 — 팝업이 겹칠 때 아래 팝업이
 * 키 이벤트를 가로채지 않도록.
 */
export default function usePopupPanelA11y({
  open,
  isTopmost,
  shouldCloseOnEscape,
  onRequestClose,
}: UsePopupPanelA11yParams) {
  const panelRef = useRef<HTMLElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // 열기 직전 포커스를 기억했다가 닫힐 때 되돌린다
  useEffect(() => {
    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement) {
      lastFocusedElementRef.current = activeElement;
    }

    return () => {
      const lastFocusedElement = lastFocusedElementRef.current;

      if (lastFocusedElement?.isConnected) {
        window.requestAnimationFrame(() => {
          if (lastFocusedElement.isConnected) {
            lastFocusedElement.focus();
          }
        });
      }
    };
  }, []);

  // 열리면 패널 안 첫 요소로 포커스를 옮긴다
  useEffect(() => {
    if (!open || !isTopmost) return;

    const focusFrame = window.requestAnimationFrame(() => {
      const panelElement = panelRef.current;
      if (!panelElement) return;

      const focusableElements = getFocusableElements(panelElement);
      (focusableElements[0] ?? panelElement).focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
    };
  }, [isTopmost, open]);

  // 포커스 트랩 + ESC
  useEffect(() => {
    if (!open || !isTopmost) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const panelElement = panelRef.current;
      if (!panelElement) return;

      if (event.key === "Escape") {
        if (!shouldCloseOnEscape) return;

        event.preventDefault();
        onRequestClose?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements(panelElement);

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelElement.focus();
        return;
      }

      const firstFocusableElement = focusableElements[0]!;
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1]!;
      const activeElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const isFocusInsidePanel = activeElement
        ? panelElement.contains(activeElement)
        : false;

      if (!isFocusInsidePanel) {
        event.preventDefault();
        (event.shiftKey ? lastFocusableElement : firstFocusableElement).focus();
        return;
      }

      if (
        event.shiftKey &&
        (activeElement === firstFocusableElement ||
          activeElement === panelElement)
      ) {
        event.preventDefault();
        lastFocusableElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTopmost, onRequestClose, open, shouldCloseOnEscape]);

  return { panelRef };
}
