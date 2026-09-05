"use client";

import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  useContext,
  type ComponentType,
  type ReactElement,
} from "react";
import type {
  ActionMeta,
  CSSObjectWithLabel,
  GroupBase,
  OptionsOrGroups,
  SelectComponentsConfig,
  StylesConfig,
  ValueContainerProps,
} from "react-select";
import { components as reactSelectComponents } from "react-select";
import {
  NuiClearIndicator,
  NuiDropdownIndicator,
  NuiMultiValueRemove,
} from "./SelectIndicators.js";
import { getMergedAriaIds } from "../Field/Field.context.js";
import { pv } from "../../internal/prefix.js";
import SelectAriaContext from "./Select.context.js";
import type {
  MultiSelectValue,
  SelectChangeMeta,
  SelectOption,
  SingleSelectValue,
} from "./Select.types.js";

// 번들러(Next/webpack/vite)가 빌드 시 치환하는 전역. 이 라이브러리는 Node 타입에
// 의존하지 않으므로 @types/node 대신 파일 로컬로 최소 선언만 둔다.
declare const process: { env: { NODE_ENV?: string } };

/**
 * portal 로 body 에 붙는 메뉴의 z-index.
 *
 * `--nui-z-tooltip`(20) 이 아니라 전용 토큰을 쓴다 — `menuPortalTarget` 을 쓰는
 * 대표적인 이유가 "팝업 안의 Select 메뉴가 잘리는 것" 인데, 팝업은 1030 이라
 * 20 으로는 메뉴가 팝업 뒤로 숨는다. 비포털 메뉴는 팝업의 stacking context
 * 안이라 `_select.scss` 의 `--nui-z-tooltip` 으로 충분하다.
 */
const MENU_PORTAL_Z_INDEX = `var(${pv("z-portal-menu")})`;

/**
 * `unstyled` 여도 react-select 이 emotion 클래스로 남기는 속성 중
 * **우리 CSS 가 책임지는 것들.**
 *
 * emotion 이 주입하는 `css-*` 클래스는 레이어 밖(unlayered)이라
 * `@layer nui.components` 안에 있는 우리 규칙을 상세도와 무관하게 항상 이긴다.
 * (styles.md §2 — 그 성질 덕분에 소비자가 우리를 덮을 수 있는 것이고,
 *  같은 이유로 서드파티 emotion 도 우리를 덮는다.)
 *
 * 그래서 충돌하는 속성만 emotion 쪽에서 걷어내 CSS 로 넘긴다.
 * 여기서 지우지 않으면 다음이 조용히 깨진다:
 *   - control  `minHeight: 38px`  → `--nui-size-field`(56px) 무시
 *   - control  `transition: 'all 100ms'` → 모션 토큰 우회 (a11y.md §6)
 *   - option   `display: 'block'` / `cursor: 'default'` → 옵션 정렬·커서 깨짐
 *   - option   `fontSize: 'inherit'` → 타이포 토큰 대신 **소비자 body 글꼴**을
 *              따라가, 메뉴와 컨트롤의 글자 크기가 어긋난다
 *   - menu     `zIndex: 1` → `--nui-z-tooltip` 무시
 *
 * ⚠️ 목록에 없는 것은 **일부러** 남긴 것이다. 크게 두 부류다.
 *   1) react-select 의 기능 스타일 — 지우면 동작이 깨진다
 *      · menu/menuPortal 의 `position` `top` `width` — 메뉴 배치 계산
 *      · menuList 의 `maxHeight` — `maxMenuHeight` prop 이 소유한다
 *      · valueContainer 의 `display` — 단일=grid / 다중=flex 전환에 의존
 *      · indicatorsContainer 의 `alignSelf` — 컨트롤 높이 추종
 *      · control 의 `flexWrap` `justifyContent` — 칩 줄바꿈 레이아웃
 *   2) 우리 CSS 가 선언하지 않아 애초에 충돌하지 않는 것
 *      · groupHeading 의 `display` `cursor`
 *   **우리 CSS 가 선언하지 않는 속성을 여기에 넣지 말 것** — 지워놓고 아무도
 *   책임지지 않으면 브라우저 기본값에 의존하게 된다.
 *
 * `styles/components/_select.scss` 와 짝을 이룬다. 한쪽만 고치면 조용히 깨진다.
 */
