"use client";

import cn from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEventHandler,
  type MouseEventHandler,
  type PointerEventHandler,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { px } from "../../internal/prefix.js";
import { PORTAL_ROOT_ATTRIBUTE } from "../../internal/portal.js";
import {
  motionTransition,
  reduceMotion,
  reduceMotionTransition,
} from "../../internal/motion.js";

const block = px("tooltip");
const TOOLTIP_ROOT_ID = px("tooltip-root");

// portal 컨테이너 하나를 모든 툴팁이 공유한다. 몇 개가 쓰고 있는지 세어 두고
// 마지막 하나가 사라질 때만 지운다 (아래 effect 참조).
let portalRootRefCount = 0;
let portalRootCreatedByUs = false;

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

/** portal 래퍼에 입히는 트리거의 화면 좌표 */
type TriggerRect = {
  top: number;
  left: number;
  width: number;
  height: number;
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
  /**
   * 말풍선을 `body` 로 내보낸다. `overflow: hidden` 조상(팝업 패널 등)에서
   * 잘리지 않게 하려면 켠다. 기본값은 `false` — 제자리 배치가 기본이다.
   *
   * ⚠️ 잘림만 없앤다. 뷰포트 밖으로 밀리는 것은 그대로이므로
   *    가장자리에서는 `placement` 를 소비자가 골라야 한다.
   */
  hasPortal?: boolean;
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
 * 트리거를 감싸 hover / focus / 터치 탭으로 설명을 띄운다.
 *
 * 기본은 트리거 옆 `absolute` 배치라 잘리는 조상(`overflow: hidden`)이 없어야 한다.
 * `hasPortal` 을 켜면 `body` 로 내보내고 스크롤·리사이즈를 따라간다.
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
  hasPortal = false,
}: TooltipProps) {
  // framer-motion 은 CSS duration 토큰의 1ms 무력화를 읽지 않는다 (design-system.md §6).
  const shouldReduceMotion = useReducedMotion();

  const tooltipId = useId();
  const [isTooltipOpen, setIsTooltipOpen] = useState(defaultOpen);
  const prevDisabledRef = useRef(disabled);
  const rootRef = useRef<HTMLDivElement | null>(null);
  // 직전 입력이 마우스였는지. 터치 기기가 흉내 내는 mouseenter 를 가려낸다.
  const lastPointerTypeRef = useRef<string>("mouse");
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [triggerRect, setTriggerRect] = useState<TriggerRect | null>(null);

  // disabled 로 바뀌는 순간 열려 있던 툴팁을 닫는다 (렌더 중 상태 조정)
  if (!prevDisabledRef.current && disabled && isTooltipOpen) {
    setIsTooltipOpen(false);
  }
  prevDisabledRef.current = disabled;

  const isControlled = typeof open === "boolean";
  const resolvedOpen = disabled ? false : isControlled ? open : isTooltipOpen;
  const animationOffset = getTooltipAnimationOffset(placement);

  const setTooltipOpenState = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setIsTooltipOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  // ── portal 컨테이너
  //
  // ⚠️ 마운트 이후에 잡는다. 렌더 중에 document 를 읽으면 서버 출력과 어긋나
  //    하이드레이션 불일치가 난다 (PopupHost·ToastHost 와 같은 규칙).
  useEffect(() => {
    if (!hasPortal) return;

    let root = document.getElementById(TOOLTIP_ROOT_ID);

    if (!root) {
      root = document.createElement("div");
      root.id = TOOLTIP_ROOT_ID;
      document.body.appendChild(root);
      portalRootCreatedByUs = true;
    }

    // 팝업이 배경을 inert 처리할 때 이 컨테이너는 건너뛰게 한다.
    // 소비자가 미리 심어둔 컨테이너에도 우리가 보장한다.
    root.setAttribute(PORTAL_ROOT_ATTRIBUTE, "");
    portalRootRefCount += 1;
    setPortalRoot(root);

    return () => {
      portalRootRefCount -= 1;

      // ⚠️ **쓰는 인스턴스가 하나도 없을 때만** 지운다.
      //    "내가 만들었고 지금 비어 있으면" 으로 판단하면, 컨테이너를 만든 툴팁이
      //    먼저 언마운트되는 순간 남은 툴팁의 `portalRoot` 가 문서에서 떨어져 나간
      //    노드를 가리켜 이후로 아무것도 보이지 않는다.
      if (
        portalRootRefCount === 0 &&
        portalRootCreatedByUs &&
        root &&
        root.childElementCount === 0
      ) {
        root.remove();
        portalRootCreatedByUs = false;
      }
    };
  }, [hasPortal]);

  // ── 트리거 좌표 추적
  //
  // portal 래퍼에 **트리거의 rect 를 그대로 입힌다.** 그러면 placement·화살표
  // CSS 규칙이 제자리 배치일 때와 똑같이 맞는다 — 좌표 계산을 다시 만들지 않는다.
  const updateTriggerRect = useCallback(() => {
    const triggerElement = rootRef.current;
    if (!triggerElement) return;

    const { top, left, width, height } = triggerElement.getBoundingClientRect();

    setTriggerRect((prev) =>
      prev &&
      prev.top === top &&
      prev.left === left &&
      prev.width === width &&
      prev.height === height
        ? prev
        : { top, left, width, height },
    );
  }, []);

  useEffect(() => {
    if (!hasPortal || !resolvedOpen) return;

    updateTriggerRect();

    let frame = 0;
    const scheduleUpdate = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateTriggerRect();
      });
    };

    // scroll 은 버블하지 않는다 — 캡처로 받아야 **조상 어디의 스크롤이든** 잡힌다
    window.addEventListener("scroll", scheduleUpdate, true);
    window.addEventListener("resize", scheduleUpdate);

    const observer = new ResizeObserver(scheduleUpdate);
    if (rootRef.current) observer.observe(rootRef.current);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate, true);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
    };
  }, [hasPortal, resolvedOpen, updateTriggerRect]);

  // ── 바깥 탭으로 닫기
  //
  // 마우스에게도 붙지만 트리거에 hover 한 채로 바깥을 누를 수는 없으므로
  // 실질적으로 터치에서만 동작한다 — 조건 분기를 하나 줄인다.
  useEffect(() => {
    if (!resolvedOpen) return;

    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;

      setTooltipOpenState(false);
    };

    // ⚠️ `Escape` 는 **문서에** 단다. 루트의 `onKeyDown` 에만 두면 마우스 hover 로
    //    연 툴팁은 포커스가 다른 곳에 있어 키가 닿지 않는다 — WCAG 1.4.13 의
    //    Dismissible(포인터를 치우지 않고 닫을 수단)에 걸린다.
    //    `Datepicker` 의 달력도 같은 방식이다.
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setTooltipOpenState(false);
      }
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [resolvedOpen, setTooltipOpenState]);

  // ⚠️ 마우스는 `pointerdown` 없이 hover 만 한다. 종류를 `pointerdown` 에서만
  //    기억하면 태블릿에서 한 번 터치한 뒤로 마우스 hover 가 영영 무시된다.
  const handlePointerEnter: PointerEventHandler<HTMLDivElement> = (event) => {
    lastPointerTypeRef.current = event.pointerType;
  };

  // 터치·펜은 탭으로 토글한다 (KRDS 가이드 659 · 662쪽 Click).
  // `preventDefault` 는 하지 않는다 — 탭이 트리거 버튼도 눌러야 한다.
  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    lastPointerTypeRef.current = event.pointerType;

    if (disabled || event.pointerType === "mouse") return;

    setTooltipOpenState(!resolvedOpen);
  };

  // ⚠️ 터치 기기는 탭 뒤에 mouseenter·mouseleave 를 흉내 내서 발생시킨다.
  //    가드가 없으면 두 번째 탭에서 닫자마자 가짜 mouseenter 가 다시 열어
  //    "닫히지 않는 툴팁" 이 된다 (styles.md §9 의 hoverable 과 같은 문제).
  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = () => {
    if (disabled || lastPointerTypeRef.current !== "mouse") return;

    setTooltipOpenState(true);
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    if (lastPointerTypeRef.current !== "mouse") return;

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

  const resolvedChildren = isValidElement<TooltipChildProps>(children)
    ? cloneElement(children, {
        "aria-describedby": getMergedAriaDescribedBy({
          currentAriaDescribedBy: children.props["aria-describedby"],
          tooltipId: resolvedOpen ? tooltipId : undefined,
        }),
      })
    : children;

  const placementClass = `${block}--${PLACEMENT_CLASS[placement]}`;

  const isPortalActive = hasPortal && Boolean(portalRoot);

  const panel = (
    // 퇴장이 끝나면 좌표를 버린다 — portal 래퍼까지 함께 언마운트되어
    // 닫힌 툴팁마다 빈 fixed div 가 body 에 쌓이지 않는다.
    //
    // ⚠️ `initial` 이 portal 여부를 따른다. 제자리 모드는 `AnimatePresence` 가 상주하므로
    //    `false` 로 최초 렌더의 등장을 막지만, portal 모드는 좌표를 버리는 순간 래퍼째
    //    언마운트돼 **열 때마다 새로 마운트**된다. 거기서 `false` 를 주면 그 차단이 매번
    //    걸려 등장 모션이 아예 사라진다(실측: opacity 가 첫 프레임부터 1).
    <AnimatePresence
      initial={isPortalActive}
      onExitComplete={() => setTriggerRect(null)}
    >
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
  );

  const portalWrapperStyle: CSSProperties | undefined = triggerRect
    ? {
        top: triggerRect.top,
        left: triggerRect.left,
        width: triggerRect.width,
        height: triggerRect.height,
      }
    : undefined;

  return (
    <div
      ref={rootRef}
      className={cn(
        block,
        placementClass,
        disabled && px("is-disabled"),
        className,
      )}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className={`${block}__trigger`}>{resolvedChildren}</div>

      {isPortalActive ? null : panel}

      {isPortalActive && portalRoot && triggerRect
        ? createPortal(
            <div
              className={cn(block, placementClass, `${block}--portal`)}
              style={portalWrapperStyle}
            >
              {panel}
            </div>,
            portalRoot,
          )
        : null}
    </div>
  );
}
