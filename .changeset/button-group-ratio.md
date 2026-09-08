---
"@nui-kit/react": minor
---

취소 버튼을 주 행동보다 좁게 놓을 수 있다

`ButtonGroup` 에 `ratio` 를 더했다. 첫 항목이 취소 · 닫기 · 초기화처럼
**되돌리는 행동**일 때 `"3:7"` 을 주면 폭으로도 위계가 드러난다.

```tsx
<ButtonGroup ratio="3:7">
  <ButtonGroupItem>
    <Button variant="line">취소</Button>
  </ButtonGroupItem>
  <ButtonGroupItem>
    <Button color="primary">저장</Button>
  </ButtonGroupItem>
</ButtonGroup>
```

기본값은 `"equal"`(균등 분할)이라 지금 쓰던 코드는 그대로 동작한다.
임의 비율은 받지 않는다 — 권장되는 값이 3:7 하나뿐이라서다.
