import hookData from "@/generated/hooks.json";

type Hook = {
  name: string;
  fallback: string;
  prop: string;
  option: string | null;
  places: number;
};
type Group = { key: string; label: string; hooks: Hook[] };

const DATA = hookData as unknown as { count: number; groups: Group[] };

export const HOOK_COUNT = DATA.count;

/**
 * 공개 훅 표. `packages/ui/src/styles/components/*.scss` 에서 추출한다.
 *
 * 손으로 적지 않는 이유 — 훅 목록을 문서에 박아두면 코드가 바뀔 때 반드시 어긋난다.
 * 실제로 색 훅을 없앤 뒤 문서가 없어진 이름을 계속 광고하고 있었다.
 */
export function HookTable({ group }: { group?: string }) {
  const groups = group
    ? DATA.groups.filter((g) => g.key === group)
    : DATA.groups;

  if (groups.length === 0) {
    return (
      <p className="doc-note doc-note--warn">
        훅 그룹 <code>{group}</code> 이 없다.
      </p>
    );
  }

  return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            <th>컴포넌트</th>
            <th>변수</th>
            <th>기본값</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {groups.flatMap((g) =>
            g.hooks.map((hook, i) => (
              <tr key={hook.name}>
                {i === 0 ? (
                  <th scope="rowgroup" rowSpan={g.hooks.length}>
                    {g.label}
                  </th>
                ) : null}
                <td>
                  <span className="doc-token-name">{hook.name}</span>
                </td>
                <td>
                  <code>{hook.fallback}</code>
                </td>
                <td className="doc-wrap">
                  {hook.option ? `크기 ${hook.option}` : "—"}
                  {hook.places > 1
                    ? ` · ${hook.places}자리를 함께 움직인다`
                    : ""}
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
