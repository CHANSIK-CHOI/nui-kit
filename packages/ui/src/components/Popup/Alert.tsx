"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import Button from "../Button/Button.js";
import ButtonGroup, { ButtonGroupItem } from "../Button/ButtonGroup.js";
import PopupBase from "./PopupBase.js";
import { getToneIcon } from "./tone.js";
import type { AlertProps } from "./Popup.types.js";

const block = px("popup-alert");

/**
 * 확인 버튼 하나짜리 알림. 사용자의 선택지가 없으므로
 * dim 클릭·ESC 로는 닫히지 않는다 — 반드시 확인을 눌러야 한다.
 *
 * 제목은 head 가 아니라 **본문 맨 위**에 온다 — 닫기 버튼이 없어 헤더가 빈 껍데기이고,
 * 제목과 설명이 한 덩어리로 읽혀야 한다 (spec §2).
 */
export default function Alert({
  id,
  open,
  onCloseComplete,
  isTopmost,
  className,
  title,
  dialogLabel,
  description,
  tone = "info",
  hasIcon = true,
  confirmLabel = "확인",
  onConfirm,
}: AlertProps) {
  const footerContent = (
    <ButtonGroup className={`${block}__actions`}>
      <ButtonGroupItem>
        <Button type="button" size="medium" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ButtonGroupItem>
    </ButtonGroup>
  );

  return (
    <PopupBase
      id={id}
      open={open}
      onCloseComplete={onCloseComplete}
      isTopmost={isTopmost}
      // tone 클래스는 자기 블록에 붙는다 — `PopupBase` 루트는 셸 셋이 쓰지 않는 축을
      // 모른다. 기본 `info` 는 클래스를 붙이지 않는다(`__icon` 의 기본 색이 그것이다).
      className={cn(block, tone !== "info" && `${block}--${tone}`, className)}
      title={title}
      titlePlacement="body"
      dialogLabel={dialogLabel}
      icon={getToneIcon(tone, hasIcon)}
      description={description}
      footer={footerContent}
      hasCloseButton={false}
      shouldCloseOnBackdrop={false}
      shouldCloseOnEscape={false}
      size="small"
    />
  );
}
