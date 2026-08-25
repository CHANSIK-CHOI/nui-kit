"use client";

import cn from "classnames";
import type { HTMLAttributes, ReactNode } from "react";
import { px } from "../../internal/prefix.js";
import { getMergedAriaIds, useFieldContext } from "../Field/Field.context.js";
import CheckboxGroupContext from "./CheckboxGroup.context.js";

const block = px("checkbox-group");

export type CheckboxGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "role"
> & {
  children: ReactNode;
  /** 하위 항목들이 공유할 input name */
  name?: string;
  direction?: "row" | "column";
  disabled?: boolean;
  readOnly?: boolean;
  isError?: boolean;
};

export default function CheckboxGroup({
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
}: CheckboxGroupProps) {
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
    <CheckboxGroupContext.Provider
      value={{ name, disabled, readOnly, isError: resolvedIsError }}
    >
      <div
        {...rest}
        role="group"
        aria-labelledby={resolvedAriaLabelledBy}
        aria-describedby={resolvedAriaDescribedBy}
        className={cn(block, `${block}--${direction}`, className)}
      >
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
}
