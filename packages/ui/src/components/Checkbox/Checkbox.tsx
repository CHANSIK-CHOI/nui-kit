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
import { useCheckboxGroupContext } from "./CheckboxGroup.context.js";

const block = px("checkbox");
/** readOnly 일 때 막아야 하는 키 (네이티브 input 은 checkbox/radio 에 readonly 가 없다) */
const INTERACTION_KEYS = new Set([" ", "Enter"]);

type CheckboxBaseProps = {
  id?: string;
  className?: string;
  isError?: boolean;
  readOnly?: boolean;
};

export type CheckboxProps = CheckboxBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "readOnly" | "type">;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      name,
      className,
      isError,
      readOnly,
      disabled,
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
    const groupContext = useCheckboxGroupContext();
    const generatedId = useId();
    const resolvedId = id ?? fieldContextId ?? generatedId;
    const resolvedName = name ?? groupContext.name;
    const resolvedDisabled = disabled ?? groupContext.disabled ?? false;
    const resolvedReadOnly = readOnly ?? groupContext.readOnly ?? false;
    const resolvedIsError =
      isFieldError || Boolean(groupContext.isError) || Boolean(isError);
    const resolvedAriaDescribedBy = getMergedAriaIds(
      ariaDescribedBy,
      ...fieldDescribedByIds,
    );

    const handleClick = (event: MouseEvent<HTMLInputElement>) => {
      if (resolvedReadOnly) {
        event.preventDefault();
        return;
      }

      onClick?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (resolvedReadOnly && INTERACTION_KEYS.has(event.key)) {
        event.preventDefault();
        return;
      }

      onKeyDown?.(event);
    };

    return (
      <span
        className={cn(block, className, {
          [px("is-disabled")]: resolvedDisabled,
          [px("is-error")]: resolvedIsError,
          [px("is-readonly")]: resolvedReadOnly,
        })}
      >
        <input
          {...rest}
          ref={ref}
          id={resolvedId}
          name={resolvedName}
          type="checkbox"
          disabled={resolvedDisabled}
          // ⚠️ DOM 에도 반드시 넘긴다. checkbox/radio 에서 브라우저는 이 속성을
          //    무시하지만(상호작용 차단은 아래 핸들러가 담당), React 는 이것이 없으면
          //    `checked` 를 controlled 로 보고 onChange 누락 경고를 낸다.
          readOnly={resolvedReadOnly}
          aria-describedby={resolvedAriaDescribedBy}
          aria-invalid={resolvedIsError ? true : undefined}
          aria-readonly={resolvedReadOnly ? true : undefined}
          className={`${block}__input`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onChange={onChange}
        />
        <span aria-hidden="true" className={`${block}__control`}>
          <span className={`${block}__indicator`} />
        </span>
      </span>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
