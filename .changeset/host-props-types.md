---
"@nui-kit/react": minor
---

`PopupHostProps` 와 `ToastHostProps` 를 공개 타입으로 내보냅니다. `@nui-kit/react` 와 `@nui-kit/react/popup`, `@nui-kit/react/toast` 에서 가져옵니다. 다른 컴포넌트처럼 `<이름>Props` 로 Host 를 감싸는 컴포넌트의 props 를 적을 수 있습니다. 두 타입은 각각 `ComponentProps<typeof PopupHost>`, `ComponentProps<typeof ToastHost>` 와 같고(`children` 하나), 화면과 동작은 바뀌지 않습니다.
