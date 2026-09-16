"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import PopupBase from "./PopupBase.js";
import type { BottomSheetProps } from "./Popup.types.js";

const block = px("bottom-sheet");

export default function BottomSheet({
  className,
  contentAlign = "left",
  shouldCloseOnDrag = false,
  // ⚠️ **끌어서 닫기를 켜면 X 가 기본으로 사라진다** (2026-09-15). 손잡이가 곧 닫는 자리라
  //    X 는 중복이고, SEED `bottom-sheet.mdx` 는 반대 방향에서 같은 말을 한다 — 상단에
  //    닫기 버튼을 두는 경우에는 *"핸들을 제거해서 실수로 닫히는 것을 방지"* 하라고 한다.
  //    둘은 함께 쓰는 짝이 아니라 **둘 중 하나**다.
  //
  //    필요하면 `hasCloseButton` 을 명시해 되돌린다. 딤과 ESC 는 그대로라 드래그를 못 하는
  //    사용자의 출구는 X 없이도 남는다 (WCAG 2.5.7 · spec §7).
  hasCloseButton = !shouldCloseOnDrag,
  ...props
}: BottomSheetProps) {
  return (
    <PopupBase
      {...props}
      shouldCloseOnDrag={shouldCloseOnDrag}
      hasCloseButton={hasCloseButton}
      variant="bottomSheet"
      size={undefined}
      contentAlign={contentAlign}
      className={cn(block, className)}
    />
  );
}
