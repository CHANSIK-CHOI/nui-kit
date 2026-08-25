import { TokenTable } from "@/components/TokenTable";
import tokens from "@/generated/tokens.json";

export const metadata = { title: "모양과 깊이" };

type Token = { name: string; value: string };
const DATA = tokens as unknown as Record<string, Token[]>;

export default function ShapePage() {
  const radii = DATA.radius ?? [];
  const shadows = DATA.shadow ?? [];

  return (
    <>
      <h1>모양과 깊이</h1>
      <p className="doc-lead">모서리 반경과 그림자.</p>

      <h2>반경</h2>
      <div className="doc-example">
        <div className="doc-example__preview doc-example__row">
          {radii.map((token) => (
            <div key={token.name} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 56,
                  background: "var(--nui-color-primary-bright)",
                  border: "1px solid var(--nui-color-primary)",
                  borderRadius: `var(${token.name})`,
                }}
              />
              <span className="doc-token-name">
                {token.name.replace("--nui-radius-", "")}
              </span>
            </div>
          ))}
        </div>
      </div>
      <TokenTable group="radius" />

      <h2>그림자</h2>
      <div className="doc-example">
        <div
          className="doc-example__preview doc-example__row"
          style={{ gap: 24, padding: 32 }}
        >
          {shadows.map((token) => (
            <div key={token.name} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 92,
                  height: 56,
                  background: "#fff",
                  borderRadius: "var(--nui-radius-sm)",
                  boxShadow: `var(${token.name})`,
                }}
              />
              <span className="doc-token-name">
                {token.name.replace("--nui-shadow-", "")}
              </span>
            </div>
          ))}
        </div>
      </div>
      <TokenTable group="shadow" />

      <h2>테두리와 포커스</h2>
      <TokenTable group="border" />
    </>
  );
}
