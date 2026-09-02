import type { ReactNode } from "react";

/** 예제 블록. 실제로 렌더되는 컴포넌트를 감싼다 — 문자열 예제를 만들지 않는다. */
export function Example({
  children,
  caption,
  row = true,
  overflow = false,
}: {
  children: ReactNode;
  caption?: string;
  row?: boolean;
  /**
   * 드롭다운·캘린더처럼 컨테이너 밖으로 나가는 예제에 쓴다.
   * 기본값(`false`)은 모서리 반경을 위해 내용을 잘라내므로, 팝업이 잘려
   * 실제로 조작할 수 없게 된다.
   */
  overflow?: boolean;
}) {
  return (
    <div className={`doc-example${overflow ? " doc-example--overflow" : ""}`}>
      <div className="doc-example__preview">
        <div className={row ? "doc-example__row" : undefined}>{children}</div>
      </div>
      {caption ? <p className="doc-example__caption">{caption}</p> : null}
    </div>
  );
}
