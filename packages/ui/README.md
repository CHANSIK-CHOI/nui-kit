# @chansikchoi/next-ui

Next.js **App Router 전용** React UI 컴포넌트 라이브러리.
모든 컴포넌트는 클라이언트 컴포넌트(`"use client"`)로 배포된다.

> 🚧 개발 중 (v0.0.0). 아직 npm 에 배포되지 않았습니다.

## 설치

```bash
npm install @chansikchoi/next-ui
```

`react` / `react-dom` 외에 **추가로 설치할 것은 없습니다.**
`react-hook-form` 은 RHF 래퍼(`/rhf`)를 사용할 때만 필요합니다.

```jsonc
"peerDependencies": {
  "react": "^18 || ^19",
  "react-dom": "^18 || ^19",
  "react-hook-form": ">=7.50.0"   // optional — /rhf 사용 시에만
}
```

## 스타일 불러오기

### 전체

```ts
import "@chansikchoi/next-ui/styles/index.css";
```

### 온디맨드

```ts
import "@chansikchoi/next-ui/styles/tokens.css"; // 1회 필수
import "@chansikchoi/next-ui/styles/button.css";
```

### reset (선택)

기본 배포 CSS 에는 reset 이 **포함되어 있지 않습니다.** 필요할 때만 명시적으로:

```ts
import "@chansikchoi/next-ui/styles/preflight.css";
```

## 소비자 프로젝트에 영향을 주지 않는 이유

| 장치 | 내용 |
| --- | --- |
| 네임스페이스 | 모든 클래스가 `nui-` 프리픽스 (`.nui-button`) |
| Cascade Layers | 모든 CSS 가 `@layer nui.*` 안에 있어, 여러분의 unlayered CSS 가 **항상 우선** |
| reset 분리 | 전역 태그 셀렉터는 opt-in `preflight.css` 에만 존재 |
| 서드파티 격리 | 내부 사용 라이브러리 스타일도 `.nui-*` 스코프 안에서만 오버라이드 |

## 커스터마이징

CSS 변수 2계층 구조. `!important` 없이 덮어쓸 수 있습니다.

```css
/* 전체 테마 교체 — seed 토큰 */
:root {
  --nui-color-primary-500: #ff6b00;
  --nui-radius-md: 4px;
}

/* 특정 컴포넌트만 — 컴포넌트 토큰 */
:root {
  --nui-button-bg: #111;
  --nui-button-radius: 0;
}

/* 부분 테마 — 상속으로 하위에만 적용 */
.dark-section {
  --nui-color-surface: #111;
  --nui-color-text: #fff;
}
```

## 사용

```tsx
// 배럴
import { Button } from "@chansikchoi/next-ui";

// react-hook-form 래퍼
import { RHFTextfield } from "@chansikchoi/next-ui/rhf";
```

## 라이선스

MIT
