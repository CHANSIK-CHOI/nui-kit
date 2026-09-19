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

// ⚠️ 확정 버튼 셋을 **공개 API 에서 내린다** (2026-09-08 · 08 DP2).
//    single 은 고른 순간 결과가 확정되고 되돌릴 것이 없다 — 하루를 고르는 데 두 번
//    누르게 하지 않는다. 확정 버튼이 필요한 것은 **여러 번의 클릭이 하나의 값을
//    만드는** range · multiple 이다 (specs/Datepicker.md §6-8).
//
//    SEED 는 Popover 면 single 에도 confirmButton 을 요구하지만 따르지 않는다 —
//    그 근거는 §6-8 「SEED 와 다른 자리」에 적혀 있다.
export type DatepickerProps = Omit<
  DatepickerBaseSingleProps,
  | "confirmLabel"
  | "formatDisplayValue"
  | "getDefaultMonth"
  | "getShouldCloseOnSelect"
  | "hasConfirmButton"
  | "mode"
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
