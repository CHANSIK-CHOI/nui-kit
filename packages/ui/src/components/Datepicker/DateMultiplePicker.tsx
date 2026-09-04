"use client";

import { forwardRef } from "react";
import type { PropsMulti, PropsMultiRequired } from "react-day-picker";
import DatepickerBase, { type DatepickerBaseProps } from "./DatepickerBase.js";
import {
  formatMultipleDateValue,
  getMultipleDefaultMonth,
  getShouldCloseMultipleOnSelect,
} from "./Datepicker.utils.js";

type DateMultiplePickerDayPickerProps = PropsMulti | PropsMultiRequired;

type DateMultiplePickerBaseProps = DatepickerBaseProps<
  Date[],
  DateMultiplePickerDayPickerProps
>;

// `parseDisplayValue` 를 넘기지 않으므로 입력은 계속 읽기 전용이다.
// 열 수 없는 문을 공개 API 에 두지 않는다 — `isTextInputBlocked` 도 함께 뺀다.
export type DateMultiplePickerProps = Omit<
  DateMultiplePickerBaseProps,
  | "formatDisplayValue"
  | "getDefaultMonth"
  | "getShouldCloseOnSelect"
  | "isTextInputBlocked"
  | "mode"
  | "parseDisplayValue"
> & {
  formatDisplayValue?: DateMultiplePickerBaseProps["formatDisplayValue"];
  getDefaultMonth?: DateMultiplePickerBaseProps["getDefaultMonth"];
  getShouldCloseOnSelect?: DateMultiplePickerBaseProps["getShouldCloseOnSelect"];
};

const DateMultiplePicker = forwardRef<
  HTMLInputElement,
  DateMultiplePickerProps
>(
  (
    {
      formatDisplayValue = formatMultipleDateValue,
      getDefaultMonth = getMultipleDefaultMonth,
      getShouldCloseOnSelect = getShouldCloseMultipleOnSelect,
      ...restProps
    },
    ref,
  ) => {
    return (
      <DatepickerBase
        {...restProps}
        inputRef={ref}
        mode="multiple"
        formatDisplayValue={formatDisplayValue}
        getDefaultMonth={getDefaultMonth}
        getShouldCloseOnSelect={getShouldCloseOnSelect}
      />
    );
  },
);

DateMultiplePicker.displayName = "DateMultiplePicker";

export default DateMultiplePicker;
