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
import Select, { type SelectProps } from "./Select.js";

export type RHFSelectProps<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
> = RHFComponentProps<
  TFormValues,
  TFieldName,
  SelectProps,
  RHFValueInputManagedProps
>;

export default function RHFSelect<
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
  ...restSelectProps
}: RHFSelectProps<TFormValues, TFieldName>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
  });

  return (
    <Select
      {...restSelectProps}
      ref={field.ref}
      name={field.name}
      value={field.value ?? null}
      disabled={disabled}
      isError={Boolean(fieldState.error) || isError}
      onBlur={field.onBlur}
      onChange={(nextValue) => field.onChange(nextValue)}
      errorMessage={fieldState.error?.message ?? errorMessage}
    />
  );
}
