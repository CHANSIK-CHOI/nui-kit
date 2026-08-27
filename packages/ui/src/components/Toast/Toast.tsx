"use client";

import cn from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { px } from "../../internal/prefix.js";
import {
  motionTransition,
  reduceMotion,
  reduceMotionTransition,
} from "../../internal/motion.js";
import type { ToastProps } from "./Toast.types.js";

const block = px("toast");
const DEFAULT_TOAST_DURATION = 2400;

/**
 * 단일 토스트 카드. 보통 직접 쓰지 않고 `useToast()` 로 띄운다.
 *
 * tone 에 따라 라이브 리전 강도가 달라진다 —
 * error 는 즉시 읽히도록 assertive, 그 외는 polite.
 */
export default function Toast({
  className,
  message,
  tone = "default",
  duration = DEFAULT_TOAST_DURATION,
  open,
  onRequestClose,
  onExited,
  onOpenComplete,
}: ToastProps) {
  // framer-motion 은 CSS duration 토큰의 1ms 무력화를 읽지 않는다 (design-system.md §6).
  const shouldReduceMotion = useReducedMotion();

  const hasOpenedRef = useRef(false);

  useEffect(() => {
    hasOpenedRef.current = false;
  }, [open]);

  useEffect(() => {
    if (!open || duration <= 0) return;

    const timeoutId = window.setTimeout(() => {
      onRequestClose?.();
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [duration, onRequestClose, open]);

  const handleAnimationComplete = () => {
    if (!open || hasOpenedRef.current) return;

    hasOpenedRef.current = true;
    onOpenComplete?.();
  };

  return (
    <AnimatePresence onExitComplete={onExited}>
      {open ? (
        <motion.article
          role={tone === "error" ? "alert" : "status"}
          aria-live={tone === "error" ? "assertive" : "polite"}
          aria-atomic="true"
          className={cn(
            block,
            tone !== "default" && `${block}--${tone}`,
            className,
          )}
          initial={reduceMotion(
            { opacity: 0, y: 32, scale: 0.98 },
            shouldReduceMotion,
          )}
          animate={reduceMotion(
            { opacity: 1, y: 0, scale: 1 },
            shouldReduceMotion,
          )}
          exit={reduceMotion(
            { opacity: 0, y: 24, scale: 0.98 },
            shouldReduceMotion,
          )}
          transition={reduceMotionTransition(
            motionTransition.toast,
            shouldReduceMotion,
          )}
          onAnimationComplete={handleAnimationComplete}
          layout="position"
        >
          <span className={`${block}__indicator`} aria-hidden="true" />
          <div className={`${block}__content`}>
            <div className={`${block}__message`}>{message}</div>
          </div>
        </motion.article>
      ) : null}
    </AnimatePresence>
  );
}
