import type { ReactNode } from "react";

/**
 * 케이스 하나. 라벨과 실물을 세로로 묶는다.
 *
 * 예제를 한 줄에 늘어놓기만 하면 **어느 것이 어느 옵션인지** 알 수 없다.
 * Button 가이드가 `round` 와 크기 세 개를 한 줄에 섞어 두어 크기 비교가
 * 되지 않던 것이 그 예다.
 */
export function Case({
  label,
  note,
  children,
}: {
  label: string;
  /** 값이나 조건 같은 부가 정보 */
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className="doc-case">
      <div className="doc-case__body">{children}</div>
      <div className="doc-case__label">
        <code>{label}</code>
        {note ? <span className="doc-case__note">{note}</span> : null}
      </div>
    </div>
  );
}

/**
 * 케이스를 격자로 깐다. 한 축의 값을 전부 나란히 놓아 **빠진 조합이 눈에 띄게** 한다.
 *
 * `columns` 를 주면 그 수로 고정하고, 없으면 내용에 맞춰 흐른다.
 */
export function CaseGrid({
  children,
  columns,
  caption,
  code,
}: {
  children: ReactNode;
  columns?: number;
  caption?: string;
  /** 대표 코드 한 줄. 케이스마다 붙이지 않는다 — 하나면 쓰는 법이 전해진다 */
  code?: string;
}) {
  return (
    <div className="doc-example">
      <div
        className="doc-example__preview doc-case-grid"
        style={
          columns
            ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
            : undefined
        }
      >
        {children}
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

/**
 * 두 축의 조합을 행 × 열로 깐다 — `variant` × `color` 처럼.
 *
 * **빠진 조합을 만들지 않으려고** 축 목록에서 자동으로 전개한다. 손으로 나열하면
 * Button 가이드처럼 12조합 중 7개만 실리는 일이 생긴다.
 */
export function CaseMatrix<R extends string, C extends string>({
  rows,
  cols,
  render,
  caption,
  code,
}: {
  rows: readonly R[];
  cols: readonly C[];
  render: (row: R, col: C) => ReactNode;
  caption?: string;
  code?: string;
}) {
  return (
    <div className="doc-example">
      <div className="doc-example__preview">
        <div className="doc-table-wrap">
          <table className="doc-table doc-matrix">
            <thead>
              <tr>
                <th />
                {cols.map((c) => (
                  <th key={c}>
                    <code>{c}</code>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r}>
                  <th scope="row">
                    <code>{r}</code>
                  </th>
                  {cols.map((c) => (
                    <td key={c}>{render(r, c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
