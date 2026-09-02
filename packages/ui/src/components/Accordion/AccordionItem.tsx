"use client";

import cn from "classnames";
import { type HTMLAttributes, type ReactNode } from "react";
import { px } from "../../internal/prefix.js";
import { useAccordionContext } from "./Accordion.context.js";

const block = px("accordion");

export type AccordionItemProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  index: number;
};

/**
 * 항목 껍데기. 열림 상태를 클래스로만 표시한다.
 *
 * ⚠️ 예전에는 `motion.div` 에 `transition={{ layout: … }}` 을 걸고 있었다.
 *    `layout` prop 이 없으면 그 설정은 아무 일도 하지 않는다. 높이 전환은
 *    `AccordionPanel` 이 `height: 0 ↔ "auto"` 로 직접 맡으므로 여기서는
 *    framer-motion 이 필요 없다.
 */
export default function AccordionItem({
  children,
  index,
  className,
  ...rest
}: AccordionItemProps) {
  const { activeIndices } = useAccordionContext();
  const isItemOpen = activeIndices.includes(index);

  return (
    <div
      {...rest}
      className={cn(`${block}__item`, className, isItemOpen && px("is-active"))}
    >
      {children}
    </div>
  );
}
