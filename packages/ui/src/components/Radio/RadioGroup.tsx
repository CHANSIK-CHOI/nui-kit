"use client";

import cn from "classnames";
import type { HTMLAttributes, ReactNode } from "react";
import { px } from "../../internal/prefix.js";
import { getMergedAriaIds, useFieldContext } from "../Field/Field.context.js";
import RadioGroupContext from "./RadioGroup.context.js";

const block = px("radio-group");

export type RadioGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "role"> & {
  children: ReactNode;
  /** 하위 항목들이 공유할 input name */
  name?: string;
  direction?: "row" | "column";
  disabled?: boolean;
  readOnly?: boolean;
  isError?: boolean;
};

export default function RadioGroup({
  children,
  className,
  name,
  direction = "column",
  disabled,
  readOnly,
  isError,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: RadioGroupProps) {
  const {
    labelId: fieldLabelId,
    describedByIds: fieldDescribedByIds,
    isError: isFieldError,
  } = useFieldContext();
  const resolvedIsError = isFieldError || Boolean(isError);
  const resolvedAriaLabelledBy = getMergedAriaIds(
    ariaLabelledBy,
    fieldLabelId ?? undefined,
  );
  const resolvedAriaDescribedBy = getMergedAriaIds(
    ariaDescribedBy,
    ...fieldDescribedByIds,
  );

  return (
    <RadioGroupContext.Provider
      value={{ name, disabled, readOnly, isError: resolvedIsError }}
    >
      <div
        {...rest}
        role="radiogroup"
        aria-labelledby={resolvedAriaLabelledBy}
        aria-describedby={resolvedAriaDescribedBy}
        aria-invalid={resolvedIsError ? true : undefined}
        className={cn(block, `${block}--${direction}`, className)}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}
