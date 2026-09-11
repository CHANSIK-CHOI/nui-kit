"use client";

import type { ReactNode } from "react";
import cn from "classnames";
import { px } from "../../internal/prefix.js";
import Message from "../Textfield/Message.js";

/** react-select 의 `classNamePrefix` 이자 래퍼의 블록 클래스. */
export const SELECT_BLOCK = px("select");

export type SelectBaseProps = {
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  isError?: boolean;
  infoMessage?: string;
  errorMessage?: string;
  messageId?: string;
  /** Field 안에서는 `Select`/`MultiSelect` 가 Footer 로 올리므로 여기서 그리지 않는다 (Field.md §6) */
  hasMessage?: boolean;
  children: ReactNode;
};

export default function SelectBase({
  className,
  disabled = false,
  readOnly = false,
  isError = false,
  infoMessage = "",
  errorMessage = "",
  messageId,
  hasMessage = true,
  children,
}: SelectBaseProps) {
  const resolvedIsError = isError || Boolean(errorMessage);

  return (
    <div
      className={cn(SELECT_BLOCK, className, {
        [px("is-disabled")]: disabled,
        [px("is-error")]: resolvedIsError,
        [px("is-readonly")]: readOnly,
      })}
    >
      {children}
      {hasMessage ? (
        <Message
          id={messageId}
          infoMessage={infoMessage}
          errorMessage={errorMessage}
        />
      ) : null}
    </div>
  );
}
