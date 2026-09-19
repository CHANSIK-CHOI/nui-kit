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
import type { SelectionTone } from "../../types/selection.js";
import { getMergedAriaIds, useFieldContext } from "../Field/Field.context.js";
import { useCheckboxGroupContext } from "./CheckboxGroup.context.js";

const block = px("checkbox");
/** readOnly 일 때 막아야 하는 키 (네이티브 input 은 checkbox/radio 에 readonly 가 없다) */
const INTERACTION_KEYS = new Set([" ", "Enter"]);

/**
 * 상자를 그릴지, 체크만 둘지.
 *
 * SEED `checkmark` 의 `variant: square | ghost` 를 옮긴 것이고, 축 이름은 SEED 문서가
 * 이 축을 부르는 대로 **Shape** 이다 — `Button` 도 `shape` 을 「모양」으로 쓰고 그 값에
 * `square` 가 있어 같은 낱말이 같은 뜻이 된다 (components.md §9).
 *
 * - `"square"` 기본. 필수 선택이고 사용자가 그 내용을 **인지해야** 하는 자리
 * - `"ghost"` 필수가 아니고 **항목이 셋 이하**인 자리
 *
 * ⚠️ ghost 는 외곽선이 없어 KRDS 의 「체크박스 외곽선 3:1」을 만족하지 못한다.
 *    KRDS 준수가 요구되는 화면에서는 `square` 를 쓴다.
 */
export type CheckboxShape = "square" | "ghost";

type CheckboxShapeProps =
  | {
      /**
       * 상자를 그릴지, 체크만 둘지. 기본은 `"square"` 다.
       *
       * `"ghost"` 는 필수 선택이 아니고 항목이 셋 이하인 자리에 쓴다. 외곽선이 없어
       * KRDS 의 체크박스 외곽선 대비 요건(3:1)을 만족하지 못하므로, KRDS 준수가
       * 요구되는 화면에서는 `"square"` 를 쓴다.
       */
      shape?: "square";
      /**
       * 중간 상태. 하위 항목이 일부만 선택된 "전체 선택" 체크박스에 쓴다
       * (KRDS 가이드 539·545쪽 · 체크리스트 [체크박스 5]).
       *
       * `CheckboxGroup` 이 자동으로 계산하지 않는다 — 그룹은 배치와 문맥만 갖고
       * 값은 소비자가 소유하기 때문이다. 전체 선택 체크박스는 그룹 밖에 두는 일도 많다.
       *
       * `shape="ghost"` 에서는 받지 않는다. 상자가 없어 「일부」를 그릴 자리가 없다.
       */
      indeterminate?: boolean;
    }
  // ⚠️ ghost 의 `indeterminate` 에는 doc 주석을 달지 않는다. props 추출기가 그것을
  //    표의 설명으로 뽑아 「일부를 그릴 자리가 없다」가 square 의 설명 자리에 앉는다.
  | { shape: "ghost"; indeterminate?: never };

type CheckboxBaseProps = {
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

// ⚠️ `children` 을 닫는다. `InputHTMLAttributes` 가 `children` 을 품고 있어
//    `<Checkbox>라벨</Checkbox>` 이 **타입은 통과하고 런타임에 죽었다** —
//    `{...rest}` 가 그것을 `<input>` 에 넣어 "input is a void element tag" 가 난다.
//    라벨은 `Field.Label` 이 붙인다 (a11y.md §1).
export type CheckboxProps = CheckboxBaseProps &
  CheckboxShapeProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "readOnly" | "type" | "children">;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      name,
      className,
      isError,
      readOnly,
      tone = "neutral",
      shape = "square",
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
      isRequired: isFieldRequired,
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
    // ⚠️ `ghost` 에는 중간 상태가 없다. 타입이 이미 막지만 런타임에서도 접는다 —
    //    프로퍼티가 살아 있으면 그리지 않아도 네이티브가 `aria-checked="mixed"` 를
    //    만들어 **보조기술은 「일부」, 화면은 「미선택」**이 된다. 이 절이 상태 클래스를
    //    안 쓰기로 한 것과 같은 종류의 어긋남이다.
    const isIndeterminate = shape === "ghost" ? false : indeterminate;

    useEffect(() => {
      if (inputElementRef.current) {
        inputElementRef.current.indeterminate = isIndeterminate;
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
        className={cn(
          block,
          tone !== "neutral" && `${block}--${tone}`,
          shape !== "square" && `${block}--${shape}`,
          className,
          {
            [px("is-disabled")]: resolvedDisabled,
            [px("is-error")]: resolvedIsError,
            [px("is-readonly")]: resolvedReadOnly,
          },
        )}
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
          aria-required={isFieldRequired ? true : undefined}
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
