"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import PopupBase from "./PopupBase.js";
import type { BottomSheetProps } from "./Popup.types.js";

const block = px("bottom-sheet");

export default function BottomSheet({
  className,
  contentAlign = "left",
  ...props
}: BottomSheetProps) {
  return (
    <PopupBase
      {...props}
      variant="bottomSheet"
      size={undefined}
      contentAlign={contentAlign}
      className={cn(block, className)}
    />
  );
}
