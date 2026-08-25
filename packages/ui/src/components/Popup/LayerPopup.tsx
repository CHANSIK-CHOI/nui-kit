"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import PopupBase from "./PopupBase.js";
import type { LayerPopupProps } from "./Popup.types.js";

const block = px("layer-popup");

export default function LayerPopup({
  className,
  contentAlign = "left",
  dialogLabel = "레이어 팝업",
  ...props
}: LayerPopupProps) {
  return (
    <PopupBase
      {...props}
      variant="dialog"
      contentAlign={contentAlign}
      dialogLabel={dialogLabel}
      className={cn(block, className)}
    />
  );
}
