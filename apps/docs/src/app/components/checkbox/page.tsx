import { Checkbox } from "@nui-kit/react";
import {
  GuideHeader,
  ChoiceStateCases,
  HookTable,
  PropsTable,
} from "@/components/guide";
import { CheckboxDemo } from "./CheckboxDemo";
import { RHFCheckboxDemo } from "./RHFCheckboxDemo";

export const metadata = { title: "Checkbox" };

export default function CheckboxPage() {
  return (
    <>
      <GuideHeader
        title="Checkbox"
        named={["Checkbox", "CheckboxGroup"]}
        subpath="checkbox"
      >
        여러 개를 고르는 선택 컨트롤이다.
      </GuideHeader>

      <CheckboxDemo />

      <h2>상태</h2>
      <ChoiceStateCases
        columns={4}
        caption="checked 가 다른 상태와 겹치면 함께 그린다"
        code={`<Checkbox checked={v} onChange={onChange} isError={hasError} />`}
        render={(p) => <Checkbox {...p} />}
      />
      <div className="doc-note">
        선택된 채로 에러면 빨강, 비활성이면 회색이다.
      </div>

      <h2>readOnly</h2>
      <div className="doc-note">
        네이티브 checkbox 에는 <code>readonly</code> 가 없다. 그래서 컴포넌트가
        클릭과 Space·Enter 키를 직접 막고 <code>aria-readonly</code> 를 붙인다.{" "}
        <strong>disabled 와 달리 포커스는 유지</strong>되므로 스크린리더가 값을
        읽을 수 있다.
      </div>

      <h2>값 소유</h2>
      <div className="doc-note doc-note--warn">
        React 는 <code>checked</code> 를 주면서 <code>onChange</code> 가 없으면
        콘솔 경고를 낸다.{" "}
        <strong>
          <code>disabled</code> 로는 막히지 않는다
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

      <RHFCheckboxDemo />

      <h2>커스터마이징</h2>
      <HookTable group="choice-base" />

      <h2>API</h2>
      <h3>Checkbox</h3>
      <PropsTable of="Checkbox" />
      <h3>CheckboxGroup</h3>
      <PropsTable of="CheckboxGroup" />
    </>
  );
}
