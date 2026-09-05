"use client";

import cn from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import { px } from "../../internal/prefix.js";
import {
  motionTransition,
  reduceMotion,
  reduceMotionTransition,
} from "../../internal/motion.js";
import { CloseIcon } from "../Icon/index.js";
import type { PopupBaseProps, PopupVariant } from "./Popup.types.js";
import usePopupPanelA11y from "./usePopupPanelA11y.js";

const block = px("popup");

/** variant 값(카멜)을 kebab 클래스명으로 옮긴다 */
const VARIANT_CLASS: Record<PopupVariant, string> = {
  dialog: "dialog",
  bottomSheet: "bottom-sheet",
  full: "full",
};

function getPanelMotion(variant: PopupVariant) {
  if (variant === "bottomSheet") {
    return {
      initial: { opacity: 1, y: "100%" },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 1, y: "100%" },
      enter: motionTransition.panelSheet,
      exitTransition: motionTransition.panelSheetExit,
    };
  }

  if (variant === "full") {
    return {
      initial: { opacity: 1, x: "100%" },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 1, x: "100%" },
      enter: motionTransition.panelFull,
      exitTransition: motionTransition.panelFullExit,
    };
  }

  return {
    initial: { opacity: 0, y: 24, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 24, scale: 0.98 },
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
  size = "regular",
  contentAlign = "center",
  title,
  icon,
  description,
  footer,
  hasCloseButton = true,
  closeButtonLabel = "팝업 닫기",
  shouldCloseOnBackdrop = true,
  shouldCloseOnEscape = true,
  dialogLabel,
  onRequestClose,
  onClickClose,
  onExited,
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

  const closeButton = hasCloseButton ? (
    <button
      type="button"
      className={`${block}__close`}
      aria-label={closeButtonLabel}
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
    <AnimatePresence onExitComplete={onExited}>
      {open ? (
        <motion.div
          id={id}
          className={cn(
            block,
            `${block}--${VARIANT_CLASS[variant]}`,
            size !== "regular" && `${block}--${size}`,
            contentAlign === "center" && `${block}--align-center`,
            hasCloseButton && `${block}--has-close`,
            !hasHeader && `${block}--no-header`,
            !footer && `${block}--no-footer`,
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
                motionTransition.overlayDialogExit,
                shouldReduceMotion,
              ),
            }}
            transition={reduceMotionTransition(
              motionTransition.overlayDialog,
              shouldReduceMotion,
            )}
            onClick={handleBackdropClick}
          />

          <div className={`${block}__positioner`}>
            <motion.section
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={titleId ? undefined : (dialogLabel ?? "팝업")}
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

              <div className={cn(`${block}__body`, bodyClassName)}>
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

              {footer ? (
                <div className={cn(`${block}__foot`, footerClassName)}>
                  {footer}
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
