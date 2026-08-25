"use client";

import cn from "classnames";
import { useCallback, useId, useMemo, useState, type ReactNode } from "react";
import { px } from "../../internal/prefix.js";
import AccordionContext from "./Accordion.context.js";
import AccordionButton from "./AccordionButton.js";
import AccordionHead from "./AccordionHead.js";
import AccordionItem from "./AccordionItem.js";
import AccordionPanel from "./AccordionPanel.js";

const block = px("accordion");

export type AccordionType = "single" | "multiple";
export type AccordionVariant = "box" | "line";

export type AccordionProps = {
  children: ReactNode;
  /** single 은 하나만, multiple 은 여러 개를 동시에 펼친다 */
  type?: AccordionType;
  className?: string;
  /** 제어 모드. 주면 열림 상태를 소비자가 소유한다 */
  activeIndices?: number[];
  defaultActiveIndices?: number[];
  variant?: AccordionVariant;
  onChange?: (nextActiveIndices: number[]) => void;
  /** 닫혀 있어도 패널 내용을 DOM 에 남긴다 (폼 입력값 유지 등) */
  shouldKeepMounted?: boolean;
};

function getResolvedActiveIndices({
  type,
  activeIndices = [],
}: {
  type: AccordionType;
  activeIndices?: number[];
}) {
  const uniqueActiveIndices = Array.from(
    new Set(activeIndices.filter(Number.isInteger)),
  );

  return type === "single"
    ? uniqueActiveIndices.slice(0, 1)
    : uniqueActiveIndices;
}

function AccordionRoot({
  children,
  type = "multiple",
  className,
  activeIndices,
  defaultActiveIndices = [],
  variant = "box",
  onChange,
  shouldKeepMounted = false,
}: AccordionProps) {
  const accordionId = useId();
  const isControlled = activeIndices !== undefined;
  const [uncontrolledActiveIndices, setUncontrolledActiveIndices] = useState(
    () =>
      getResolvedActiveIndices({ type, activeIndices: defaultActiveIndices }),
  );

  // ⚠️ 이 useMemo 가 없으면 매 렌더마다 새 배열이 만들어져
  //    아래 useCallback / useMemo 의 의존성이 항상 바뀐다 — 메모이제이션이 무력해진다.
  //    (제어 모드에서 소비자가 매 렌더 새 배열을 넘기면 여전히 무력하지만,
  //     그건 소비자 쪽 선택이다)
  const sourceActiveIndices = isControlled
    ? activeIndices
    : uncontrolledActiveIndices;
  const resolvedActiveIndices = useMemo(
    () =>
      getResolvedActiveIndices({ type, activeIndices: sourceActiveIndices }),
    [type, sourceActiveIndices],
  );

  const handleToggleItem = useCallback(
    (targetIndex: number) => {
      const isItemOpen = resolvedActiveIndices.includes(targetIndex);
      let nextActiveIndices: number[];

      if (type === "single") {
        nextActiveIndices = isItemOpen ? [] : [targetIndex];
      } else {
        nextActiveIndices = isItemOpen
          ? resolvedActiveIndices.filter((index) => index !== targetIndex)
          : [...resolvedActiveIndices, targetIndex];
      }

      if (!isControlled) {
        setUncontrolledActiveIndices(nextActiveIndices);
      }

      onChange?.(nextActiveIndices);
    },
    [resolvedActiveIndices, type, isControlled, onChange],
  );

  const contextValue = useMemo(
    () => ({
      accordionId,
      activeIndices: resolvedActiveIndices,
      shouldKeepMounted,
      handleToggleItem,
    }),
    [accordionId, resolvedActiveIndices, shouldKeepMounted, handleToggleItem],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn(block, `${block}--${variant}`, className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// dot notation 은 Client Component 전용.
// Server Component 에서는 아래 named export 를 쓴다.
const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Button: AccordionButton,
  Panel: AccordionPanel,
  Head: AccordionHead,
});

export default Accordion;
export { AccordionItem, AccordionButton, AccordionPanel, AccordionHead };
