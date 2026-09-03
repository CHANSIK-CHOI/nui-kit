"use client";

import cn from "classnames";
import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { px } from "../../internal/prefix.js";
import { getMergedAriaIds, useFieldContext } from "../Field/Field.context.js";
import Message from "../Textfield/Message.js";

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
  /** 사용자 크기 조절 허용 여부 */
  resize?: TextareaResize;
};

// 지우기 버튼(isClearable)은 두지 않는다. 여러 줄 본문은 실수로 지우면 잃는 것이
// 크고, 통째로 되돌리는 장치는 검색어·태그처럼 짧은 값 하나의 것이다.
// 주요 디자인 시스템 대부분이 textarea 에 지우기를 두지 않는다 (2026-09-03 결정).
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
