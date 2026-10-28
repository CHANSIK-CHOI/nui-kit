---
---

문서 앱과 라이브러리 개발 의존의 `next` 를 16.3.2 에서 16.4.3 으로 올렸습니다. 2026-10-14 React Server Components 원격 코드 실행 공지(GHSA-xqc2-xf4c-x3h3)의 Next 하한 16.4.1 이상입니다. `packages/ui` 에서는 `devDependencies` 만 바뀌고 `peerDependencies` 의 `next >=14` 는 그대로라 배포되는 패키지는 달라지지 않습니다.
