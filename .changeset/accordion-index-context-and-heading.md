---
"@nui-kit/react": minor
---

`Accordion` 의 자리 번호를 `Item` 한 곳에만 적을 수 있습니다. `Accordion.Button` 과
`Accordion.Panel` 의 `index` 가 선택으로 바뀌어, 생략하면 감싼 `Accordion.Item` 에서 받아 갑니다.

```tsx
<Accordion.Item index={0}>
  <Accordion.Button>
    <Accordion.Head>배송은 얼마나 걸리나요?</Accordion.Head>
  </Accordion.Button>
  <Accordion.Panel>영업일 2~3일이 걸립니다.</Accordion.Panel>
</Accordion.Item>
```

세 곳에 적던 코드는 그대로 돕니다 — **직접 준 값이 이깁니다.** 셋 중 하나만 어긋났을 때
타입은 통과하고 엉뚱한 패널이 열리던 자리가 닫힙니다. `Item` 밖에 두면서 `index` 도 빼면
무엇을 해야 하는지 알려 주는 메시지와 함께 멈춥니다.

`Accordion.Head` 의 `buttonIndex` 는 그대로 직접 줍니다. 그 prop 은 자리 번호가 아니라
「화살표만 버튼으로 만든다」는 모드 스위치라, 생략은 「헤더 전체가 버튼」이라는 뜻입니다.

**제목을 heading 으로 만들 수 있습니다.** 루트에 `headingLevel` 을 주면 그 수준의
`h2`~`h6` 안에 제목이 들어갑니다. 헤더 전체가 버튼인 모드는 heading 이 버튼을 감싸고,
화살표만 버튼인 모드는 제목 상자가 그 태그가 됩니다.

```tsx
<Accordion headingLevel={3}>…</Accordion>
```

받는 값은 `2`~`6` 입니다. **기본값이 없어** 주지 않으면 heading 을 만들지 않습니다 — 페이지의
제목 계층은 쓰는 쪽이 압니다. 타입이 필요하면 `AccordionHeadingLevel` 을 가져다 씁니다.

앱이 `h2`~`h6` 에 여백을 주고 있으면 그 여백이 아코디언 안에도 옵니다. 라이브러리 스타일은
`@layer` 안이라 앱의 태그 규칙에 집니다. 항목 사이가 벌어지면 그 규칙에서
`.nui-accordion__heading` 과 `.nui-accordion__title-box` 를 빼면 됩니다.

**모션 감소 설정에서 패널이 계속 움직이던 것을 고쳤습니다.** `prefers-reduced-motion: reduce`
인데도 높이 전환이 그대로 돌고 있었습니다(120ms 사이 74 → 7px). 이제 즉시 정착합니다.

닫힌 패널을 감추는 수단이 `inert` 하나로 정리됐습니다. 겹쳐 걸려 있던 `pointer-events: none`
을 뺐습니다 — `inert` 가 클릭·포커스·텍스트 선택을 모두 막습니다. 보이는 동작은 같습니다.

`Accordion.Button` 과 `Accordion.Panel` 의 `index` 타입이 `number` 에서 `number | undefined`
가 됩니다. 그 prop 타입을 읽어 쓰던 래퍼 코드가 있다면 타입만 맞춰 주면 됩니다.
