import type { ReactNode } from "react";

/** 예제 블록. 실제로 렌더되는 컴포넌트를 감싼다 — 문자열 예제를 만들지 않는다. */
export function Example({
  children,
  caption,
  row = true,
}: {
  children: ReactNode;
  caption?: string;
  row?: boolean;
}) {
  return (
    <div className="doc-example">
      <div className="doc-example__preview">
        <div className={row ? "doc-example__row" : undefined}>{children}</div>
      </div>
      {caption ? <p className="doc-example__caption">{caption}</p> : null}
    </div>
  );
}
