"use client";

import cn from "classnames";
import { type HTMLAttributes, type ReactNode } from "react";
import { px } from "../../internal/prefix.js";
import AccordionButton from "./AccordionButton.js";
import { useAccordionContext } from "./Accordion.context.js";

const block = px("accordion");

export type AccordionHeadProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** 주면 화살표 자리에 토글 버튼이 놓인다. 주지 않으면 장식용 화살표만 렌더된다 */
  buttonIndex?: number;
};

export default function AccordionHead({
  children,
  buttonIndex,
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
      className={cn(
        `${block}__head`,
        className,
        hasToggleButton && `${block}__head--with-button`,
      )}
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
            aria-label={titleId ? undefined : "아코디언 패널 토글"}
            aria-labelledby={titleId}
          >
            <span className={`${block}__arrow-icon`} aria-hidden="true" />
          </AccordionButton>
        ) : (
          <span className={`${block}__arrow-icon`} aria-hidden="true" />
        )}
      </span>
    </div>
  );
}
