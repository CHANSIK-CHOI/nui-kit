import { TokenTable } from "@/components/TokenTable";
import tokens from "@/generated/tokens.json";

export const metadata = { title: "간격과 크기" };

type Token = { name: string; value: string };
const DATA = tokens as unknown as Record<string, Token[]>;

export default function SpacingPage() {
  const spaces = DATA.space ?? [];
  const controls = (DATA.size ?? []).filter((t) =>
    /control|field/.test(t.name),
  );

  return (
    <>
      <h1>간격과 크기</h1>
      <p className="doc-lead">
        간격은 4px 리듬을 따른다. 크기는 아이콘과 컨트롤 높이 두 갈래다.
      </p>

      <h2>간격 스케일</h2>
      <div className="doc-example">
        <div className="doc-example__preview">
          {spaces.map((token) => (
            <div
              key={token.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 6,
              }}
            >
              <span className="doc-token-name" style={{ width: 150 }}>
                {token.name.replace("--nui-", "")}
              </span>
              <span
                style={{
                  display: "block",
                  height: 14,
                  width: `var(${token.name})`,
                  background: "var(--nui-color-primary)",
                  borderRadius: 2,
                }}
              />
              <span className="doc-token-name">{token.value}</span>
            </div>
          ))}
        </div>
        <p className="doc-example__caption">막대 길이가 실제 토큰 값이다</p>
      </div>
      <TokenTable group="space" />

      <h2>컨트롤 높이</h2>
      <p>
        입력 컨트롤과 버튼이 공유하는 높이다. 폼 안에서 요소들이 같은 리듬을
        갖도록 이 값만 쓴다.
      </p>
      <div className="doc-example">
        <div className="doc-example__preview doc-example__row">
          {controls.map((token) => (
            <div key={token.name} style={{ textAlign: "center" }}>
              <div
                style={{
                  height: `var(${token.name})`,
                  width: 96,
                  background: "var(--nui-bg-color-3)",
                  border: "1px solid var(--nui-control-border)",
                  borderRadius: "var(--nui-radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--nui-font-size-label)",
                }}
              >
                {token.value}
              </div>
              <span className="doc-token-name">
                {token.name.replace("--nui-size-", "")}
              </span>
            </div>
          ))}
        </div>
      </div>
      <TokenTable group="size" />

      <div className="doc-note">
        모든 치수는 <strong>16px 루트 기준 rem</strong> 이다. px 로 고정하지
        않아 사용자가 브라우저 글꼴을 키우면 함께 커진다.
      </div>
    </>
  );
}
