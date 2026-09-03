import { Switch } from "@chansikchoi/next-ui";
import {
  GuideHeader,
  ChoiceStateCases,
  HookTable,
  PropsTable,
} from "@/components/guide";
import { SwitchDemo } from "./SwitchDemo";
import { RHFSwitchDemo } from "./RHFSwitchDemo";

export const metadata = { title: "Switch" };

export default function SwitchPage() {
  return (
    <>
      <GuideHeader title="Switch" named={["Switch"]} subpath="switch">
        즉시 적용되는 켬과 끔이다. 저장 버튼 없이 바로 반영되는 설정에 쓴다.
        제출이 필요한 동의 항목에는 <code>Checkbox</code> 가 맞다.
      </GuideHeader>

      <SwitchDemo />

      <h2>상태</h2>
      <ChoiceStateCases
        columns={4}
        caption="checked 가 다른 상태와 겹치면 함께 그린다"
        code={`<Switch checked={on} onChange={() => setOn(!on)} />`}
        render={(p) => <Switch {...p} />}
      />
      <div className="doc-note">
        선택된 채로 에러면 빨강, 비활성이면 회색이다.
      </div>

      <h2>접근성</h2>
      <div className="doc-note">
        내부는 <code>input[type=checkbox]</code> 에{" "}
        <code>role=&quot;switch&quot;</code> 를 붙인다. 스크린리더가 체크박스가
        아니라 스위치로 안내하고 켬과 끔으로 읽는다.
      </div>

      <RHFSwitchDemo />

      <h2>커스터마이징</h2>
      <p>
        트랙 너비와 높이를 CSS 변수로 연다. 자기 치수를 갖는 컴포넌트라 라벨이
        길어져도 찌그러지지 않는다.
      </p>
      <HookTable group="switch" />
      <HookTable group="choice-base" />

      <h2>API</h2>
      <PropsTable of="Switch" />
    </>
  );
}
