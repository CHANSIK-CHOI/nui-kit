---
"@nui-kit/react": patch
---

필수 표시가 Select 에도 전해진다

`Field` 에 `required` 를 줘도 `Select` · `MultiSelect` 의 입력에만
`aria-required` 가 붙지 않았다. 스크린리더로 폼을 훑는 사람에게는 그 칸만
필수가 아닌 것으로 읽혔다 — 화면에는 필수 표시가 멀쩡히 보여서 드러나지 않던
종류다.

```tsx
<Field required>
  <Field.Label>요금제</Field.Label>
  <Select options={plans} value={plan} onChange={setPlan} />
</Field>
```

다른 컨트롤 여섯(`Textfield` · `Textarea` · `Checkbox` · `Radio` · `Switch` ·
`Datepicker` 계열)은 원래 동작하고 있었다.
