import { Radio } from "@chansikchoi/next-ui";
import {
  GuideHeader,
  ChoiceStateCases,
  HookTable,
  PropsTable,
} from "@/components/guide";
import { RadioDemo } from "./RadioDemo";
import { RHFRadioDemo } from "./RHFRadioDemo";

export const metadata = { title: "Radio" };

export default function RadioPage() {
  return (
    <>
      <GuideHeader
        title="Radio"
        named={["Radio", "RadioGroup"]}
        subpath="radio"
      >
        하나만 고르는 선택 컨트롤이다.
      </GuideHeader>

      <RadioDemo />

      <h2>상태</h2>
      <ChoiceStateCases
        columns={4}
        caption="checked 가 다른 상태와 겹치면 함께 그린다"
        code={`<Radio name="plan" checked={v === "a"} onChange={onChange} />`}
        render={(p, key) => <Radio name={`state-${key}`} {...p} />}
      />
      <div className="doc-note">
        선택된 채로 에러면 빨강, 비활성이면 회색이다. 케이스마다{" "}
        <code>name</code> 이 다르다. 같은 <code>name</code> 이면 브라우저가
        하나만 선택되게 만든다.
      </div>

      <h2>그룹</h2>
      <div className="doc-note">
        <code>RadioGroup</code> 이 <code>name</code> 을 전파해 같은 그룹으로
        묶는다. <code>role=&quot;radiogroup&quot;</code> 이며 Field 의 label 을{" "}
        <code>aria-labelledby</code> 로 연결한다. 그룹 자체에{" "}
        <code>aria-invalid</code> 도 붙는다.
      </div>

      <RHFRadioDemo />

      <h2>커스터마이징</h2>
      <HookTable group="choice-base" />

      <h2>API</h2>
      <h3>Radio</h3>
      <PropsTable of="Radio" />
      <h3>RadioGroup</h3>
      <PropsTable of="RadioGroup" />
    </>
  );
}
