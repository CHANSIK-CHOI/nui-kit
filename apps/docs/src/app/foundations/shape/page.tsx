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
                  background: "var(--nui-color-brand-3)",
                  border: "1px solid var(--nui-color-brand-9)",
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
                  borderRadius: "var(--nui-radius-2)",
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

      <h2>포커스 링</h2>
      <p>
        키보드로 이동할 때 &quot;지금 여기&quot;를 알리는 표시다. 마우스로 눌렀을
        때는 나타나지 않는다(<code>:focus-visible</code>). 그림자와 생김새가
        비슷하지만 다른 토큰인데, 그림자는 <em>높이</em>를 나타내고 링은{" "}
        <em>상태</em>를 나타내기 때문이다.
      </p>
      <p>
        크기를 둘로 나눈 것은 컨트롤이 작을수록 같은 굵기의 링이 더 두껍게 보이기
        때문이다. 컨트롤 높이 <strong>36px</strong> 이 경계다 — 달력 날짜 칸처럼
        작은 것에는 <code>focus-ring-sm</code> 을 쓴다.
      </p>
      <TokenTable group="focus" />

      <p className="doc-note">
        테두리 <strong>색</strong>은 색상 문서에 있다 — 값이 색이므로 테마에 따라
        바뀌고, 여기 있는 치수는 테마와 무관하다.
      </p>
    </>
  );
}
