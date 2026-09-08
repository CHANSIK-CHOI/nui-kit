"use client";

import { createContext, useContext } from "react";

export type FieldContextValue = {
  inputId: string | null;
  labelId: string | null;
  describedByIds: string[];
  isError: boolean;
  /** 필수 입력인가 — 라벨의 표시와 컨트롤의 `aria-required` 가 함께 읽는다 */
  isRequired: boolean;
  /** 필수 표시(점)의 스크린리더 문구 */
  requiredLabel: string;
  /**
   * 선택 항목임을 알리는 문구. **주지 않으면 아무것도 그리지 않는다.**
   *
   * 기본값을 두지 않는 이유 — 한 화면에서 필드의 2/3 이상이 필수면 「선택」만
   * 표시하고 그렇지 않으면 필수 표시만 쓴다. 둘을 섞지 않는다(SEED field.mdx ·
   * KRDS [입력폼 9] 화면 전체 일관). 기본값이 있으면 그 판단이 **소비자 손을
   * 떠난 채** 모든 선택 필드에 「선택」이 붙는다.
   */
  optionalLabel: string | null;
  registerDescription?: (id: string) => () => void;
  registerMessage?: (id: string) => () => void;
};

const FieldContext = createContext<FieldContextValue>({
  inputId: null,
  labelId: null,
  describedByIds: [],
  isError: false,
  isRequired: false,
  requiredLabel: "필수",
  optionalLabel: null,
});

export function useFieldContext() {
  return useContext(FieldContext);
}

/** aria-describedby 용 id 목록을 중복 제거해 공백 구분 문자열로 합친다. */
export function getMergedAriaIds(...ids: Array<string | null | undefined>) {
  const resolvedIds = Array.from(new Set(ids.filter(Boolean)));

  return resolvedIds.length > 0 ? resolvedIds.join(" ") : undefined;
}

export default FieldContext;
