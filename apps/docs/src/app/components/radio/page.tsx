import { PropsTable } from "@/components/PropsTable";
import { RadioDemo } from "./RadioDemo";

export const metadata = { title: "Radio" };

export default function RadioPage() {
  return (
    <>
      <h1>Radio</h1>
      <p className="doc-lead">
        단일 선택. 같은 <code>name</code> 을 공유하는 항목끼리 배타 선택된다 —{" "}
        <code>RadioGroup</code> 이 <code>name</code> 을 하위에 전파한다.
      </p>

      <pre className="doc-code">
        <code>{`import { Radio, RadioGroup } from "@chansikchoi/next-ui";`}</code>
      </pre>

      <RadioDemo />

      <div className="doc-note">
        <code>RadioGroup</code> 은 <code>role=&quot;radiogroup&quot;</code> 이며
        Field 의 label 을 <code>aria-labelledby</code> 로 연결한다. 그룹 자체에{" "}
        <code>aria-invalid</code> 도 붙는다.
      </div>

      <h2>API</h2>
      <h3>Radio</h3>
      <PropsTable of="Radio" />
      <h3>RadioGroup</h3>
      <PropsTable of="RadioGroup" />
    </>
  );
}
