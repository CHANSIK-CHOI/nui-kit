import type {
  GroupBase,
  OptionsOrGroups,
  Props as ReactSelectProps,
  SelectComponentsConfig,
  StylesConfig,
} from "react-select";

export type SelectOptionValue = string | number;

export type SelectOption = {
  label: string;
  value: SelectOptionValue;
  isDisabled?: boolean;
  [key: string]: unknown;
};

export type SingleSelectValue = SelectOptionValue | null;
export type MultiSelectValue = SelectOptionValue[];

/**
 * Select / MultiSelect 가 공유하는 prop.
 *
 * react-select 의 prop 중 우리가 소유하는 것들은 `Omit` 으로 걷어낸다.
 * - `className` / `classNamePrefix` / `unstyled` — 스타일 계약(`_select.scss`)이 소유한다
 * - `isDisabled` / `value` / `onChange` — 우리 API(`disabled` / 원시값)로 다시 노출한다
 * - `id` / `inputId` — Field Context 와의 id 연결을 우리가 해석한다
 *
 * 아래 셋은 **타입은 통과하는데 동작만 조용히 없거나 어긋나서** 걷어낸다.
 * - `defaultValue` — 우리는 항상 `value` 를 넘기므로 react-select 이 무시한다.
 *   controlled 전용 계약이다 (rules/components.md §5 — uncontrolled 진입 차단).
 * - `getOptionValue` — 바꿔도 `getResolvedSingleValue`/`getResolvedMultiValue` 는
 *   여전히 `option.value` 로 매칭해, 선택은 되는데 화면에서 사라진다.
 *   `SelectOption` 이 `value` 를 필수로 못박은 이상 교체 대상이 아니다.
 * - `theme` — `unstyled` 라 기본 스타일이 없고, 유일하게 남던 `controlHeight`
 *   기반 `minHeight` 마저 `CSS_OWNED_PROPERTIES` 가 걷어내므로 효과가 없다.
 *
 * `getOptionLabel` 은 표시 문자열만 바꾸므로 그대로 통과시킨다.
 * `defaultInputValue` / `defaultMenuIsOpen` 도 실제로 동작하므로 남긴다.
 */
export type SelectSharedProps<IsMulti extends boolean> = Omit<
  ReactSelectProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
  | "className"
  | "classNamePrefix"
  | "components"
  | "defaultValue"
  | "getOptionValue"
  | "id"
  | "inputId"
  | "isDisabled"
  | "name"
  | "onChange"
  | "options"
  | "placeholder"
  | "styles"
  | "theme"
  | "unstyled"
  | "value"
> & {
  id?: string;
  className?: string;
  name?: string;
  "aria-describedby"?: string;
  options: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  isError?: boolean;
  infoMessage?: string;
  errorMessage?: string;
  components?: SelectComponentsConfig<
    SelectOption,
    IsMulti,
    GroupBase<SelectOption>
  >;
  styles?: StylesConfig<SelectOption, IsMulti, GroupBase<SelectOption>>;
};
