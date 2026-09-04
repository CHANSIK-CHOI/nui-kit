"use client";

import { forwardRef, useCallback, useState } from "react";
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
  "formatDisplayValue" | "getDefaultMonth" | "mode" | "getShouldCloseOnSelect"
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
      ...restProps
    },
    ref,
  ) => {
    // 캘린더가 열려 있는 동안에는 아직 확정되지 않은 기간 선택 상태를 로컬에
    // 보관해서, { from, to } 가 모두 정해지기 전의 중간 선택도 UI 에 보여준다.
    const [draftRange, setDraftRange] = useState<DateRange | undefined>();
    const [isCalendarOpen, setIsCalendarOpen] = useState(defaultIsCalendarOpen);

    const resolvedSelected =
      isCalendarOpen && draftRange ? draftRange : selected;

    const resolvedDayPickerProps: NonNullable<
      DateRangePickerProps["dayPickerProps"]
    > = {
      ...dayPickerProps,
      min: dayPickerProps?.min ?? 1,
      resetOnSelect: dayPickerProps?.resetOnSelect ?? true,
    };

    const handleCalendarOpenChange = useCallback((nextIsOpen: boolean) => {
      if (!nextIsOpen) {
        setDraftRange(undefined);
      }

      setIsCalendarOpen(nextIsOpen);
    }, []);

    const handleSelectedChange = useCallback(
      (nextSelected: DateRange | undefined) => {
        if (!nextSelected) {
          setDraftRange(undefined);
          onSelectedChange?.(undefined);
          return;
        }

        setDraftRange(nextSelected);

        if (isCompleteDateRange(nextSelected)) {
          onSelectedChange?.(nextSelected);
          return;
        }

        onSelectedChange?.(undefined);
      },
      [onSelectedChange],
    );

    return (
      <DatepickerBase
        {...restProps}
        inputRef={ref}
        mode="range"
        selected={resolvedSelected}
        onSelectedChange={handleSelectedChange}
        dayPickerProps={resolvedDayPickerProps}
        formatDisplayValue={formatDisplayValue}
        parseDisplayValue={parseDisplayValue}
        getDefaultMonth={getDefaultMonth}
        getShouldCloseOnSelect={getShouldCloseOnSelect}
        defaultIsCalendarOpen={defaultIsCalendarOpen}
        onCalendarOpenChange={handleCalendarOpenChange}
      />
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";

export default DateRangePicker;