const CSS_OWNED_PROPERTIES: Record<string, readonly string[]> = {
  control: ["minHeight", "transition", "cursor"],
  option: ["display", "cursor", "fontSize"],
  multiValue: ["display"],
  multiValueRemove: ["display"],
  clearIndicator: ["display", "transition"],
  dropdownIndicator: ["display", "transition"],
  menu: ["zIndex"],
};

/** react-select 이 검색 input 에 붙이는 role. 이 자식만 골라 aria 를 보강한다. */
const COMBOBOX_ROLE = "combobox";

type ComboboxChildProps = {
  role?: string;
  "aria-describedby"?: string;
  "aria-readonly"?: boolean;
};

type StyleFn = (base: CSSObjectWithLabel, props: never) => CSSObjectWithLabel;

function omitCssProperties(
  base: CSSObjectWithLabel,
  properties: readonly string[],
): CSSObjectWithLabel {
  const next = { ...base } as Record<string, unknown>;

  for (const property of properties) {
    delete next[property];
  }

  return next as CSSObjectWithLabel;
}

function isOptionGroup(
  item: SelectOption | GroupBase<SelectOption>,
): item is GroupBase<SelectOption> {
  return Array.isArray((item as GroupBase<SelectOption>).options);
}

function flattenOptions(
  options: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>,
) {
  return options.flatMap((item) =>
    isOptionGroup(item) ? [...item.options] : [item],
  );
}

/** 원시값을 react-select 이 요구하는 옵션 객체로 되돌린다. */
export function getResolvedSingleValue(
  options: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>,
  value: SingleSelectValue | undefined,
) {
  const flatOptions = flattenOptions(options);

  return flatOptions.find((option) => option.value === value) ?? null;
}

/**
 * 원시값 배열을 react-select 이 요구하는 옵션 객체 배열로 되돌린다.
 *
 * **`value` 배열의 순서를 그대로 보존한다.** options 순서로 재정렬하면
 * `onChange` 가 준 순서(선택 순서)를 그대로 state 에 넣어도 화면에는 다른
 * 순서로 그려져, controlled 컴포넌트가 `value` 를 반영하지 않는 상태가 된다.
 */
export function getResolvedMultiValue(
  options: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>,
  value: MultiSelectValue | undefined,
) {
  const flatOptions = flattenOptions(options);
  const selectedValues = Array.isArray(value) ? value : [];

  return selectedValues
    .map((selectedValue) =>
      flatOptions.find((option) => option.value === selectedValue),
    )
    .filter((option): option is SelectOption => Boolean(option));
}

/**
 * `ValueContainer` 를 감싸 검색 input 의 aria 를 보정하는 컴포넌트를 만든다.
 *
 * ⚠️ react-select 은 input 의 `aria-describedby` 를 **자체적으로 계산해 덮어쓴다.**
 *    (`renderInput()` — 값이 없으면 `${id}-placeholder`, 최초 포커스면
 *     `${id}-live-region`, 그 외에는 아예 붙이지 않는다.) selectProps 로 넘긴
 *    `aria-describedby` 는 읽지도 않는다. 그대로 두면 우리 에러·설명 메시지가
 *    스크린리더에 연결되지 않는다 (a11y.md §2·§3).
 *
 * ⚠️ `components.Input` 을 교체하는 것으로는 부족하다. `isSearchable` 이 false 면
 *    (이 컴포넌트의 **기본값**이다) react-select 은 `Input` 대신 교체 불가능한
 *    내부 `DummyInput` 을 렌더한다. → 두 경로가 모두 거치는 `ValueContainer` 에서
 *    `role="combobox"` 인 자식을 찾아 보정한다.
 *
 * ⚠️ 값은 **반드시 Context 로** 받는다. 클로저로 받으면 값이 바뀔 때마다 이 함수의
 *    identity 가 바뀌어 react-select 이 input 을 remount 하고, 포커스와 입력 중이던
 *    검색어가 날아간다. (RHF `mode: "onChange"` 로 에러가 생겼다 사라지거나
 *    `Field.Message` 가 등록·해제될 때 실제로 발생한다.)
 *    → 호출부는 `components.ValueContainer` 만 deps 로 두고 메모이즈한다.
 */
