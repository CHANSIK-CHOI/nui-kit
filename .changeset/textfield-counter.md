---
"@nui-kit/react": minor
---

`Textfield` 에도 글자 수 카운터가 생겼다. `maxLength` 를 주면 메시지 줄 오른쪽에 붙는다.

```tsx
<Textfield
  value={nickname}
  onChange={onChange}
  maxLength={10}
  infoMessage="다른 사람에게 보이는 이름이에요."
/>
// 왼쪽 안내, 오른쪽 6 / 10 — 한 줄이다
```

`Textarea` 와 규칙이 같다 — 제한이 있을 때만 나오고, 현재 수는 진하게 최대 수는 연하게, 넘치면 둘 다 빨개진다. 문구는 `counterLabel` 로 바꾼다.
