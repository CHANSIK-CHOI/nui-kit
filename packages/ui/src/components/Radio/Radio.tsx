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
import type { SelectionTone } from "../../types/selection.js";
import { getMergedAriaIds, useFieldContext } from "../Field/Field.context.js";
import { useRadioGroupContext } from "./RadioGroup.context.js";

const block = px("radio");
/** readOnly 일 때 막아야 하는 키 (네이티브 input 은 checkbox/radio 에 readonly 가 없다) */
const INTERACTION_KEYS = new Set([" ", "Enter"]);

type RadioBaseProps = {
  /**
   * 선택됐을 때의 채움색. 기본은 **중립(먹색)** 이고, 강조가 필요한 자리에만
   * `"brand"` 를 준다 (2026-09-08 · prototype S1).
   *
   * 선택 컨트롤은 한 화면에 여럿 반복되는 자리라 전부 브랜드색이면 목록이
   * 얼룩덜룩해지고 강조가 흔해져 강조가 아니게 된다. 약관 동의나 추천 항목처럼
   * **하나만 도드라져야 하는 자리**가 `"brand"` 의 자리다.
   */
  tone?: SelectionTone;
  id?: string;
  className?: string;
  isError?: boolean;
  readOnly?: boolean;
};

export type RadioProps = RadioBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "readOnly" | "type">;

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      id,
      name,
      className,
      isError,
      readOnly,
      tone = "neutral",
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
    const groupContext = useRadioGroupContext();
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
        className={cn(
          block,
          tone !== "neutral" && `${block}--${tone}`,
          className,
          {
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
          type="radio"
          disabled={resolvedDisabled}
          // ⚠️ DOM 에도 반드시 넘긴다. checkbox/radio 에서 브라우저는 이 속성을
          //    무시하지만(상호작용 차단은 아래 핸들러가 담당), React 는 이것이 없으면
          //    `checked` 를 controlled 로 보고 onChange 누락 경고를 낸다.
          readOnly={resolvedReadOnly}
          aria-describedby={resolvedAriaDescribedBy}
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

Radio.displayName = "Radio";

export default Radio;
