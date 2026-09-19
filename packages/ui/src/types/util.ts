/**
 * 유니온의 **각 갈래마다** `Omit` 한다.
 *
 * `CheckboxProps` 처럼 **갈래를 가진 props** 를 감쌀 때 쓴다. 기본 `Omit<A | B, K>` 는
 * 유니온을 하나로 접어 갈래가 사라진 객체를 만든다. 그러면 둘이 깨진다 —
 *
 * 1. 접힌 타입을 다시 그 컴포넌트에 넘길 수 없다. `shape` 이 `"square" | "ghost"` 가 되어
 *    어느 갈래에도 안 맞는다
 * 2. 갈래가 막고 있던 조합이 통과한다. `{ shape: "ghost", indeterminate: true }` 가 그렇다
 *
 * ```ts
 * // ❌ 감싼 타입을 <Checkbox> 에 넘기면 컴파일이 깨지고, 금지 조합이 새어 나간다
 * type MyProps = Omit<CheckboxProps, "className">;
 *
 * // ✅ 갈래가 살아 있다
 * type MyProps = DistributiveOmit<CheckboxProps, "className">;
 * ```
 *
 * 유니온이 아닌 타입에는 결과가 `Omit` 과 **동치**다 — 아무 데나 써도 손해가 없다.
 */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
