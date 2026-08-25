"use client";

import { createContext, useContext } from "react";

export type AccordionContextValue = {
  accordionId: string;
  activeIndices: number[];
  shouldKeepMounted: boolean;
  handleToggleItem: (targetIndex: number) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext() {
  const accordionContext = useContext(AccordionContext);

  if (!accordionContext) {
    throw new Error(
      "Accordion 의 하위 컴포넌트는 <Accordion> 안에서만 쓸 수 있습니다.",
    );
  }

  return accordionContext;
}

export default AccordionContext;
