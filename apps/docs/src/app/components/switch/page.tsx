import Link from "next/link";
import { FieldItem, FieldLabel, Switch } from "@nui-kit/react";
import {
  GuideHeader,
  ExceptionBadges,
  DesignNote,
  Case,
  CaseGrid,
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
      <GuideHeader title="Switch" named={["Switch"]} subpath="switch" />

      <ExceptionBadges items={[{ kind: "ownSize", target: "Switch" }]} />

      <p>
        누르는 즉시 반영되는 설정에 쓴다. 저장 버튼을 눌러야 값이 들어가는
        폼에는 <Link href="/components/checkbox">Checkbox</Link> 가 맞다 —
        스위치를 켰는데 아무 일도 안 일어나면 고장으로 읽힌다.
      </p>
      <div className="doc-note">
        항목은 하나씩 독립이다. 「전체 켜기」처럼 부모가 하위를 묶는 구조에는
        Checkbox 의 <code>indeterminate</code> 가 맞다.
      </div>

      <SwitchDemo />

      <h2>설명 붙이기</h2>
      <p>
        설정 화면의 스위치는 <strong>켜면 무엇이 달라지는지</strong>를 한 줄로
        덧붙일 때가 많다. 그 줄은 감싼 <code>Field.Item</code> 의{" "}
        <code>infoMessage</code> 가 맡는다 — 라벨 아래에 서고{" "}
        <code>aria-describedby</code> 로 이어져 스크린리더가 라벨과 함께 읽는다.
      </p>
      <CaseGrid
        columns={2}
        caption="설명은 라벨을 되풀이하기보다 켠 결과를 적는 자리다"
        code={`<Field.Item infoMessage="밤 10시부터 아침 8시까지 알림을 멈춰요">
  <Switch checked={night} onChange={toggle} />
  <Field.Label>야간 알림 끄기</Field.Label>
</Field.Item>`}
      >
        <Case label="라벨만">
          <FieldItem>
            <Switch defaultChecked />
            <FieldLabel>야간 알림 끄기</FieldLabel>
          </FieldItem>
        </Case>
        <Case label="infoMessage" note="켠 결과를 적는다">
          <FieldItem infoMessage="밤 10시부터 아침 8시까지 알림을 멈춰요">
            <Switch defaultChecked />
            <FieldLabel>야간 알림 끄기</FieldLabel>
          </FieldItem>
        </Case>
      </CaseGrid>

      <h2>강조 — tone</h2>
      <p>
        기본 채움은 중립색이다. 설정 화면에서 스위치가 줄지어 있을 때 전부
        색이면 강조가 아니게 된다. 하나만 도드라져야 하면{" "}
        <code>tone=&quot;brand&quot;</code>.
      </p>
      <CaseGrid
        columns={4}
        caption="tone 은 켜진 트랙의 채움만 바꾼다"
        code={`<Switch tone="brand" checked={on} onChange={toggle} />`}
      >
        <Case label="neutral" note="기본">
          <Switch defaultChecked />
        </Case>
        <Case label="brand">
          <Switch tone="brand" defaultChecked />
        </Case>
        <Case label="brand + isError" note="빨강 — tone 무관">
          <Switch tone="brand" defaultChecked isError />
        </Case>
        <Case label="brand + disabled" note="회색 — tone 무관">
          <Switch tone="brand" defaultChecked disabled />
        </Case>
      </CaseGrid>

      <h2>상태</h2>
      <ChoiceStateCases
        columns={4}
        caption="checked 가 다른 상태와 겹치면 함께 그린다"
        code={`<Switch checked={on} onChange={(e) => setOn(e.target.checked)} />`}
        render={(p) => <Switch {...p} />}
      />

      <DesignNote title="왜 role 이 switch 인가">
        <p>
          안은 <code>input[type=checkbox]</code> 인데{" "}
          <code>role=&quot;switch&quot;</code> 를 붙인다. 스크린리더가
          「체크박스」가 아니라 「스위치」로 안내하고, 상태를 「선택됨」이
          아니라 「켬 · 끔」으로 읽는다. 겉모습이 말하는 것과 소리가 말하는 것을
          맞춘다.
        </p>
      </DesignNote>

      <RHFSwitchDemo />

      <h2>커스터마이징</h2>
      <p>
        트랙 너비와 높이가 열려 있다. 자기 치수를 갖는 컴포넌트라 라벨이
        길어져도 찌그러지지 않는다. 테두리 두께는 <code>Checkbox</code> ·{" "}
        <code>Radio</code> 와 함께 쓰는 변수다.
      </p>
      <HookTable group="switch" />
      <HookTable group="selector" />

      <h2>API</h2>
      <PropsTable of="Switch" />
    </>
  );
}
