"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import PopupBase from "./PopupBase.js";
import type { BottomSheetProps } from "./Popup.types.js";

const block = px("bottom-sheet");

export default function BottomSheet({
  className,
  contentAlign = "left",
  dialogLabel = "바텀시트 팝업",
  ...props
}: BottomSheetProps) {
  return (
    <PopupBase
      {...props}
      variant="bottomSheet"
      size={undefined}
      contentAlign={contentAlign}
      dialogLabel={dialogLabel}
      className={cn(block, className)}
    />
  );
}
