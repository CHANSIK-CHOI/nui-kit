---
description: npm 배포. 사용자 명시 승인 없이는 절대 실행하지 않는다
---

# /release

**⚠️ 이 명령은 외부 변경이다. 사용자의 명시적 승인 없이 배포 단계로 넘어가지 않는다.**

## 0단계 · 전제 확인

```bash
git status --short          # 워킹트리가 깨끗해야 한다
git branch --show-current   # main
npx changeset status        # 배포할 변경이 있는가
npm whoami                  # 로그인 상태
```

하나라도 불충족이면 멈추고 사용자에게 보고한다.

## 1단계 · 빌드 · 검증 (여기까지는 승인 없이 가능)

```bash
npm run build:ui
npm run verify:pkg          # verify:css + publint + attw
npm pack -w @chansikchoi/next-ui --dry-run
```

`npm pack` 산출물 목록을 **사용자에게 보여준다** — 무엇이 배포되는지 눈으로 확인시킨다.
`src/`, `*.scss`, 설정 파일이 포함되어 있으면 `files` 필드 문제이므로 멈춘다.

## 2단계 · 버전 산정

```bash
npm run version-packages    # changeset version
```

바뀐 `package.json` 버전과 `CHANGELOG.md` 를 사용자에게 보여준다.

## 3단계 · 승인 (BLOCKING)

다음을 명시하고 **사용자의 승인을 받는다**:

- 배포될 패키지명·버전
- 배포 태그 (`latest` / `next`)
- 되돌리기: npm 은 72시간 내에만 unpublish 가능하고, 같은 버전 재배포는 불가하다

**최초 배포는 반드시 `--tag next` 프리릴리즈로 한다.**
별도 빈 프로젝트에 설치해 import 스모크 테스트를 통과한 뒤에만 `latest` 로 승격한다.

## 4단계 · 배포

승인 후에만 실행한다.

```bash
npm run release
```

> `npm publish` 는 `.claude/settings.json` deny 에 있다. 우회하지 않는다.
> 차단이 걸리면 사용자에게 직접 실행을 요청한다.

## 5단계 · 사후

- 배포된 버전 확인 (`npm view @chansikchoi/next-ui`)
- git 태그
- 소비 스모크 테스트 결과 보고
