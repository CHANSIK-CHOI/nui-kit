import Link from "next/link";
import { TokenTable } from "@/components/TokenTable";
import tokens from "@/generated/tokens.json";

export const metadata = { title: "깊이" };

type Token = { name: string; value: string };
const DATA = tokens as unknown as Record<string, Token[]>;

/** 고도(elevation)를 나타내는 것만. ring-* · thumb · inset-* 은 내부 전용이다. */
const ELEVATION = ["1", "2", "3", "press"];

const LAYERS: [string, string, string][] = [
  [
    "layer-basement",
    "바닥",
    "화면의 바닥. 앱이 쓰는 층이고 컴포넌트는 쓰지 않는다",
  ],
  [
    "layer-default",
    "기본",
    "카드 · 리스트 · 입력 컨트롤 표면. 대부분의 콘텐츠가 여기 놓인다",
  ],
  ["layer-floating", "떠 있음", "팝업 · Select 메뉴 · Datepicker 팝업"],
  ["layer-inverse", "반전", "토스트 · 툴팁. 글자는 text-on-inverse"],
  ["layer-overlay", "딤", "모달 뒤를 덮는 어두운 면"],
];

export default function ElevationPage() {
  const shadows = (DATA.shadow ?? []).filter((t) =>
    ELEVATION.includes(t.name.replace("--nui-shadow-", "")),
  );

  return (
    <>
      <h1>깊이</h1>
      <p className="doc-lead">
        무엇이 무엇 위에 놓이는지 정한다. 면의 층과 그림자, 쌓임 순서 셋이 같은
        이야기를 다른 수단으로 한다.
      </p>

      <h2>층</h2>
      <p>
        <code>layer-*</code> 는 컨테이너의 표면색만 정의한다. 글자나 아이콘 같은
        개별 요소가 아니라 화면의 캔버스를 만든다.
      </p>

      <div className="doc-example">
        <div
          className="doc-example__preview"
          style={{
            background: "var(--nui-layer-basement)",
            padding: 28,
            borderRadius: "var(--nui-radius-2)",
          }}
        >
          <div
            style={{
              background: "var(--nui-layer-default)",
              border: "1px solid var(--nui-border-form)",
              borderRadius: "var(--nui-radius-2)",
              padding: 28,
            }}
          >
            <div
              style={{
                background: "var(--nui-layer-floating)",
                boxShadow: "var(--nui-shadow-2)",
                borderRadius: "var(--nui-radius-2)",
                padding: 20,
                fontSize: "var(--nui-font-size-3)",
              }}
            >
              떠 있는 면 — <code>layer-floating</code>
            </div>
          </div>
        </div>
        <p className="doc-example__caption">
          바깥부터 basement → default → floating. 안쪽으로 갈수록 위에 있다.
        </p>
      </div>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>층</th>
              <th>토큰</th>
              <th>쓰는 곳</th>
            </tr>
          </thead>
          <tbody>
            {LAYERS.map(([token, role, where]) => (
              <tr key={token}>
                <th scope="row">{role}</th>
                <td>
                  <span className="doc-token-name">--nui-{token}</span>
                </td>
                <td className="doc-wrap">{where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="doc-note">
        <strong>
          <code>surface-*</code> 는 층이 아니다.
        </strong>{" "}
        콘텐츠 <em>위에</em> 얹는 톤(강조면 · 구분면)이라 역할이 다르다.
        혼용하면 어느 것이 위인지 알 수 없게 된다.
      </div>

      <div className="doc-note doc-note--warn">
        <strong>라이트에서 같고 다크에서 갈리는 쌍이 있다.</strong>{" "}
        <code>control-bg</code> 와 <code>layer-floating</code> 은 라이트에서 둘
        다 gray-1 이라 헷갈려 써도 안 보이지만, 다크에서는 gray-2 와 gray-3 으로
        갈린다. 그래서 자리로 정한다 — 입력 컨트롤 본체는{" "}
        <code>control-bg</code>, 메뉴·팝업·달력은 <code>layer-floating</code>.
        다크에서는 층이 올라갈수록 밝아진다.
      </div>

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
                  background: "var(--nui-layer-floating)",
                  borderRadius: "var(--nui-radius-2)",
                  boxShadow: `var(${token.name})`,
                  marginBottom: 8,
                }}
              />
              <span className="doc-token-name">
                {token.name.replace("--nui-shadow-", "")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>토큰</th>
              <th>쓰는 곳</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <span className="doc-token-name">--nui-shadow-1</span>
              </th>
              <td className="doc-wrap">낮게 뜸 — 카드, 인라인 드롭다운</td>
            </tr>
            <tr>
              <th scope="row">
                <span className="doc-token-name">--nui-shadow-2</span>
              </th>
              <td className="doc-wrap">중간 — 팝오버, 메뉴, 달력</td>
            </tr>
            <tr>
              <th scope="row">
                <span className="doc-token-name">--nui-shadow-3</span>
              </th>
              <td className="doc-wrap">최상단 — 모달, 토스트</td>
            </tr>
            <tr>
              <th scope="row">
                <span className="doc-token-name">--nui-shadow-press</span>
              </th>
              <td className="doc-wrap">눌렸을 때 — 아래로 내려간 느낌</td>
            </tr>
          </tbody>
        </table>
      </div>
      <TokenTable group="shadow" swatch={false} />

      <div className="doc-note">
        <strong>
          <code>shadow-ring-*</code> · <code>shadow-thumb</code> ·{" "}
          <code>shadow-inset-*</code> 은 컴포넌트 내부 전용이다.
        </strong>{" "}
        고도를 나타내지 않으므로 위 미리보기에 없다.
      </div>

      <div className="doc-note doc-note--warn">
        <strong>포커스 링은 그림자가 아니다.</strong> 생김새가 비슷하지만
        그림자는 <em>높이</em>를, 링은 <em>상태</em>를 나타낸다. 그래서{" "}
        <code>shadow-*</code> 가 아니라 <code>focus-ring-*</code> 이다. 고르는
        기준은 <Link href="/foundations/accessibility">접근성</Link> 문서에
        있다.
      </div>

      <h2>쌓임 순서</h2>
      <p>
        <code>z-index</code> 를 직접 쓰지 않고 이 네 개 안에서 고른다. 값을 직접
        쓰기 시작하면 숫자 경쟁이 벌어진다.
      </p>
      <TokenTable group="z-index" swatch={false} />

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>토큰</th>
              <th>왜 그 값인가</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <span className="doc-token-name">--nui-z-tooltip</span>
              </th>
              <td className="doc-wrap">
                같은 화면 안에서만 떠 있으면 된다 — 툴팁, 인라인 드롭다운
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span className="doc-token-name">--nui-z-overlay-layer</span>
              </th>
              <td className="doc-wrap">팝업과 그 딤</td>
            </tr>
            <tr>
              <th scope="row">
                <span className="doc-token-name">--nui-z-portal-menu</span>
              </th>
              <td className="doc-wrap">
                <strong>팝업보다 위.</strong> 팝업 <em>안에서</em> 연 셀렉트와
                달력이 팝업에 가리면 안 된다
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span className="doc-token-name">--nui-z-toast</span>
              </th>
              <td className="doc-wrap">
                <strong>가장 위.</strong> 팝업 안에서 띄운 토스트도 보여야 한다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="doc-note">
        <strong>팝업끼리는 나중에 연 것이 위다.</strong> 값을 나누지 않는다.
        Alert 이 열린 BottomSheet 위에 오는 것은 이 순서의 결과다. 반대로 Alert
        위로 시트를 여는 것은 흐름 오류다.
      </div>

      <div className="doc-note">
        <strong>겹친다고 값을 올리지 않는다.</strong> 새 값이 필요해 보이면
        대개는 쌓임 맥락(stacking context)이 잘못 잡힌 것이다. 부모에{" "}
        <code>transform</code> 이나 <code>opacity</code> 가 걸려 있으면 자식의{" "}
        <code>z-index</code> 는 그 맥락 안에 갇힌다. 숫자를 키워도 소용없다.
      </div>
    </>
  );
}
