"use client";

import { createContext } from "react";

/**
 * Select 래퍼가 react-select 내부 컴포넌트에 내려보내는 aria 값.
 *
 * 왜 Context 인가 — react-select 은 input 의 `aria-describedby` 를 자체 계산해
 * 덮어쓰고 props 를 읽지 않는다. 그래서 `ValueContainer` 를 감싸 자식 aria 를
 * 보정하는데, **그 값을 클로저로 넘기면 값이 바뀔 때마다 컴포넌트 함수 identity 가
 * 바뀌어 input 이 remount 된다** (포커스·검색어 소실).
 * 컴포넌트 identity 는 고정해 두고 값만 Context 로 흘려보낸다.
 */
export type SelectAriaContextValue = {
  /** 컨트롤에 연결할 설명·에러 메시지 id 들 (공백 구분) */
  describedBy?: string;
  /** 값 변경이 불가능한 상태인지 */
  readOnly: boolean;
  /**
   * MultiSelect 칩의 삭제 버튼 접근 이름을 만든다 (KRDS 가이드 566쪽 02).
   *
   * 문자열이 아니라 함수인 이유는 라벨을 끼워 넣는 자리가 언어마다 다르기 때문이다.
   * `selectProps` 에 얹지 않는 이유는 위 주석과 같다 — 값이 바뀔 때마다 컴포넌트
   * identity 가 흔들려 input 이 remount 된다.
   */
  getRemoveButtonLabel: (optionLabel: string) => string;
};

export const DEFAULT_REMOVE_BUTTON_LABEL = (optionLabel: string) =>
  `${optionLabel} 옵션 삭제`;

export const SelectAriaContext = createContext<SelectAriaContextValue>({
  describedBy: undefined,
  readOnly: false,
  getRemoveButtonLabel: DEFAULT_REMOVE_BUTTON_LABEL,
});

export default SelectAriaContext;
