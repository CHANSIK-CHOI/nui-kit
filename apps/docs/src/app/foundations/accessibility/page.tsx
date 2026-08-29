import Link from "next/link";
import { TokenTable } from "@/components/TokenTable";

export const metadata = { title: "접근성" };

/**
 * 실측치다. `npm run verify:a11y` 가 문서 사이트에서 getComputedStyle 로 재고
 * WCAG 2.1 공식으로 계산한다. 손으로 적은 값이 아니다.
 */
const CONTRAST: [string, string, string][] = [
  ["기본 버튼 라벨", "16.17:1", "rgb(28,32,29) on rgb(252,253,252)"],
  ["primary 버튼 라벨", "5.30:1", "rgb(255,255,255) on rgb(1,121,111)"],
  ["입력 글자", "16.17:1", "rgb(28,32,29) on rgb(252,253,252)"],
  ["에러 메시지", "5.11:1", "rgb(206,44,49) on rgb(252,253,252)"],
];

export default function AccessibilityPage() {
  return (
    <>
      <h1>접근성</h1>
      <p className="doc-lead">
        <strong>이 페이지가 정하는 것</strong> — 컴포넌트가 이미 보장하는 것과,
        여러분이 쓸 때 챙겨야 하는 것.
      </p>

      <div className="doc-note">
        <strong>컴포넌트 라이브러리의 접근성은 소비자가 고칠 수 없다.</strong>{" "}
        포커스 링이 없거나 대비가 모자라면 여러분이 CSS 로 덮기 전에는 그대로
        나간다. 그래서 여기서 보장한다 — 그리고{" "}
        <strong>기계로 검사한다.</strong>
      </div>

      <h2>명도 대비</h2>
      <p>
        기준은 <strong>WCAG 2.1 AA — 4.5:1</strong> 이다. 아래는 계산이 아니라{" "}
        <strong>실제 렌더된 화면에서 잰 값</strong>이다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>대상</th>
              <th>대비</th>
              <th>실측 색</th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST.map(([target, ratio, colors]) => (
              <tr key={target}>
                <th scope="row" className="doc-wrap">
                  {target}
                </th>
                <td>
                  <strong>{ratio}</strong>
                </td>
                <td className="doc-wrap">
                  <span className="doc-token-name">{colors}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <code>npm run verify:a11y</code> 가 브라우저에서 이 값을 다시 재고, AA
        에 미달하면 실패시킨다.
      </p>

      <div className="doc-note doc-note--warn">
        <strong>색을 바꾸면 이 보장이 깨질 수 있다.</strong> 특히 배경만 바꾸고
        글자색을 그대로 두면 대비가 무너지는데{" "}
        <strong>화면에서는 그게 안 보인다.</strong> 이것이 컴포넌트별 색 변수를
        두지 않은 이유다 — <Link href="/foundations/color#change">색 문서</Link>{" "}
        참조.
      </div>

      <p>
        <strong>색만으로 정보를 전달하지 않는다.</strong> 에러는 빨간 테두리만이
        아니라 <strong>아이콘 + 텍스트</strong>를 함께 준다. 색각 이상
        사용자에게 빨강과 초록은 구분되지 않는다.
      </p>

      <h2>터치 영역</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>기준</th>
              <th>크기</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">권장</th>
              <td>
                <strong>44 × 44px</strong> —{" "}
                <span className="doc-token-name">
                  --nui-size-control-option
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                디자인 제약으로 44px 이 어려울 때의 하한
              </th>
              <td>24 × 24px</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>보이는 크기와 누를 수 있는 크기는 다르다.</strong> 아이콘이 16px
        이어도 히트 영역은 44px 이어야 한다 — <code>padding</code> 이나
        가상요소(<code>::before</code> 확장)로 넓힌다.
      </p>

      <div className="doc-note doc-note--warn">
        <strong>선택 컨트롤은 예외가 필요하다.</strong> Checkbox · Radio 는
        22px, Switch 는 46×26 으로 <strong>컨트롤 자체가 44px 미만</strong>이다.
        이 경우 <strong>라벨을 포함한 클릭 영역</strong>이 44px 을 채운다 —
        라벨이 <code>&lt;label&gt;</code> 로 연결돼 있으면 자동으로 확보된다.
        <br />
        <br />
        <strong>라벨 없이 단독으로 쓴다면 여러분이 넓혀야 한다.</strong>
      </div>

      <h2>포커스</h2>
      <p>
        키보드로 이동할 때 &quot;지금 여기&quot;를 알리는 표시다.{" "}
        <code>:focus-visible</code> 로만 그리므로{" "}
        <strong>마우스로 눌렀을 때는 나타나지 않는다.</strong>
      </p>

      <h3>크기는 컨트롤 높이로 고른다</h3>
      <p>작은 컨트롤일수록 같은 굵기의 링이 더 두꺼워 보이기 때문이다.</p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>컨트롤</th>
              <th>토큰</th>
              <th>쓰는 곳</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">36px 미만</th>
              <td>
                <span className="doc-token-name">--nui-focus-ring-sm</span>
              </td>
              <td className="doc-wrap">달력 날짜 칸, 년/월 셀렉트</td>
            </tr>
            <tr>
              <th scope="row">36px 이상</th>
              <td>
                <span className="doc-token-name">--nui-focus-ring</span>
              </td>
              <td className="doc-wrap">Textfield · Select · Button</td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                선택 컨트롤
              </th>
              <td>
                <span className="doc-token-name">--nui-focus-ring-strong</span>
              </td>
              <td className="doc-wrap">
                Checkbox · Radio · Switch — 작지만 강조가 필요하다
              </td>
            </tr>
            <tr>
              <th scope="row">error</th>
              <td>
                <span className="doc-token-name">--nui-focus-ring-error</span>
              </td>
              <td className="doc-wrap">
                <strong>크기 규칙과 무관하게</strong> 에러면 이것
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <TokenTable group="focus" />

      <div className="doc-note doc-note--warn">
        <strong>
          <code>--nui-focus-width</code> 에는 컴포넌트별 변수를 두지 않았다.
        </strong>{" "}
        치수인데도 막은 유일한 값이다 — 얇아지면{" "}
        <strong>키보드로 쓰는 사람만 영향을 받고</strong>, 마우스로 확인하는
        사람은 알아채지 못한다. 색과 같은 성격이라 막았다.
      </div>

      <p>
        <code>outline: none</code> 을 쓸 때는 반드시 대체 표시(테두리 ·
        그림자)를 준다. 포커스 표시를 없애는 것은{" "}
        <strong>키보드 사용자에게서 커서를 뺏는 것</strong>과 같다.
      </p>

      <h2>모션 줄이기</h2>
      <p>
        OS 에서 &quot;동작 줄이기&quot;를 켠 사용자에게는{" "}
        <code>prefers-reduced-motion: reduce</code> 가 전달된다. 이때 모든{" "}
        <code>--nui-duration-*</code> 이 <strong>1ms 로 무력화</strong>된다.
      </p>
      <div className="doc-note doc-note--warn">
        <strong>시간을 하드코딩하면 이 장치를 우회한다.</strong>{" "}
        <code>transition: 0.2s</code> 라고 쓰면 설정을 켠 사용자에게도 그대로
        움직인다. 자세한 것은 <Link href="/foundations/motion">모션</Link> 문서.
      </div>

      <h2>메시지가 나타났다는 사실을 알린다</h2>
      <p>
        <code>aria-describedby</code> 는{" "}
        <strong>포커스가 그 컨트롤로 갔을 때</strong> 읽힌다. 그런데 폼 검증
        실패처럼 <strong>사용자 조작 없이</strong> 메시지가 생기는 경우에는
        포커스가 이동하지 않아 스크린리더가 침묵한다.
      </p>
      <p>
        그래서 에러 메시지 컨테이너에 <code>aria-live=&quot;polite&quot;</code>{" "}
        를 함께 건다. 둘 다 필요하다 —{" "}
        <strong>
          <code>describedby</code> 는 &quot;이 필드의 설명&quot;,{" "}
          <code>live</code> 는 &quot;지금 바뀌었다&quot;
        </strong>
        .
      </p>

      <h2>이미 보장하는 것</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>항목</th>
              <th>어떻게</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                라벨과 입력의 연결
              </th>
              <td className="doc-wrap">
                <code>Field</code> 가 <code>useId()</code> 로 만든 id 를 라벨과
                컨트롤이 함께 쓴다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                설명·에러 연결
              </th>
              <td className="doc-wrap">
                여러 개여도 <code>aria-describedby</code> 로 중복 없이 합친다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                에러 표시
              </th>
              <td className="doc-wrap">
                <code>aria-invalid</code> + 아이콘 + 텍스트 +{" "}
                <code>aria-live</code>
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                아이콘 전용 버튼
              </th>
              <td className="doc-wrap">sr-only 텍스트로 접근 이름을 준다</td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                그룹 컨트롤
              </th>
              <td className="doc-wrap">
                <code>fieldset</code> + <code>legend</code> 또는{" "}
                <code>role=&quot;group&quot;</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>여러분이 챙겨야 하는 것</h2>
      <ul>
        <li>
          <strong>
            <code>IconButton</code> 에 <code>aria-label</code> 을 준다.
          </strong>{" "}
          없으면 스크린리더가 읽을 것이 없다
        </li>
        <li>
          <strong>placeholder 를 라벨 대신 쓰지 않는다.</strong> 입력을 시작하면
          사라진다
        </li>
        <li>
          <strong>우리가 정한 기본 문자열은 바꿀 수 있다.</strong> sr-only
          라벨(&quot;내용 지우기&quot;), Datepicker 의 요일 이름, Confirm 의
          버튼 문구는 전부 prop 으로 덮어쓴다 — 다국어 앱에서 한국어가 그대로
          노출되지 않도록
        </li>
        <li>
          <strong>번역하면 라벨이 최대 2.5배까지 늘어난다.</strong> 자기 치수를
          갖는 컨트롤(Switch · Checkbox) 옆의 긴 라벨이 컨트롤을 찌그러뜨리지
          않는지 확인한다
        </li>
      </ul>
    </>
  );
}
