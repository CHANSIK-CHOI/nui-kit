import tokenData from "@/generated/tokens.json";

type Token = {
  name: string;
  value: string;
  note: string | null;
  alias: boolean;
};

const DATA = tokenData as unknown as Record<string, Token[]>;

const COLOR_GROUPS = new Set(["color", "semantic", "control"]);

/**
 * 토큰 표. `packages/ui/src/styles/tokens/_seed.scss` 에서 추출한 JSON 을 렌더한다.
 * 토큰을 추가/변경하면 문서가 자동으로 따라온다.
 */
export function TokenTable({
  group,
  filter,
}: {
  group: string;
  filter?: string;
}) {
  const all = DATA[group];

  if (!all) {
    return (
      <p className="doc-note doc-note--warn">
        토큰 그룹 <code>{group}</code> 이 없다.
      </p>
    );
  }

  const tokens = filter
    ? all.filter((t) => t.name.startsWith(`--nui-${filter}`))
    : all;
  const showSwatch = COLOR_GROUPS.has(group);

  return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            {showSwatch ? <th aria-label="색상" /> : null}
            <th>토큰</th>
            <th>값</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.name}>
              {showSwatch ? (
                <td>
                  <span
                    className="doc-swatch"
                    style={{ background: `var(${token.name})` }}
                  />
                </td>
              ) : null}
              <td>
                <span className="doc-token-name">{token.name}</span>
              </td>
              <td>
                <code>{token.value}</code>
              </td>
              <td className="doc-wrap">
                {token.alias ? "별칭" : (token.note ?? "—")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
