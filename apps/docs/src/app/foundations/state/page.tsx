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
  [
    "error",
    "control-bg",
    "control-border-error",
    "변화 없음 · caret · 단위만 control-text-error",
  ],
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
        컨트롤이 어떤 상태일 때 무엇이 바뀌는지, 상태가 겹칠 때 어떻게 되는지
        정한다. 색 자체의 목록은 <Link href="/foundations/color">색</Link>{" "}
        문서에 있다.
      </p>

      <h2>상태에는 두 종류가 있다</h2>
      <p>누가 그 상태를 만드는지가 다르다. 이 구분이 겹침 규칙의 근거다.</p>
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
              <td>개발자</td>
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
      <p>어느 쪽인지 정하면 색은 표에서 읽는다.</p>

      <h3>입력 컨트롤</h3>
      <p>타이핑하거나 목록에서 고르는 것이다.</p>
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

      <h3>선택 컨트롤</h3>
      <p>켜고 끄는 것이다.</p>
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
        직후 클릭 한 번으로 값이 확정되므로 미리 강조한다. 입력 컨트롤은 hover
        해도 아직 아무 일도 일어나지 않는다.
      </div>

      <h2>상태가 겹칠 때</h2>
      <p>겹침에는 두 가지가 있다. 하나만 이기는 것과 함께 그리는 것이다.</p>

      <h3>하나만 이긴다</h3>
      <pre className="doc-code">
        <code>{`disabled   >   error   >   readonly`}</code>
      </pre>
      <p>
        셋은 CSS 상세도가 같아서 소스에 나중에 쓴 규칙이 이긴다. 파일 안에서
        순서만 바꿔도 색이 조용히 뒤바뀐다. 우선순위를 <code>:not()</code> 으로
        명시해 순서에 의존하지 않게 했다.
      </p>
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
              <td className="doc-wrap">테두리는 에러 색을 유지</td>
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
              <td className="doc-wrap">링을 그린다. 배경은 readonly 유지</td>
              <td className="doc-wrap">
                readonly 도 포커스를 받는다. 값을 읽을 수 있어야 한다
              </td>
            </tr>
            <tr>
              <th scope="row" className="doc-wrap">
                hover + disabled
              </th>
              <td className="doc-wrap">아무것도 그리지 않는다</td>
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
              <td className="doc-wrap">지금은 안 되지만 조건이 맞으면 된다</td>
              <td className="doc-wrap">필수 항목 미입력 시의 제출 버튼</td>
            </tr>
            <tr>
              <th scope="row">
                <code>readonly</code>
              </th>
              <td className="doc-wrap">값은 보여주되 바꿀 수 없다</td>
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
        목록 행, 패널 헤더, 아이콘 전용 버튼처럼 면이 통째로 반응하는 자리는 두
        값으로 통일한다. hover 는 <code>control-bg-hover</code>, 누르는 순간은{" "}
        <code>control-bg-active</code>. 둘 다 반투명이라 카드 위든 패널 위든
        다크든 같은 진하기가 된다. 비활성은 배경을 바꾸지 않고 글자만{" "}
        <code>action-fg-disabled</code> 로 바꾼다.
      </p>
      <div className="doc-note doc-note--warn">
        <code>surface-neutral-soft</code> · <code>surface-neutral-subtle</code>{" "}
        · <code>control-bg-subtle</code> · <code>control-bg-readonly</code> 를
        hover 에 쓰지 않는다. 카드·구분 영역·읽기 전용처럼 정적인 면의 배경이다.{" "}
        <code>verify:tokens</code> 가 잡는다.
      </div>
      <p>
        <strong>hover 는 hover 가 있는 기기에서만 그린다.</strong> 터치 기기는
        탭한 뒤에 hover 가 남아 버튼이 눌린 채로 보인다. 모든 hover 가{" "}
        <code>@media (hover: hover)</code> 안에 있다.
      </p>

      <h2>색이 아닌 상태 표현</h2>
      <p>
        투명도로 표현하는 자리는 없다. 비활성 아이콘은{" "}
        <code>control-icon-disabled</code>, 버튼의 hover·pressed 는 같은 색조의
        다음 단계(<code>action-*-hover</code> · <code>-active</code>)다. 정부
        가이드라인(KRDS)이 비활성에 투명도를 쓰지 말라고 해서 맞췄다. 비활성
        글자는 대비 요구에서 빠지지만{" "}
        <strong>2.0:1 아래로는 내려가지 않는다</strong> — 회색이 배경에 녹으면
        &quot;비활성&quot;이 아니라 &quot;없음&quot;으로 읽힌다.
      </p>
    </>
  );
}
