---
"@nui-kit/react": patch
---

`Field.Grid` 안에서 칸끼리 라벨과 입력이 어긋나던 것을 고친다

설명(`description`)이 있는 칸과 없는 칸을 나란히 두면 라벨이 7px, 입력이 22px 어긋났다.
grid 가 자식을 행 높이로 늘리는데 `Field.Item` 이 줄바꿈 컨테이너라 남는 높이만큼 줄
사이가 벌어지고 있었다.

```tsx
<Field.Grid>
  <Field.Item>
    <Field.Label>이름</Field.Label>
    <Textfield … />
  </Field.Item>
  <Field.Item>
    <Field.Label>휴대폰</Field.Label>
    <Textfield … />
    <Field.Description>10-11자리</Field.Description>   {/* 이쪽만 설명이 있다 */}
  </Field.Item>
</Field.Grid>
```

이제 두 칸의 라벨과 입력이 같은 줄에 선다. 마크업은 그대로다.
