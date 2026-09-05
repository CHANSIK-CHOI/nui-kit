# @nui-kit/react

## 0.1.1

### Patch Changes

- README 의 잘못된 안내를 고쳤습니다.
  
  **배포된 패키지가 "아직 배포되지 않았다"고 적고 있었습니다.** 0.1.0 의 README 첫
  문단에 `🚧 개발 중 (v0.0.0). 아직 npm 에 배포되지 않았습니다` 배너가 그대로
  남아 있었습니다. tarball 은 publish 시점에 고정되므로 새 버전으로만 고칠 수
  있습니다.
  
  - CSS 변수 계층을 **2계층 → 3계층**으로 정정했습니다.
    실제 구조는 Primitive → Semantic → Component(공개 훅)입니다
  - `DateMultiplePicker` 설명을 다시 썼습니다 — "아직 읽기 전용" 이 아니라
    **달력으로만 고른다**는 설계입니다. 여러 날짜를 한 칸에 쳐 넣는 구분자 규칙을
    두지 않았습니다
  
  코드 동작은 바뀌지 않았습니다. 주석의 출처 표기만 함께 정리했습니다.

## 0.1.0

**첫 공개 버전입니다.** Next.js App Router 전용 React 컴포넌트 라이브러리입니다.

이 버전 이전의 개발 과정은 저장소의 커밋 히스토리에 있습니다. 아래는 지금 이
버전에 무엇이 들어 있는지입니다.

### 들어 있는 것

컴포넌트 **40종**을 14개 계열로 제공합니다.

| 계열 | 컴포넌트 |
| --- | --- |
| 액션 | `Button` · `IconButton` · `ButtonGroup` · `ButtonLink` |
| 폼 골격 | `Field` (+ `Label` · `Description` · `Message` · `Item` · `Grid`) |
| 텍스트 입력 | `Textfield` · `Textarea` · `Search` · `Password` |
| 선택 컨트롤 | `Checkbox` · `Radio` · `Switch` (+ 각 `Group`) |
| 목록 선택 | `Select` · `MultiSelect` |
| 날짜 | `Datepicker` · `DateRangePicker` · `DateMultiplePicker` |
| 팝업 | `Alert` · `Confirm` · `LayerPopup` · `BottomSheet` · `FullPopup` · `PopupHost` |
| 피드백 | `Toast` · `ToastHost` · `Tooltip` |
| 디스클로저 | `Accordion` |
| 아이콘 | `Icon` + 어댑터 7종 |

**react-hook-form 래퍼 13종**을 `/rhf` 서브패스로 함께 제공합니다 —
`RHFTextfield` · `RHFTextarea` · `RHFSearch` · `RHFPassword` · `RHFCheckbox` ·
`RHFRadio` · `RHFSwitch` · `RHFSelect` · `RHFMultiSelect` · `RHFDatepicker` ·
`RHFDateRangePicker` · `RHFDateMultiplePicker`.

### 설치

```bash
npm i @nui-kit/react
```

```tsx
import { Button, Field, Textfield } from "@nui-kit/react";
import "@nui-kit/react/styles/index.css";
```

`next` 는 **required peer** 입니다 — App Router 전용이고 배럴에 `next/link` 를
쓰는 `ButtonLink` 가 포함되어 있습니다. `react-hook-form` 은 **선택적 peer** 라
`/rhf` 서브패스를 쓸 때만 필요합니다.

### 설계 계약

- **소비자 스타일을 오염시키지 않습니다.** 모든 클래스는 `nui-` 프리픽스, 모든 CSS 는
  `@layer nui.*` 안에 있습니다. 레이어 밖 선언이 항상 이기므로 `!important` 없이
  덮어쓸 수 있습니다. reset 은 배포하지 않습니다 — `preflight.css` 를 원할 때만
  가져다 씁니다
