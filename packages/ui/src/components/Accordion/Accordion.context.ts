"use client";

import { createContext, useContext } from "react";

/** 문서 제목 계층은 페이지가 정한다. `h1` 은 아코디언 바깥에 있다 (spec §6-6) */
export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export type AccordionContextValue = {
  accordionId: string;
  activeIndices: number[];
  shouldKeepMounted: boolean;
  headingLevel?: AccordionHeadingLevel;
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

// ── 항목 Context — 비공개 ────────────────────────────────────────
// `index` 의 정본은 `Accordion.Item` 하나이고 `Button` · `Panel` 이 여기서 받아 간다
// (spec §6-1). 루트 Context 와 나눈 이유는 값의 단위가 달라서다 — 루트의 것은 목록 전체의
// 값이고 이것은 항목 하나의 값이다.
//
// 배럴로 내보내지 않는다. 루트 Context 는 소비자가 헤더 안에 자기 컴포넌트를 넣을 수 있게
// 일부러 연 것이지만(spec §3-3), 이쪽은 `Item` → `Button` · `Panel` 을 잇는 내부 배선이다.
// 여는 것은 non-breaking 이라 닫고 시작한다 (spec §13).
type AccordionItemContextValue = {
  index: number;
};

export const AccordionItemContext =
  createContext<AccordionItemContextValue | null>(null);

/**
 * 쓸 `index` 를 정한다 — **명시값이 Context 를 이긴다.**
 *
 * 세 곳에 같은 값을 적던 코드가 그대로 돌아야 하므로 prop 이 우선이다.
 * 둘 다 없으면 던진다. 조용히 엉뚱한 항목을 토글하는 것이 이 설계가 닫으려던 결함이라
 * (타입은 통과하고 화면에서만 드러난다) 같은 실패를 되살리지 않는다.
 */
export function useResolvedIndex(
  explicitIndex: number | undefined,
  componentName: string,
) {
  const itemContext = useContext(AccordionItemContext);

  if (typeof explicitIndex === "number" && !Number.isNaN(explicitIndex)) {
    return explicitIndex;
  }

  if (!itemContext) {
    throw new Error(
      `${componentName} 에 index 를 주거나 <Accordion.Item index={…}> 안에 넣어 주세요.`,
    );
  }

  return itemContext.index;
}

// ── 헤더 Context — 비공개 ────────────────────────────────────────
// 「지금 `Accordion.Head` 안인가」 하나만 말한다. `headingLevel` 을 받았을 때 heading 을
// **누가 만드는가**가 여기서 갈린다 (spec §6-6) —
//   모드 A: 버튼이 헤더를 감싸므로 버튼은 Head **밖**이다 → 버튼이 자기 바깥을 감싼다
//   모드 B: 버튼이 화살표 자리, 즉 Head **안**이다 → 제목 상자가 heading 이 되고 버튼은 만들지 않는다
// 항목당 heading 이 둘이 되지 않게 하는 장치다.
export const AccordionHeadContext = createContext(false);

export default AccordionContext;
