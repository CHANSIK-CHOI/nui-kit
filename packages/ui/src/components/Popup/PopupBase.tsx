"use client";

import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useId } from "react";
import { px } from "../../internal/prefix.js";
import { motionTransition } from "../../internal/motion.js";
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
  isTopmost = false,
}: PopupBaseProps) {
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

      {hasCloseButton ? (
        <button
          type="button"
          className={`${block}__close`}
          aria-label={closeButtonLabel}
          onClick={handleCloseButtonClick}
        >
          <CloseIcon width={20} height={20} />
        </button>
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
              transition: motionTransition.overlayDialogExit,
            }}
            transition={motionTransition.overlayDialog}
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
              initial={panelMotion.initial}
              animate={panelMotion.animate}
              exit={{
                ...panelMotion.exit,
                transition: panelMotion.exitTransition,
              }}
              transition={panelMotion.enter}
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
            </motion.section>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
