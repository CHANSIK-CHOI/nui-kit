"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import Button from "../Button/Button.js";
import ButtonGroup, { ButtonGroupItem } from "../Button/ButtonGroup.js";
import PopupBase from "./PopupBase.js";
import { getToneIcon } from "./tone.js";
import type { ConfirmProps } from "./Popup.types.js";

const block = px("popup-confirm");

/**
 * 취소/확인 두 갈래 확인창. 결정을 요구하므로 dim 클릭·ESC 로 닫히지 않는다
 * (실수로 닫히면 어느 쪽을 선택했는지 모호해진다).
 *
 * 제목은 head 가 아니라 **본문 맨 위**에 온다 (spec §2).
 */
export default function Confirm({
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
  cancelLabel = "취소",
  confirmLabel = "확인",
  onCancel,
  onConfirm,
}: ConfirmProps) {
  const footerContent = (
    // 취소 : 확인 = 3 : 7 — 첫 항목이 Dismiss 다 (design-system.md §2-4-1 · 2026-09-09)
    <ButtonGroup className={`${block}__actions`} ratio="3:7">
      <ButtonGroupItem>
        <Button type="button" variant="line" size="medium" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </ButtonGroupItem>
      <ButtonGroupItem>
        {/*
          되돌릴 수 없는 것을 확인받는 자리면 확인 버튼도 빨갛다 (design-system.md §11 ·
          spec §6-6). 취소는 tone 과 무관하게 중립 line 이다 — SEED `alert-dialog.mdx` 가
          취소에 Critical 을 쓴 예시를 반례로 든다.
          `warning` 에 대응하는 버튼 색은 없다 — 2026-09-07 에 경고 색을 지웠다.
        */}
        <Button
          type="button"
          size="medium"
          color={tone === "danger" ? "danger" : undefined}
          onClick={onConfirm}
        >
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
