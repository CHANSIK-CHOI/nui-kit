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
        어떤 색이 있고 각 색이 무슨 역할인지 정한다. 어떤 상태일 때 무엇을
        쓰는지는 <Link href="/foundations/state">상태</Link> 문서에 있다.
      </p>

      <h2 id="change">색을 바꾸는 방법 두 가지</h2>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>범위</th>
              <th>방법</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                화면 전체
              </th>
              <td className="doc-wrap">
                <Link href="/brand-colors">브랜드 프리셋 185색</Link> 에서
                고른다. 명령 한 줄이 <code>nui-theme.css</code> 를 만든다.
                라이브러리 CSS 뒤에 불러오면 끝난다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                한 컴포넌트
              </th>
              <td className="doc-wrap">
                <code>className</code> 으로 직접 지정한다. 배경과 글자를 같은
                자리에 쓰게 되므로 짝을 놓치기 어렵다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <pre className="doc-code">
        <code>{`/* 1) 화면 전체 */
import "@chansikchoi/next-ui/styles/index.css";
import "./nui-theme.css";

/* 2) 한 컴포넌트 — !important 는 필요 없다 */
.my-tooltip {
  background: #222;
  color: #fff;
}`}</code>
      </pre>

      <div className="doc-note doc-note--warn">
        <strong>컴포넌트별 색 변수는 제공하지 않는다.</strong> 배경만 바꾸면
        글자색은 라이브러리 값이 남아 대비가 조용히 깨진다. 그 사실은 화면에
        드러나지 않는다. semantic 변수를 <code>:root</code> 에서 덮어쓰는 방법도
        같은 이유로 지원하지 않는다.
      </div>

      <h2>역할별 색</h2>
      <p>
        <code>className</code> 으로 색을 맞출 때 아래 이름을 참조한다.
      </p>

      <h3>글자</h3>
      <p>
        글자로 쓸 수 있는 단계는 11번과 12번뿐이다. 9번과 10번은 채워진 배경
        자리라 글자로 쓰면 대비가 3점대로 떨어진다. <code>text-disabled</code>{" "}
        만 9번을 쓴다. 비활성 요소는 WCAG 대비 요구에서 빠지기 때문이다.
      </p>
      <TokenTable group="text" />

      <h3>면</h3>
      <p>
        면은 콘텐츠를 담는 것의 배경이다. 글자나 아이콘이 아니라 화면의 층을
        만든다. 층의 순서는 <Link href="/foundations/elevation">깊이</Link>{" "}
        문서에 있다.
      </p>
      <TokenTable group="layer" />

      <h3>선</h3>
      <p>
        선 색은 굵기가 아니라 등장 빈도로 나눈다. 고르는 기준과 두께는{" "}
        <Link href="/foundations/shape">모양과 선</Link> 문서에 있다.
      </p>
      <TokenTable group="border" omit="border-width" />

      <h3>액션</h3>
      <p>
        액션은 버튼 계열이다. 색이 아니라 역할이 이름이라 이 버튼이 삭제인지만
        물으면 정해진다. 각 역할의 <code>-fg</code> 는 그 배경 위에서 대비 4.5
        대 1 을 넘는 글자색이다.
      </p>
      <TokenTable group="action" />
      <div className="doc-note">
        <strong>
          <code>action-warning</code> 만 글자가 어둡다.
        </strong>{" "}
        노랑 배경에 흰 글자는 대비가 크게 미달한다. 노랑을 어둡게 하면 갈색이
        되어 주의의 의미를 잃으므로 배경을 밝게 두고 글자를 어둡게 했다.
      </div>

      <h3>입력 컨트롤</h3>
      <p>
        입력 컨트롤 색은 <code>Textfield</code> 와 <code>Select</code>,{" "}
        <code>Checkbox</code> 처럼 값을 받는 것들이 공유한다.
      </p>
      <TokenTable group="control" />

      <h3>상태 표시</h3>
      <p>상태 표시는 알림이나 배지처럼 은은한 면으로 알릴 때 쓴다.</p>
      <TokenTable group="status" />

      <h2>12단계 팔레트</h2>
      <p>
        모든 색이 12단계를 갖고 단계마다 쓸 자리가 정해져 있다. 어느 색을 쓰든
        테두리는 7번, 채워진 배경은 9번이다.
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
        밝은 쪽 1번부터 7번까지는 어두운 글자를, 어두운 쪽 8번부터 12번까지는
        밝은 글자를 얹도록 만들었다. 스케일이 그 경계에서 뒤집히므로{" "}
        <strong>같은 번호를 쓰면 대비가 자동으로 확보된다.</strong>
      </div>

      <h2>다크 테마</h2>
      <p>
        아직 없다. 넣을 때도 이름은 바뀌지 않는다. 12단계가{" "}
        <code>data-theme</code> 에서 다른 값으로 다시 선언되고{" "}
        <code>action-primary</code> 같은 역할 이름은 그대로다. 컴포넌트 CSS 는
        고칠 필요가 없다.
      </p>

      <h2>팔레트 전량</h2>
      <p>
        컴포넌트는 팔레트를 직접 참조하지 않는다. 참조하면 브랜드 색을 바꿔도 그
        컴포넌트만 옛 색으로 남는다.
      </p>
      <TokenTable group="color" />
    </>
  );
}
