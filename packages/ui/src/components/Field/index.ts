export { default as Field } from "./Field.js";

// Server Component 에서는 dot notation(Field.Label)이 동작하지 않으므로
// 서브 컴포넌트를 개별 named export 로도 제공한다.
export {
  FieldItem,
  FieldGrid,
  FieldLabel,
  FieldDescription,
  FieldMessage,
} from "./Field.js";

export type {
  FieldProps,
  FieldItemProps,
  FieldGridProps,
  FieldLabelProps,
  FieldDescriptionProps,
  FieldMessageProps,
} from "./Field.js";

export {
  useFieldContext,
  getMergedAriaIds,
  type FieldContextValue,
} from "./Field.context.js";
