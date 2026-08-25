import { PropsTable } from "@/components/PropsTable";
import { SelectDemo } from "./SelectDemo";

export const metadata = { title: "Select" };

export default function SelectPage() {
  return (
    <>
      <h1>Select</h1>
      <p className="doc-lead">
        드롭다운 선택 컨트롤. 내부적으로 <code>react-select</code> 을 쓰지만{" "}
        <strong>값은 옵션 객체가 아니라 원시값으로 주고받는다</strong> — 폼
        상태에 그대로 넣을 수 있다. 다중 선택은 <code>MultiSelect</code> 다.
      </p>

      <pre className="doc-code">
        <code>{`import { Select, MultiSelect } from "@chansikchoi/next-ui";

const OPTIONS = [
  { label: "서울", value: "seoul" },
  { label: "부산", value: "busan" },
];

<Select options={OPTIONS} value={city} onChange={setCity} />
<MultiSelect options={OPTIONS} value={cities} onChange={setCities} />`}</code>
      </pre>

      <div className="doc-note">
        <strong>controlled 전용이다.</strong> <code>value</code> 와{" "}
        <code>onChange</code> 를 소비자가 소유한다.{" "}
        <code>onChange</code> 의 첫 인자가 원시값이고, 두 번째·세 번째로
        react-select 의 옵션 객체와 <code>actionMeta</code> 가 함께 온다.
        react-hook-form 을 쓴다면 <code>@chansikchoi/next-ui/rhf</code> 의{" "}
        <code>RHFSelect</code> · <code>RHFMultiSelect</code> 를 쓴다.
      </div>

      <SelectDemo />

      <h2>스타일 커스터마이징</h2>
      <p>
        컨트롤 외형은 공개 CSS 변수로 조정한다. 이 변수들은 라이브러리
        레이어(<code>@layer nui.components</code>) 밖에서 선언하면 언제나
        우선한다.
      </p>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>변수</th>
              <th>기본값</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>--nui-select-height</code>
              </td>
              <td>
                <code>--nui-size-field</code>
              </td>
              <td className="doc-wrap">컨트롤 최소 높이</td>
            </tr>
            <tr>
              <td>
                <code>--nui-select-radius</code>
              </td>
              <td>
                <code>--nui-radius-sm</code>
              </td>
              <td className="doc-wrap">모서리 반경</td>
            </tr>
            <tr>
              <td>
                <code>--nui-select-border-color</code>
              </td>
              <td>
                <code>--nui-control-border</code>
              </td>
              <td className="doc-wrap">테두리 색</td>
            </tr>
            <tr>
              <td>
                <code>--nui-select-bg</code>
              </td>
              <td>
                <code>--nui-control-bg</code>
              </td>
              <td className="doc-wrap">배경색</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="doc-note doc-note--warn">
        <strong>
          react-select 의 <code>styles</code> prop 은 우리 CSS 를 이긴다.
        </strong>{" "}
        react-select 은 emotion 으로 스타일을 주입하는데, 그 클래스는 CSS
        레이어 밖에 있어 <code>@layer nui.components</code> 안의 우리 규칙보다
        항상 우선한다. 그래서 이 컴포넌트는 <code>unstyled</code> 로 구동하면서{" "}
        <strong>충돌하는 속성만 emotion 쪽에서 걷어내</strong> CSS 가 책임지게
        한다. <code>styles</code> prop 을 직접 넘기면 그 정리된 값 위에 얹히므로
        의도한 대로 덧칠할 수 있다. 반대로 메뉴 최대 높이처럼 react-select 이
        배치 계산에 쓰는 값은 CSS 가 아니라 <code>maxMenuHeight</code> prop 으로
        조정해야 한다.
      </div>

      <div className="doc-note doc-note--warn">
        <strong>
          <code>components</code> 는 렌더 밖에서 선언한다.
        </strong>{" "}
        매 렌더 새 컴포넌트 함수를 넘기면 react-select 이 내부 input 을 remount 해{" "}
        <strong>포커스와 입력 중이던 검색어가 사라진다.</strong> react-select
        공식 문서도 같은 것을 권고한다.
        <pre className="doc-code" style={{ marginTop: 10, marginBottom: 0 }}>
          <code>{`// ❌ 렌더 안에서 컴포넌트를 새로 만든다
<Select components={{ Option: (props) => <CustomOption {...props} /> }} />

// ✅ 모듈 스코프에 한 번만 선언한다
const SELECT_COMPONENTS = { Option: CustomOption };
<Select components={SELECT_COMPONENTS} />`}</code>
        </pre>
        <p style={{ marginBottom: 0 }}>
          <code>styles</code> 는 컴포넌트가 아니라 함수 객체라 인라인으로 넘겨도
          remount 되지 않는다.
        </p>
      </div>

      <div className="doc-note">
        <code>value</code> 는 <code>options</code> 안에 존재하는 값이어야 한다.
        옵션을 비동기로 불러오는 동안처럼 <code>options</code> 에 없는 값을 넣으면
        선택이 표시되지 않고 placeholder 가 보인다 — 원시값 API 의 구조적 특성이다.
      </div>

      <h2>접근성</h2>
      <ul>
        <li>
          <code>Field</code> 안에서는 라벨의 <code>htmlFor</code> 와 컨트롤의{" "}
          <code>id</code> 가 자동으로 연결된다
        </li>
        <li>
          설명·에러 메시지 id 는 <code>aria-describedby</code> 로 중복 없이
          합쳐진다
        </li>
        <li>
          에러일 때 <code>aria-invalid</code> 가 붙고, 메시지는 색이 아니라{" "}
          <strong>아이콘 + 텍스트</strong>로 표시된다
        </li>
        <li>
          키보드로 조작한다 — <kbd>↑</kbd> <kbd>↓</kbd> 로 이동,{" "}
          <kbd>Enter</kbd> 로 선택, <kbd>Esc</kbd> 로 닫기
        </li>
        <li>
          <code>readOnly</code> 는 포커스는 받되 메뉴를 열지 않는다.{" "}
          <code>disabled</code> 는 포커스 자체를 받지 않는다
        </li>
      </ul>

      <h2>API</h2>
      <p>
        아래 표는 이 라이브러리가 정의한 prop 이다. 여기에 없는{" "}
        <code>react-select</code> 의 prop(<code>menuPlacement</code>,{" "}
        <code>maxMenuHeight</code>, <code>closeMenuOnSelect</code> 등)도 그대로
        전달된다. 단 <code>defaultValue</code>(controlled 전용),{" "}
        <code>getOptionValue</code>(원시값 매칭이 <code>value</code> 고정),{" "}
        <code>theme</code>(<code>unstyled</code> 라 효과 없음) 은 받지 않는다.
      </p>
      <h3>Select</h3>
      <PropsTable of="Select" />
      <h3>MultiSelect</h3>
      <PropsTable of="MultiSelect" />
    </>
  );
}
