# specs

컴포넌트 명세. `component-planner` 에이전트가 본문을 만들고 Claude 가 저장한다.

- 파일명은 컴포넌트 이름 그대로: `Button.md`, `Textfield.md`
- 형식은 `.claude/agents/component-planner.md` 의 "spec 형식" 참조
- spec 은 **구현의 근거**다. 구현이 spec 과 다르면 둘 중 하나가 틀린 것이므로 맞춘다
- 이식된 컴포넌트에 spec 이 없으면 `/component-audit` 의 역추출로 만든다

> 파일럿 3종(Button / Field / Textfield)은 원본 이식이라 spec 없이 진행했다.
> `/component-audit` 으로 역추출해 채우는 것이 다음 과제다.
