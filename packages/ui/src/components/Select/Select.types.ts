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
 * 컨트롤 높이 단계. `small` 은 없다 — SEED `text-input` 도 두 단계이고, 입력 컨트롤은
 * 컨트롤 전체가 누르는 타겟이라 KRDS 권장 44 아래로 내리지 않는다 (Select.md §4).
 */
export type SelectSize = "large" | "medium";

/**
 * 메뉴의 **배치 기준.** 안 주면 `hasPortal` 이 정한다 — 켜면 `fixed`, 끄면 `absolute`.
 *
 * `absolute` · `fixed` 는 react-select 의 값 그대로이고 **`static` 만 우리 확장**이다
 * (components.md §9-1 — 이름은 라이브러리 것을 쓰고 값만 넓힌다).
 *
 * - `absolute` (기본) — 컨트롤 아래 **제자리.** 스크롤을 CSS 가 따라간다. 잘리는 조상
 *   안에서는 잘린다 — 그때는 `hasPortal`
 * - `fixed` (`hasPortal` 의 기본) — **뷰포트를 기준으로** 자리를 잡아 아래가 모자라면
 *   높이를 줄이거나 위로 뒤집는다. 조상 스크롤은 react-select 의 `autoUpdate` 가 따라간다
 * - `static` — 문서 흐름 안이라 아래 콘텐츠를 밀어낸다. portal 은 언제나 해제된다
 */
export type SelectMenuPosition = "absolute" | "fixed" | "static";

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
  | "menuPosition"
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
  /**
   * 컨트롤의 한 줄 높이. 기본 `medium`(48) · `large`(56). Button · Textfield 의 같은
   * 이름과 같은 값이라 `size` 를 안 적어도 나란히 놓인 것과 높이가 맞는다. 메뉴 · 옵션은
   * 이 값과 무관하고, 다중은 칩이 줄을 넘으면 이 값보다 커진다 (Select.md §4 · §9).
   * react-select 에 넘기지 않는다.
   */
  size?: SelectSize;
  isError?: boolean;
  infoMessage?: string;
  errorMessage?: string;
  /**
   * 메뉴를 `body` 로 내보내 **잘리는 조상을 탈출한다.** 기본 `false` — 컨트롤 아래 제자리에 뜬다.
   * 카드 · 팝업처럼 `overflow` 로 잘리는 곳 안에 넣을 때 켠다. `Tooltip` · `Datepicker` 와
   * 같은 이름 · 같은 기본값이다 (components.md §9).
   *
   * 켜면 `menuPosition` 기본이 `"fixed"` 가 된다. `menuPortalTarget` 을 `undefined` 가 아닌
   * 값으로 주면(`null` 포함) 그 값이 이기고 이 prop 은 무시된다 (Select.md §6-7).
   */
  hasPortal?: boolean;
  /**
   * 메뉴의 배치 기준. 안 주면 `hasPortal` 이 정한다 — 켜면 `"fixed"`, 끄면 `"absolute"`.
   *
   * `"static"` 이면 문서 흐름에 들어가 아래 콘텐츠를 밀어내고, portal 도 해제된다.
   * 그 값은 react-select 에 넘기지 않는다 — 공식 값이 아니다 (Select.md §6-7).
   */
  menuPosition?: SelectMenuPosition;
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
  "select-option" | "deselect-option" | "remove-value" | "pop-value" | "clear";

export type SelectChangeMeta = {
  /** 무엇을 해서 값이 바뀌었나 */
  action: SelectChangeAction;
  /** 방금 고르거나 지운 값 하나. `clear` 에는 없다 */
  option?: SelectOptionValue;
  /** `clear` 로 한꺼번에 지워진 값들 */
  removedValues?: SelectOptionValue[];
};
