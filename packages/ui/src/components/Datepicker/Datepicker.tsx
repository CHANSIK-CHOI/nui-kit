"use client";

import { forwardRef } from "react";
import type { PropsSingle, PropsSingleRequired } from "react-day-picker";
import DatepickerBase, { type DatepickerBaseProps } from "./DatepickerBase.js";
import {
  formatSingleDateValue,
  getShouldCloseSingleOnSelect,
  getSingleDefaultMonth,
  parseSingleDateValue,
} from "./Datepicker.utils.js";

type DatepickerDayPickerProps = PropsSingle | PropsSingleRequired;

type DatepickerBaseSingleProps = DatepickerBaseProps<
  Date,
  DatepickerDayPickerProps
>;

export type DatepickerProps = Omit<
  DatepickerBaseSingleProps,
  "formatDisplayValue" | "getDefaultMonth" | "mode" | "getShouldCloseOnSelect"
> & {
  formatDisplayValue?: DatepickerBaseSingleProps["formatDisplayValue"];
  parseDisplayValue?: DatepickerBaseSingleProps["parseDisplayValue"];
  getDefaultMonth?: DatepickerBaseSingleProps["getDefaultMonth"];
  getShouldCloseOnSelect?: DatepickerBaseSingleProps["getShouldCloseOnSelect"];
};

const Datepicker = forwardRef<HTMLInputElement, DatepickerProps>(
  (
    {
      formatDisplayValue = formatSingleDateValue,
      parseDisplayValue = parseSingleDateValue,
      getDefaultMonth = getSingleDefaultMonth,
      getShouldCloseOnSelect = getShouldCloseSingleOnSelect,
      ...restProps
    },
    ref,
  ) => {
    return (
      <DatepickerBase
        {...restProps}
        inputRef={ref}
        mode="single"
        formatDisplayValue={formatDisplayValue}
        parseDisplayValue={parseDisplayValue}
        getDefaultMonth={getDefaultMonth}
        getShouldCloseOnSelect={getShouldCloseOnSelect}
      />
    );
  },
);

Datepicker.displayName = "Datepicker";

export default Datepicker;
