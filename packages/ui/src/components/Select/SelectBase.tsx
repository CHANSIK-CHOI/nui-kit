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
      <Message
        id={messageId}
        infoMessage={infoMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
}
