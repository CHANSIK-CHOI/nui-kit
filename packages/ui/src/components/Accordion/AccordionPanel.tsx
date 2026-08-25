"use client";

import cn from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { px } from "../../internal/prefix.js";
import { motionTransition } from "../../internal/motion.js";
import { useAccordionContext } from "./Accordion.context.js";

const block = px("accordion");

const panelVariants = {
  closed: {
    opacity: 0,
    y: -8,
    transitionEnd: {
      visibility: "hidden" as const,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    visibility: "visible" as const,
  },
};

export type AccordionPanelProps = {
  children: ReactNode;
  index: number;
  className?: string;
};

export default function AccordionPanel({
  children,
  index,
  className,
}: AccordionPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const { accordionId, activeIndices, shouldKeepMounted } =
    useAccordionContext();
  const isItemOpen = activeIndices.includes(index);
  const panelId = `${accordionId}-panel-${index}`;
  const buttonId = `${accordionId}-button-${index}`;
  const [isLayoutVisible, setIsLayoutVisible] = useState(isItemOpen);
  const panelTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        ...motionTransition.collapse,
        layout: motionTransition.panel,
      };

  useEffect(() => {
    if (isItemOpen) {
      setIsLayoutVisible(true);
    }
  }, [isItemOpen]);

  // shouldKeepMounted: 내용을 DOM 에 남긴다.
  // 폼 입력값 유지나 내부 콘텐츠 검색이 필요할 때 쓴다.
  if (shouldKeepMounted) {
    return (
      <motion.div
        layout
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isItemOpen}
        className={cn(`${block}__panel`, className)}
        variants={panelVariants}
        transition={panelTransition}
        initial={false}
        animate={isItemOpen ? "open" : "closed"}
        onAnimationComplete={() => {
          if (!isItemOpen) {
            setIsLayoutVisible(false);
          }
        }}
        style={{
          display: isLayoutVisible ? "block" : "none",
          overflow: "hidden",
          pointerEvents: isItemOpen ? "auto" : "none",
          willChange: shouldReduceMotion ? "auto" : "transform, opacity",
        }}
      >
        <div className={`${block}__panel-box`}>{children}</div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {isItemOpen ? (
        <motion.div
          layout
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={cn(`${block}__panel`, className)}
          variants={panelVariants}
          initial="closed"
          animate="open"
          transition={panelTransition}
          exit="closed"
          style={{
            overflow: "hidden",
            willChange: shouldReduceMotion ? "auto" : "transform, opacity",
          }}
        >
          <div className={`${block}__panel-box`}>{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
