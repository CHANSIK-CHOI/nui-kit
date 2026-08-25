# 컴포넌트 작성 규칙

## 1. 모든 컴포넌트 파일은 `"use client"` 로 시작한다

App Router 전용 라이브러리다. tsup 이 배너로도 주입하지만 **소스에도 명시**한다
(에디터·타입 도구가 경계를 인식하고, 배너 설정이 바뀌어도 안전하다).

## 2. 합성 컴포넌트(dot notation)는 named export 를 반드시 동반한다 ★

Server Component 가 `"use client"` 모듈을 import 하면 React 는 client reference
프록시로 치환한다. **프록시에서 정적 프로퍼티는 `undefined` 로 읽힌다.**

```tsx
// Server Component 에서 이렇게 쓰면 런타임 에러:
//   Error: Element type is invalid ... but got: undefined
<Field.Label>이름</Field.Label>
```

타입 검사도 빌드도 통과하고 **렌더 시점에만 터진다.** 그래서 규칙으로 못박는다.

```tsx
// Field.tsx — 서브 컴포넌트를 export 함수로 선언
export function FieldLabel(...) { ... }

// index.ts — dot API 와 named export 를 모두 노출
export { default as Field } from "./Field.js";
export { FieldItem, FieldGrid, FieldLabel, ... } from "./Field.js";
```

새 합성 컴포넌트를 만들 때마다 같은 쌍을 제공하고 README 표에 추가한다.

## 3. 클래스명은 반드시 `px()` 헬퍼로 만든다

```tsx
import { px } from "../../internal/prefix.js";

const block = px("textfield");        // "nui-textfield"
<div className={`${block}__wrap`} />
<div className={cn({ [px("is-error")]: isError })} />
```

문자열 리터럴로 `"nui-textfield"` 를 직접 쓰지 않는다 — 프리픽스 단일 출처를 깨뜨린다.
CSS 변수는 `pv()` 를 쓴다: `pv("field-grid-columns")` → `--nui-field-grid-columns`.

## 4. 내부 상대 import 는 `.js` 확장자를 붙인다

```tsx
import Message from "./Message.js";        // ✅
import Message from "./Message";           // ❌ .d.ts 의 ESM 해석 실패
```

ESM 배포라 확장자 없는 상대 경로는 선언 파일에서 해석되지 않는다.
`npm run verify:pkg` 의 attw 가 `Internal resolution error` 로 잡는다.

## 5. controlled 컴포넌트와 RHF 래퍼의 값 소유권을 섞지 않는다

- 기본 컴포넌트는 **controlled** — `value` + `onChange` 를 소비자가 소유한다.
  `defaultValue` 는 타입에서 `Omit` 한다 (uncontrolled 진입 차단).
- RHF 래퍼는 `useController` 로 값을 소유하고, 기본 컴포넌트가 관리하는 prop
  (`name` `value` `defaultValue` `onBlur` `onChange`)을 `Omit` 해서 중복 소유를 막는다.
  → `types/rhf.ts` 의 `RHFValueInputManagedProps` / `RHFCheckedInputManagedProps` 사용.
- RHF 래퍼 파일은 컴포넌트 폴더에 두되, **export 는 `rhf.ts` 로만** 한다.
  배럴(`index.ts`)에 넣으면 RHF 를 안 쓰는 소비자 번들에 react-hook-form 이 섞인다.

## 6. Field 연동은 Context 를 통한다

폼 컨트롤은 `useFieldContext()` 로 `inputId` / `describedByIds` / `isError` 를 받아
자기 id 보다 우선 적용한다. `getMergedAriaIds()` 로 `aria-describedby` 를 합친다.
직접 id 를 만들어 쓰는 건 Field 밖에서 단독으로 쓰일 때의 fallback 이다.

## 7. props 는 원본 API 를 함부로 바꾸지 않는다

이식 작업에서는 **원본 컴포넌트의 prop 이름·기본값·동작을 유지**한다.
바꿔야 한다면 이유를 spec 에 적고 changeset 에 breaking 으로 남긴다.

## 8. 새 외부 라이브러리는 먼저 분류부터 한다

`packaging.md` 의 dependencies / peerDependencies 판정 기준을 따른다.
소비자와 인스턴스를 공유해야 하면 peer, 아니면 dependency 다.
