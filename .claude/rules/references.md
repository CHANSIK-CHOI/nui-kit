# 외부 문서 참조 규칙 (Context7 로컬 캐시)

## 원칙

**Context7 MCP 를 매번 호출하지 않는다.**
한 번 받아 `.claude/references/` 에 저장하고, **1주일 동안은 그 로컬 파일을 읽어 팩트체크**한다.
1주일이 지나면 다시 받아 갱신한다.

## 절차

```
1) node scripts/check-refs.mjs      캐시 상태 확인
2) 필요한 문서가 유효(7일 이내)  → 로컬 파일을 Read 해서 사용. MCP 호출 금지
3) 없거나 만료(7일 경과)         → Context7 로 받아 저장 후 사용
```

## 받아서 저장하기

```
mcp__context7__resolve-library-id  →  라이브러리 ID 확정 (/org/project)
mcp__context7__query-docs          →  개념 1개 단위로 질의
→ 결과를 .claude/references/<library-slug>/<topic>.md 에 Write
```

`<library-slug>` 는 `/` 를 `-` 로 바꾼 것 (`/vercel/next.js` → `vercel-next.js`).
질문이 여러 개념에 걸치면 **개념당 파일 하나**로 나눈다. 한 파일에 섞지 않는다.

## 파일 형식 (frontmatter 필수)

```markdown
---
library: /vercel/next.js
topic: mdx-app-router-setup
query: "MDX setup for App Router with @next/mdx"
fetched: 2026-08-25
---

(Context7 응답 본문을 그대로 저장한다. 요약하거나 가공하지 않는다.)
```

- `fetched` 는 **받은 날짜**다. 파일을 수정해도 갱신하지 않는다 — 재수신할 때만 바꾼다
- 본문을 가공하면 팩트체크의 근거가 사라진다. **원문 그대로 저장한다**
- 저장 후 `.claude/references/INDEX.md` 에 한 줄 추가한다

## 사용할 때

- 로컬 파일을 근거로 답할 때는 **어느 파일을 봤는지 밝힌다**
- 로컬 문서에 없는 내용을 추측으로 메우지 않는다.
  필요하면 새 topic 으로 Context7 를 호출해 받아온다 (이건 캐시 미스이므로 허용)
- 로컬 문서와 실제 동작이 다르면 **실제 동작이 정본**이다. 그 사실을 보고한다

## 언제 Context7 를 쓰는가

**쓴다** — 외부 라이브러리의 props/이벤트/설정/CLI 사용법처럼 **정확도가 결정적**일 때
**쓰지 않는다** — React 19 / Next 16 자체 문법, 일반 프로그래밍 개념, 우리 코드 디버깅

## 커밋

`.claude/references/` 는 **커밋한다.** 캐시를 공유해야 TTL 이 의미가 있고,
어떤 문서를 근거로 판단했는지가 기록으로 남는다.
