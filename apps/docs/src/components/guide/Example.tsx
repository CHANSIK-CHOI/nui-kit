import type { CSSProperties, ReactNode } from "react";

/** 예제 블록. 실제로 렌더되는 컴포넌트를 감싼다 — 문자열 예제를 만들지 않는다. */
export function Example({
  children,
  caption,
  code,
  row = true,
  overflow = false,
  style,
}: {
  children: ReactNode;
  caption?: string;
  /** 대표 코드 한 줄. 케이스마다 붙이지 않는다 — 하나면 쓰는 법이 전해진다 */
  code?: string;
  row?: boolean;
  /**
   * 드롭다운·캘린더처럼 컨테이너 밖으로 나가는 예제에 쓴다.
   * 기본값(`false`)은 모서리 반경을 위해 내용을 잘라내므로, 팝업이 잘려
   * 실제로 조작할 수 없게 된다.
   */
  overflow?: boolean;
  /**
   * 예제 줄에 직접 얹는 스타일. CSS 변수를 덮어쓰는 예제에 쓴다.
   *
   * ⚠️ 안에 `doc-example__row` 를 **또** 두지 않는다. 그러면 바깥 줄의
   *    flex 항목이 되어 내용만큼 좁아지고, 폭 100% 인 컴포넌트가 세로로
   *    쌓인다 — 실제로 그렇게 되어 있던 자리가 둘 있었다.
   */
  style?: CSSProperties;
}) {
  return (
    <div className={`doc-example${overflow ? " doc-example--overflow" : ""}`}>
      <div className="doc-example__preview">
        <div className={row ? "doc-example__row" : undefined} style={style}>
          {children}
        </div>
      </div>
      {code ? (
        <pre className="doc-example__code">
          <code>{code}</code>
        </pre>
      ) : null}
      {caption ? <p className="doc-example__caption">{caption}</p> : null}
    </div>
  );
}
