"use client";

import cn from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { px } from "../../internal/prefix.js";
import {
  motionTransition,
  reduceMotion,
  reduceMotionTransition,
} from "../../internal/motion.js";
import { CloseIcon } from "../Icon/index.js";
import Button from "../Button/Button.js";
import ButtonGroup, { ButtonGroupItem } from "../Button/ButtonGroup.js";
import type { PopupBaseProps, PopupVariant } from "./Popup.types.js";
import usePopupPanelA11y from "./usePopupPanelA11y.js";

const block = px("popup");

/** variant 값(카멜)을 kebab 클래스명으로 옮긴다 */
const VARIANT_CLASS: Record<PopupVariant, string> = {
  dialog: "dialog",
  bottomSheet: "bottom-sheet",
  full: "full",
};

/**
 * ⚠️ **`transform` 문자열로 준다** — `y`·`scale` 숏핸드가 아니다
 *    (2026-09-08 · 07 M5).
 *
 * framer 의 숏핸드는 메인 스레드 rAF 로 매 프레임 inline style 을 쓴다.
 * 페이지가 바쁠 때 프레임이 떨어진다. `transform` 문자열이면 WAAPI 로 넘어간다 —
 * Emil `animate/SKILL.md`: *"In Motion, use the full transform string. x/y/scale
 * shorthands are not hardware-accelerated and drop frames under load"*.
 *
 * ⚠️ 시트의 `translateY(100%)` 는 **퍼센트라 자기 크기 기준**이다. px 로 적으면
 *    시트 높이가 바뀔 때 어긋난다 (motion.md §4).
 */
function getPanelMotion(variant: PopupVariant) {
  if (variant === "bottomSheet") {
    return {
      initial: { opacity: 1, transform: "translateY(100%)" },
      animate: { opacity: 1, transform: "translateY(0%)" },
      exit: { opacity: 1, transform: "translateY(100%)" },
      enter: motionTransition.panelSheet,
      exitTransition: motionTransition.panelSheetExit,
    };
  }

  if (variant === "full") {
    return {
      initial: { opacity: 1, transform: "translateX(100%)" },
      animate: { opacity: 1, transform: "translateX(0%)" },
      exit: { opacity: 1, transform: "translateX(100%)" },
      enter: motionTransition.panelFull,
      exitTransition: motionTransition.panelFullExit,
    };
  }

  return {
    initial: { opacity: 0, transform: "translateY(24px) scale(0.96)" },
    animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
    exit: { opacity: 0, transform: "translateY(24px) scale(0.97)" },
    enter: motionTransition.panelDialog,
    exitTransition: motionTransition.panelDialogExit,
  };
}

/**
 * 모든 팝업의 공통 골격. 직접 쓰기보다 LayerPopup / BottomSheet / FullPopup 을 쓴다.
 * dim + 위치 잡기 + 패널 + 헤더/본문/푸터 슬롯 + 모션 + 접근성을 담당한다.
 */
