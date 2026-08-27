"use client";

import cn from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  cloneElement,
  isValidElement,
  useId,
  useRef,
  useState,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { px } from "../../internal/prefix.js";
import {
  motionTransition,
  reduceMotion,
  reduceMotionTransition,
} from "../../internal/motion.js";

const block = px("tooltip");

export type TooltipPlacement =
  | "topCenter"
  | "topLeft"
  | "topRight"
  | "bottomCenter"
  | "bottomLeft"
  | "bottomRight";

/** placement 값(카멜)을 kebab 클래스명으로 옮긴다 */
const PLACEMENT_CLASS: Record<TooltipPlacement, string> = {
  topCenter: "top-center",
  topLeft: "top-left",
  topRight: "top-right",
  bottomCenter: "bottom-center",
  bottomLeft: "bottom-left",
  bottomRight: "bottom-right",
};

type TooltipChildProps = {
  "aria-describedby"?: string;
};

export type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  placement?: TooltipPlacement;
  /** 제어 모드. 주면 열림 상태를 소비자가 소유한다 */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (nextOpen: boolean) => void;
  disabled?: boolean;
};

function getTooltipAnimationOffset(placement: TooltipPlacement) {
  return placement.startsWith("top") ? 6 : -6;
}

function getMergedAriaDescribedBy({
  currentAriaDescribedBy,
  tooltipId,
}: {
  currentAriaDescribedBy?: string;
  tooltipId?: string;
}) {
  const merged = [currentAriaDescribedBy, tooltipId].filter(Boolean).join(" ");

  return merged || undefined;
}

/**
 * 트리거를 감싸 hover / focus 시 설명을 띄운다. portal 이 아니라
 * 트리거 옆에 absolute 로 붙으므로, 잘리는 조상(overflow: hidden)이 없어야 한다.
 *
 * 열려 있는 동안 트리거에 `aria-describedby` 를 연결한다 —
 * 마우스가 없는 사용자도 내용을 들을 수 있도록.
 */
export default function Tooltip({
  children,
  content,
  className,
  placement = "topCenter",
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
}: TooltipProps) {
  // framer-motion 은 CSS duration 토큰의 1ms 무력화를 읽지 않는다 (design-system.md §6).
  const shouldReduceMotion = useReducedMotion();

  const tooltipId = useId();
  const [isTooltipOpen, setIsTooltipOpen] = useState(defaultOpen);
  const prevDisabledRef = useRef(disabled);

  // disabled 로 바뀌는 순간 열려 있던 툴팁을 닫는다 (렌더 중 상태 조정)
  if (!prevDisabledRef.current && disabled && isTooltipOpen) {
    setIsTooltipOpen(false);
  }
  prevDisabledRef.current = disabled;

  const isControlled = typeof open === "boolean";
  const resolvedOpen = disabled ? false : isControlled ? open : isTooltipOpen;
  const animationOffset = getTooltipAnimationOffset(placement);

  const setTooltipOpenState = (nextOpen: boolean) => {
    if (!isControlled) {
      setIsTooltipOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = () => {
    if (disabled) return;

    setTooltipOpenState(true);
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    setTooltipOpenState(false);
  };

  const handleFocus: FocusEventHandler<HTMLDivElement> = () => {
    if (disabled) return;

    setTooltipOpenState(true);
  };

  const handleBlur: FocusEventHandler<HTMLDivElement> = (event) => {
    // 컨테이너 내부로 포커스가 옮겨간 것은 blur 로 보지 않는다
    if (event.currentTarget.contains(event.relatedTarget as Node | null))
      return;

    setTooltipOpenState(false);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Escape") {
      setTooltipOpenState(false);
    }
  };

  const resolvedChildren = isValidElement<TooltipChildProps>(children)
    ? cloneElement(children, {
        "aria-describedby": getMergedAriaDescribedBy({
          currentAriaDescribedBy: children.props["aria-describedby"],
          tooltipId: resolvedOpen ? tooltipId : undefined,
        }),
      })
    : children;

  return (
    <div
      className={cn(
        block,
        `${block}--${PLACEMENT_CLASS[placement]}`,
        disabled && px("is-disabled"),
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <div className={`${block}__trigger`}>{resolvedChildren}</div>

      <AnimatePresence initial={false}>
        {resolvedOpen ? (
          <motion.div
            key="tooltip-panel"
            className={`${block}__panel`}
            initial={reduceMotion(
              { opacity: 0, y: animationOffset, scale: 0.98 },
              shouldReduceMotion,
            )}
            animate={reduceMotion(
              { opacity: 1, y: 0, scale: 1 },
              shouldReduceMotion,
            )}
            exit={{
              ...reduceMotion(
                { opacity: 0, y: animationOffset, scale: 0.98 },
                shouldReduceMotion,
              ),
              transition: reduceMotionTransition(
                motionTransition.popoverExit,
                shouldReduceMotion,
              ),
            }}
            transition={reduceMotionTransition(
              motionTransition.popover,
              shouldReduceMotion,
            )}
          >
            <div id={tooltipId} role="tooltip" className={`${block}__bubble`}>
              <div className={`${block}__content`}>{content}</div>
              <span className={`${block}__arrow`} aria-hidden="true" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
