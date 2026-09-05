---
"@nui-kit/react": minor
---

`Textfield` · `Textarea` 의 `value` 타입을 실제로 쓰는 값으로 좁혔습니다.

**⚠️ BREAKING (타입만 — 런타임 동작은 그대로입니다)**

| 컴포넌트 | 전 | 후 |
| --- | --- | --- |
| `Textfield` | `string \| number \| readonly string[]` | **`string \| number`** |
| `Textarea` | `string \| number \| readonly string[]` | **`string`** |

`readonly string[]` 은 React 가 `<select multiple>` 때문에 넣은 갈래라 한 줄·여러 줄
입력에는 쓸 자리가 없습니다. 넘기면 React 가 `'' + value` 로 합쳐 **쉼표가 값에 섞이고**,
`Textarea` 의 글자 수 카운터도 그 쉼표를 함께 셉니다.

`Textarea` 에서 `number` 도 뺐습니다 — 여러 줄 텍스트에 숫자를 넣을 자리가 없습니다.
`Textfield` 는 `type="number"` 를 지원하므로 `number` 를 남깁니다.

배열이나 숫자를 넘기고 있었다면 호출부에서 문자열로 바꾸면 됩니다.

```tsx
<Textarea value={String(v)} onChange={onChange} />
```

**바뀌지 않는 것** — `Checkbox` · `Radio` · `Switch` 의 `defaultChecked` 는 그대로
받습니다. 체크형은 `checked` 를 네이티브 `input` 에 그대로 넘길 뿐 내부 상태를 두지
않아 값 소유권이 갈리지 않습니다. `<form>` 안에서 uncontrolled 로 쓰는 방식도 계속
지원합니다.
