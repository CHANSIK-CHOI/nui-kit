import tokenData from "@/generated/tokens.json";

type Token = {
  name: string;
  value: string;
  note: string | null;
  alias: boolean;
};

const DATA = tokenData as unknown as Record<string, Token[]>;

/** 색 견본을 함께 보여줄 그룹. 값이 색인 그룹은 전부 여기 있어야 한다. */
const COLOR_GROUPS = new Set([
  "color",
  "text",
  "layer",
  "border",
  "control",
  "status",
  "action",
]);

/**
 * 토큰 표. `packages/ui/src/styles/tokens/_seed.scss` 에서 추출한 JSON 을 렌더한다.
 * 토큰을 추가/변경하면 문서가 자동으로 따라온다.
 *
 * `only` / `omit` 은 한 그룹을 성격별로 쪼갤 때 쓴다 —
 * `border` 그룹에는 선 **색**과 선 **두께**가 섞여 있는데 둘은 다른 이야기다.
 */
export function TokenTable({
  group,
  only,
  omit,
  swatch,
}: {
  group: string;
  only?: string;
  omit?: string;
  /** 색 견본 표시를 강제하거나 끈다. 기본값은 그룹으로 판단한다 */
  swatch?: boolean;
}) {
  const all = DATA[group];

  if (!all) {
    return (
      <p className="doc-note doc-note--warn">
        토큰 그룹 <code>{group}</code> 이 없다.
      </p>
    );
  }

  const tokens = all
    .filter((t) => (only ? t.name.startsWith(`--nui-${only}`) : true))
    .filter((t) => (omit ? !t.name.startsWith(`--nui-${omit}`) : true));

  if (tokens.length === 0) {
    return (
      <p className="doc-note doc-note--warn">
        조건에 맞는 토큰이 없다 — <code>{group}</code>
        {only ? ` / only=${only}` : ""}
        {omit ? ` / omit=${omit}` : ""}
      </p>
    );
  }

  const showSwatch = swatch ?? COLOR_GROUPS.has(group);

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
