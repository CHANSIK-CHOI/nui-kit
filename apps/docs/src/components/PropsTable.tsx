import propsData from "@/generated/props.json";

type PropRow = {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string;
};

type Entry = {
  typeName: string;
  sourceFile: string;
  props: PropRow[];
  inheritedCount: number;
};

const DATA = propsData as unknown as Record<string, Entry>;

/**
 * props 표. **손으로 쓰지 않는다** — `scripts/extract-props.mjs` 가
 * 컴포넌트 타입에서 생성한 JSON 을 렌더한다. 코드가 바뀌면 표가 따라 바뀐다.
 */
export function PropsTable({ of }: { of: string }) {
  const entry = DATA[of];

  if (!entry) {
    return (
      <p className="doc-note doc-note--warn">
        <code>{of}</code> 의 props 데이터가 없다.{" "}
        <code>scripts/extract-props.mjs</code> 의 TARGETS 에 등록할 것.
      </p>
    );
  }

  return (
    <>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>타입</th>
              <th>기본값</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            {entry.props.map((prop) => (
              <tr key={prop.name}>
                <td>
                  <code>{prop.name}</code>
                  {prop.required ? (
                    <span className="doc-req" title="필수">
                      {" *"}
                    </span>
                  ) : null}
                </td>
                <td>
                  <span className="doc-type">{prop.type}</span>
                </td>
                <td>{prop.default ? <code>{prop.default}</code> : "—"}</td>
                <td className="doc-wrap">{prop.description || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="doc-note">
        <code>{entry.typeName}</code> 에서 자동 생성됨 (
        <code>{entry.sourceFile}</code>).
        {entry.inheritedCount > 0 ? (
          <>
            {" "}
            표준 DOM 속성 {entry.inheritedCount}개는 그대로 전달되며 표에서
            생략했다.
          </>
        ) : null}
      </p>
    </>
  );
}
