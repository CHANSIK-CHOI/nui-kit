"use client";

import { forwardRef } from "react";
import type {
  DateRange,
  PropsRange,
  PropsRangeRequired,
} from "react-day-picker";
import DatepickerBase, { type DatepickerBaseProps } from "./DatepickerBase.js";
import {
  formatRangeDateValue,
  getRangeDefaultMonth,
  getShouldCloseRangeOnSelect,
  parseRangeDateValue,
} from "./Datepicker.utils.js";

type DateRangePickerDayPickerProps = PropsRange | PropsRangeRequired;

type DateRangePickerBaseProps = DatepickerBaseProps<
  DateRange,
  DateRangePickerDayPickerProps
>;

export type DateRangePickerProps = Omit<
  DateRangePickerBaseProps,
  | "formatDisplayValue"
  | "getDefaultMonth"
  | "getShouldCloseOnSelect"
  | "mode"
> & {
  formatDisplayValue?: DateRangePickerBaseProps["formatDisplayValue"];
  parseDisplayValue?: DateRangePickerBaseProps["parseDisplayValue"];
  getDefaultMonth?: DateRangePickerBaseProps["getDefaultMonth"];
  getShouldCloseOnSelect?: DateRangePickerBaseProps["getShouldCloseOnSelect"];
};

function isCompleteDateRange(
  value: DateRange | undefined,
): value is DateRange & { from: Date; to: Date } {
  return Boolean(value?.from && value?.to);
}

const DateRangePicker = forwardRef<HTMLInputElement, DateRangePickerProps>(
  (
    {
      selected,
      onSelectedChange,
      dayPickerProps,
      defaultIsCalendarOpen = false,
      formatDisplayValue = formatRangeDateValue,
      parseDisplayValue = parseRangeDateValue,
      getDefaultMonth = getRangeDefaultMonth,
      getShouldCloseOnSelect = getShouldCloseRangeOnSelect,
      hasConfirmButton = true,
      ...restProps
    },
    ref,
  ) => {
    const resolvedDayPickerProps: NonNullable<
      DateRangePickerProps["dayPickerProps"]
    > = {
      ...dayPickerProps,
      // `min` 에 기본값을 두지 않는다. 예전에는 `?? 1` 이었는데 react-day-picker 의
      // `min` 은 **최소 일수로는 `min > 1` 일 때만 검사된다**(`addToRange`) —
      // `1` 의 유일한 효과는 같은 날을 다시 눌렀을 때 하루 기간을 만드는 대신
      // **선택을 통째로 비우는 것**이었다. "9월 1일 하루" 를 기간으로 받으려는
      // 소비자가 우리 문서를 읽어야 알 수 있는 제약이었다.
      // 최소 일수가 필요하면 `min: 2` 이상을 주면 그때 실제로 검사된다.
      resetOnSelect: dayPickerProps?.resetOnSelect ?? true,
    };

    return (
      <DatepickerBase
        {...restProps}
        inputRef={ref}
        mode="range"
        selected={selected}
        onSelectedChange={onSelectedChange}
        dayPickerProps={resolvedDayPickerProps}
        formatDisplayValue={formatDisplayValue}
        parseDisplayValue={parseDisplayValue}
        getDefaultMonth={getDefaultMonth}
        getShouldCloseOnSelect={getShouldCloseOnSelect}
        defaultIsCalendarOpen={defaultIsCalendarOpen}
        hasConfirmButton={hasConfirmButton}
        getIsConfirmable={isCompleteDateRange}
      />
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";

export default DateRangePicker;