export default function PopupBase({
  children,
  id,
  className,
  panelClassName,
  bodyClassName,
  footerClassName,
  open,
  variant = "dialog",
  size = "medium",
  contentAlign = "center",
  title,
  icon,
  description,
  footer,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  hasCloseButton = true,
  closeLabel = "팝업 닫기",
  shouldCloseOnBackdrop = true,
  shouldCloseOnEscape = true,
  dialogLabel,
  onRequestClose,
  onClickClose,
  onCloseComplete,
  // 기본값은 `true` 다 — 스택을 아는 것은 `PopupHost` 뿐이고 그쪽은 열린 팝업마다
  // 값을 **항상 명시적으로** 넘긴다(`PopupHost.tsx`). 남는 자리는 소비자가 팝업을
  // 직접 렌더하는 선언형이고 거기서는 답이 사실상 언제나 `true` 다.
  //
  // ⚠️ `false` 를 기본으로 두면 최초 포커스 이동·포커스 트랩·ESC 셋이 **조용히**
  //    죽는다(`usePopupPanelA11y`). 화면은 멀쩡하고 마우스도 멀쩡해서 키보드
  //    사용자만 겪는다 — 소비자가 알아챌 수 없는 종류의 기본값이다 (a11y.md §5).
  isTopmost = true,
}: PopupBaseProps) {
  // framer-motion 은 CSS duration 토큰의 1ms 무력화를 읽지 않는다 (design-system.md §6).
  const shouldReduceMotion = useReducedMotion();

  const generatedTitleId = useId();
  const generatedDescriptionId = useId();
  const panelMotion = getPanelMotion(variant);
  const hasHeader = Boolean(title) || hasCloseButton;
  const { panelRef } = usePopupPanelA11y({
    open,
    isTopmost,
    shouldCloseOnEscape,
    onRequestClose,
  });

  const titleId = title ? generatedTitleId : undefined;
  const descriptionId = description ? generatedDescriptionId : undefined;

  const handleBackdropClick = () => {
    if (!shouldCloseOnBackdrop) return;

    onRequestClose?.();
  };

  const handleCloseButtonClick = () => {
    onClickClose?.();
    onRequestClose?.();
  };

  // ── 표준 푸터 (2026-09-09)
  //
  // 취소는 line · 확인은 solid 이고, 둘 다 있으면 3:7 이다 (design-system.md §2-4-1 —
  // 첫 항목이 Dismiss 일 때). 하나만 있으면 비율 없이 그 하나가 폭을 채운다.
  // `onCancel` 을 안 주면 `onRequestClose` 가 대신한다 — 취소는 닫아 달라는 뜻이다.
  const hasStandardFooter =
    footer == null && (confirmLabel != null || cancelLabel != null);
  const standardFooter = hasStandardFooter ? (
    <ButtonGroup
      className={`${block}__actions`}
      ratio={confirmLabel != null && cancelLabel != null ? "3:7" : "equal"}
    >
      {cancelLabel != null ? (
        <ButtonGroupItem>
          <Button
            type="button"
            variant="line"
            size="medium"
            onClick={onCancel ?? onRequestClose}
          >
            {cancelLabel}
          </Button>
        </ButtonGroupItem>
      ) : null}
      {confirmLabel != null ? (
        <ButtonGroupItem>
          <Button type="button" size="medium" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </ButtonGroupItem>
      ) : null}
    </ButtonGroup>
  ) : null;
  const resolvedFooter = footer ?? standardFooter;

  // ── 본문 스크롤 경계선 ★ (2026-09-08 · 08 DL2)
  //
  // SEED 는 스크롤이 시작되면 헤더 아래에 경계선을 노출하고(Divider Visibility),
  // 본문 하단에 Scroll Fog 를 깐다. **Fog 는 그라디언트라 쓰지 않는다** —
  // 「그라디언트는 쓰지 않는다. 고도는 표면색·그림자·선 셋으로 표현한다」
  // (design-system.md §2-5). 위아래 **같은 수단(선)** 으로 옮긴다 — 위는
  // "위로 더 있다", 아래는 "아래로 더 있다"를 말한다.
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scrollEdges, setScrollEdges] = useState({ top: false, bottom: false });

  const syncScrollEdges = useCallback(() => {
    const element = bodyRef.current;

    if (!element) return;

    // 1px 여유 — 소수점 확대에서 scrollHeight 가 clientHeight 보다 살짝 커
    // 스크롤이 없는 본문에도 선이 그려지는 것을 막는다.
    const top = element.scrollTop > 1;
    const bottom =
      element.scrollHeight - element.scrollTop - element.clientHeight > 1;

    setScrollEdges((current) =>
      current.top === top && current.bottom === bottom
        ? current
        : { top, bottom },
    );
  }, []);

  useEffect(() => {
    if (!open) return;

    syncScrollEdges();

    const element = bodyRef.current;

    if (!element || typeof ResizeObserver === "undefined") return;

    // ⚠️ 본문 **자식들**도 함께 관찰한다. 본문 자체는 높이가 고정이라 내용이
    //    늘어도 크기가 안 바뀐다 — 자식을 안 보면 나중에 채워지는 본문에서
    //    아래쪽 선이 뜨지 않는다.
    const observer = new ResizeObserver(syncScrollEdges);

    observer.observe(element);
    for (const child of element.children) observer.observe(child);

    return () => observer.disconnect();
  }, [open, syncScrollEdges]);

  const closeButton = hasCloseButton ? (
    <button
      type="button"
      className={`${block}__close`}
      aria-label={closeLabel}
      onClick={handleCloseButtonClick}
    >
      <CloseIcon width={20} height={20} />
    </button>
  ) : null;

  // 닫기 버튼은 DOM 의 가장 마지막에 둔다 (KRDS 가이드 397쪽 02).
  // 첫 포커스가 본문·푸터로 가고, 시각 위치는 CSS 가 우상단에 고정한다.
  // head 는 제목이 없어도 렌더한다 — 닫기 버튼이 앉을 자리를 비워 두는 몫이다.
  const headerContent = hasHeader ? (
    <div
      className={cn(`${block}__head`, {
        [`${block}__head--no-title`]: !title,
      })}
    >
      {title ? (
        <div className={`${block}__header-content`}>
          <span id={titleId} className={`${block}__title`}>
            {title}
          </span>
        </div>
      ) : null}
    </div>
  ) : null;

  return (
    <AnimatePresence onExitComplete={onCloseComplete}>
      {open ? (
        <motion.div
          id={id}
          className={cn(
            block,
            `${block}--${VARIANT_CLASS[variant]}`,
            size !== "medium" && `${block}--${size}`,
            contentAlign === "center" && `${block}--align-center`,
            hasCloseButton && `${block}--has-close`,
            !hasHeader && `${block}--no-header`,
            !resolvedFooter && `${block}--no-footer`,
            className,
          )}
        >
          <motion.div
            className={`${block}__dim`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: reduceMotionTransition(
                motionTransition.overlayExit,
                shouldReduceMotion,
              ),
            }}
            transition={reduceMotionTransition(
              motionTransition.overlay,
              shouldReduceMotion,
            )}
            onClick={handleBackdropClick}
          />

          <div className={`${block}__positioner`}>
            <motion.section
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={titleId ? undefined : dialogLabel}
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              className={cn(`${block}__panel`, panelClassName)}
              tabIndex={-1}
              initial={reduceMotion(panelMotion.initial, shouldReduceMotion)}
              animate={reduceMotion(panelMotion.animate, shouldReduceMotion)}
              exit={{
                ...reduceMotion(panelMotion.exit, shouldReduceMotion),
                transition: reduceMotionTransition(
                  panelMotion.exitTransition,
                  shouldReduceMotion,
                ),
              }}
              transition={reduceMotionTransition(
                panelMotion.enter,
                shouldReduceMotion,
              )}
            >
              {headerContent}

              <div
                ref={bodyRef}
                className={cn(`${block}__body`, bodyClassName)}
                data-scrolled-top={scrollEdges.top ? "true" : undefined}
                data-scrolled-bottom={scrollEdges.bottom ? "true" : undefined}
                onScroll={syncScrollEdges}
              >
                {icon !== null && icon !== undefined ? (
                  <div className={`${block}__icon`}>{icon}</div>
                ) : null}
                {description ? (
                  <p id={descriptionId} className={`${block}__description`}>
                    {description}
                  </p>
                ) : null}
                {children}
              </div>

              {resolvedFooter ? (
                <div className={cn(`${block}__foot`, footerClassName)}>
                  {resolvedFooter}
                </div>
              ) : null}

              {closeButton}
            </motion.section>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
