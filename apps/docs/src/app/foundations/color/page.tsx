import Link from "next/link";
import { TokenTable } from "@/components/TokenTable";
import { ColorScale, ScaleLegend } from "@/components/ColorScale";

export const metadata = { title: "색" };

const SCALES: [string, string][] = [
  ["brand", "브랜드 색 — #01796f 를 9단계에 놓고 생성했다"],
  ["gray", "무채색 — 브랜드에 맞춰 살짝 초록빛이다"],
  ["danger", "되돌릴 수 없는 액션 · 오류"],
  ["warning", "주의가 필요한 액션"],
  ["success", "완료 · 확인"],
  ["info", "정보 전달 · 도움말"],
];

export default function ColorPage() {
  return (
    <>
      <h1>색</h1>
      <p className="doc-lead">
        <strong>이 페이지가 정하는 것</strong> — 어떤 색이 있고 각 색이 무슨
        역할인가. <em>어떤 상태일 때</em> 무엇을 쓰는지는{" "}
        <Link href="/foundations/state">상태</Link> 문서에 있다.
      </p>

      <h2>팔레트를 직접 쓰지 않는다</h2>
      <p>
        색에는 이름이 두 번 붙는다. <strong>색 자체</strong>(
        <code>color-brand-9</code>)와 <strong>그 색이 맡은 역할</strong>(
        <code>action-primary</code>)이다. 컴포넌트는 역할만 참조한다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>이렇게 하면</th>
              <th>이런 일이 생긴다</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="doc-wrap">
                버튼이 <code>color-brand-9</code> 를 직접 참조
              </td>
              <td className="doc-wrap">
                브랜드 색을 바꿔도 <strong>그 버튼만 옛 색으로 남는다</strong>
              </td>
            </tr>
            <tr>
              <td className="doc-wrap">
                버튼이 <code>action-primary</code> 를 참조
              </td>
              <td className="doc-wrap">
                역할 하나를 바꾸면 그 역할을 쓰는 곳이 전부 따라온다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>12단계 — 번호가 곧 역할이다</h2>
      <p>
        모든 색이 12단계를 갖고,{" "}
        <strong>단계마다 쓸 자리가 정해져 있다.</strong> 어느 색을 쓰든
        &quot;테두리는 7번, 채워진 배경은 9번&quot;이다. 색을 새로 추가해도 같은
        규칙이 적용된다.
      </p>
      <ScaleLegend />

      {SCALES.map(([scale, description]) => (
        <ColorScale
          key={scale}
          scale={scale}
          label={scale}
          description={description}
        />
      ))}

      <div className="doc-note">
        <strong>왜 12단계인가</strong> — 밝은 쪽 1~7 은 어두운 글자를, 어두운 쪽
        8~12 는 밝은 글자를 얹도록 만들었다. 스케일 자체가 그 경계에서
        뒤집히므로 <strong>같은 번호를 쓰면 대비가 자동으로 확보된다.</strong>
      </div>

      <h2>역할별 색</h2>

      <h3>글자</h3>
      <p>
        12단계 중 글자로 쓸 수 있는 것은 <strong>11(보조)과 12(본문)</strong>{" "}
        둘뿐이다. 9·10 은 채워진 배경 자리라 글자로 쓰면 대비가 3점대로
        떨어진다. <code>text-disabled</code> 만 예외로 9단계를 쓰는데, 비활성
        요소는 WCAG 대비 요구에서 제외되기 때문이다.
      </p>
      <TokenTable group="text" />

      <h3>면</h3>
      <p>
        콘텐츠를 <em>담는</em> 것의 배경이다. 글자나 아이콘 같은 개별 요소가
        아니라 화면의 <em>층</em>을 만든다. 어느 층이 어느 층 위에 오는지는{" "}
        <Link href="/foundations/elevation">깊이</Link> 문서에서 다룬다.
      </p>
      <TokenTable group="layer" />

      <h3>선</h3>
      <p>
        선 색은 <strong>굵기가 아니라 등장 빈도</strong>로 나눈다. 고르는 기준과
        두께는 <Link href="/foundations/shape">모양과 선</Link> 문서에 있다.
      </p>
      <TokenTable group="border" omit="border-width" />

      <h3>액션</h3>
      <p>
        버튼 계열이다. <strong>색이 아니라 역할이 이름</strong>이라 &quot;이
        버튼은 삭제인가&quot;만 물으면 정해진다. 각 역할의 <code>-fg</code> 는
        그 배경 위에서 대비 4.5:1 을 넘는 글자색이다.
      </p>
      <TokenTable group="action" />
      <div className="doc-note">
        <strong>
          <code>action-warning</code> 만 글자가 어둡다.
        </strong>{" "}
        노랑 배경에 흰 글자는 대비가 크게 미달한다. 그렇다고 노랑을 어둡게 하면
        갈색이 되어 &quot;주의&quot;의 의미를 잃는다. 배경을 밝게 두고 글자를
        어둡게 했다.
      </div>

      <h3>입력 컨트롤</h3>
      <p>
        Textfield · Select · Checkbox 처럼 값을 받는 것들이 공유한다. 폼 전체의
        톤을 한 번에 바꾸고 싶을 때 여기를 덮는다.
      </p>
      <TokenTable group="control" />

      <h3>상태 표시</h3>
      <p>알림 · 배지처럼 은은한 면으로 알릴 때 쓴다.</p>
      <TokenTable group="status" />

      <h2 id="change">색을 바꾸는 세 가지 방법</h2>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>바꾸고 싶은 범위</th>
              <th>방법</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                역할 하나
              </th>
              <td className="doc-wrap">
                <code>:root</code> 에서 그 역할을 덮는다. 짝(<code>-fg</code>)도
                함께 준다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                컴포넌트 하나
              </th>
              <td className="doc-wrap">
                <code>className</code> 으로 직접 쓴다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                브랜드 전체
              </th>
              <td className="doc-wrap">12단계를 함께 준다</td>
            </tr>
          </tbody>
        </table>
      </div>

      <pre className="doc-code">
        <code>{`/* 1) 역할 하나 */
:root {
  --nui-action-primary: #7c3aed;
  --nui-action-primary-fg: #fff;    /* 짝을 함께 준다 */
}

/* 2) 컴포넌트 하나 — !important 는 필요 없다 */
.my-tooltip {
  background: #222;
  color: #fff;
}

/* 3) 브랜드 전체 — 9단계만 바꾸면 단계 사이의 명도 관계가 깨진다 */
:root {
  --nui-color-brand-1: #fdf4ff;
  /* … 2 ~ 11 … */
  --nui-color-brand-9: #a21caf;
  --nui-color-brand-12: #3b0764;
  --nui-color-brand-contrast: #fff;   /* 9단계 위에 얹는 글자색 */
}`}</code>
      </pre>

      <div className="doc-note doc-note--warn">
        <strong>
          <code>--nui-button-bg</code> 같은 컴포넌트별 색 변수는 없다.
        </strong>{" "}
        배경만 바꾸면 글자색은 우리 것이 남아 대비가 깨지는데,{" "}
        <strong>그 사실이 화면에 드러나지 않는다</strong> — 저시력 사용자만
        겪는다. 위의 두 번째 방법(<code>className</code>)을 쓰면 배경과 글자를
        같은 자리에 쓰게 되므로 짝을 놓치기 어렵다.{" "}
        <strong>막는 게 아니라 짝을 지키는 경로로 보내는 것이다.</strong>
      </div>

      <h2>다크 테마</h2>
      <p>
        아직 없다. 다만 넣을 때 <strong>이름은 바뀌지 않는다</strong> — 12단계가{" "}
        <code>[data-theme=&quot;dark&quot;]</code> 에서 다른 값으로 다시
        선언되고, <code>action-primary</code> 같은 역할 이름은 그대로다.
        컴포넌트 CSS 는 한 줄도 고칠 필요가 없다.
      </p>

      <h2>팔레트 전량</h2>
      <p>
        위 스케일의 실제 값이다.{" "}
        <strong>컴포넌트에서 이 이름을 직접 쓰지 않는다.</strong>
      </p>
      <TokenTable group="color" />
    </>
  );
}
