"use client";

import cn from "classnames";
import {
  forwardRef,
  useEffect,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { px } from "../../internal/prefix.js";
import { getMergedAriaIds, useFieldContext } from "../Field/Field.context.js";
import Message from "./Message.js";
import TextfieldBtn from "./TextfieldBtn.js";

const block = px("textfield");

export type TextfieldInputType =
  "text" | "password" | "email" | "tel" | "url" | "number";

/**
 * 높이 단계. `medium` 48(`size-control-xl`) · `large` 56(`size-field`).
 * Button 의 같은 이름과 같은 값이라 나란히 놓으면 `size` 를 안 적어도 높이가 맞는다.
 * `small` 은 없다 — SEED `text-input` 도 두 단계이고, 입력은 컨트롤 전체가 누르는
 * 타겟이라 KRDS 권장 44 아래로 내리지 않는다 (Textfield.md §4).
 */
export type TextfieldSize = "large" | "medium";

type TextfieldBaseProps = {
  children?: ReactNode;
  id?: string;
  className?: string;
  placeholder?: string;
  type?: TextfieldInputType;
  /**
   * 높이 단계. 기본 `medium`(48) — 두 단계면 작은 쪽이 기본이다(design-system.md §7-1).
   * HTML `size`(글자 폭)가 아니다 — 폭은 `100%` 라 그 속성이 설 자리가 없었다.
   */
  size?: TextfieldSize;
  /**
   * 입력값. 네이티브 타입(`string | number | readonly string[]`)에서
   * **배열을 뺐다** — React 가 `<select multiple>` 때문에 넣은 갈래라 한 줄 입력에는
   * 쓸 일이 없고, 넘기면 `'' + value` 로 합쳐져 쉼표가 값에 섞인다.
   * `number` 는 남긴다 — `type="number"` 를 지원하기 때문이다.
   */
  value?: string | number;
  readOnly?: boolean;
  isTextInputBlocked?: boolean;
  disabled?: boolean;
  infoMessage?: string;
  errorMessage?: string;
  unit?: string;
  isClearable?: boolean;
  onClear?: () => void;
  /** 지우기 버튼의 접근 이름. 소비자의 어휘·언어로 바꿀 수 있어야 한다 (a11y.md §9) */
  clearButtonTitle?: string;
  /**
   * 글자 수 카운터의 sr-only 라벨. 소비자의 어휘·언어로 바꿀 수 있어야 한다 (a11y.md §9).
   * 카운터는 `maxLength` 가 있을 때만 렌더된다 — 제한이 곧 카운터의 조건이다
   * (KRDS 가이드 683쪽 · SEED `field.mdx`).
   */
  counterLabel?: string;
};

export type TextfieldProps = TextfieldBaseProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "aria-invalid"
    | "defaultValue"
    | "disabled"
    | "id"
    | "placeholder"
    | "readOnly"
    // HTML 의 `size?: number` 와 이름이 겹친다 — 빼지 않으면 교집합이 `never` 다
    | "size"
    | "type"
    | "value"
  >;

const Textfield = forwardRef<HTMLInputElement, TextfieldProps>(
  (
    {
      children,
      id,
      className,
      placeholder,
      size = "medium",
      value,
      maxLength,
      counterLabel = "글자 수",
      readOnly = false,
      isTextInputBlocked = false,
      disabled = false,
      infoMessage = "",
      errorMessage = "",
      unit = "",
      isClearable = false,
      onClear,
      clearButtonTitle = "내용 지우기",
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
      registerFooter,
    } = useFieldContext();
    // Field 안이면 자기 메시지 줄을 접고 Field 의 Footer 로 올린다 (Field.md §6 「Footer 승계」).
    // 기본 Context 에는 registerFooter 가 없다 — 그 존재가 「Field 안」의 판정이다.
    const isInField = typeof registerFooter === "function";
    const generatedId = useId();
    const generatedMessageId = useId();
    const resolvedId = id ?? fieldContextId ?? generatedId;
    const hasOwnMessage = Boolean(infoMessage || errorMessage);
    const resolvedIsError = isFieldError || Boolean(errorMessage);
    // 제한이 있을 때만 센다 — Textarea 와 같은 규칙이다.
    const hasCounter = typeof maxLength === "number";
    // 세는 단위는 브라우저의 `maxlength` 와 같은 UTF-16 코드 단위다 —
    // 다르게 세면 카운터가 100 인데 더 쳐지거나 99 인데 안 쳐진다.
    const valueLength = value != null ? String(value).length : 0;
    const resolvedAriaDescribedBy = getMergedAriaIds(
      ariaDescribedBy,
      ...fieldDescribedByIds,
      // 메시지와 카운터가 한 줄에 오므로 둘 중 하나만 있어도 그 줄을 가리킨다.
      // Field 안에서는 자체 id 를 만들지 않는다 — Footer 의 id 가 describedByIds 로 들어온다.
      !isInField && (hasOwnMessage || hasCounter) ? generatedMessageId : null,
    );

    // 카운터가 없으면 타이핑마다 Footer 를 다시 등록하지 않는다 — deps 에는 이 값만
    const footerCount = hasCounter ? valueLength : undefined;

    useEffect(() => {
      if (!isInField) return;

      // `isError` 는 자기 것만 — Context 의 값을 되돌려 올리면 Field 가 에러를 못 거둔다 (래치)
      return registerFooter({
        id: resolvedId,
        infoMessage,
        errorMessage,
        isError: Boolean(errorMessage),
        count: footerCount,
        maxCount: maxLength,
        counterLabel,
      });
    }, [
      counterLabel,
      errorMessage,
      footerCount,
      hasCounter,
      infoMessage,
      isInField,
      maxLength,
      registerFooter,
      resolvedId,
    ]);
    const hasValue = value != null && String(value).length > 0;
    const canClear =
      isClearable &&
      typeof onClear === "function" &&
      hasValue &&
      !readOnly &&
      !disabled;

    return (
      <div
        className={cn(block, className, {
          // 기본값(medium)에는 modifier 를 붙이지 않는다 — Button 과 같은 방식
          [`${block}--${size}`]: size !== "medium",
          [px("is-disabled")]: disabled,
          [px("is-error")]: resolvedIsError,
          [px("is-readonly")]: readOnly,
          [`${block}--text-right`]: unit,
        })}
      >
        <div className={`${block}__wrap`}>
          <div className={`${block}__input-box`}>
            <input
              {...rest}
              ref={ref}
              id={resolvedId}
              className={`${block}__input`}
              value={value}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly || isTextInputBlocked}
              maxLength={maxLength}
              aria-describedby={resolvedAriaDescribedBy}
              aria-invalid={resolvedIsError ? true : undefined}
              aria-required={isFieldRequired ? true : undefined}
            />
          </div>
          <div className={`${block}__actions`}>
            {canClear ? (
              <TextfieldBtn
                icon="clear"
                title={clearButtonTitle}
                onClick={onClear}
                disabled={disabled}
                className={`${block}__clear`}
              />
            ) : null}
            {children}
            {unit ? <span className={`${block}__unit`}>{unit}</span> : null}
          </div>
        </div>
        {isInField ? null : (
          <Message
            id={hasOwnMessage || hasCounter ? generatedMessageId : undefined}
            infoMessage={infoMessage}
            errorMessage={errorMessage}
            count={hasCounter ? valueLength : undefined}
            maxCount={maxLength}
            counterLabel={counterLabel}
          />
        )}
      </div>
    );
  },
);

Textfield.displayName = "Textfield";

export default Textfield;
