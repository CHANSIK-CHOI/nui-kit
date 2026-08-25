import type { HTMLAttributes } from "react";

/** MDX 의 <pre> 를 대체한다. */
export function CodeBlock(props: HTMLAttributes<HTMLPreElement>) {
  return <pre {...props} className="doc-code" />;
}

/** TSX 에서 코드 조각을 보여줄 때 사용한다. */
export function Code({ children }: { children: string }) {
  return (
    <pre className="doc-code">
      <code>{children}</code>
    </pre>
  );
}
