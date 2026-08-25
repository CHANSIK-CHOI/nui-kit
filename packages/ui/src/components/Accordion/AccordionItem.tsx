"use client";

import cn from "classnames";
import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";
import { px } from "../../internal/prefix.js";
import { motionTransition } from "../../internal/motion.js";
import { useAccordionContext } from "./Accordion.context.js";

const block = px("accordion");

export type AccordionItemProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  index: number;
};

export default function AccordionItem({
  children,
  index,
  className,
  ...rest
}: AccordionItemProps) {
  const { activeIndices } = useAccordionContext();
  const isItemOpen = activeIndices.includes(index);

  return (
    <motion.div
      {...rest}
      transition={{ layout: motionTransition.panel }}
      className={cn(`${block}__item`, className, isItemOpen && px("is-active"))}
    >
      {children}
    </motion.div>
  );
}
