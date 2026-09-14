"use client";

import cn from "classnames";
import {
  useContext,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { px } from "../../internal/prefix.js";
import {
  AccordionHeadContext,
  useAccordionContext,
  useResolvedIndex,
} from "./Accordion.context.js";

const block = px("accordion");

export type AccordionButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onClick" | "id"
> & {
  children: ReactNode;
  /** 이 버튼이 토글할 항목의 index. 생략하면 감싼 `Accordion.Item` 에서 온다 */
  index?: number;
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
  const {
    accordionId,
    activeIndices,
    shouldKeepMounted,
    headingLevel,
    handleToggleItem,
  } = useAccordionContext();
  const resolvedIndex = useResolvedIndex(index, "Accordion.Button");
  // 모드 B 의 화살표 버튼은 `Accordion.Head` 안에 있다. 그쪽은 제목 상자가 heading 이 되므로
  // 여기서 또 감싸면 한 항목에 heading 이 둘이 된다 (spec §6-6).
  const isInsideHead = useContext(AccordionHeadContext);
  const isItemOpen = activeIndices.includes(resolvedIndex);
  const panelId = `${accordionId}-panel-${resolvedIndex}`;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    handleToggleItem(resolvedIndex);
    onClick?.(resolvedIndex, event);
  };

  const toggleButton = (
    <button
      {...rest}
      type="button"
      id={`${accordionId}-button-${resolvedIndex}`}
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

  if (headingLevel === undefined || isInsideHead) {
    return toggleButton;
  }

  // 모드 A — 버튼이 헤더를 감싸므로 heading 은 **버튼 바깥**이다. `<button>` 안에는 담을 수
  // 없다(phrasing content 만 들어간다). APG 의 아코디언 패턴이 이 모양이다 (spec §6-6).
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <HeadingTag className={`${block}__heading`}>{toggleButton}</HeadingTag>
  );
}
