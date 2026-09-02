"use client";

import cn from "classnames";
import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { px } from "../../internal/prefix.js";
import { getMergedAriaIds, useFieldContext } from "../Field/Field.context.js";
import Message from "../Textfield/Message.js";
import TextfieldBtn from "../Textfield/TextfieldBtn.js";

const block = px("textarea");

export type TextareaResize = "none" | "vertical";

type TextareaBaseProps = {
  id?: string;
  className?: string;
  placeholder?: string;
  value?: TextareaHTMLAttributes<HTMLTextAreaElement>["value"];
  readOnly?: boolean;
  disabled?: boolean;
  infoMessage?: string;
  errorMessage?: string;
  isClearable?: boolean;
  onClear?: () => void;
  /** 지우기 버튼의 접근 이름. 소비자의 어휘·언어로 바꿀 수 있어야 한다 (a11y.md §9) */
  clearButtonTitle?: string;
  /** 사용자 크기 조절 허용 여부 */
  resize?: TextareaResize;
};

export type TextareaProps = TextareaBaseProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    | "aria-invalid"
    | "defaultValue"
    | "disabled"
    | "id"
    | "placeholder"
    | "readOnly"
    | "value"
  >;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      className,
      placeholder = "내용을 입력해주세요",
      value,
      rows = 4,
      readOnly = false,
      disabled = false,
      infoMessage = "",
      errorMessage = "",
      isClearable = false,
      onClear,
      clearButtonTitle = "내용 지우기",
      resize = "vertical",
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
        className={cn(block, `${block}--resize-${resize}`, className, {
          [px("is-disabled")]: disabled,
          [px("is-error")]: resolvedIsError,
          [px("is-readonly")]: readOnly,
        })}
      >
        <div className={`${block}__wrap`}>
          <textarea
            autoComplete="off"
            {...rest}
            ref={ref}
            id={resolvedId}
            rows={rows}
            className={`${block}__input`}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-describedby={resolvedAriaDescribedBy}
            aria-invalid={resolvedIsError ? true : undefined}
          />
          {canClear ? (
            <div className={`${block}__actions`}>
              <TextfieldBtn
                icon="clear"
                title={clearButtonTitle}
                onClick={onClear}
                disabled={disabled}
                className={`${block}__clear`}
              />
            </div>
          ) : null}
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

Textarea.displayName = "Textarea";

export default Textarea;
