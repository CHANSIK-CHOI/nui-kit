"use client";

import cn from "classnames";
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { px } from "../../internal/prefix.js";
import { getMergedAriaIds, useFieldContext } from "../Field/Field.context.js";

const block = px("switch");
const INTERACTION_KEYS = new Set([" ", "Enter"]);

type SwitchBaseProps = {
  id?: string;
  className?: string;
  isError?: boolean;
  readOnly?: boolean;
};

export type SwitchProps = SwitchBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "readOnly" | "role" | "type">;

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      className,
      isError = false,
      readOnly = false,
      disabled = false,
      onClick,
      onKeyDown,
      onChange,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const {
      inputId: fieldContextId,
      describedByIds: fieldDescribedByIds,
      isError: isFieldError,
    } = useFieldContext();
    const generatedId = useId();
    const resolvedId = id ?? fieldContextId ?? generatedId;
    const resolvedIsError = isFieldError || isError;
    const resolvedAriaDescribedBy = getMergedAriaIds(
      ariaDescribedBy,
      ...fieldDescribedByIds,
    );

    const handleClick = (event: MouseEvent<HTMLInputElement>) => {
      if (readOnly) {
        event.preventDefault();
        return;
      }

      onClick?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (readOnly && INTERACTION_KEYS.has(event.key)) {
        event.preventDefault();
        return;
      }

      onKeyDown?.(event);
    };

    return (
      <span
        className={cn(block, className, {
          [px("is-disabled")]: disabled,
          [px("is-error")]: resolvedIsError,
          [px("is-readonly")]: readOnly,
        })}
      >
        <input
          {...rest}
          ref={ref}
          id={resolvedId}
          type="checkbox"
          role="switch"
          disabled={disabled}
          // ⚠️ DOM 에도 반드시 넘긴다 — Checkbox 와 같은 이유 (React controlled 경고 방지)
          readOnly={readOnly}
          aria-describedby={resolvedAriaDescribedBy}
          aria-invalid={resolvedIsError ? true : undefined}
          aria-readonly={readOnly ? true : undefined}
          className={`${block}__input`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onChange={onChange}
        />
        <span aria-hidden="true" className={`${block}__control`}>
          <span className={`${block}__thumb`} />
        </span>
      </span>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
