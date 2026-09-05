# nui-kit

Next.js **App Router 전용** React UI 컴포넌트 시스템.
컴포넌트 라이브러리와 API 문서 사이트를 하나의 모노레포에서 관리합니다.

[![npm](https://img.shields.io/npm/v/@nui-kit/react?color=16815a)](https://www.npmjs.com/package/@nui-kit/react)
[![provenance](https://img.shields.io/badge/provenance-signed-16815a)](https://www.npmjs.com/package/@nui-kit/react#Provenance)
[![license](https://img.shields.io/npm/l/@nui-kit/react)](./packages/ui/LICENSE)

```bash
npm i @nui-kit/react
```

```tsx
import { Button, Field, FieldLabel, Textfield } from "@nui-kit/react";
import "@nui-kit/react/styles/index.css";
```

**사용법·API·커스터마이징은 [`packages/ui/README.md`](./packages/ui/README.md) 가 정본입니다.**
이 문서는 저장소 구조와 개발 방법을 다룹니다.

## 무엇이 들어 있나

컴포넌트 **40종**과 react-hook-form 래퍼 **13종**. 계열별 목록은 패키지 README 에 있습니다.

| 계열 | |
| --- | --- |
| 액션 | `Button` · `IconButton` · `ButtonGroup` · `ButtonLink` |
| 폼 | `Field` · `Textfield` · `Textarea` · `Search` · `Password` |
| 선택 | `Checkbox` · `Radio` · `Switch` · `Select` · `MultiSelect` |
| 날짜 | `Datepicker` · `DateRangePicker` · `DateMultiplePicker` |
| 오버레이 | `Alert` · `Confirm` · `LayerPopup` · `BottomSheet` · `FullPopup` |
| 피드백 | `Toast` · `Tooltip` · `Accordion` · `Icon` |

## 구조

```
nui-kit/
├─ packages/ui      @nui-kit/react — npm 에 배포되는 컴포넌트 라이브러리
│  ├─ src/          컴포넌트 · SCSS · 내부 유틸
│  ├─ scripts/      품질 검사 · 브랜드 색 생성기
│  └─ presets.json  브랜드 색 프리셋 185색
└─ apps/docs        문서 사이트 (Next.js App Router · 배포 대상 아님)
   └─ scripts/      props·토큰·훅 추출기 + 실동작 검사
```

## 핵심 원칙

1. **소비자 프로젝트 스타일을 오염시키지 않는다**
   - 모든 클래스에 `nui-` 프리픽스 (`.nui-button`)
   - 모든 CSS 를 `@layer nui.*` 안에 배치 → 소비자의 unlayered CSS 가 상세도와 무관하게 항상 우선
   - reset 은 기본 배포에 포함하지 않는다 (`styles/preflight.css` 로 opt-in)
   - 컴포넌트가 스스로 UA 기본 스타일을 정규화한다
2. **ESM 단일 포맷** — 듀얼 패키지 해저드(React 인스턴스 이중화)를 차단한다
3. **모든 컴포넌트는 클라이언트 컴포넌트** (`"use client"`)
   합성 컴포넌트는 dot notation 과 named export 를 함께 제공한다 —
   Server Component 에서는 named export 를 써야 한다
4. **CSS 변수 3계층** — Primitive → Semantic → Component(공개 훅)
   치수·간격·둥글기·선 두께는 열고, **색은 열지 않는다**(배경과 글자가 짝이라
   한쪽만 바꾸면 대비가 조용히 깨진다). 색은 브랜드 프리셋이나 `className` 으로 바꾼다
5. **컴포넌트 작업 ≠ 문서 갱신 ≠ 배포** — 셋을 원스텝으로 묶지 않는다.
   변경은 `.changeset/` 에 큐로 쌓아 두고 나중에 넘긴다

## 로컬에서 돌리기

```bash
npm i
npm run build:ui     # 라이브러리를 먼저 빌드해야 문서 사이트가 뜬다
npm run dev          # 문서 사이트 개발 서버
```

문서 사이트의 **props 표·토큰 표·훅 표는 손으로 쓰지 않습니다.** 개발 서버와 빌드가
컴포넌트 타입과 `_seed.scss` 에서 직접 뽑아냅니다 — 문서가 코드를 따라갑니다.
그 외 명령은 `package.json` 에 있습니다.

## 무엇을 기계로 보장하나

문서만으로는 지켜지지 않는 것들입니다.

- **스타일 격리** — 프리픽스 누락, 전역 셀렉터 유입, `@layer` 누락을 빌드된 CSS 에서 검사
- **토큰 규율** — 색 primitive 직접 참조, 색에 공개 훅 부여, 역할군↔속성 불일치를 소스에서 검사
- **접근성** — WCAG 비텍스트 대비 3:1 을 라이트·다크 두 테마에서 재고, 히트 영역을
  `elementFromPoint` 로 실측합니다. 모션 감소 설정 대응도 함께 봅니다
- **실동작** — 36개 문서 페이지의 콘솔 에러·경고, 달력 개폐·클리핑, react-hook-form
  연동 회귀를 Playwright 로 확인합니다
- **배포 정합성** — `publint` · `attw` 로 exports 맵과 타입 해석을 검증합니다

## 브랜치와 기여

```
feature/xxx  →(PR)→  dev  →(PR)→  main  →(태그 v0.x.y)→  npm 배포
```

- **`dev`** 가 기본 브랜치입니다. 작업은 여기서 시작합니다
- `main` 은 배포된 상태입니다. 태그를 밀면 릴리스 워크플로가 npm 에 배포합니다
- 두 브랜치 모두 **PR 을 거쳐야** 하고 force push·삭제가 막혀 있습니다
- 외부 기여는 fork → PR 로 받습니다. 이슈로 먼저 논의해 주시면 좋습니다

배포는 GitHub Actions 에서 **OIDC(Trusted Publishing)** 로만 이뤄집니다 —
장기 토큰이 없고 tarball 에 provenance 서명이 붙습니다.

## 라이선스

MIT — [`packages/ui/LICENSE`](./packages/ui/LICENSE)
