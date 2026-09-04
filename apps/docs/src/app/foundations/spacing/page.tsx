import Link from "next/link";
import { TokenTable } from "@/components/TokenTable";
import tokens from "@/generated/tokens.json";

export const metadata = { title: "간격과 크기" };

type Token = { name: string; value: string };
const DATA = tokens as unknown as Record<string, Token[]>;

export default function SpacingPage() {
  const spaces = (DATA.space ?? []).filter((t) =>
    /--nui-space-\d/.test(t.name),
  );
  const semantic = (DATA.space ?? []).filter(
    (t) => !/--nui-space-\d/.test(t.name),
  );
  const sizes = DATA.size ?? [];
  const controls = sizes.filter((t) =>
    /--nui-size-(control|field)/.test(t.name),
  );

  return (
    <>
      <h1>간격과 크기</h1>
      <p className="doc-lead">
        요소 사이를 얼마나 띄우고 컨트롤을 얼마나 크게 그릴지 정한다. 아이콘
        크기는 <Link href="/foundations/icon">아이콘</Link> 문서에 있다.
      </p>

      <h2>간격</h2>
      <div className="doc-example">
        <div className="doc-example__preview">
          {spaces.map((token) => (
            <div key={token.name} className="doc-ruler">
              <span className="doc-token-name doc-ruler__label">
                {token.name.replace("--nui-", "")}
              </span>
              <span
                className="doc-ruler__bar"
                style={{ width: `var(${token.name})` }}
              />
              <span className="doc-ruler__value">{token.value}</span>
            </div>
          ))}
        </div>
      </div>

      <p>
        4px 기준 숫자 스케일이다. <code>space-4</code> 는 4 × 4px = 16px 이다.
        중간값을 넣어도 기존 이름이 바뀌지 않는다. <code>space-1</code> 과{" "}
        <code>space-2</code> 사이가 필요하면 <code>space-1_5</code> 다.
      </p>
      <p>
        <code>space-5</code> · <code>space-7</code> · <code>space-8</code> ·{" "}
        <code>space-9</code> 는 없다. 쓰이지 않아서 만들지 않았다.
      </p>

      <h2>정해진 게 없으면 이것</h2>
      <p>
        규칙이 따로 없을 때 쓸 기본값도 이름을 갖는다. 임의의 숫자가 코드에
        들어가는 경로를 막기 위해서다.
      </p>
      <TokenTable group="space" only="space-" swatch={false} />
      <p>
        위 표에서 숫자가 아닌 것 {semantic.length}개가 그것이다.{" "}
        <code>space-component-gap</code> 은 &quot;컴포넌트 안쪽 요소 사이에
        규칙이 따로 없을 때&quot; 쓴다.
      </p>

      <h2>크기</h2>
      <p>
        값이 불규칙해서 역할 이름을 쓴다. 컨트롤 높이는 32 · 36 · 40 · 48 · 56px
        이라 숫자 스케일의 이점이 둘 다 없다.
      </p>

      <h3>컨트롤 높이</h3>
      <div className="doc-example">
        <div
          className="doc-example__preview doc-example__row"
          style={{ gap: 16, alignItems: "flex-end" }}
        >
          {controls.map((token) => (
            <div key={token.name} style={{ textAlign: "center" }}>
              <span
                style={{
                  display: "block",
                  width: 64,
                  height: `var(${token.name})`,
                  background: "var(--nui-color-brand-3)",
                  border: "1px solid var(--nui-color-brand-9)",
                  borderRadius: "var(--nui-radius-2)",
                  marginBottom: 8,
                }}
              />
              <span className="doc-token-name">
                {token.name.replace("--nui-size-", "")}
              </span>
              <br />
              <span className="doc-token-name">{token.value}</span>
            </div>
          ))}
        </div>
        <p className="doc-example__caption">
          Button 의 기본은 <code>size-control-xl</code>(48px)이다. 56px 을
          쓰려면 <code>size=&quot;large&quot;</code> 를 명시한다.
        </p>
      </div>

      <h2>크기 옵션</h2>
      <p>
        크기를 고를 수 있는 컴포넌트는 <code>lg</code> · <code>md</code> ·{" "}
        <code>sm</code> 세 단계이고 기본은 <code>md</code> 다. 위아래로 하나씩
        있는 형태가 표준이고 <code>sm</code> 은 가장 작은 것으로 읽힌다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>컴포넌트</th>
              <th>large</th>
              <th>medium (기본)</th>
              <th>small</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                Button · IconButton · ButtonLink
              </th>
              <td>56px</td>
              <td>
                <strong>48px</strong>
              </td>
              <td>40px</td>
            </tr>
            <tr>
              <th scope="row">Popup</th>
              <td>40rem</td>
              <td>
                <strong>30rem</strong>
              </td>
              <td>22.5rem</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        크기별 값은 단계마다 이름이 따로 있는 변수로 연다.{" "}
        <code>--nui-button--lg-height</code> · <code>-md-height</code> ·{" "}
        <code>-sm-height</code> 가 그렇다. 하나로 두면 값을 넣는 순간 세 단계가
        전부 같아진다. 자세한 것은{" "}
        <Link href="/foundations/customizing">커스터마이징</Link> 문서에 있다.
      </p>

      <div className="doc-note doc-note--warn">
        <strong>
          <code>size-control-option</code>(44px)은 터치 영역의 기준이다.
        </strong>{" "}
        단독으로 누를 수 있는 것은 이 크기를 향한다. 보이는 크기와 누를 수 있는
        크기는 다르다. 팝업 닫기와 달력 날짜는 모양을 그대로 두고 가상요소로
        44px 을 누르고, 입력 안 보조 버튼처럼 44 를 채울 수 없는 자리는 하한
        24px 에 둔다. 자리별 결정은{" "}
        <Link href="/foundations/accessibility">접근성</Link> 문서에 있다.
        <br />
        <br />
        자기 치수를 갖는 선택 컨트롤(Checkbox · Radio 24px, Switch 40×24)은
        컨트롤 자체가 44px 보다 작다. 라벨을 포함한 클릭 영역이 44px 을 채우고,
        라벨이 <code>&lt;label&gt;</code> 로 연결돼 있으면 자동으로 확보된다.
      </div>

      <h2>전체 토큰</h2>
      <TokenTable group="size" swatch={false} />
    </>
  );
}
