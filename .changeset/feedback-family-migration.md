---
"@chansikchoi/next-ui": minor
---

Feedback 계열을 추가했습니다.

**Toast** — 잠깐 나타났다 사라지는 알림
- `useToast()` 로 띄웁니다. 앱을 `ToastHost` 로 감싸야 합니다
- `tone="error"` 는 `role="alert"` + `aria-live="assertive"`,
  기본은 `role="status"` + `aria-live="polite"` 입니다
- 스택으로 쌓이며 `close()` / `closeAll()` 로 닫습니다
- `duration` 이 0 이하면 자동으로 닫히지 않습니다

**Tooltip** — hover·포커스 시 짧은 설명
- placement 6종 (top/bottom × left/center/right)
- 열려 있는 동안 트리거에 `aria-describedby` 가 연결됩니다
- `open` prop 으로 제어 모드 사용 가능

**새 서브패스** `/toast` `/tooltip` · **새 온디맨드 CSS** `styles/toast.css` `styles/tooltip.css`

**동작 수정 (원본 대비)**
- `ToastHost` 가 portal 컨테이너(`#nui-toast-root`)를 **없으면 직접 생성**합니다.
  원본은 컨테이너가 없으면 아무것도 렌더하지 않고 조용히 실패했습니다.
- 전역 클래스 `toastPortal` / `toastStack` → `nui-toast-portal` / `nui-toast-stack`
- Tooltip placement 클래스가 kebab 으로 바뀌었습니다 (`--topCenter` → `--top-center`).
  prop 값(`placement="topCenter"`)은 그대로입니다.
