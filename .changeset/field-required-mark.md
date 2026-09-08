---
"@nui-kit/react": minor
---

`Field` 에 필수 · 선택 표시가 생겼다. 그리고 선택 컨트롤 셋이 `children` 을 받으면 런타임에 죽던 것을 막았다.

**필수 · 선택 표시** — `required` 를 주면 라벨 오른쪽에 점이 붙고 컨트롤에 `aria-required` 가 간다.

```tsx
<Field required>
  <FieldLabel>휴대폰 번호</FieldLabel>
  <Textfield value={phone} onChange={onChange} />
</Field>

<Field optionalLabel="선택">
  <FieldLabel>회사</FieldLabel>
  <Textfield value={company} onChange={onChange} />
</Field>
```

| prop | 기본값 | 무엇 |
| --- | --- | --- |
| `required` | `false` | 6px 점 + 화면 낭독 전용 문구 + `aria-required` |
| `requiredLabel` | `"필수"` | 그 문구 |
| `optionalLabel` | **없음** | 주면 선택 문구를 그린다 |

`optionalLabel` 에 기본값이 없는 이유 — 한 화면에서 필드의 3분의 2 이상이 필수면 「선택」만 표시하고, 그렇지 않으면 필수 표시만 쓴다. 한 폼에서 둘을 섞지 않는다. 기본값이 있으면 그 판단이 소비자 손을 떠난다.

**`Checkbox` · `Radio` · `Switch` 가 `children` 을 받지 않는다.** 예전에는 타입이 통과하고 화면이 죽었다 — `<input>` 에 자식을 넣을 수 없기 때문이다. 라벨은 `FieldLabel` 로 붙인다.

```tsx
// 전 — 컴파일은 되고 렌더에서 터졌다
<Checkbox>이용약관에 동의합니다</Checkbox>

// 후
<FieldItem>
  <Checkbox />
  <FieldLabel>이용약관에 동의합니다</FieldLabel>
</FieldItem>
```
