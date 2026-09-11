"use client";

import type { ReactNode } from "react";
import cn from "classnames";
import { px } from "../../internal/prefix.js";
import Message from "../Textfield/Message.js";
import type { SelectSize } from "./Select.types.js";

/** react-select 의 `classNamePrefix` 이자 래퍼의 블록 클래스. */
export const SELECT_BLOCK = px("select");

export type SelectBaseProps = {
  className?: string;
  /** 루트에 `--large` modifier 로 붙는다. medium 은 기본이라 클래스가 없다 */
  size?: SelectSize;
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
  size = "medium",
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
        // 컨트롤 높이는 루트 modifier 가 정한다. 메뉴는 portal 로 나가면 이 클래스가
        // 닿지 않는데, 메뉴는 size 와 무관하므로 문제가 없다 (Select.md §4)
        [`${SELECT_BLOCK}--${size}`]: size !== "medium",
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
