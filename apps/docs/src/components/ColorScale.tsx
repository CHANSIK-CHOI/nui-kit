const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

/**
 * 12단계 스케일 한 줄. 단계 번호가 곧 역할이므로 번호를 함께 보여준다.
 *
 * 밝은 쪽(1~7)에는 어두운 글자, 어두운 쪽(8~12)에는 밝은 글자를 얹는다 —
 * 스케일 자체가 그 경계에서 뒤집히도록 설계되어 있다.
 */
export function ColorScale({
  scale,
  label,
  description,
}: {
  scale: string;
  label: string;
  description: string;
}) {
  return (
    <div className="doc-scale">
      <div className="doc-scale__head">
        <strong>{label}</strong>
        <span>{description}</span>
      </div>
      <div className="doc-scale__row">
        {STEPS.map((step) => (
          <div
            key={step}
            className="doc-scale__cell"
            style={{
              background: `var(--nui-color-${scale}-${step})`,
              color: step >= 8 ? "#fff" : "rgb(0 0 0 / 55%)",
            }}
            title={`--nui-color-${scale}-${step}`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

const ROLE_ROWS: [string, string, string][] = [
  ["1 · 2", "배경", "화면 바닥 · 은은한 표면"],
  ["3 · 4 · 5", "컴포넌트 배경", "기본 · hover · 눌림"],
  ["6 · 7 · 8", "테두리", "구분선 · 컨트롤 테두리 · 강조와 포커스"],
  ["9 · 10", "solid 배경", "브랜드 색이 가장 선명한 단계 · 그 hover"],
  ["11 · 12", "글자", "보조 텍스트 · 본문 텍스트"],
];

/** 단계 번호 ↔ 역할 대응표. 스케일을 읽는 법이다. */
export function ScaleLegend() {
  return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            <th>단계</th>
            <th>역할</th>
            <th>쓰는 곳</th>
          </tr>
        </thead>
        <tbody>
          {ROLE_ROWS.map(([step, role, where]) => (
            <tr key={step}>
              <td>
                <span className="doc-token-name">{step}</span>
              </td>
              <td>
                <strong>{role}</strong>
              </td>
              <td className="doc-wrap">{where}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
