import type { ReactNode } from "react";
import { Case, CaseGrid } from "./CaseGrid";

/**
 * 상태 케이스를 매트릭스대로 깐다.
 *
 * **왜 컴포넌트로 뽑았나** — 상태 목록을 페이지마다 손으로 쓰다 보니 커버리지가
 * 들쭉날쭉했다. 실측하니 `search` 는 데모가 하나뿐이라 `disabled`·`readOnly`·
 * `isError` 를 하나도 보여주지 않았고, `textarea` 는 `readOnly` 가 빠져 있었다.
 * 여기에 부류만 넘기면 `design-system.md §2` 가 정한 상태가 빠짐없이 깔린다.
 *
 * `hover`·`focus` 는 넣지 않는다. 정지 화면으로 재현할 수 없고, 억지로
 * 흉내 내면 실제 동작과 어긋난 것을 보여주게 된다.
 */

/** 입력 컨트롤 — 값을 타이핑하거나 목록에서 고르는 것 */
export const INPUT_STATES = [
  { key: "default", label: "기본", note: undefined as string | undefined },
  { key: "error", label: "isError", note: "테두리·글자·메시지" },
  { key: "disabled", label: "disabled", note: "조건이 맞으면 다시 쓸 수 있다" },
  { key: "readOnly", label: "readOnly", note: "값은 보여주되 바꿀 수 없다" },
] as const;

/** 선택 컨트롤 — 켜고 끄는 것. checked 축이 하나 더 있다 */
export const CHOICE_STATES = [
  { key: "default", label: "기본", note: undefined as string | undefined },
  { key: "checked", label: "checked", note: undefined },
  { key: "error", label: "isError", note: undefined },
  { key: "checkedError", label: "checked + isError", note: "함께 그린다" },
  { key: "disabled", label: "disabled", note: undefined },
  { key: "checkedDisabled", label: "checked + disabled", note: "함께 그린다" },
  { key: "readOnly", label: "readOnly", note: undefined },
] as const;

export type InputStateKey = (typeof INPUT_STATES)[number]["key"];
export type ChoiceStateKey = (typeof CHOICE_STATES)[number]["key"];

export function StateCases<K extends string>({
  states,
  render,
  columns,
  caption,
}: {
  states: readonly { key: K; label: string; note?: string }[];
  render: (key: K) => ReactNode;
  columns?: number;
  caption?: string;
}) {
  return (
    <CaseGrid columns={columns} caption={caption}>
      {states.map((s) => (
        <Case key={s.key} label={s.label} note={s.note}>
          {render(s.key)}
        </Case>
      ))}
    </CaseGrid>
  );
}

/**
 * 선택 컨트롤용 단축 — `checked` 축이 겹치는 조합까지 전개한다.
 *
 * `design-system.md §3-2` 가 "함께 그린다"로 정한 `checked + isError` 와
 * `checked + disabled` 가 페이지마다 빠져 있었다.
 *
 * ⚠️ `checked` 대신 `defaultChecked` 를 넘긴다. `checked` 를 주면서 `onChange`
 *    도 `readOnly` 도 없으면 React 가 controlled 경고를 낸다. `checked + readOnly`
 *    로 고정할 수도 있지만, 그러면 모든 칸이 readOnly 가 되어 readOnly 케이스와
 *    구분이 사라진다. uncontrolled 라 눌러볼 수도 있다.
 */
export function ChoiceStateCases({
  render,
  columns = 4,
  caption,
  code,
}: {
  /**
   * 두 번째 인자로 케이스 키를 받는다. Radio 처럼 케이스마다 고유한 `name` 이
   * 필요할 때 쓴다 — 같은 `name` 이면 브라우저가 하나만 선택되게 만든다.
   */
  render: (
    props: {
      defaultChecked?: boolean;
      isError?: boolean;
      disabled?: boolean;
      readOnly?: boolean;
    },
    key: ChoiceStateKey,
  ) => ReactNode;
  columns?: number;
  caption?: string;
  code?: string;
}) {
  const propsOf = (key: ChoiceStateKey) =>
    ({
      default: {},
      checked: { defaultChecked: true },
      error: { isError: true },
      checkedError: { defaultChecked: true, isError: true },
      disabled: { disabled: true },
      checkedDisabled: { defaultChecked: true, disabled: true },
      readOnly: { readOnly: true },
    })[key];

  return (
    <CaseGrid columns={columns} caption={caption} code={code}>
      {CHOICE_STATES.map((s) => (
        <Case key={s.key} label={s.label} note={s.note}>
          {render(propsOf(s.key), s.key)}
        </Case>
      ))}
    </CaseGrid>
  );
}

/** 입력 컨트롤용 단축 — 상태 키를 prop 으로 바꿔 넘긴다 */
export function InputStateCases({
  render,
  columns = 2,
  caption,
  code,
}: {
  render: (props: {
    isError?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
  }) => ReactNode;
  columns?: number;
  caption?: string;
  code?: string;
}) {
  const propsOf = (key: InputStateKey) =>
    key === "error"
      ? { isError: true }
      : key === "disabled"
        ? { disabled: true }
        : key === "readOnly"
          ? { readOnly: true }
          : {};

  return (
    <CaseGrid columns={columns} caption={caption} code={code}>
      {INPUT_STATES.map((s) => (
        <Case key={s.key} label={s.label} note={s.note}>
          {render(propsOf(s.key))}
        </Case>
      ))}
    </CaseGrid>
  );
}
