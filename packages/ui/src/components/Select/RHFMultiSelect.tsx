"use client";

import {
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";
import type {
  RHFComponentProps,
  RHFValueInputManagedProps,
} from "../../types/rhf.js";
import MultiSelect, { type MultiSelectProps } from "./MultiSelect.js";

export type RHFMultiSelectProps<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
> = RHFComponentProps<
  TFormValues,
  TFieldName,
  MultiSelectProps,
  RHFValueInputManagedProps
>;

export default function RHFMultiSelect<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  disabled = false,
  isError = false,
  errorMessage,
  ...restMultiSelectProps
}: RHFMultiSelectProps<TFormValues, TFieldName>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
  });

  return (
    <MultiSelect
      {...restMultiSelectProps}
      ref={field.ref}
      name={field.name}
      value={Array.isArray(field.value) ? field.value : []}
      disabled={disabled}
      isError={Boolean(fieldState.error) || isError}
      onBlur={field.onBlur}
      onChange={(nextValue) => field.onChange(nextValue)}
      errorMessage={fieldState.error?.message ?? errorMessage}
    />
  );
}
