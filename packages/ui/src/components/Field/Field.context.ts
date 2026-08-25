"use client";

import { createContext, useContext } from "react";

export type FieldContextValue = {
  inputId: string | null;
  labelId: string | null;
  describedByIds: string[];
  isError: boolean;
  registerDescription?: (id: string) => () => void;
  registerMessage?: (id: string) => () => void;
};

const FieldContext = createContext<FieldContextValue>({
  inputId: null,
  labelId: null,
  describedByIds: [],
  isError: false,
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
