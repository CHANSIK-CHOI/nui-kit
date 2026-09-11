"use client";

import { createContext, useContext } from "react";

/**
 * Field 안의 메시지 컨트롤이 Footer 로 올리는 것 (spec §6 「Footer 승계」).
 *
 * `id` 는 등록 주체(컨트롤)의 resolved id — 해제·교체의 키이지 DOM id 가 아니다.
 * `isError` 는 **자기 것만** 넣는다 — Context 에서 받은 `isError` 를 합쳐 올리면
 * Field 가 prop 을 거둬도 참이 남아 에러가 풀리지 않는다(래치 · spec §5).
 */
export type FieldFooterEntry = {
  id: string;
  infoMessage?: string;
  errorMessage?: string;
  isError?: boolean;
  count?: number;
  maxCount?: number;
  counterLabel?: string;
};

export type FieldContextValue = {
  inputId: string | null;
  labelId: string | null;
  /** 이 범위 Footer `Message` 의 DOM id — 내용이 있을 때만 붙는다. `Select` 가 `aria-errormessage` 로 가리킨다 */
  footerId: string | null;
  describedByIds: string[];
  isError: boolean;
  /** 필수 입력인가 — 부모에서 물려받은 것까지 합친 값. 컨트롤의 `aria-required` 가 읽는다 */
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
  registerMessage?: (id: string) => () => void;
  /**
   * Field 안의 메시지 컨트롤이 자기 메시지 줄을 접고 여기로 올린다. 기본 Context 에는
   * 없다 — 컨트롤은 이 함수의 존재로 「Field 안」을 안다. 반환 함수가 해제다.
   */
  registerFooter?: (entry: FieldFooterEntry) => () => void;
};

const FieldContext = createContext<FieldContextValue>({
  inputId: null,
  labelId: null,
  footerId: null,
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
