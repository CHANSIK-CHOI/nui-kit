export { default as Datepicker } from "./Datepicker.js";
export type { DatepickerProps } from "./Datepicker.js";
export { default as DateRangePicker } from "./DateRangePicker.js";
export type { DateRangePickerProps } from "./DateRangePicker.js";
export { default as DateMultiplePicker } from "./DateMultiplePicker.js";
export type { DateMultiplePickerProps } from "./DateMultiplePicker.js";

// 공개 시그니처에 등장하는 서드파티 타입을 함께 내보낸다.
// `react-day-picker` 는 dependency 라 소비자의 node_modules 루트에 없다
// (pnpm 처럼 엄격한 설치에서는 소비자가 직접 import 할 수 없다).
export type {
  DateRange,
  Matcher,
  Modifiers,
  DayPickerProps,
} from "react-day-picker";

// `formatDisplayValue` 를 확장하려는 소비자가 기본 구현을 재사용할 수 있도록 공개한다.
export {
  formatSingleDateValue,
  formatMultipleDateValue,
  formatRangeDateValue,
} from "./Datepicker.utils.js";

// ⚠️ `DatepickerBase` 는 공개하지 않는다.
//    제네릭 2개짜리 시그니처를 공개 API 로 고정하면 이후 리팩터가 전부 major 가 되고,
//    필수 prop(formatDisplayValue 등)과 내부 prop(onCalendarOpenChange)의 경계가
//    공개 타입만으로는 성립하지 않는다.
export type { DatepickerMode } from "./DatepickerBase.js";
