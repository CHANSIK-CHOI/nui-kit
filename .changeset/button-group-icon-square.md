---
"@nui-kit/react": patch
---

버튼 묶음 안의 아이콘 버튼이 정사각으로 남는다

`ButtonGroup` 안에 `IconButton` 을 넣으면 가로가 눌려 22×48 로 그려졌다.
묶음이 자식 버튼을 전부 칸 너비로 늘리면서 아이콘 버튼의 정사각 치수까지
덮었기 때문이다. 액션이 셋일 때 하나를 아이콘 버튼으로 접는 것은 권장하는
사용법이라 실제로 부딪히는 자리였다.

```tsx
<ButtonGroup>
  <ButtonGroup.Item shouldAutoWidth>
    <IconButton aria-label="삭제"><DelIcon /></IconButton>
  </ButtonGroup.Item>
  …
</ButtonGroup>
```

일반 버튼이 칸을 채우는 동작은 그대로다.
