import { PropsTable } from "@/components/guide";
import { SwitchDemo } from "./SwitchDemo";

export const metadata = { title: "Switch" };

export default function SwitchPage() {
  return (
    <>
      <h1>Switch</h1>
      <p className="doc-lead">
        즉시 적용되는 켬/끔. 저장 버튼 없이 바로 반영되는 설정에 쓴다. 제출이
        필요한 동의 항목에는 <code>Checkbox</code> 가 맞다.
      </p>

      <pre className="doc-code">
        <code>{`import { Switch } from "@chansikchoi/next-ui";`}</code>
      </pre>

      <SwitchDemo />

      <div className="doc-note">
        내부적으로 <code>input[type=checkbox]</code> 에{" "}
        <code>role=&quot;switch&quot;</code> 를 붙인다. 스크린리더가 &quot;켬/
        끔&quot;으로 읽고, 체크박스가 아닌 스위치로 안내한다.
      </div>

      <h2>API</h2>
      <PropsTable of="Switch" />
    </>
  );
}
