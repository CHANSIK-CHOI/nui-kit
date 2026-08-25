# 패키징 · 배포 규칙

## 배포 형태 (변경 시 영향 큼 — 임의로 바꾸지 않는다)

| 항목 | 값 | 이유 |
| --- | --- | --- |
| 포맷 | **ESM 단일** | 듀얼 패키지 해저드(인스턴스 이중화) 차단 |
| 지시어 | 전 출력 파일 `"use client"` | App Router 전용 |
| 타입 | `tsc --emitDeclarationOnly` | tsup 의 dts 는 TS 7 내부 API 변경으로 깨짐 |
| treeshake | `false` | rollup treeshake 패스가 `"use client"` 를 제거함 |
| 검증 | `verify:css` + `publint` + `attw --profile esm-only` | |

## dependencies vs peerDependencies 판정

> **소비자와 같은 인스턴스를 공유해야 하는가?**
> 공유 → `peerDependencies` / 우리 안에서만 쓰고 끝 → `dependencies`

| 라이브러리 | 분류 | 근거 |
| --- | --- | --- |
| `react` `react-dom` | **peer** | 두 벌이면 Invalid hook call |
| `react-hook-form` | **peer (optional)** | 소비자의 `useForm()` `control` 을 우리가 받는다 |
| `next` | **peer (optional)** | `ButtonLink` 만 `next/link` 사용 |
| `classnames` `framer-motion` `zustand` `react-select` `react-day-picker` `date-fns` | **dep** | 내부 구현 전용. 소비자는 설치하지 않는다 |

**dependencies 로 넣는다고 번들이 커지지 않는다** — 서브패스 exports + `sideEffects`
설정으로 실제 사용한 것만 번들에 들어간다. `node_modules` 용량만 는다.

optional peer 를 쓰는 코드는 **반드시 별도 엔트리로 분리**한다
(RHF → `rhf.ts`). 배럴에 섞으면 안 쓰는 소비자의 그래프에 들어간다.

## 새 컴포넌트 추가 시 갱신 목록

1. `src/components/<Name>/` + `index.ts`
2. `src/<name>.ts` (서브패스 엔트리)
3. `tsup.config.ts` → `entry` 에 추가
4. `package.json` → `exports` 에 추가
5. `src/index.ts` → 배럴 재export
6. `styles/components/_<name>.scss` + `styles/entries/<name>.scss` + `entries/index.scss`
7. `packages/ui/README.md` → 사용법 / 합성 컴포넌트 대응표
8. **changeset 작성** (아래)

## 변경 큐 — changeset

컴포넌트 작업과 문서 갱신·배포를 **한 번에 묶지 않는다.**
무엇이 바뀌었는지만 `.changeset/*.md` 에 쌓고 넘긴다.

```
컴포넌트 작업 → npm run changeset → .changeset/*.md
                                       ↓ (나중에)
                          /docs-sync  →  /release
```

- `patch` 버그 수정 · 내부 리팩터
- `minor` 컴포넌트/prop 추가, 토큰 추가
- `major` prop 제거·이름 변경, 클래스명 변경, 토큰 제거 (0.x 에서는 minor 로 두되 본문에 **BREAKING** 명시)

changeset 본문에는 **소비자 관점의 변화**를 쓴다. 내부 구현 설명이 아니다.

## 배포는 절대 자동으로 하지 않는다

- `npm publish` 는 `.claude/settings.json` deny 에 등록되어 있다
- 배포는 `/release` 명령으로만, 사용자 명시 승인 후 진행한다
- 배포 전 필수: `npm run build:ui` → `npm run verify:pkg` → `npm pack --dry-run` 내용물 확인
