"use client";

import cn from "classnames";
import {
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { px } from "../../internal/prefix.js";
import { useAccordionContext } from "./Accordion.context.js";

const block = px("accordion");

export type AccordionButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onClick" | "id"
> & {
  children: ReactNode;
  /** 이 버튼이 토글할 항목의 index */
  index: number;
  onClick?: (index: number, event: MouseEvent<HTMLButtonElement>) => void;
};

export default function AccordionButton({
  children,
  index,
  className,
  onClick,
  "aria-controls": ariaControls,
  "aria-expanded": ariaExpanded,
  ...rest
}: AccordionButtonProps) {
  const { accordionId, activeIndices, shouldKeepMounted, handleToggleItem } =
    useAccordionContext();
  const isItemOpen = activeIndices.includes(index);
  const panelId = `${accordionId}-panel-${index}`;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    handleToggleItem(index);
    onClick?.(index, event);
  };

  return (
    <button
      {...rest}
      type="button"
      id={`${accordionId}-button-${index}`}
      className={cn(`${block}__button`, className)}
      // 패널이 DOM 에 없을 때 aria-controls 로 없는 id 를 가리키지 않도록 한다
      aria-controls={
        ariaControls ?? (shouldKeepMounted || isItemOpen ? panelId : undefined)
      }
      aria-expanded={ariaExpanded ?? isItemOpen}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
