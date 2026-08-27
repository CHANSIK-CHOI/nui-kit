# specs

컴포넌트 명세. `component-planner` 에이전트가 본문을 만들고 Claude 가 저장한다.

- 파일명은 컴포넌트 이름 그대로: `Button.md`, `Textfield.md`
- 형식은 `.claude/agents/component-planner.md` 의 "spec 형식" 참조
- spec 은 **구현의 근거**다. 구현이 spec 과 다르면 둘 중 하나가 틀린 것이므로 맞춘다
- 이식된 컴포넌트에 spec 이 없으면 `/component-audit` 의 역추출로 만든다

- 형식은 [`_TEMPLATE.md`](./_TEMPLATE.md) 를 복사해서 쓴다. **섹션 번호와 제목은 바꾸지 않는다**
- 규율(무엇을 담고 무엇을 담지 않는가)은 [`rules/spec-scope.md`](../rules/spec-scope.md)
- **색·상태 토큰을 나열하지 않는다.** [`rules/design-system.md`](../rules/design-system.md)
  §3 매트릭스를 따르고, spec 에는 **예외만** 적는다

> 이식된 계열은 구현이 정본이므로 역추출로 채운다.
> 현재 Button / LayerPopup 두 개가 있고 나머지 12계열이 남았다.
