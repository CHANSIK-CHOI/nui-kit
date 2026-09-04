"use client";

import cn from "classnames";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
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
  /**
   * 중간 상태. 하위 항목이 일부만 선택된 "전체 선택" 체크박스에 쓴다
   * (KRDS 가이드 539·545쪽 · 체크리스트 [체크박스 5]).
   *
   * `CheckboxGroup` 이 자동으로 계산하지 않는다 — 그룹은 배치와 문맥만 갖고
   * 값은 소비자가 소유하기 때문이다. 전체 선택 체크박스는 그룹 밖에 두는 일도 많다.
   */
  indeterminate?: boolean;
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
      indeterminate = false,
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
    const inputElementRef = useRef<HTMLInputElement | null>(null);
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

    // 소비자(또는 RHF)의 ref 와 내부 ref 를 함께 채운다.
    // 내부 ref 는 `indeterminate` 를 DOM 에 심는 데 쓴다.
    const setInputRef = useCallback(
      (element: HTMLInputElement | null) => {
        inputElementRef.current = element;

        if (typeof ref === "function") {
          ref(element);
          return;
        }

        if (ref) {
          (ref as { current: HTMLInputElement | null }).current = element;
        }
      },
      [ref],
    );

    // `indeterminate` 는 속성이 아니라 **DOM 프로퍼티**라 마크업으로 넣을 수 없다.
    // 접근성 트리의 `aria-checked="mixed"` 는 네이티브가 이 프로퍼티에서 만들어 준다 —
    // 손으로 붙이면 출처가 둘이 된다.
    //
    // ⚠️ 의존성 배열을 두지 않는다. 중간 상태인 체크박스를 사용자가 클릭하면
    //    브라우저가 프로퍼티를 스스로 false 로 내리는데, 소비자가 prop 을 계속
    //    true 로 두고 있으면 값이 안 바뀌어 effect 가 다시 돌지 않는다.
    //    그러면 화면만 조용히 어긋난다. 대입 한 줄이라 매 렌더 실행이 싸다.
    useEffect(() => {
      if (inputElementRef.current) {
        inputElementRef.current.indeterminate = indeterminate;
      }
    });

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
          ref={setInputRef}
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
