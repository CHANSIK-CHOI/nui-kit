"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import PopupBase from "./PopupBase.js";
import type { FullPopupProps } from "./Popup.types.js";

const block = px("full-popup");

export default function FullPopup({
  className,
  contentAlign = "left",
  dialogLabel = "전체 팝업",
  ...props
}: FullPopupProps) {
  return (
    <PopupBase
      {...props}
      variant="full"
      size={undefined}
      contentAlign={contentAlign}
      dialogLabel={dialogLabel}
      className={cn(block, className)}
    />
  );
}
