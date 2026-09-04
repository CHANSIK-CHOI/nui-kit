"use client";

import cn from "classnames";
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { px } from "../../internal/prefix.js";
import { getMergedAriaIds, useFieldContext } from "../Field/Field.context.js";
import Message from "./Message.js";
import TextfieldBtn from "./TextfieldBtn.js";

const block = px("textfield");

export type TextfieldInputType =
  "text" | "password" | "email" | "tel" | "url" | "number";

type TextfieldBaseProps = {
  children?: ReactNode;
  id?: string;
  className?: string;
  placeholder?: string;
  type?: TextfieldInputType;
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
  readOnly?: boolean;
  isTextInputBlocked?: boolean;
  disabled?: boolean;
  infoMessage?: string;
  errorMessage?: string;
  unit?: string;
  isClearable?: boolean;
  onClear?: () => void;
  /** 지우기 버튼의 접근 이름. 소비자의 어휘·언어로 바꿀 수 있어야 한다 (a11y.md §9) */
  clearButtonTitle?: string;
};

export type TextfieldProps = TextfieldBaseProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "aria-invalid"
    | "defaultValue"
    | "disabled"
    | "id"
    | "placeholder"
    | "readOnly"
    | "type"
    | "value"
  >;

const Textfield = forwardRef<HTMLInputElement, TextfieldProps>(
  (
    {
      children,
      id,
      className,
      placeholder = "내용을 입력해주세요",
      value,
      readOnly = false,
      isTextInputBlocked = false,
      disabled = false,
      infoMessage = "",
      errorMessage = "",
      unit = "",
      isClearable = false,
      onClear,
      clearButtonTitle = "내용 지우기",
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
    const generatedMessageId = useId();
    const resolvedId = id ?? fieldContextId ?? generatedId;
    const hasOwnMessage = Boolean(infoMessage || errorMessage);
    const resolvedIsError = isFieldError || Boolean(errorMessage);
    const resolvedAriaDescribedBy = getMergedAriaIds(
      ariaDescribedBy,
      ...fieldDescribedByIds,
      hasOwnMessage ? generatedMessageId : null,
    );
    const hasValue = value != null && String(value).length > 0;
    const canClear =
      isClearable &&
      typeof onClear === "function" &&
      hasValue &&
      !readOnly &&
      !disabled;

    return (
      <div
        className={cn(block, className, {
          [px("is-disabled")]: disabled,
          [px("is-error")]: resolvedIsError,
          [px("is-readonly")]: readOnly,
          [`${block}--text-right`]: unit,
        })}
      >
        <div className={`${block}__wrap`}>
          <div className={`${block}__input-box`}>
            <input
              {...rest}
              ref={ref}
              id={resolvedId}
              className={`${block}__input`}
              value={value}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly || isTextInputBlocked}
              aria-describedby={resolvedAriaDescribedBy}
              aria-invalid={resolvedIsError ? true : undefined}
            />
          </div>
          <div className={`${block}__actions`}>
            {canClear ? (
              <TextfieldBtn
                icon="clear"
                title={clearButtonTitle}
                onClick={onClear}
                disabled={disabled}
                className={`${block}__clear`}
              />
            ) : null}
            {children}
            {unit ? <span className={`${block}__unit`}>{unit}</span> : null}
          </div>
        </div>
        <Message
          id={hasOwnMessage ? generatedMessageId : undefined}
          infoMessage={infoMessage}
          errorMessage={errorMessage}
        />
      </div>
    );
  },
);

Textfield.displayName = "Textfield";

export default Textfield;
