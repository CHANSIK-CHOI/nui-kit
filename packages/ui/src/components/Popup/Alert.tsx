"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import Button from "../Button/Button.js";
import ButtonGroup, { ButtonGroupItem } from "../Button/ButtonGroup.js";
import { AttentionIcon } from "../Icon/index.js";
import PopupBase from "./PopupBase.js";
import type { AlertProps } from "./Popup.types.js";

const block = px("popup-alert");

/**
 * 확인 버튼 하나짜리 알림. 사용자의 선택지가 없으므로
 * dim 클릭·ESC 로는 닫히지 않는다 — 반드시 확인을 눌러야 한다.
 */
export default function Alert({
  id,
  open,
  onExited,
  isTopmost,
  className,
  title,
  description,
  icon = <AttentionIcon width={28} height={28} />,
  confirmText = "확인",
  onConfirm,
}: AlertProps) {
  const footerContent = (
    <ButtonGroup className={`${block}__actions`}>
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
      dialogLabel={title ? undefined : "Alert 팝업"}
      size="small"
    />
  );
}