export function createAriaValueContainer<IsMulti extends boolean>(
  consumerValueContainer?: ComponentType<
    ValueContainerProps<SelectOption, IsMulti, GroupBase<SelectOption>>
  >,
) {
  const BaseValueContainer =
    consumerValueContainer ?? reactSelectComponents.ValueContainer;

  function NuiValueContainer(
    props: ValueContainerProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
  ) {
    const { describedBy, readOnly } = useContext(SelectAriaContext);
    let hasCombobox = false;

    const children = Children.map(props.children, (child) => {
      if (!isValidElement(child)) {
        return child;
      }

      const childProps = child.props as ComboboxChildProps;

      if (childProps.role !== COMBOBOX_ROLE) {
        return child;
      }

      hasCombobox = true;

      return cloneElement(child as ReactElement<ComboboxChildProps>, {
        "aria-describedby": getMergedAriaIds(
          childProps["aria-describedby"],
          describedBy,
        ),
        // react-select 은 `isSearchable` 이 false 면 무조건 `aria-readonly` 를
        // 붙인다 — "텍스트 입력 불가" 를 뜻하지만, combobox 의 `aria-readonly` 는
        // "값 변경 불가" 다. 우리 readOnly 상태와 일치시킨다.
        "aria-readonly": readOnly ? true : undefined,
      });
    });

    if (process.env.NODE_ENV !== "production" && !hasCombobox) {
      // 이 조건이 깨지면 타입도 빌드도 통과한 채 aria 연결만 조용히 사라진다.
      // react-select 업그레이드가 시끄럽게 깨지도록 알린다.
      console.warn(
        '[nui-select] ValueContainer 에서 role="combobox" 인 자식을 찾지 못했습니다. ' +
          "react-select 의 내부 구조가 바뀐 것으로 보이며, aria-describedby 연결이 " +
          "끊어졌습니다. Select.utils.ts 의 createAriaValueContainer 를 확인하세요.",
      );
    }

    return createElement(BaseValueContainer, props, children);
  }

  NuiValueContainer.displayName = "NuiValueContainer";

  return NuiValueContainer;
}

/**
 * `IndicatorSeparator` 를 끄고 호출부가 지정한 컴포넌트를 얹는다.
 *
 * `overrides` 는 우리가 소유하는 것이므로 소비자 `components` 보다 뒤에 온다.
 * 반환 객체 자체는 매번 새로 만들어도 무방하다 — react-select 도 내부에서 매
 * 렌더 새 객체를 만든다. remount 를 유발하는 것은 **컴포넌트 함수 identity** 뿐이다.
 */
export function getResolvedSelectComponents<IsMulti extends boolean>(
  components:
    | SelectComponentsConfig<SelectOption, IsMulti, GroupBase<SelectOption>>
    | undefined,
  overrides: SelectComponentsConfig<
    SelectOption,
    IsMulti,
    GroupBase<SelectOption>
  >,
): SelectComponentsConfig<SelectOption, IsMulti, GroupBase<SelectOption>> {
  return {
    IndicatorSeparator: null,
    // 인디케이터 3종은 lucide 로 바꾼 우리 기본값이다. 소비자 `components` 가 뒤에
    // 오므로 소비자가 자기 것으로 갈아끼울 수 있다 — 기본값이지 소유가 아니다.
    DropdownIndicator: NuiDropdownIndicator,
    ClearIndicator: NuiClearIndicator,
    MultiValueRemove: NuiMultiValueRemove,
    ...components,
    ...overrides,
  };
}

