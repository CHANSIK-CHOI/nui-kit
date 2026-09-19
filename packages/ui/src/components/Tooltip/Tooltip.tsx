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

/**
 * **마지막으로 툴팁이 닫힌 시각** (07 M3).
 *
 * 하나 열린 뒤 이웃으로 옮기면 지연도 모션도 생략한다 — Emil: *"첫 툴팁은
 * 지연으로 오작동을 막는다. 하나 열린 뒤 이웃은 즉시. 툴바 전체가 빨라 보인다."*
 *
 * 모듈 스코프인 이유 — 툴팁 인스턴스끼리는 서로를 모른다. 「직전에 다른 툴팁이
 * 열려 있었나」는 화면 전체의 사실이라 컴포넌트 밖에 둔다. Context 로 두면
 * 소비자가 Provider 를 감싸야 하고, 감싸지 않으면 조용히 동작하지 않는다.
 */
let lastTooltipClosedAt = 0;
// ⚠️ 「닫힌 시각」이 아니라 「닫히기 시작한 시각」이다 (2026-09-09). 실제로 닫히는
//    것은 마우스가 떠난 `closeDelay`(100ms) 뒤인데, 툴바를 쓸며 지나가면 이웃에
//    닿는 것이 그보다 빠르다(실측 11ms). 닫힌 순간만 적으면 이웃이 「직전에 열려
//    있었나」를 못 보고 400ms 를 다시 기다린다 — 실측 484ms. 그래서 hover 가
//    열린 툴팁을 떠나는 순간에도 적는다.

/** 이 시간 안에 이웃이 열리면 즉시 연다 */
const INSTANT_WINDOW_MS = 300;

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
  /**
   * hover 로 열 때의 지연 (07 M3). 포커스 · 터치 탭은 **즉시**다.
   *
   * pointer 가 스치는 순간 열리면 툴바를 가로지를 때 툴팁이 줄줄이 뜬다
   * (실측 11ms). 지연이 그 오작동을 막는다.
   */
  openDelay?: number;
  /**
   * hover 가 떠난 뒤 닫히는 지연.
   *
   * 툴팁 위로 마우스를 옮길 시간을 준다 — WCAG 2.1 의 1.4.13 Hoverable 이
   * 요구하는 것이다. 트리거와 버블 사이에 `space-3`(12px) 간격이 있다.
   */
  closeDelay?: number;
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

/**
 * 툴팁이 **자라나는 지점** (2026-09-08 · 07 M2).
 *
 * 트리거에서 자란다 — 팝오버 · 드롭다운 · 툴팁 · 메뉴는 자기를 연 것에서 커진다
 * (motion.md §6). 원점이 없으면 중앙에서 커져 "어디서 나왔는지" 가 사라진다.
 *
 * 세로는 트리거 쪽 — 위에 뜨면 아래 모서리, 아래에 뜨면 위 모서리다.
 * 가로는 **화살표 자리**에 맞춘다. 툴팁은 화살표가 가리키는 점에서 자라는 것이
 * 자연스럽고, 그 자리는 `_tooltip.scss` 의 화살표 위치와 같다 —
 * center 는 50%, left·right 는 `space-4`(16px) 다.
 *
 * ⚠️ SCSS 에 두지 않는다. `placement` 는 런타임이라 framer 가 inline 으로 쓴다.
 */
