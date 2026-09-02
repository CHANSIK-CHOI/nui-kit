/**
 * 가이드 페이지를 짜는 틀.
 *
 * 페이지마다 손으로 쓰던 것을 여기로 모았다. 케이스 커버리지가 페이지마다
 * 달라지던 문제를 구조로 막는다 — 상태는 `StateCases`, 두 축의 조합은
 * `CaseMatrix` 가 목록에서 전개한다.
 */
export { GuideHeader } from "./GuideHeader";
export { Case, CaseGrid, CaseMatrix } from "./CaseGrid";
export {
  StateCases,
  InputStateCases,
  INPUT_STATES,
  CHOICE_STATES,
} from "./StateCases";
export type { InputStateKey, ChoiceStateKey } from "./StateCases";
export { Example } from "./Example";
export { PropsTable } from "./PropsTable";
export { HookTable, HOOK_COUNT } from "./HookTable";
export { CodeBlock, Code } from "./CodeBlock";
