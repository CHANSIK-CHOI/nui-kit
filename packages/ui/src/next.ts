// Next.js 전용 서브패스 (`@nui-kit/react/next`).
// `next/link` 를 쓰는 컴포넌트는 여기서만 나간다 — 배럴에 섞으면 `next` 를 쓰지 않는
// 소비자의 번들과 `.d.ts` 에 `next/link` 참조가 들어간다 (`rhf.ts` 와 같은 구조).
export { default as ButtonLink } from "./components/Button/ButtonLink.js";
export type { ButtonLinkProps } from "./components/Button/ButtonLink.js";
