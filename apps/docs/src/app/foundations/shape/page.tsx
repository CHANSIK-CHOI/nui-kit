import Link from "next/link";
import { TokenTable } from "@/components/TokenTable";
import tokens from "@/generated/tokens.json";

export const metadata = { title: "모양과 선" };

type Token = { name: string; value: string };
const DATA = tokens as unknown as Record<string, Token[]>;

/** [역할, 토큰, 빈도, 예] */
const STROKE: [string, string, string, string][] = [
  ["형태선", "border-form", "한 요소에 하나", "카드 · 패널 · 팝업의 외곽"],
  [
    "의미경계선",
    "border-section",
    "한 화면에 한두 번",
    "섹션 사이, 헤더와 본문 경계",
  ],
  ["구분선", "border-divider", "한 화면에 여러 번", "리스트 행, 아코디언 항목"],
];

export default function ShapePage() {
  const radii = DATA.radius ?? [];

  return (
    <>
      <h1>모양과 선</h1>
      <p className="doc-lead">
        <strong>이 페이지가 정하는 것</strong> — 모서리를 얼마나 둥글게 하고,
        선을 어떤 색·두께로 그리는가. 그림자와 쌓임 순서는{" "}
        <Link href="/foundations/elevation">깊이</Link> 문서에 있다.
      </p>

      <h2>모서리</h2>
      <div className="doc-example">
        <div
          className="doc-example__preview doc-example__row"
          style={{ gap: 20 }}
        >
          {radii.map((token) => (
            <div key={token.name} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 56,
                  background: "var(--nui-color-brand-3)",
                  border: "1px solid var(--nui-color-brand-9)",
                  borderRadius: `var(${token.name})`,
                  marginBottom: 8,
                }}
              />
              <span className="doc-token-name">
                {token.name.replace("--nui-radius-", "")}
              </span>
            </div>
          ))}
        </div>
      </div>
      <TokenTable group="radius" swatch={false} />

      <div className="doc-note doc-note--warn">
        <strong>
          <code>radius-circle</code>(50%)과 <code>radius-full</code>(9999px)은
          다르다.
        </strong>{" "}
        둘 다 &quot;완전히 둥근&quot;처럼 보이지만 <code>50%</code> 는 가로세로
        비율을 따라간다 — Switch 트랙(46×26)에 쓰면 <strong>타원</strong>이
        된다. 정사각형이 아니면 반드시 <code>radius-full</code> 이다.
      </div>

      <h2>선 — 등장 빈도로 고른다</h2>
      <p>
        굵기가 아니라 <strong>한 화면에 몇 번 나오는가</strong>로 나눈다.{" "}
        <strong>많이 나올수록 연하다</strong> — 리스트 구분선이 진하면 화면이
        줄무늬처럼 보인다.
      </p>

      <div className="doc-example">
        <div className="doc-example__preview">
          {STROKE.map(([role, token]) => (
            <div key={token} className="doc-ruler">
              <span className="doc-ruler__label">
                <strong>{role}</strong>
              </span>
              <span
                style={{
                  flex: 1,
                  height: 0,
                  borderTop: `1px solid var(--nui-${token})`,
                }}
              />
              <span className="doc-token-name doc-ruler__value">{token}</span>
            </div>
          ))}
        </div>
        <p className="doc-example__caption">
          위에서 아래로 갈수록 연해진다. 자주 나오는 선일수록 조용해야 한다.
        </p>
      </div>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>이 선이 화면에</th>
              <th>토큰</th>
              <th>예</th>
            </tr>
          </thead>
          <tbody>
            {STROKE.map(([role, token, freq, where]) => (
              <tr key={token}>
                <th scope="row" className="doc-wrap">
                  {freq}
                  <br />
                  <span className="doc-token-name">{role}</span>
                </th>
                <td>
                  <span className="doc-token-name">--nui-{token}</span>
                </td>
                <td className="doc-wrap">{where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        <strong>뒤의 둘이 반투명(alpha)인 이유</strong> — 구분선은 어떤 배경
        위에 놓일지 모른다. 흰 카드 위일 수도, 회색 패널 위일 수도 있다. 불투명
        회색은 배경에 따라 튀지만 반투명은 아래 색과 섞여 어디서든 자연스럽다.
      </p>

      <div className="doc-note">
        <strong>입력 컨트롤은 이 표를 쓰지 않는다.</strong>{" "}
        <code>control-border</code> 가 따로 있고 형태선보다 한 단계 진하다 —{" "}
        <strong>누를 수 있는 것과 가만히 있는 것</strong>을 진하기로 구분하기
        때문이다. 상태별로 무엇을 쓰는지는{" "}
        <Link href="/foundations/state">상태</Link> 문서에 있다.
      </div>

      <TokenTable group="border" omit="border-width" />

      <h2>두께</h2>
      <p>
        색과 달리 <strong>두께는 연쇄하지 않는다.</strong> 1px 은 그냥 1px 이고,
        하나를 바꿔도 다른 데로 퍼지지 않는다. 그래서 역할 계층 없이 스케일만
        둔다.
      </p>
      <TokenTable group="border" only="border-width" swatch={false} />
      <p>
        컴포넌트는 자기 두께 변수로 이 값을 덮는다 — <code>border</code> 를{" "}
        <strong>실제로 쓰는</strong> 컴포넌트에만 있다. Toast · Tooltip 은
        테두리를 쓰지 않으므로 두께 변수도 만들지 않았다.{" "}
        <strong>안 쓰는 변수는 죽은 토큰이 된다.</strong>
      </p>

      <div className="doc-note doc-note--warn">
        <strong>투명한 테두리에도 두께가 적용된다.</strong> Popup 닫기 버튼과
        Datepicker 날짜 칸은 <code>border: … solid transparent</code> 로 자리만
        잡아둔 자리다. 선택되면 색이 생기는데 그때{" "}
        <strong>1px 밀리지 않도록</strong> 미리 자리를 잡아둔 것이다. 여기를
        빼면 두께를 2px 로 바꿨을 때 이 자리만 1px 로 남아{" "}
        <strong>선택하는 순간 요소가 움직인다.</strong>
      </div>
    </>
  );
}
