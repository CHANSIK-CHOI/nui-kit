"use client";

import { forwardRef, useId, useMemo } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type {
  ActionMeta,
  GroupBase,
  MultiValue,
  SelectInstance,
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
  getResolvedMultiValue,
  getResolvedSelectComponents,
  getResolvedSelectStyles,
  toSelectChangeMeta,
} from "./Select.utils.js";
import type {
  MultiSelectValue,
  SelectChangeMeta,
  SelectOption,
  SelectSharedProps,
} from "./Select.types.js";

export type MultiSelectProps = SelectSharedProps<true> & {
  value?: MultiSelectValue;
  /**
   * 칩의 삭제 버튼 접근 이름 (KRDS 가이드 566쪽 02). 기본값 `"{라벨} 옵션 삭제"`.
   * 문자열이 아니라 함수인 이유는 라벨을 끼워 넣는 자리가 언어마다 다르기 때문이다.
   */
  removeButtonLabel?: (optionLabel: string) => string;
  onChange?: (
    nextValue: MultiSelectValue,
    selectedOptions: readonly SelectOption[],
    meta: SelectChangeMeta,
  ) => void;
};

type MultiSelectRefInstance = SelectInstance<
  SelectOption,
  true,
  GroupBase<SelectOption>
>;

/**
 * readOnly 일 때 칩의 × 를 없앤다.
 * 값 변경은 `handleChange` 가 막지만, 그대로 두면 눌리는 것처럼 보이는데
 * 아무 일도 일어나지 않는 컨트롤이 된다.
 * 모듈 상수로 둬야 identity 가 고정되어 불필요한 remount 가 없다.
 */
const HiddenMultiValueRemove = () => null;

// ⚠️ 명시적 타입 주석이 필요하다. 이유는 Select.tsx 참조 (TS2883).
const MultiSelect: ForwardRefExoticComponent<
  MultiSelectProps & RefAttributes<MultiSelectRefInstance>
> = forwardRef<MultiSelectRefInstance, MultiSelectProps>(
  (
    {
      id,
      className,
      name,
      value = [],
      options,
      placeholder = "항목을 선택해주세요",
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
      removeButtonLabel = DEFAULT_REMOVE_BUTTON_LABEL,
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
    const resolvedValue = getResolvedMultiValue(options, value);
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
      () => createAriaValueContainer<true>(consumerValueContainer),
      [consumerValueContainer],
    );
    const resolvedComponents = useMemo(
      () =>
        getResolvedSelectComponents<true>(components, {
          ValueContainer: AriaValueContainer,
          ...(readOnly ? { MultiValueRemove: HiddenMultiValueRemove } : null),
        }),
      [components, AriaValueContainer, readOnly],
    );
    const resolvedStyles = useMemo(
      () => getResolvedSelectStyles<true>(styles),
      [styles],
    );
    const ariaContextValue = useMemo(
      () => ({
        describedBy: resolvedAriaDescribedBy,
        readOnly,
        getRemoveButtonLabel: removeButtonLabel,
      }),
      [resolvedAriaDescribedBy, readOnly, removeButtonLabel],
    );

    const handleChange = (
      nextOption: MultiValue<SelectOption>,
      actionMeta: ActionMeta<SelectOption>,
    ) => {
      if (readOnly) {
        return;
      }

      onChange?.(
        nextOption.map((option) => option.value),
        nextOption,
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
          <ReactSelect<SelectOption, true, GroupBase<SelectOption>>
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
            placeholder={placeholder}
            isDisabled={disabled}
            isSearchable={!readOnly && !disabled && isSearchable}
            isClearable={!readOnly && !disabled && isClearable}
            isMulti
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

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
