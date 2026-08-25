---
"@chansikchoi/next-ui": minor
---

`Accordion` 을 추가했습니다.

**구성** — `Accordion` + `Item` / `Head` / `Button` / `Panel`
- `type="single"` (하나만) / `"multiple"` (기본, 여러 개)
- `variant="box"` (카드, 기본) / `"line"` (구분선)
- `activeIndices` + `onChange` 로 제어 모드 사용 가능
- `shouldKeepMounted` 로 닫혀도 패널 내용을 DOM 에 남길 수 있습니다
  (폼 입력값 유지, 브라우저 검색 대응)

**새 서브패스** `/accordion` · **새 온디맨드 CSS** `styles/accordion.css`

**토글 영역은 두 모드 중 하나만 고릅니다**
```tsx
// 모드 A — 헤더 전체가 버튼
<Accordion.Button index={0}>
  <Accordion.Head>제목</Accordion.Head>
</Accordion.Button>

// 모드 B — 화살표 아이콘만 버튼 (헤더에 다른 조작 요소가 있을 때)
<Accordion.Head buttonIndex={0}>제목</Accordion.Head>
```
둘을 겹치면 `<button>` 안에 `<button>` 이 되어 하이드레이션이 깨집니다.

**Server Component 대응**
`AccordionItem` / `AccordionHead` / `AccordionButton` / `AccordionPanel` 을
named export 로도 제공합니다. Server Component 에서는 dot notation 이 동작하지 않습니다.
