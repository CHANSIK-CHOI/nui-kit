# 아키텍처

## 저장소 구조

```
next-ui-system/
├─ packages/ui        @chansikchoi/next-ui — npm 배포 대상
│  ├─ src/
│  │  ├─ index.ts            공개 배럴
│  │  ├─ rhf.ts              react-hook-form 래퍼 서브패스
│  │  ├─ button|field|…​.ts   컴포넌트별 서브패스 엔트리 (재export 한 줄)
│  │  ├─ internal/           프리픽스 등 내부 유틸 (일부만 공개)
│  │  ├─ components/<Name>/  컴포넌트 1개 = 폴더 1개
│  │  ├─ types/              공용 타입
│  │  └─ styles/             SCSS (아래 참조)
│  ├─ scripts/               품질 검사 스크립트
│  ├─ dist/  styles/         빌드 산출물 (gitignore)
│  └─ package.json           exports map = 공개 API 의 단일 출처
└─ apps/docs           문서 사이트 (Next App Router). 배포되지 않는다.
```

**원본 참조**: 형제 폴더 `next-ui-components-guide` (Pages Router) 는 이식 원본이다.
**읽기 전용**으로만 참조하고 절대 수정하지 않는다.

## 컴포넌트 폴더 구조

Atomic Design 을 쓰지 않는다. **컴포넌트 이름 기준 평면 구조**다.

```
components/Textfield/
├─ Textfield.tsx        본체
├─ Message.tsx          부속 컴포넌트 (같은 계열이면 같은 폴더)
├─ TextfieldBtn.tsx
├─ RHFTextfield.tsx     RHF 래퍼 — 파일은 여기, export 는 rhf.ts 로만
└─ index.ts             폴더 배럴
```

## 공개 경로 3층

| 층 | 예 | 용도 |
| --- | --- | --- |
| 배럴 | `@chansikchoi/next-ui` | 기본. 대부분 여기서 가져온다 |
| 서브패스 | `@chansikchoi/next-ui/textfield` | 번들 최소화가 필요할 때 |
| RHF | `@chansikchoi/next-ui/rhf` | react-hook-form 래퍼 전용 |

새 컴포넌트를 추가하면 **세 곳을 같이 갱신**한다:
`src/<name>.ts` 생성 → `tsup.config.ts` entry 추가 → `package.json` exports 추가 → `src/index.ts` 재export.

## 스타일 폴더 구조

```
styles/
├─ abstracts/    prefix / layer / breakpoints / mixins — CSS 출력 없음
├─ tokens/       _seed.scss — CSS 변수 선언만
├─ base/         _normalize.scss — 스코프 정규화
├─ components/   _<name>.scss — 컴포넌트 1개당 1파일
├─ utilities/
└─ entries/      → 여기 있는 파일이 그대로 styles/*.css 로 컴파일된다
```

컴포넌트를 추가하면 `components/_<name>.scss` 와 `entries/<name>.scss` 를 만들고
`entries/index.scss` 에 등록한다. entry 는 **단독으로 동작**해야 하므로
필요한 하위 스타일(icon, message 등)을 함께 `@use` 한다.

## 하지 않는 것

- `apps/docs` 코드를 `packages/ui` 가 import 하지 않는다 (역방향만 허용)
- 컴포넌트에서 서비스 화면·페이지를 만들지 않는다
- 원본 프로젝트를 수정하지 않는다
