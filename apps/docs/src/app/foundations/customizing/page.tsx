import Link from "next/link";
import { HookTable, HOOK_COUNT } from "@/components/guide";

export const metadata = { title: "커스터마이징" };

export default function CustomizingPage() {
  return (
    <>
      <h1>커스터마이징</h1>
      <p className="doc-lead">
        만질 수 있는 자리는 <strong>{HOOK_COUNT}개</strong>다. CSS 변수를
        덮어쓰면 값이 바뀐다.
      </p>

      <h2>
        <code>!important</code> 가 필요 없다
      </h2>
      <p>
        라이브러리 CSS 는 전부 <code>@layer nui.*</code> 안에 있다. Cascade 는
        상세도보다 레이어를 먼저 보므로 레이어 밖 선언이 항상 이긴다. 상세도를
        아무리 올려도 라이브러리 쪽이 진다.
      </p>

      <pre className="doc-code">
        <code>{`origin  →  importance  →  @layer  →  specificity(상세도)
                          ↑
                  상세도보다 먼저 본다`}</code>
      </pre>

      <pre className="doc-code">
        <code>{`/* 이것으로 충분하다 */
.my-button { border-radius: 0; }

/* 라이브러리 쪽은 상세도를 아무리 올려도 진다 */
@layer nui.components {
  html body .nui-button.nui-button--small { border-radius: 4px; }
}`}</code>
      </pre>

      <div className="doc-note doc-note--warn">
        <code>!important</code> 를 쓰면 오히려 자기 규칙끼리 부딪힌다.{" "}
        <code>.my-button</code> 에 <code>!important</code> 를 걸면{" "}
        <code>.my-button:hover</code> 의 값이 먹지 않는다.
      </div>

      <h2>어디를 만지나</h2>
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
                <Link href="/design-system/color">
                  프리셋 · <code>npx nui-theme</code> 또는 className
                </Link>
              </td>
              <td className="doc-wrap">화면 전체 또는 그 요소만</td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                치수 · 모양 · 선 두께
              </th>
              <td className="doc-wrap">컴포넌트별 변수 {HOOK_COUNT}개</td>
              <td className="doc-wrap">그 컴포넌트 전부</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>변수 이름을 읽는 법</h2>
      <p>
        이름은 컴포넌트, 옵션, 요소, 속성 순서로 붙는다. 읽으면 문장이 된다.
      </p>
      <pre className="doc-code">
        <code>{`--nui-button--large-height      버튼 · large 옵션 · 높이
--nui-button--large-radius      버튼 · large 옵션 · 둥글기 (크기마다 따로)
--nui-button--border-width      버튼 · 테두리 두께 (옵션 없음)
--nui-icon-button--medium-size  아이콘 버튼 · medium 옵션 · 크기
--nui-datepicker--day-size      달력 · 날짜 · 크기 (요소 있음)`}</code>
      </pre>
      <ul>
        <li>
          옵션이 컴포넌트 이름 바로 뒤에 온다. large 버튼을 통째로 손볼 때
          한자리에 모이기 때문이다
        </li>
        <li>
          옵션 이름은 prop 값 그대로다. <code>size=&quot;large&quot;</code> 면{" "}
          <code>--large-</code>, <code>shape=&quot;round&quot;</code> 면{" "}
          <code>--round-</code> 다
        </li>
        <li>
          크기 옵션마다 이름을 나눈다. 하나로 덮으면 세 크기가 전부 같아진다
        </li>
        <li>없는 옵션은 이름에 넣지 않는다. 테두리 두께는 컴포넌트당 하나다</li>
        <li>
          컴포넌트가 다르면 이름도 다르다. <code>Button</code> 은{" "}
          <code>--nui-button--</code>, <code>IconButton</code> 은{" "}
          <code>--nui-icon-button--</code> 다
        </li>
      </ul>

      <h2>전체 목록</h2>
      <p>이 표는 컴포넌트 SCSS 에서 자동 생성한다.</p>
      <HookTable />

      <pre className="doc-code">
        <code>{`/* 전역으로 — 모든 버튼 */
:root {
  --nui-button--medium-radius: 0;
  --nui-button--large-height: 3.75rem;
  --nui-button--border-width: 2px;
}

/* 부분적으로 — 상속되므로 하위에만 적용된다. 옵션 낱말은 prop 값 그대로다 */
.compact-form {
  --nui-textfield--medium-height: 2.5rem;
  --nui-select--medium-height: 2.5rem;
}`}</code>
      </pre>

      <h2>막아둔 것</h2>
      <p>
        색 · 포커스 링 두께 · 바깥 여백은 변수로 열려 있지 않다. 각각의 이유는{" "}
        <Link href="/design-system">디자인 시스템</Link> 의 「바꿀 수 있는 것과
        없는 것」 에 있다.
      </p>

      <div className="doc-note doc-note--warn">
        <strong>
          <code>--nui-_</code> 로 시작하는 변수는 내부 배선이다.
        </strong>{" "}
        variant 가 값을 갈아끼우는 수단이라 덮어쓰면 variant 가 무력화된다. 공개
        API 가 아니라 예고 없이 바뀐다.
      </div>

      <h2>필요한 자리가 있으면 알려달라</h2>
      <p>
        변수를 새로 여는 것은 호환을 깨지 않는다. 열어둔 것을 닫으면 쓰는 쪽
        코드가 깨지므로 적게 열고 시작했다. 나중에 추가하는 비용은 크지 않다.
      </p>
    </>
  );
}
