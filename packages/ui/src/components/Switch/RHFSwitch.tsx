"use client";

import { type ChangeEvent } from "react";
import {
  useController,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import type {
  RHFCheckedInputManagedProps,
  RHFComponentProps,
} from "../../types/rhf.js";
import Switch, { type SwitchProps } from "./Switch.js";

export type RHFSwitchProps<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
> = RHFComponentProps<
  TFormValues,
  TFieldName,
  SwitchProps,
  RHFCheckedInputManagedProps
>;

export default function RHFSwitch<
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
  ...restProps
}: RHFSwitchProps<TFormValues, TFieldName>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    field.onChange(event.target.checked);
  };

  return (
    <Switch
      {...restProps}
      ref={field.ref}
      name={field.name}
      checked={Boolean(field.value)}
      disabled={disabled}
      isError={Boolean(fieldState.error) || isError}
      onBlur={field.onBlur}
      onChange={handleChange}
    />
  );
}
