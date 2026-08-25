"use client";

import { type ChangeEvent } from "react";
import {
  useController,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import type {
  RHFComponentProps,
  RHFValueInputManagedProps,
} from "../../types/rhf.js";
import Textfield, { type TextfieldProps } from "./Textfield.js";

type RHFTextfieldBaseProps = {
  formatValue?: (value: string) => string;
};

export type RHFTextfieldProps<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
> = RHFComponentProps<
  TFormValues,
  TFieldName,
  TextfieldProps,
  RHFValueInputManagedProps
> &
  RHFTextfieldBaseProps;

export default function RHFTextfield<
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
  formatValue,
  onClear,
  ...restTextfieldProps
}: RHFTextfieldProps<TFormValues, TFieldName>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
  });
  const { ref, ...fieldProps } = field;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    field.onChange(
      formatValue ? formatValue(event.target.value) : event.target.value,
    );
  };

  const handleClear = () => {
    field.onChange(formatValue ? formatValue("") : "");
    onClear?.();
  };

  return (
    <Textfield
      {...restTextfieldProps}
      {...fieldProps}
      ref={ref}
      value={field.value ?? ""}
      disabled={disabled}
      onChange={handleChange}
      onClear={handleClear}
      errorMessage={fieldState.error?.message ?? errorMessage}
    />
  );
}