- **ESM 단일 포맷**입니다. 듀얼 패키지 해저드(React 인스턴스 이중화)를 차단합니다
- **모든 컴포넌트가 클라이언트 컴포넌트**(`"use client"`)입니다. 합성 컴포넌트는
  dot notation 과 named export 를 함께 제공합니다 — Server Component 에서
  `<Field.Label>` 이 `undefined` 가 되는 문제를 피하려면 named export 를 쓰세요
- **서브패스 14개**로 필요한 것만 가져올 수 있습니다 (`@nui-kit/react/button` 등).
  CSS 도 컴포넌트별로 나뉘어 있고 서브패스 이름과 1:1로 맞습니다
- **값형 입력은 controlled 전용**입니다 (`value` + `onChange`). 체크형
  (`Checkbox`·`Radio`·`Switch`)은 `defaultChecked` 를 받습니다

### 커스터마이징

CSS 변수 **283개**를 3계층(Primitive → Semantic → Component)으로 두고, 그중
**공개 훅 40개**를 11개 컴포넌트에서 열어 둡니다. 치수·간격·둥글기·선 두께가
그 대상입니다.

```css
:root {
  --nui-button--radius: 20px;
  --nui-button--lg-height: 60px;
}
```

**색은 훅으로 열지 않습니다.** 배경과 글자는 짝이라 한쪽만 바꾸면 대비가 조용히
깨지는데, 그 사실이 화면에 드러나지 않기 때문입니다. 색을 바꾸는 길은 둘입니다 —
**브랜드 색 프리셋 185색** 중 하나를 고르거나, `className` 으로 그 컴포넌트만
직접 지정하는 것입니다.

다크 테마는 OS 설정만으로 적용되고 `data-theme="light|dark"` 로 고정할 수도 있습니다.

### 접근성

- **WCAG 비텍스트 대비 3:1** — 입력 테두리 · 스위치 트랙 · 체크박스 외곽선 ·
  포커스 표시를 라이트·다크 두 테마에서 기계 검사합니다
- **터치 영역** — 단독으로 누르는 것은 44×44px 을 향하고, 구조적으로 불가능한
  자리는 하한 24px 에 두고 이유를 기록합니다
- **`prefers-reduced-motion`** — duration 토큰이 무력화되고, framer-motion 을 쓰는
  컴포넌트는 `useReducedMotion()` 으로 분기합니다
- **컴포넌트가 소유한 문자열은 전부 prop 으로 교체 가능**합니다. 스크린리더 전용
  안내(`Select` 의 `ariaLiveMessages` 등)도 포함입니다
- `Field` 가 `id` · `aria-describedby` 연결을 소유하고, 에러는 색만이 아니라
  아이콘 + 텍스트 + `aria-live` 로 전합니다

### KRDS 준수

**디지털 정부서비스 UI/UX 가이드라인(2025.08)** 을 기준으로 색 단계 · 상태 · 대비 ·
서체 규격(400·700, 행간 150%, 최소 13px) · 형태(높이 × ⅛, 최대 12px) · 치수 ·
동작을 맞췄습니다. 정부 납품용은 아니며, 브랜드 색은 자체 상징 경로로 유지합니다.

### 알려진 제약

- **반응형 브레이크포인트는 보류 상태**입니다. 인프라는 있지만 컴포넌트가 쓰지
  않습니다 — 모든 뷰포트에서 지정한 값을 유지합니다
- `Alert` · `Confirm` 은 `Escape` · dim 클릭으로 닫히지 않습니다. KRDS 가 정한
  「승인이 필요한 모달」 유형이라 액션 버튼을 골라야 닫힙니다 (APG 와는 다릅니다)
- 문서 사이트와 컴포넌트 기본 문자열은 **한국어**입니다. 다른 언어라면 위의
  「접근성」 항목대로 prop 으로 교체하세요
- 0.x 이므로 공개 API 가 바뀔 수 있습니다. 변경은 이 파일에 기록합니다
