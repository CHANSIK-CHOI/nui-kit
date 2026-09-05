"use client";

import { forwardRef, useId, useMemo } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type {
  ActionMeta,
  GroupBase,
  SelectInstance,
  SingleValue,
} from "react-select";
import ReactSelect from "react-select";
import { getMergedAriaIds, useFieldContext } from "../Field/Field.context.js";
import SelectAriaContext, {
  DEFAULT_REMOVE_BUTTON_LABEL,
} from "./Select.context.js";
import SelectBase, { SELECT_BLOCK } from "./SelectBase.js";
import {
  createAriaValueContainer,
  getReadOnlyGuardedProps,
  getResolvedSelectComponents,
  getResolvedSelectStyles,
  getResolvedSingleValue,
  toSelectChangeMeta,
} from "./Select.utils.js";
import type {
  SelectChangeMeta,
  SelectOption,
  SelectOptionValue,
  SelectSharedProps,
  SingleSelectValue,
} from "./Select.types.js";

export type { SelectOption, SelectOptionValue, SingleSelectValue };

export type SelectProps = SelectSharedProps<false> & {
  value?: SingleSelectValue;
  onChange?: (
    nextValue: SingleSelectValue,
    selectedOption: SelectOption | null,
    meta: SelectChangeMeta,
  ) => void;
};

type SelectRefInstance = SelectInstance<
  SelectOption,
  false,
  GroupBase<SelectOption>
>;

// ⚠️ 명시적 타입 주석이 필요하다.
//    forwardRef 의 추론 결과가 react-select 내부 타입 `SelectComponents` 를 참조해
//    `tsc --emitDeclarationOnly` 가 TS2883 으로 실패한다
//    (선언 파일에서 그 이름을 가리킬 수 없어 이식 불가능한 타입이 된다).
//    react-select 이 `SelectComponents` 를 루트에서 export 하면 이 주석은 떼도 된다.
const Select: ForwardRefExoticComponent<
  SelectProps & RefAttributes<SelectRefInstance>
> = forwardRef<SelectRefInstance, SelectProps>(
  (
    {
      id,
      className,
      name,
      value = null,
      options,
      placeholder,
      disabled = false,
      readOnly = false,
      isError = false,
      infoMessage = "",
      errorMessage = "",
      onChange,
      components,
      styles,
      isSearchable = false,
      isClearable = false,
      hasPortal = false,
      // 라벨·안내 문구에는 마침표를 붙이지 않는다 (SEED writing 규칙과 같다)
      noOptionsMessage = () => "선택 가능한 항목이 없습니다",
      // 메뉴 최대 높이는 react-select 이 소유한다 (배치 계산이 이 값을 참조하므로
      // CSS 의 max-height 로 덮지 않는다). 기본값만 우리 치수에 맞춘다.
      maxMenuHeight = 240,
      menuIsOpen,
      menuPosition,
      openMenuOnClick,
      openMenuOnFocus,
      backspaceRemovesValue,
      escapeClearsValue,
      tabSelectsValue,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
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
    const resolvedValue = getResolvedSingleValue(options, value);
    const hasOwnMessage = Boolean(infoMessage || errorMessage);
    const resolvedIsError = isFieldError || isError || Boolean(errorMessage);
    const resolvedAriaDescribedBy = getMergedAriaIds(
      ariaDescribedBy,
      ...fieldDescribedByIds,
      hasOwnMessage ? generatedMessageId : null,
    );

    // ⚠️ 컴포넌트 함수 identity 는 소비자의 ValueContainer 에만 의존해야 한다.
    //    aria 값을 deps 에 넣으면 값이 바뀔 때마다 input 이 remount 되어
    //    포커스와 검색어가 날아간다 — 값은 Context 로 흘려보낸다.
    const consumerValueContainer = components?.ValueContainer;
    const AriaValueContainer = useMemo(
      () => createAriaValueContainer<false>(consumerValueContainer),
      [consumerValueContainer],
    );
    const resolvedComponents = useMemo(
      () =>
        getResolvedSelectComponents<false>(components, {
          ValueContainer: AriaValueContainer,
        }),
      [components, AriaValueContainer],
    );
    const resolvedStyles = useMemo(
      () => getResolvedSelectStyles<false>(styles),
      [styles],
    );
    // 단일 Select 에는 칩이 없다. context 모양을 맞추려고 기본값만 넣는다.
    const ariaContextValue = useMemo(
      () => ({
        describedBy: resolvedAriaDescribedBy,
        readOnly,
        getRemoveButtonLabel: DEFAULT_REMOVE_BUTTON_LABEL,
      }),
      [resolvedAriaDescribedBy, readOnly],
    );

    const handleChange = (
      nextOption: SingleValue<SelectOption>,
      actionMeta: ActionMeta<SelectOption>,
    ) => {
      if (readOnly) {
        return;
      }

      onChange?.(
        nextOption?.value ?? null,
        nextOption ?? null,
        toSelectChangeMeta(actionMeta),
      );
    };

    return (
      <SelectBase
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        isError={resolvedIsError}
        infoMessage={infoMessage}
        errorMessage={errorMessage}
        messageId={hasOwnMessage ? generatedMessageId : undefined}
      >
        <SelectAriaContext.Provider value={ariaContextValue}>
          <ReactSelect<SelectOption, false, GroupBase<SelectOption>>
            {...rest}
            {...getReadOnlyGuardedProps(readOnly, {
              menuIsOpen,
              openMenuOnClick,
              openMenuOnFocus,
              backspaceRemovesValue,
              escapeClearsValue,
              tabSelectsValue,
            })}
            ref={ref}
            inputId={resolvedId}
            instanceId={resolvedId}
            className={`${SELECT_BLOCK}__container`}
            classNamePrefix={SELECT_BLOCK}
            unstyled
            name={name}
            value={resolvedValue}
            options={options}
            placeholder={placeholder ?? ""}
            isDisabled={disabled}
            isSearchable={!readOnly && !disabled && isSearchable}
            isClearable={!readOnly && !disabled && isClearable}
            isMulti={false}
            onChange={handleChange}
            components={resolvedComponents}
            styles={resolvedStyles}
            noOptionsMessage={noOptionsMessage}
            maxMenuHeight={maxMenuHeight}
            menuPosition={menuPosition}
            // 잘리는 조상을 탈출한다. 소비자가 직접 준 값이 우리 기본을 이긴다.
            // z 는 `getResolvedSelectStyles` 가 `z-portal-menu` 로 올린다.
            menuPortalTarget={
              rest.menuPortalTarget ??
              (hasPortal && typeof document !== "undefined"
                ? document.body
                : undefined)
            }
            aria-invalid={ariaInvalid ?? (resolvedIsError || undefined)}
            aria-errormessage={
              resolvedIsError && errorMessage ? generatedMessageId : undefined
            }
          />
        </SelectAriaContext.Provider>
      </SelectBase>
    );
  },
);

Select.displayName = "Select";

export default Select;
