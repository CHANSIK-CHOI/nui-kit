import Link from "next/link";
import { TokenTable } from "@/components/TokenTable";

export const metadata = { title: "상태" };

const INPUT: [string, string, string, string][] = [
  ["default", "control-bg", "control-border", "control-text"],
  ["hover", "변화 없음", "control-border-hover", "—"],
  ["focus", "—", "focus-color + 링", "—"],
  [
    "disabled",
    "control-bg-disabled",
    "control-border-disabled",
    "control-text-disabled",
  ],
  [
    "readonly",
    "control-bg-readonly",
    "control-border-disabled",
    "control-text-muted",
  ],
  ["error", "control-bg", "control-border-error", "control-text-error"],
  ["placeholder", "—", "—", "control-text-placeholder"],
];

const CHOICE: [string, string, string][] = [
  ["default", "control-bg", "control-border"],
  ["hover", "변화 없음", "control-accent"],
  ["focus", "—", "focus-color + focus-ring-strong"],
  ["checked", "control-accent", "control-accent"],
  ["checked + error", "control-accent-error", "control-accent-error"],
  [
    "checked + disabled",
    "control-selection-disabled",
    "control-selection-disabled",
  ],
  ["disabled", "control-bg-subtle", "control-border-disabled"],
  ["readonly", "control-bg-readonly", "default 유지"],
];

