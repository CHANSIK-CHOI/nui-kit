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
 *   controlled 전용 계약이다 (components.md §5 — uncontrolled 진입 차단).
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
  /**
   * 메뉴를 `body` 로 내보내 **잘리는 조상을 탈출한다.**
   *
   * 기본 배치는 제자리(`absolute`)라 조상에 `overflow: hidden` 이 있으면 메뉴가
   * 잘려 값을 고를 수 없다. 카드·팝업 안에 넣을 때 켠다.
   * `Tooltip` 의 같은 이름 prop 과 한 규칙이다.
   *
   * ⚠️ 소비자가 `menuPortalTarget` 을 직접 주면 그쪽이 이긴다.
   */
  hasPortal?: boolean;
  components?: SelectComponentsConfig<
    SelectOption,
    IsMulti,
    GroupBase<SelectOption>
  >;
  styles?: StylesConfig<SelectOption, IsMulti, GroupBase<SelectOption>>;
};

/**
 * 값이 바뀐 **까닭**. `onChange` 의 마지막 인자다.
 *
 * ⚠️ react-select 의 `ActionMeta` 를 그대로 노출하지 않고 우리 타입으로 감싼다.
 *    그 타입은 `react-select` 에서만 나오는데 우리는 그것을 재수출하지 않으므로
 *    (dependency 라 pnpm 같은 엄격한 설치에서는 소비자 `node_modules` 루트에 없다)
 *    **소비자가 인자에 타입을 붙일 방법이 없었다.** 라이브러리를 갈아끼우면 공개
 *    시그니처가 통째로 깨지는 문제도 함께 사라진다 — Select 의 계약은 원시값 API 로
 *    라이브러리를 **감추는** 것이다(`Datepicker` 는 반대로 드러내는 것이 계약이라
 *    `dayPickerProps` 와 함께 타입을 재수출한다).
 */
export type SelectChangeAction =
  | "select-option"
  | "deselect-option"
  | "remove-value"
  | "pop-value"
  | "clear";

export type SelectChangeMeta = {
  /** 무엇을 해서 값이 바뀌었나 */
  action: SelectChangeAction;
  /** 방금 고르거나 지운 값 하나. `clear` 에는 없다 */
  option?: SelectOptionValue;
  /** `clear` 로 한꺼번에 지워진 값들 */
  removedValues?: SelectOptionValue[];
};
