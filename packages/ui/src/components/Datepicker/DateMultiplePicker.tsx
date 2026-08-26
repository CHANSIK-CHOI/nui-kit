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

export type DateMultiplePickerProps = Omit<
  DateMultiplePickerBaseProps,
  "formatDisplayValue" | "getDefaultMonth" | "mode" | "getShouldCloseOnSelect"
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