/** readOnly 일 때 값 변경·메뉴 개폐로 이어지는 상호작용을 한꺼번에 끈다. */
export type MenuInteractionProps = {
  menuIsOpen?: boolean;
  openMenuOnClick?: boolean;
  openMenuOnFocus?: boolean;
  backspaceRemovesValue?: boolean;
  escapeClearsValue?: boolean;
  tabSelectsValue?: boolean;
};

/**
 * Select 와 MultiSelect 가 같은 가드를 쓰도록 한 곳에 모은다.
 * 두 파일에 복제해두면 한쪽에만 항목을 추가했을 때 나머지가 조용히 뚫린다.
 */
export function getReadOnlyGuardedProps(
  readOnly: boolean,
  props: MenuInteractionProps,
): MenuInteractionProps {
  if (!readOnly) {
    return props;
  }

  return {
    menuIsOpen: false,
    openMenuOnClick: false,
    openMenuOnFocus: false,
    backspaceRemovesValue: false,
    escapeClearsValue: false,
    tabSelectsValue: false,
  };
}

/**
 * emotion 이 남긴 충돌 속성을 걷어내고, 소비자의 `styles` 를 그 위에 얹는다.
 * 소비자 함수는 정리된 base 를 받으므로 우리 CSS 를 기준으로 덧칠할 수 있다.
 */
export function getResolvedSelectStyles<IsMulti extends boolean>(
  styles?: StylesConfig<SelectOption, IsMulti, GroupBase<SelectOption>>,
): StylesConfig<SelectOption, IsMulti, GroupBase<SelectOption>> {
  const consumerStyles = (styles ?? {}) as Record<string, StyleFn | undefined>;
  const resolved: Record<string, StyleFn | undefined> = { ...consumerStyles };

  for (const [key, properties] of Object.entries(CSS_OWNED_PROPERTIES)) {
    const consumerStyle = consumerStyles[key];

    resolved[key] = (base, props) => {
      const stripped = omitCssProperties(base, properties);

      return consumerStyle ? consumerStyle(stripped, props) : stripped;
    };
  }

  const consumerMenuPortal = consumerStyles.menuPortal;

  resolved.menuPortal = (base, props) => {
    const nextBase: CSSObjectWithLabel = {
      ...base,
      zIndex: MENU_PORTAL_Z_INDEX,
    };

    return consumerMenuPortal ? consumerMenuPortal(nextBase, props) : nextBase;
  };

  return resolved as StylesConfig<
    SelectOption,
    IsMulti,
    GroupBase<SelectOption>
  >;
}

/**
 * react-select 의 `ActionMeta` 를 우리 `SelectChangeMeta` 로 옮긴다.
 *
 * 경계에서 한 번 변환해 **공개 시그니처에서 라이브러리 타입을 지운다**
 * (`Select.types.ts` 의 `SelectChangeMeta` 주석 참조).
 *
 * `create-option` 은 `react-select/creatable` 전용이라 우리에게는 오지 않는다
 * (제외 범위). 그래도 타입이 그것을 알 수 없으므로 기본 갈래가 함께 받는다.
 */
export function toSelectChangeMeta(
  actionMeta: ActionMeta<SelectOption>,
): SelectChangeMeta {
  switch (actionMeta.action) {
    case "remove-value":
    case "pop-value":
      return {
        action: actionMeta.action,
        option: actionMeta.removedValue?.value,
      };

    case "clear":
      return {
        action: "clear",
        removedValues: actionMeta.removedValues.map((option) => option.value),
      };

    case "deselect-option":
      return { action: "deselect-option", option: actionMeta.option?.value };

    default:
      return { action: "select-option", option: actionMeta.option?.value };
  }
}
