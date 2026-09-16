"use client";

import { forwardRef, useEffect, useId, useMemo, useState } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type {
  ActionMeta,
  GroupBase,
  MultiValue,
  SelectInstance,
} from "react-select";
import ReactSelect from "react-select";
import { getMergedAriaIds, useFieldContext } from "../Field/Field.context.js";
import { acquirePortalRoot } from "../../internal/portal.js";
import SelectAriaContext, {
  DEFAULT_REMOVE_BUTTON_LABEL,
} from "./Select.context.js";
import SelectBase, { SELECT_BLOCK } from "./SelectBase.js";
import {
  createSelectAriaLiveMessages,
  DEFAULT_NO_OPTIONS_MESSAGE,
  selectLoadingMessage,
  selectScreenReaderStatus,
} from "./Select.locale.js";
import {
  createAriaValueContainer,
  getReadOnlyGuardedProps,
  getResolvedMultiValue,
  getResolvedSelectComponents,
  getResolvedSelectStyles,
  needsSelectPortalRoot,
  resolveMenuPlacementProps,
  SELECT_PORTAL_ROOT_ID,
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

// react-select 이 소유한 스크린리더 문자열의 한국어 기본값 (Select.locale.ts).
// 모듈 스코프에 한 번만 만든다 — 매 렌더 새 객체를 넘기면 불필요하게 다시 그린다.
const ARIA_LIVE_MESSAGES = createSelectAriaLiveMessages<true>();

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
      placeholder,
      disabled = false,
      readOnly = false,
      // 우리가 소비하고 react-select 에는 넘기지 않는다 — DOM 에 `size` 로 새지 않게
      size = "medium",
      isError = false,
      infoMessage = "",
      errorMessage = "",
      onChange,
      components,
      styles,
      isSearchable = false,
      isClearable = false,
      removeButtonLabel = DEFAULT_REMOVE_BUTTON_LABEL,
      // 라벨·안내 문구에는 마침표를 붙이지 않는다 (SEED writing 규칙과 같다)
      noOptionsMessage = DEFAULT_NO_OPTIONS_MESSAGE,
      // 메뉴 최대 높이는 react-select 이 소유한다 (배치 계산이 이 값을 참조하므로
      // CSS 의 max-height 로 덮지 않는다). 기본값만 우리가 정한다 — SEED `select.yaml`
      // 의 `maxHeight` 와 같은 480 이다 (Select.md §6-7).
      maxMenuHeight = 480,
      menuIsOpen,
      // 배치 넷 — 기본은 제자리 `absolute` · 뒤집지 않음 · 페이지를 스크롤하지 않음.
      // `Datepicker` 와 같은 기본이다. 해석은 `resolveMenuPlacementProps` 한 곳 (Select.md §6-7).
      hasPortal = false,
      menuPosition,
      menuPlacement,
      menuPortalTarget,
      // react-select 기본(`true`)을 뒤집었다 — 열 때 페이지가 저절로 움직이지 않게
      menuShouldScrollIntoView = false,
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
      isRequired: isFieldRequired,
      footerId: fieldFooterId,
      registerFooter,
    } = useFieldContext();
    // Field 안이면 메시지를 Field 의 Footer 로 올린다 (Field.md §6 「Footer 승계」)
    const isInField = typeof registerFooter === "function";
    const generatedId = useId();
    const generatedMessageId = useId();
    const resolvedId = id ?? fieldContextId ?? generatedId;
    const resolvedValue = getResolvedMultiValue(options, value);
    const hasOwnMessage = Boolean(infoMessage || errorMessage);
    const resolvedIsError = isFieldError || isError || Boolean(errorMessage);
    const resolvedAriaDescribedBy = getMergedAriaIds(
      ariaDescribedBy,
      ...fieldDescribedByIds,
      // Field 안에서는 자체 id 를 만들지 않는다 — Footer 의 id 가 describedByIds 로 들어온다
      !isInField && hasOwnMessage ? generatedMessageId : null,
    );
    // Field 안 · 밖에서 에러 문구의 id 가 다르다 — `aria-errormessage` 가 가리킨다
    const errorMessageId = isInField
      ? (fieldFooterId ?? undefined)
      : generatedMessageId;

    useEffect(() => {
      if (!isInField) return;

      return registerFooter({
        id: resolvedId,
        infoMessage,
        errorMessage,
        isError: isError || Boolean(errorMessage),
      });
    }, [
      errorMessage,
      infoMessage,
      isError,
      isInField,
      registerFooter,
      resolvedId,
    ]);

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
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
    const resolvedStyles = useMemo(
      () => getResolvedSelectStyles<true>(styles),
      [styles],
    );

    // ── portal 컨테이너 (Tooltip · Datepicker · ToastHost 와 같은 규칙)
    //
    // ⚠️ 마운트 이후에 잡는다. 렌더 중 `document` 를 읽으면 하이드레이션이 어긋난다.
    //    첫 프레임에는 `portalRoot` 가 없어 메뉴가 제자리로 그려지는데, 메뉴는 열려야
    //    보이고 그전에 이 effect 가 돈다.
    //
    // `hasPortal` 일 때만 잡는다 — 판정은 `needsSelectPortalRoot` 한 곳.
    const placementInput = {
      hasPortal,
      menuPosition,
      menuPlacement,
      menuPortalTarget,
    };
    const needsPortalRoot = needsSelectPortalRoot(placementInput);

    useEffect(() => {
      if (!needsPortalRoot) {
        setPortalRoot(null);
        return;
      }

      const { root, release } = acquirePortalRoot(SELECT_PORTAL_ROOT_ID);
      setPortalRoot(root);

      return release;
    }, [needsPortalRoot]);

    const menuPlacementProps = resolveMenuPlacementProps(
      placementInput,
      portalRoot,
    );
    const ariaContextValue = useMemo(
      () => ({
        describedBy: resolvedAriaDescribedBy,
        readOnly,
        isRequired: isFieldRequired,
        getRemoveButtonLabel: removeButtonLabel,
      }),
      [resolvedAriaDescribedBy, readOnly, removeButtonLabel, isFieldRequired],
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
        size={size}
        disabled={disabled}
        readOnly={readOnly}
        isError={resolvedIsError}
        infoMessage={infoMessage}
        errorMessage={errorMessage}
        messageId={hasOwnMessage ? generatedMessageId : undefined}
        hasMessage={!isInField}
        isMenuStatic={menuPosition === "static"}
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
            placeholder={placeholder ?? ""}
            isDisabled={disabled}
            isSearchable={!readOnly && !disabled && isSearchable}
            isClearable={!readOnly && !disabled && isClearable}
            isMulti
            onChange={handleChange}
            components={resolvedComponents}
            styles={resolvedStyles}
            noOptionsMessage={noOptionsMessage}
            // 스크린리더 전용 문자열도 한국어 기본값을 채운다 (a11y.md §9).
            // 소비자가 준 값이 우리 기본을 이긴다.
            ariaLiveMessages={rest.ariaLiveMessages ?? ARIA_LIVE_MESSAGES}
            screenReaderStatus={
              rest.screenReaderStatus ?? selectScreenReaderStatus
            }
            loadingMessage={rest.loadingMessage ?? selectLoadingMessage}
            maxMenuHeight={maxMenuHeight}
            // 배치 prop 은 한자리에서 해석한다 (Select.md §6-7). 기본은 제자리이고
            // `hasPortal` 이면 body 로 나간다. portal 래퍼의 z 는 `getResolvedSelectStyles` 가
            // `z-portal-menu` 로 올린다.
            menuShouldScrollIntoView={menuShouldScrollIntoView}
            {...menuPlacementProps}
            aria-invalid={ariaInvalid ?? (resolvedIsError || undefined)}
            aria-errormessage={
              resolvedIsError && errorMessage ? errorMessageId : undefined
            }
          />
        </SelectAriaContext.Provider>
      </SelectBase>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
