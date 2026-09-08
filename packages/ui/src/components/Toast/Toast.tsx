"use client";

import cn from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { px } from "../../internal/prefix.js";
import {
  motionTransition,
  reduceMotion,
  reduceMotionTransition,
} from "../../internal/motion.js";
import { AttentionIcon, CloseIcon, SuccessIcon } from "../Icon/icons.js";
import type { ToastProps, ToastTone } from "./Toast.types.js";

const block = px("toast");

/**
 * 기본 4초. SEED Snackbar 값이고, 두 줄까지 읽기에 모자라지 않다.
 * 긴 문구는 소비자가 `duration` 으로 늘린다.
 */
const DEFAULT_TOAST_DURATION = 4000;

const DEFAULT_CLOSE_LABEL = "닫기";

/**
 * tone 이 아이콘을 정한다. `default` 는 아이콘이 없다 —
 * "무슨 일이 있었다"에는 붙일 그림이 없다 (SEED Snackbar variant=default).
 */
const TONE_ICON: Record<ToastTone, typeof SuccessIcon | null> = {
  default: null,
  success: SuccessIcon,
  error: AttentionIcon,
};

/**
 * 단일 토스트 카드. 보통 직접 쓰지 않고 `useToast()` 로 띄운다.
 *
 * tone 에 따라 라이브 리전 강도가 달라진다 —
 * error 는 즉시 읽히도록 assertive, 그 외는 polite.
 *
 * **읽는 동안은 사라지지 않는다.** 마우스가 올라가 있거나, 포커스가 안에 있거나,
 * 탭이 숨어 있으면 시간이 멈추고 남은 시간부터 다시 간다 (WCAG 2.2.1).
 */
export default function Toast({
  className,
  message,
  tone = "default",
  duration = DEFAULT_TOAST_DURATION,
  closable = false,
  closeLabel = DEFAULT_CLOSE_LABEL,
  action,
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

  // ⚠️ 콜백을 ref 로 받아 타이머 effect 의 의존성에서 뺀다.
  //    `ToastHost` 는 렌더마다 새 `onRequestClose` 를 만들므로, 의존성에 두면
  //    **다른 토스트가 열리고 닫힐 때마다 남아 있던 토스트의 시간이 처음부터 다시 간다.**
  const onRequestCloseRef = useRef(onRequestClose);

  useEffect(() => {
    onRequestCloseRef.current = onRequestClose;
  });

  // ── 멈추는 이유 셋. 하나라도 켜져 있으면 시간이 흐르지 않는다.
  const [isHovered, setHovered] = useState(false);
  const [isFocusedWithin, setFocusedWithin] = useState(false);
  const [isPageHidden, setPageHidden] = useState(false);
  const isPaused = isHovered || isFocusedWithin || isPageHidden;

  useEffect(() => {
    const sync = () => setPageHidden(document.visibilityState === "hidden");

    sync();
    document.addEventListener("visibilitychange", sync);

    return () => {
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // 남은 시간을 들고 있는다. 멈출 때 흘러간 만큼 깎고, 다시 걸 때 그 값으로 건다.
  const remainingRef = useRef(duration);

  useEffect(() => {
    remainingRef.current = duration;
  }, [duration, open]);

  useEffect(() => {
    if (!open || duration <= 0 || isPaused) return;

    const startedAt = Date.now();
    const timeoutId = window.setTimeout(() => {
      onRequestCloseRef.current?.();
    }, remainingRef.current);

    return () => {
      window.clearTimeout(timeoutId);
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startedAt),
      );
    };
  }, [duration, isPaused, open]);

  const handleAnimationComplete = () => {
    if (!open || hasOpenedRef.current) return;

    hasOpenedRef.current = true;
    onOpenComplete?.();
  };

  // ⚠️ 마우스에서만 멈춘다. 터치는 `pointerleave` 가 오지 않을 수 있어
  //    한 번 탭하면 토스트가 영영 남는다. 터치 사용자에게는 액션과 닫기 버튼이 있다.
  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") setHovered(true);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") setHovered(false);
  };

  const handleActionClick = () => {
    action?.onClick();
    // 액션을 눌렀으면 토스트는 할 일을 마쳤다.
    onRequestClose?.();
  };

  const ToneIcon = TONE_ICON[tone];

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
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onFocus={() => setFocusedWithin(true)}
          onBlur={() => setFocusedWithin(false)}
          // `transform` 문자열로 준다 — 숏핸드는 메인 스레드 rAF 다 (07 M5).
          // 원점은 두지 않는다 — 아래에서 올라오는 것이라 의미가 없다.
          initial={reduceMotion(
            { opacity: 0, transform: "translateY(32px) scale(0.97)" },
            shouldReduceMotion,
          )}
          animate={reduceMotion(
            { opacity: 1, transform: "translateY(0px) scale(1)" },
            shouldReduceMotion,
          )}
          exit={reduceMotion(
            { opacity: 0, transform: "translateY(24px) scale(0.97)" },
            shouldReduceMotion,
          )}
          transition={reduceMotionTransition(
            motionTransition.toast,
            shouldReduceMotion,
          )}
          onAnimationComplete={handleAnimationComplete}
          layout="position"
        >
          {ToneIcon ? (
            <span className={`${block}__icon`}>
              <ToneIcon />
            </span>
          ) : null}
          <div className={`${block}__content`}>
            <div className={`${block}__message`}>{message}</div>
          </div>
          {action ? (
            <button
              type="button"
              className={`${block}__action`}
              onClick={handleActionClick}
            >
              {action.label}
            </button>
          ) : null}
          {closable ? (
            <button
              type="button"
              className={`${block}__close`}
              onClick={() => onRequestClose?.()}
              aria-label={closeLabel}
            >
              <CloseIcon />
            </button>
          ) : null}
        </motion.article>
      ) : null}
    </AnimatePresence>
  );
}
