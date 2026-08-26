"use client";

import {
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";
import type {
  RHFComponentProps,
  RHFSelectedInputManagedProps,
} from "../../types/rhf.js";
import DateRangePicker, {
  type DateRangePickerProps,
} from "./DateRangePicker.js";

export type RHFDateRangePickerProps<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
> = RHFComponentProps<
  TFormValues,
  TFieldName,
  DateRangePickerProps,
  RHFSelectedInputManagedProps
>;

export default function RHFDateRangePicker<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  disabled = false,
  errorMessage,
  ...restProps
}: RHFDateRangePickerProps<TFormValues, TFieldName>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
  });

  return (
    <DateRangePicker
      {...restProps}
      ref={field.ref}
      name={field.name}
      onBlur={field.onBlur}
      selected={field.value as DateRangePickerProps["selected"]}
      onSelectedChange={field.onChange}
      disabled={disabled}
      errorMessage={fieldState.error?.message ?? errorMessage}
    />
  );
}
