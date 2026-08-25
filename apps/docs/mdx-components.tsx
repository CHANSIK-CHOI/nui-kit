import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/CodeBlock";

/**
 * MDX 전역 컴포넌트 매핑. App Router 에서 @next/mdx 를 쓰려면
 * 이 파일이 프로젝트 루트에 반드시 있어야 한다.
 */
const components: MDXComponents = {
  pre: CodeBlock,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
