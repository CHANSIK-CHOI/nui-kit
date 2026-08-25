import { PropsTable } from "@/components/PropsTable";
import { CheckboxDemo } from "./CheckboxDemo";

export const metadata = { title: "Checkbox" };

export default function CheckboxPage() {
  return (
    <>
      <h1>Checkbox</h1>
      <p className="doc-lead">
        다중 선택. 네이티브 <code>input[type=checkbox]</code> 를 투명하게 덮고
        시각 표현은 형제 요소가 담당한다 — 접근성과 키보드 조작을 그대로
        유지하면서 OS 별 렌더 차이를 배제하기 위해서다.
      </p>

      <pre className="doc-code">
        <code>{`import { Checkbox, CheckboxGroup } from "@chansikchoi/next-ui";`}</code>
      </pre>

      <CheckboxDemo />

      <h2>readOnly 에 대하여</h2>
      <div className="doc-note">
        네이티브 checkbox 에는 <code>readonly</code> 가 없다(무시된다). 그래서
        클릭과 Space·Enter 키를 직접 막고 <code>aria-readonly</code> 를 붙인다.
        <strong>disabled 와 달리 포커스는 유지</strong>되므로 스크린리더가 값을
        읽을 수 있다.
      </div>

      <h2>controlled 입력 규칙</h2>
      <div className="doc-note doc-note--warn">
        React 는 <code>checked</code> 를 주면서 <code>onChange</code> 가 없으면
        콘솔 경고를 낸다.{" "}
        <strong>
          <code>disabled</code> 로는 이 경고가 막히지 않는다
        </strong>{" "}
        — 표시 전용으로 쓸 때는 <code>readOnly</code> 를 함께 준다.
        <pre className="doc-code" style={{ marginTop: 10, marginBottom: 0 }}>
          <code>{`// ⚠️ 콘솔 경고
<Checkbox checked disabled />

// ✅
<Checkbox checked disabled readOnly />
<Checkbox checked onChange={handleChange} />`}</code>
        </pre>
      </div>

      <h2>API</h2>
      <h3>Checkbox</h3>
      <PropsTable of="Checkbox" />
      <h3>CheckboxGroup</h3>
      <PropsTable of="CheckboxGroup" />
    </>
  );
}
