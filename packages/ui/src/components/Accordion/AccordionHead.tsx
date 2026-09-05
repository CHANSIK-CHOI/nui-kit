"use client";

import cn from "classnames";
import { ChevronDown } from "lucide-react";
import { type HTMLAttributes, type ReactNode } from "react";
import { px } from "../../internal/prefix.js";
import AccordionButton from "./AccordionButton.js";
import { useAccordionContext } from "./Accordion.context.js";

const block = px("accordion");

export type AccordionHeadProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** 주면 화살표 자리에 토글 버튼이 놓인다. 주지 않으면 장식용 화살표만 렌더된다 */
  buttonIndex?: number;
  /** 제목이 없을 때 토글 버튼의 접근 이름. 소비자의 어휘·언어로 바꿀 수 있어야 한다 (a11y.md §9) */
  toggleLabel?: string;
};

export default function AccordionHead({
  children,
  buttonIndex,
  toggleLabel = "아코디언 패널 토글",
  className,
  ...rest
}: AccordionHeadProps) {
  const { accordionId } = useAccordionContext();
  const hasToggleButton =
    typeof buttonIndex === "number" && !Number.isNaN(buttonIndex);
  const titleId =
    hasToggleButton && children
      ? `${accordionId}-title-${buttonIndex}`
      : undefined;

  return (
    <div
      {...rest}
      className={cn(`${block}__head`, className)}
    >
      <div id={titleId} className={`${block}__title-box`}>
        {children ? <div className={`${block}__title`}>{children}</div> : null}
      </div>

      <span className={`${block}__arrow`}>
        {hasToggleButton ? (
          <AccordionButton
            index={buttonIndex}
            className={`${block}__button--icon`}
            // 제목이 있으면 그것을 접근 이름으로 삼고, 없을 때만 대체 텍스트를 쓴다
            aria-label={titleId ? undefined : toggleLabel}
            aria-labelledby={titleId}
          >
            <ChevronDown
              className={`${block}__arrow-icon`}
              aria-hidden="true"
            />
          </AccordionButton>
        ) : (
          <ChevronDown className={`${block}__arrow-icon`} aria-hidden="true" />
        )}
      </span>
    </div>
  );
}
