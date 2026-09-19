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
  /**
   * `menuPosition="static"` — 메뉴가 흐름에 들어가 아래를 밀어낸다 (Select.md §6-7).
   *
   * 루트 modifier 로 내려보내는 이유는 **그 모드에서는 portal 이 없어 메뉴가 언제나
   * 이 루트 안**이기 때문이다. 배치를 메뉴 자신이 아니라 조상이 말하게 두면
   * `NuiMenu` 에 배치 정보를 또 흘려보내지 않아도 된다.
   */
  isMenuStatic?: boolean;
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
  isMenuStatic = false,
  children,
}: SelectBaseProps) {
  const resolvedIsError = isError || Boolean(errorMessage);

  return (
    <div
      className={cn(SELECT_BLOCK, className, {
        // 컨트롤 높이는 루트 modifier 가 정한다. 메뉴는 portal 로 나가면 이 클래스가
        // 닿지 않는데, 메뉴는 size 와 무관하므로 문제가 없다 (Select.md §4)
        [`${SELECT_BLOCK}--${size}`]: size !== "medium",
        // 흐름 배치. 이 모드에서만 메뉴가 루트 안에 있다 (Select.md §6-7)
        [`${SELECT_BLOCK}--menu-static`]: isMenuStatic,
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
