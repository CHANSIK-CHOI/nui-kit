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
import DateMultiplePicker, {
  type DateMultiplePickerProps,
} from "./DateMultiplePicker.js";

export type RHFDateMultiplePickerProps<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
> = RHFComponentProps<
  TFormValues,
  TFieldName,
  DateMultiplePickerProps,
  RHFSelectedInputManagedProps
>;

export default function RHFDateMultiplePicker<
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
}: RHFDateMultiplePickerProps<TFormValues, TFieldName>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
  });

  return (
    <DateMultiplePicker
      {...restProps}
      ref={field.ref}
      name={field.name}
      onBlur={field.onBlur}
      selected={field.value as DateMultiplePickerProps["selected"]}
      onSelectedChange={field.onChange}
      disabled={disabled}
      errorMessage={fieldState.error?.message ?? errorMessage}
    />
  );
}
