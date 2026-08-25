export { default as Accordion } from "./Accordion.js";
export type {
  AccordionProps,
  AccordionType,
  AccordionVariant,
} from "./Accordion.js";

// Server Component 에서는 dot notation(Accordion.Item)이 동작하지 않으므로
// 서브 컴포넌트를 개별 named export 로도 제공한다.
export { default as AccordionItem } from "./AccordionItem.js";
export type { AccordionItemProps } from "./AccordionItem.js";
export { default as AccordionButton } from "./AccordionButton.js";
export type { AccordionButtonProps } from "./AccordionButton.js";
export { default as AccordionHead } from "./AccordionHead.js";
export type { AccordionHeadProps } from "./AccordionHead.js";
export { default as AccordionPanel } from "./AccordionPanel.js";
export type { AccordionPanelProps } from "./AccordionPanel.js";
export {
  useAccordionContext,
  type AccordionContextValue,
} from "./Accordion.context.js";
