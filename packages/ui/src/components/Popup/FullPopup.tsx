"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import PopupBase from "./PopupBase.js";
import type { FullPopupProps } from "./Popup.types.js";

const block = px("full-popup");

export default function FullPopup({
  className,
  contentAlign = "left",
  ...props
}: FullPopupProps) {
  return (
    <PopupBase
      {...props}
      variant="full"
      size={undefined}
      contentAlign={contentAlign}
      className={cn(block, className)}
    />
  );
}
