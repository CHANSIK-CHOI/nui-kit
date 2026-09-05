export { default as Select } from "./Select.js";
export type { SelectProps } from "./Select.js";
export { default as MultiSelect } from "./MultiSelect.js";
export type { MultiSelectProps } from "./MultiSelect.js";
// ⚠️ `SelectBase` 는 내보내지 않는다. 소비자가 쓰는 것은 `Select` 와 `MultiSelect`
//    이고, 블록·상태 클래스와 메시지만 붙이는 골격은 내부 배선이다
//    (`PopupBase` · `DatepickerBase` 와 같은 규칙).
export type {
  SelectChangeAction,
  SelectChangeMeta,
  SelectOption,
  SelectOptionValue,
  SingleSelectValue,
  MultiSelectValue,
  SelectSharedProps,
} from "./Select.types.js";
