import { HookTable, HOOK_COUNT } from "@/components/HookTable";

export const metadata = { title: "커스터마이징" };

export default function CustomizingPage() {
  return (
    <>
      <h1>커스터마이징</h1>
      <p className="doc-lead">
        여러분이 만질 수 있는 자리는 <strong>{HOOK_COUNT}개</strong>다. 무엇을
        열고 무엇을 막았는지, 그리고 왜 그런지.
      </p>

      <h2>
        <code>!important</code> 는 필요 없다
      </h2>
      <p>
        이 라이브러리의 CSS 는 전부 <code>@layer nui.*</code> 안에 있고,
        여러분이 그냥 쓴 CSS 는 레이어 밖이다. Cascade 는 상세도보다{" "}
        <strong>레이어를 먼저</strong> 보므로{" "}
        <strong>레이어 밖이 레이어 안을 항상 이긴다.</strong>
      </p>

      <pre className="doc-code">
        <code>{`origin  →  importance  →  @layer  →  specificity(상세도)
                          ↑
                  상세도보다 먼저 본다`}</code>
      </pre>

      <pre className="doc-code">
        <code>{`/* 이것으로 충분하다 */
.my-button { border-radius: 0; }

/* 우리 쪽은 상세도를 아무리 올려도 진다 */
@layer nui.components {
  html body .nui-button.nui-button--small { border-radius: 4px; }
}`}</code>
      </pre>

      <div className="doc-note doc-note--warn">
        <strong>
          오히려 <code>!important</code> 를 쓰면 자기 발등을 찍는다.
        </strong>
        <br />
        <code>
          .my-button {"{"} border-radius: 0 !important {"}"}
        </code>{" "}
        를 쓰면 <code>.my-button:hover</code> 의 값이 안 먹는다 — 자기 규칙끼리
        부딪힌다.
      </div>

      <h2>어디를 만지나 — 세 갈래</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>바꾸고 싶은 것</th>
              <th>방법</th>
              <th>범위</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                색
              </th>
              <td className="doc-wrap">
                <code>:root</code> 에서 <strong>역할(semantic)</strong> 덮어쓰기
              </td>
              <td className="doc-wrap">그 역할을 쓰는 모든 곳</td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                한 컴포넌트의 색
              </th>
              <td className="doc-wrap">
                <code>className</code> 으로 직접
              </td>
              <td className="doc-wrap">그 요소만</td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                치수 · 모양 · 선 두께
              </th>
              <td className="doc-wrap">
                <strong>컴포넌트별 변수</strong> {HOOK_COUNT}개
              </td>
              <td className="doc-wrap">그 컴포넌트 전부</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>이름을 읽는 법</h2>
      <p>
        <code>
          --nui-{"{"}컴포넌트{"}"}-{"{"}옵션{"}"}-{"{"}요소{"}"}-{"{"}속성
          {"}"}
        </code>{" "}
        — 읽으면 문장이 된다.
      </p>
      <pre className="doc-code">
        <code>{`--nui-button-lg-height        버튼 · large 옵션 · 높이
--nui-button-radius           버튼 · 둥글기 (옵션 없음)
--nui-button-border-width     버튼 · 테두리 두께 (옵션 없음)
--nui-datepicker-day-size     달력 · 날짜 · 크기 (요소 있음)`}</code>
      </pre>
      <ul>
        <li>
          <strong>옵션이 컴포넌트 이름 바로 뒤에 온다.</strong> &quot;large
          버튼을 통째로&quot; 손볼 때 <code>button-lg-*</code> 로 한자리에
          모이기 때문이다
        </li>
        <li>
          <strong>큰 것부터 lg · md · sm.</strong> 기본은 언제나 <code>md</code>{" "}
          다 — 위아래로 하나씩 있는 형태가 표준이고, <code>sm</code> 은
          &quot;가장 작은 것&quot;으로 읽힌다
        </li>
        <li>
          <strong>없는 옵션을 이름에 넣지 않는다.</strong>{" "}
          <code>border-width</code> 는 컴포넌트당 하나다
        </li>
      </ul>

      <div className="doc-note">
        <strong>크기마다 이름을 나눈 이유.</strong> 예전에는{" "}
        <code>--nui-button-min-height</code> 하나가 large · medium · small{" "}
        <strong>세 자리에 뚫려 있었다.</strong> 여기에 값을 넣으면 셋이 전부
        같은 높이가 되어 크기 variant 가 통째로 죽었다. 우리 레이어 안에서는
        막을 수 없으니 <strong>자리마다 이름을 나눴다.</strong>
      </div>

      <h2>전체 목록</h2>
      <p>
        이 표는 <code>packages/ui/src/styles/components/*.scss</code> 에서{" "}
        <strong>자동 생성된다.</strong> 손으로 적으면 코드가 바뀔 때 어긋난다 —
        실제로 그런 적이 있다.
      </p>
      <HookTable />

      <pre className="doc-code">
        <code>{`/* 전역으로 — 모든 버튼 */
:root {
  --nui-button-radius: 0;
  --nui-button-lg-height: 3.75rem;
  --nui-button-border-width: 2px;
}

/* 부분적으로 — 상속되므로 하위에만 적용된다 */
.compact-form {
  --nui-textfield-height: 2.5rem;
  --nui-select-height: 2.5rem;
}`}</code>
      </pre>

      <h2>막아둔 것</h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>무엇</th>
              <th>왜</th>
              <th>대신</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                컴포넌트별 색
              </th>
              <td className="doc-wrap">
                배경과 글자는 짝이다. 한쪽만 바꾸면 대비가 깨지는데{" "}
                <strong>화면에 드러나지 않는다</strong>
              </td>
              <td className="doc-wrap">
                역할 덮어쓰기 또는 <code>className</code>
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                포커스 링 두께
              </th>
              <td className="doc-wrap">
                얇아지면 키보드로 쓰는 사람만 영향을 받고, 마우스로 확인하는
                사람은 알아채지 못한다
              </td>
              <td className="doc-wrap">—</td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                바깥 여백 · 배치
              </th>
              <td className="doc-wrap">
                <code>margin</code> · <code>position</code> ·{" "}
                <code>z-index</code> 는 <strong>부모가 소유</strong>한다
              </td>
              <td className="doc-wrap">
                감싸는 요소에서 <code>className</code> 으로
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="doc-note doc-note--warn">
        <strong>
          <code>--nui-_</code> 로 시작하는 변수는 내부 배선이다.
        </strong>{" "}
        variant 가 값을 갈아끼우는 수단이라 덮어쓰면 variant 가 무력화된다. 공개
        API 가 아니며 예고 없이 바뀐다.
      </div>

      <h2>여는 것은 쉽고 닫는 것은 어렵다</h2>
      <p>
        변수를 <strong>새로 여는 것은 호환을 깨지 않지만</strong>, 열어둔 것을
        닫는 것은 여러분의 코드를 깨뜨린다. 그래서 적게 열고 시작한다. 필요한
        자리가 있으면 알려주면 된다 — 나중에 추가하는 것은 비싸지 않다.
      </p>
    </>
  );
}