const PLACEMENT_ORIGIN: Record<TooltipPlacement, string> = {
  topCenter: "bottom center",
  topLeft: "bottom 16px",
  topRight: "bottom calc(100% - 16px)",
  bottomCenter: "top center",
  bottomLeft: "top 16px",
  bottomRight: "top calc(100% - 16px)",
};

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
  openDelay = 400,
  closeDelay = 100,
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
  const transformOrigin = PLACEMENT_ORIGIN[placement];

  const setTooltipOpenState = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setIsTooltipOpen(nextOpen);
      }

      // 닫힌 시각을 남긴다 — 이웃 툴팁이 즉시 열릴지를 이것으로 판단한다.
      if (!nextOpen) {
        lastTooltipClosedAt = Date.now();
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  // ── hover 지연 (07 M3)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 이웃에서 옮겨 왔는가 — 지연도 모션도 생략한다.
  const [isInstant, setIsInstant] = useState(false);

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  // 언마운트에서 타이머를 반드시 끊는다 — 안 끊으면 사라진 컴포넌트의 상태를
  // 건드려 개발 모드에서 경고가 난다.
  useEffect(() => clearHoverTimer, [clearHoverTimer]);

  /** hover 로 연다 — 첫 툴팁은 지연, 이웃은 즉시 */
  const openByHover = useCallback(() => {
    clearHoverTimer();

    const isFromNeighbor = Date.now() - lastTooltipClosedAt < INSTANT_WINDOW_MS;

    if (isFromNeighbor || openDelay <= 0) {
      setIsInstant(isFromNeighbor);
      setTooltipOpenState(true);

      return;
    }

    setIsInstant(false);
    hoverTimerRef.current = setTimeout(() => {
      hoverTimerRef.current = null;
      setTooltipOpenState(true);
    }, openDelay);
  }, [clearHoverTimer, openDelay, setTooltipOpenState]);

  /** hover 가 떠나 닫는다 — 툴팁 위로 옮길 시간을 준다 (WCAG 1.4.13) */
  const closeByHover = useCallback(() => {
    clearHoverTimer();

    // 열려 있던 것을 떠난다 — 이웃이 즉시 열릴 수 있게 지금 적는다 (위 주석).
    if (resolvedOpen) {
      lastTooltipClosedAt = Date.now();
    }

    if (closeDelay <= 0) {
      setTooltipOpenState(false);

      return;
    }

    hoverTimerRef.current = setTimeout(() => {
      hoverTimerRef.current = null;
      setTooltipOpenState(false);
    }, closeDelay);
  }, [clearHoverTimer, closeDelay, resolvedOpen, setTooltipOpenState]);

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

    // 터치 탭도 즉시다 — 손가락이 이미 그 자리에 있다.
    clearHoverTimer();
    setIsInstant(true);
    setTooltipOpenState(!resolvedOpen);
  };

  // ⚠️ 터치 기기는 탭 뒤에 mouseenter·mouseleave 를 흉내 내서 발생시킨다.
  //    가드가 없으면 두 번째 탭에서 닫자마자 가짜 mouseenter 가 다시 열어
  //    "닫히지 않는 툴팁" 이 된다 (styles.md §9 의 hoverable 과 같은 문제).
  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = () => {
    if (disabled || lastPointerTypeRef.current !== "mouse") return;

    // ⚠️ 제어형은 지연을 적용하지 않는다 — 소비자가 시점을 소유한다.
    if (isControlled) {
      onOpenChange?.(true);

      return;
    }

    openByHover();
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    if (lastPointerTypeRef.current !== "mouse") return;

    if (isControlled) {
      onOpenChange?.(false);

      return;
    }

    closeByHover();
  };

  const handleFocus: FocusEventHandler<HTMLDivElement> = () => {
    if (disabled) return;

    // 키보드는 **즉시**다 (07 M3). 대기 중인 hover 타이머가 있으면 끊는다 —
    // 안 끊으면 400ms 뒤에 한 번 더 열려는 호출이 온다.
    clearHoverTimer();
    setIsInstant(true);
    setTooltipOpenState(true);
  };

  const handleBlur: FocusEventHandler<HTMLDivElement> = (event) => {
    // 컨테이너 내부로 포커스가 옮겨간 것은 blur 로 보지 않는다
    if (event.currentTarget.contains(event.relatedTarget as Node | null))
      return;

    clearHoverTimer();
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
          // 트리거에서 자란다 — 원점이 없으면 중앙에서 커진다 (07 M2)
          style={{ transformOrigin }}
          // ⚠️ **모션 감소에서도 `initial` · `animate` 둘 다 항등 `transform` 을 갖는다** (2026-09-17 · qa 두 판).
          //    ① `defaultOpen` 이면 `initial={false}` 라 서버가 `animate` 의 `transform` 을 inline style 로 그린다 —
          //       모션 감소 클라이언트가 그 키를 빼면 style 이 달라 hydration 불일치가 났다.
          //    ② 그래서 `animate` 에만 남기면, `initial` 에 없는 키의 시작값을 framer 가 **0** 으로 채워
          //       모션 감소인데 `scale(0)` 에서 커져 나왔다. 둘의 키 집합이 같아야 한다 — 항등이라 움직임은 없다.
          initial={
            shouldReduceMotion
              ? { opacity: 0, transform: "translateY(0px) scale(1)" }
              : {
                  opacity: 0,
                  transform: `translateY(${animationOffset}px) scale(0.97)`,
                }
          }
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={{
            ...reduceMotion(
              {
                opacity: 0,
                transform: `translateY(${animationOffset}px) scale(0.97)`,
              },
              shouldReduceMotion,
            ),
            transition: reduceMotionTransition(
              motionTransition.tooltipExit,
              shouldReduceMotion,
            ),
          }}
          // 이웃에서 옮겨 왔거나 키보드·터치로 열렸으면 **모션을 생략한다** —
          // 지연 없이 뜨는데 모션이 남으면 그 모션이 지연처럼 느껴진다 (07 M3).
          transition={
            isInstant
              ? { duration: 0 }
              : reduceMotionTransition(
                  motionTransition.tooltip,
                  shouldReduceMotion,
                )
          }
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
