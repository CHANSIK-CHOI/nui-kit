"use client";

import cn from "classnames";
import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from "react";
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
  /**
   * 글자 수 카운터의 sr-only 라벨. 소비자의 어휘·언어로 바꿀 수 있어야 한다 (a11y.md §9).
   * 카운터는 `maxLength` 가 있을 때만 렌더된다.
   */
  counterLabel?: string;
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
      maxLength,
      counterLabel = "글자 수",
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
    const generatedMessageId = useId();
    const generatedCounterId = useId();
    const resolvedId = id ?? fieldContextId ?? generatedId;
    const hasOwnMessage = Boolean(infoMessage || errorMessage);
    const resolvedIsError = isFieldError || Boolean(errorMessage);

    // 제한이 있을 때만 센다 — 제한이 곧 카운터의 조건이다
    // (KRDS 가이드 683쪽 · 체크리스트 [텍스트 영역 4]).
    const hasCounter = typeof maxLength === "number";
    // controlled 전용이지만 `value` 없이 쓰는 것 자체는 막히지 않는다.
    // 그때 카운터가 0 에 멈춰 있으면 대놓고 틀린 화면이 되므로 길이를 따로 들고 있는다.
    const [uncontrolledLength, setUncontrolledLength] = useState(0);
    // 세는 단위는 브라우저의 `maxlength` 와 같은 UTF-16 코드 단위다 —
    // 다르게 세면 카운터가 100 인데 더 쳐지거나 99 인데 안 쳐진다.
    const valueLength =
      value != null ? String(value).length : uncontrolledLength;
    const isOverLimit = hasCounter && valueLength > maxLength;

    const resolvedAriaDescribedBy = getMergedAriaIds(
      ariaDescribedBy,
      ...fieldDescribedByIds,
      hasOwnMessage ? generatedMessageId : null,
      hasCounter ? generatedCounterId : null,
    );

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setUncontrolledLength(event.target.value.length);
      onChange?.(event);
    };

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
            maxLength={maxLength}
            aria-describedby={resolvedAriaDescribedBy}
            aria-invalid={resolvedIsError ? true : undefined}
            onChange={handleChange}
          />
        </div>
        <div className={`${block}__foot`}>
          <Message
            id={hasOwnMessage ? generatedMessageId : undefined}
            infoMessage={infoMessage}
            errorMessage={errorMessage}
          />
          {/*
            `aria-live` 를 붙이지 않는다 — 글자마다 갱신되므로 live 로 두면
            스크린리더가 타이핑 한 글자마다 숫자를 읽는다. 사용자가 직접 만드는
            변화라 `aria-describedby` 로 포커스 시점에 알리는 것으로 충분하다.
          */}
          {hasCounter ? (
            <span
              id={generatedCounterId}
              className={cn(`${block}__counter`, {
                [`${block}__counter--over`]: isOverLimit,
              })}
            >
              <span className={px("sr-only")}>{counterLabel}</span>
              {valueLength} / {maxLength}
            </span>
          ) : null}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
