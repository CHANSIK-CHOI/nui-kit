import type {
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

export type RHFComponentProps<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
  TComponentProps,
  TManagedProps extends PropertyKey = never,
> = Omit<TComponentProps, TManagedProps> &
  UseControllerProps<TFormValues, TFieldName>;

/** 체크형 입력에서 RHF 가 소유하는 prop 들 */
export type RHFCheckedInputManagedProps =
  | "checked"
  | "defaultChecked"
  | "defaultValue"
  | "name"
  | "onBlur"
  | "onChange";

/**
 * 날짜 입력에서 RHF 가 소유하는 prop 들.
 * 값 API 가 `value/onChange` 가 아니라 `selected/onSelectedChange` 라 별도로 둔다.
 *
 * ⚠️ 변경 콜백(`onSelectedChange`)도 함께 막는다 — `RHFValueInputManagedProps` 가
 *    `onChange` 를 막는 것과 같은 정책이다. 래퍼마다 "변경 콜백을 붙일 수 있는가" 의
 *    답이 다르면 소비자가 혼란스럽다.
 *    나중에 pass-through 를 허용하기로 하면 **양쪽을 함께** 열면 된다
 *    (막았다 여는 것은 breaking 이 아니다. 반대는 breaking 이다).
 */
export type RHFSelectedInputManagedProps =
  "name" | "selected" | "onBlur" | "onSelectedChange";

/** 값형 입력에서 RHF 가 소유하는 prop 들 */
export type RHFValueInputManagedProps =
  "name" | "value" | "defaultValue" | "onBlur" | "onChange";
