"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import Button from "../Button/Button.js";
import ButtonGroup, { ButtonGroupItem } from "../Button/ButtonGroup.js";
import { AttentionIcon } from "../Icon/index.js";
import PopupBase from "./PopupBase.js";
import type { ConfirmProps } from "./Popup.types.js";

const block = px("popup-confirm");

/**
 * 취소/확인 두 갈래 확인창. 결정을 요구하므로 dim 클릭·ESC 로 닫히지 않는다
 * (실수로 닫히면 어느 쪽을 선택했는지 모호해진다).
 */
export default function Confirm({
  id,
  open,
  onExited,
  isTopmost,
  className,
  title,
  description,
  icon = <AttentionIcon width={28} height={28} />,
  cancelText = "취소",
  confirmText = "확인",
  onCancel,
  onConfirm,
}: ConfirmProps) {
  const footerContent = (
    <ButtonGroup className={`${block}__actions`}>
      <ButtonGroupItem>
        <Button type="button" variant="line" size="medium" onClick={onCancel}>
          {cancelText}
        </Button>
      </ButtonGroupItem>
      <ButtonGroupItem>
        <Button type="button" size="medium" onClick={onConfirm}>
          {confirmText}
        </Button>
      </ButtonGroupItem>
    </ButtonGroup>
  );

  return (
    <PopupBase
      id={id}
      open={open}
      onExited={onExited}
      isTopmost={isTopmost}
      className={cn(block, className)}
      title={title}
      icon={icon}
      description={description}
      footer={footerContent}
      hasCloseButton={false}
      shouldCloseOnBackdrop={false}
      shouldCloseOnEscape={false}
      dialogLabel={title ? undefined : "Confirm 팝업"}
      size="small"
    />
  );
}
