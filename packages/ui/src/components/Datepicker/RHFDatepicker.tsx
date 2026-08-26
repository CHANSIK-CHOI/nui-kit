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
import Datepicker, { type DatepickerProps } from "./Datepicker.js";

export type RHFDatepickerProps<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
> = RHFComponentProps<
  TFormValues,
  TFieldName,
  DatepickerProps,
  RHFSelectedInputManagedProps
>;

export default function RHFDatepicker<
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
}: RHFDatepickerProps<TFormValues, TFieldName>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
  });

  return (
    <Datepicker
      {...restProps}
      ref={field.ref}
      name={field.name}
      onBlur={field.onBlur}
      selected={field.value as DatepickerProps["selected"]}
      onSelectedChange={field.onChange}
      disabled={disabled}
      errorMessage={fieldState.error?.message ?? errorMessage}
    />
  );
}
