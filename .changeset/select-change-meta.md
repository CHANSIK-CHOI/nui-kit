---
"@nui-kit/react": minor
---

**⚠️ `Select`·`MultiSelect` 의 `onChange` 세 번째 인자가 우리 타입으로 바뀌었습니다.**

```tsx
// 전
onChange={(value, option, actionMeta) => {
  if (actionMeta.action === "remove-value") console.log(actionMeta.removedValue);
}}

// 후
onChange={(value, option, meta) => {
  if (meta.action === "remove-value") console.log(meta.option);
}}
```

`SelectChangeMeta` 는 이렇게 생겼습니다.

```ts
type SelectChangeMeta = {
  action: "select-option" | "deselect-option" | "remove-value" | "pop-value" | "clear";
  option?: SelectOptionValue;        // 방금 고르거나 지운 값
  removedValues?: SelectOptionValue[]; // clear 로 한꺼번에 지워진 값들
};
```

**왜 바꿨나** — 예전에는 react-select 의 `ActionMeta` 를 그대로 넘겼는데, 그 타입은
`react-select` 에서만 나오고 우리는 그것을 재수출하지 않습니다. `react-select` 은
dependency 라 pnpm 처럼 엄격한 설치에서는 **소비자의 `node_modules` 루트에 없어서
인자에 타입을 붙일 방법이 아예 없었습니다.** 라이브러리를 갈아끼우면 공개 시그니처가
통째로 깨지는 문제도 함께 사라집니다.

두 번째 인자도 `MultiValue<SelectOption>` → `readonly SelectOption[]`,
`SingleValue<SelectOption>` → `SelectOption | null` 로 우리 타입이 됐습니다.
값 자체는 같습니다.

**바뀌지 않는 것** — `isSearchable` 과 `isClearable` 의 기본값은 `false` 그대로입니다.
짧은 목록에 검색창은 방해이고, 전체 지우기는 되돌릴 수 없어 기본값이면 실수가 잦습니다.
