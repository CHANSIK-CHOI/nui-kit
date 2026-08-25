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
import Textarea, { type TextareaProps } from "./Textarea.js";

type RHFTextareaBaseProps = {
  formatValue?: (value: string) => string;
};

export type RHFTextareaProps<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
> = RHFComponentProps<
  TFormValues,
  TFieldName,
  TextareaProps,
  RHFValueInputManagedProps
> &
  RHFTextareaBaseProps;

export default function RHFTextarea<
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
  ...restTextareaProps
}: RHFTextareaProps<TFormValues, TFieldName>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
  });
  const { ref, ...fieldProps } = field;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    field.onChange(
      formatValue ? formatValue(event.target.value) : event.target.value,
    );
  };

  const handleClear = () => {
    field.onChange(formatValue ? formatValue("") : "");
    onClear?.();
  };

  return (
    <Textarea
      {...restTextareaProps}
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