export default function StatePage() {
  return (
    <>
      <h1>상태</h1>
      <p className="doc-lead">
        <strong>이 페이지가 정하는 것</strong> — 컨트롤이 어떤 상태일 때 무엇이
        바뀌는가, 그리고 <strong>상태가 겹칠 때 어떻게 되는가.</strong> 색
        자체의 목록은 <Link href="/foundations/color">색</Link> 문서에 있다.
      </p>

      <h2>상태에는 두 종류가 있다</h2>
      <p>
        이 구분이 겹침 규칙의 근거다. <strong>누가 그 상태를 만드는가</strong>가
        다르다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th />
              <th>상호작용 상태</th>
              <th>옵션 상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">만드는 주체</th>
              <td>사용자</td>
              <td>여러분(개발자)</td>
            </tr>
            <tr>
              <th scope="row">예</th>
              <td>
                <code>hover</code> · <code>focus</code> · <code>active</code>
              </td>
              <td>
                <code>disabled</code> · <code>readonly</code> ·{" "}
                <code>error</code> · <code>checked</code>
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                언제 바뀌나
              </th>
              <td className="doc-wrap">마우스·키보드 조작에 따라 즉시</td>
              <td className="doc-wrap">prop 을 주는 동안 계속</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>컨트롤을 두 부류로 나눈다</h2>
      <p>
        어느 쪽인지만 정하면 색은 표에서 읽는다.{" "}
        <strong>고를 여지를 남기지 않는 것이 목적이다.</strong>
      </p>

      <h3>입력 컨트롤 — 타이핑하거나 목록에서 고르는 것</h3>
      <p>
        <code>Textfield</code> · <code>Textarea</code> · <code>Search</code> ·{" "}
        <code>Password</code> · <code>Select</code> · <code>MultiSelect</code> ·{" "}
        <code>Datepicker</code> 계열.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>상태</th>
              <th>배경</th>
              <th>테두리</th>
              <th>글자</th>
            </tr>
          </thead>
          <tbody>
            {INPUT.map(([state, bg, border, text]) => (
              <tr key={state}>
                <th scope="row">{state}</th>
                {[bg, border, text].map((v, i) => (
                  <td key={i} className="doc-wrap">
                    {v.includes("-") && v !== "변화 없음" ? (
                      <code>{v}</code>
                    ) : (
                      v
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>선택 컨트롤 — 켜고 끄는 것</h3>
      <p>
        <code>Checkbox</code> · <code>Radio</code> · <code>Switch</code>.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>상태</th>
              <th>배경</th>
              <th>테두리</th>
            </tr>
          </thead>
          <tbody>
            {CHOICE.map(([state, bg, border]) => (
              <tr key={state}>
                <th scope="row">{state}</th>
                {[bg, border].map((v, i) => (
                  <td key={i} className="doc-wrap">
                    {v.includes("-") &&
                    !v.startsWith("변화") &&
                    !v.startsWith("default") ? (
                      <code>{v}</code>
                    ) : (
                      v
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="doc-note">
        <strong>hover 테두리가 두 부류에서 다른 것은 의도다.</strong> 입력
        컨트롤은 회색으로, 선택 컨트롤은 초록으로 바뀐다. 선택 컨트롤은 hover
        직후 클릭 한 번으로 값이 확정되므로 <strong>미리 강조</strong>한다. 입력
        컨트롤은 hover 해도 아직 아무 일도 일어나지 않는다.
      </div>

      <h2>상태가 겹칠 때</h2>
      <p>겹침에는 두 가지가 있다 — 하나만 이기는 것과, 함께 그리는 것.</p>

      <h3>하나만 이긴다</h3>
      <pre className="doc-code">
        <code>{`disabled   >   error   >   readonly`}</code>
      </pre>
      <p>
        셋은 CSS 상세도가 같다. 그래서{" "}
        <strong>소스에 나중에 쓴 규칙이 이긴다</strong> — 파일 안에서 순서만
        바꿔도 색이 조용히 뒤바뀐다. 우선순위를 <code>:not()</code> 으로 명시해
        순서에 의존하지 않게 한다.
      </p>
      <div className="doc-note doc-note--warn">
        <strong>실제로 겪은 사고다.</strong> Switch 에서 <code>readonly</code>{" "}
        가 <code>error</code> 를 덮어 <strong>에러 스위치가 초록으로</strong>{" "}
        렌더된 적이 있다. 타입 검사도 CSS 격리 검사도 전부 통과했고
        브라우저에서만 드러났다.
      </div>

      <h3>함께 그린다</h3>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>조합</th>
              <th>결과</th>
              <th>왜</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="doc-wrap">
                checked + error
              </th>
              <td className="doc-wrap">
                <code>control-accent-error</code>
              </td>
              <td className="doc-wrap">
                선택됐지만 잘못된 선택임을 함께 보인다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                hover + error
              </th>
              <td className="doc-wrap">
                테두리는 <strong>에러 색을 유지</strong>
              </td>
              <td className="doc-wrap">
                hover 로 덮으면 에러가 사라진 것처럼 보인다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                focus + error
              </th>
              <td className="doc-wrap">
                테두리 에러 색 + <code>focus-ring-error</code>
              </td>
              <td className="doc-wrap">
                고쳐야 할 자리로 이동했다는 것까지 알린다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                focus + readonly
              </th>
              <td className="doc-wrap">
                링을 <strong>그린다</strong>. 배경은 readonly 유지
              </td>
              <td className="doc-wrap">
                readonly 도 포커스를 받는다 — 값을 읽을 수 있어야 한다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                hover + disabled
              </th>
              <td className="doc-wrap">
                <strong>아무것도 그리지 않는다</strong>
              </td>
              <td className="doc-wrap">
                누를 수 없는 것에 반응을 주면 누를 수 있다고 오해한다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                hover + readonly
              </th>
              <td className="doc-wrap">테두리 변화 없음</td>
              <td className="doc-wrap">바꿀 수 없는 값이다</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>
        <code>disabled</code> 와 <code>readonly</code> 중 무엇을 쓰나
      </h2>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th />
              <th>뜻</th>
              <th>예</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <code>disabled</code>
              </th>
              <td className="doc-wrap">
                지금은 안 되지만 <strong>조건이 맞으면 된다</strong>
              </td>
              <td className="doc-wrap">필수 항목 미입력 시의 제출 버튼</td>
            </tr>
            <tr>
              <th scope="row">
                <code>readonly</code>
              </th>
              <td className="doc-wrap">
                <strong>값은 보여주되 바꿀 수 없다</strong>
              </td>
              <td className="doc-wrap">조회 전용 필드</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>영구적으로 쓸 수 없는 것은 애초에 렌더하지 않는다.</strong>{" "}
        disabled 로 남겨두면 사용자는 &quot;어떻게 하면 활성화되지&quot;를
        찾는다.
      </p>

      <h2>면 전체가 반응할 때</h2>
      <p>
        목록 행, 패널 헤더, 아이콘 전용 버튼처럼 <strong>면이 통째로</strong>{" "}
        반응하는 자리는 <code>control-bg-hover</code> 하나로 통일한다.
      </p>
      <div className="doc-note doc-note--warn">
        <code>surface-neutral-soft</code> · <code>surface-neutral-subtle</code>{" "}
        을 hover 에 쓰지 않는다. 그 둘은 <strong>정적인 면</strong>(카드 · 구분
        영역)의 배경이다. 예전에 이 구분이 없어 hover 배경에 세 가지 토큰이 섞여
        있었고, 그게 이 문서를 만든 이유다.
      </div>

      <h2>색이 아닌 상태 표현</h2>
      <p>
        비활성이나 눌림을 색이 아니라 <strong>투명도</strong>로 표현하는 자리가
        있다. 규칙이 이미 있는 값만 토큰으로 만들었다.
      </p>
      <TokenTable group="etc" only="opacity-" swatch={false} />
      <div className="doc-note">
        <strong>규칙 밖의 투명도가 아직 남아 있다</strong> — Datepicker
        이전/다음 버튼(0.3) · 날짜(0.45) · Button 비활성(0.72) · Select
        multi-value(0.7). &quot;비활성&quot;이라는 같은 상태에 다른 값을 쓰는
        자리다. 어느 값으로 모을지 정하면 시각이 바뀌므로 아직 손대지 않았다.
      </div>
    </>
  );
}
