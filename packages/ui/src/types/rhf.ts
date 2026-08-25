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

/** 값형 입력에서 RHF 가 소유하는 prop 들 */
export type RHFValueInputManagedProps =
  "name" | "value" | "defaultValue" | "onBlur" | "onChange";
