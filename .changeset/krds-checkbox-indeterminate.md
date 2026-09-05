---
"@nui-kit/react": minor
---

`Checkbox` 에 중간 상태가 생겼습니다. 하위 항목이 일부만 선택된 "전체 선택" 체크박스에
쓰는 세 번째 상태로, 대시(−)로 그립니다. KRDS 가이드 539·545쪽 · 체크리스트 [체크박스 5]
기준입니다.

```tsx
<Checkbox
  checked={checked.length === options.length}
  indeterminate={checked.length > 0 && checked.length < options.length}
  onChange={toggleAll}
/>
```

- 스크린리더에는 `aria-checked="mixed"` 로 읽힙니다. 네이티브 `indeterminate`
  프로퍼티가 만들어 주는 값이라 따로 붙일 것이 없습니다
- 채움은 선택 상태와 같습니다. 에러면 빨강, 비활성이면 회색으로 대시가 나옵니다
- `checked` 와 `indeterminate` 가 둘 다 참이면 대시가 이깁니다 (네이티브와 같습니다)
- `CheckboxGroup` 이 대신 계산해 주지는 않습니다. 값은 소비자가 소유하고, 전체 선택
  체크박스는 그룹 밖에 두는 일도 많기 때문입니다

추가라 기존 코드에는 영향이 없습니다.
