import Link from "next/link";
import {
  Field,
  FieldItem,
  FieldLabel,
  Radio,
  RadioGroup,
} from "@nui-kit/react";
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
      />

      <ExceptionBadges items={[{ kind: "ownSize", target: "Radio" }]} />

      <p>
        여럿 중 하나를 고른다. 같은 <code>name</code> 을 가진 라디오끼리 한
        묶음이고, <code>RadioGroup</code> 이 그 <code>name</code> 을 하위에
        전파한다.
      </p>

      <RadioDemo />

      <h2>강조 — tone</h2>
      <p>
        기본 채움은 중립색이다. 추천 요금제처럼{" "}
        <strong>하나만 도드라져야 하는 자리</strong>에{" "}
        <code>tone=&quot;brand&quot;</code> 를 준다.
      </p>
      <CaseGrid
        columns={4}
        caption="tone 은 checked 의 채움만 바꾼다"
        code={`<Radio tone="brand" name="plan" value="pro" checked={plan === "pro"} onChange={pick} />`}
      >
        <Case label="neutral" note="기본">
          <Radio name="tone-a" defaultChecked />
        </Case>
        <Case label="brand">
          <Radio name="tone-b" tone="brand" defaultChecked />
        </Case>
        <Case label="brand + isError" note="빨강 — tone 무관">
          <Radio name="tone-c" tone="brand" defaultChecked isError />
        </Case>
        <Case label="brand + disabled" note="회색 — tone 무관">
          <Radio name="tone-d" tone="brand" defaultChecked disabled />
        </Case>
      </CaseGrid>

      <DesignNote title="왜 Radio 도 면을 채우나">
        <p>
          체크박스와 스위치가 둘 다 채워지는데 라디오만 테두리 안의 점으로
          남으면, 한 가족 안에서 「선택됐다」의 뜻이 갈린다. 같아 보이는 것은
          같게 동작한다. 채움색과 강조 규칙도 셋이 같다.
        </p>
      </DesignNote>

      <h2>상태</h2>
      <ChoiceStateCases
        columns={4}
        caption="checked 가 다른 상태와 겹치면 함께 그린다. 케이스마다 name 이 다르다"
        code={`<Radio name="plan" checked={v === "a"} onChange={onChange} />`}
        render={(p, key) => <Radio name={`state-${key}`} {...p} />}
      />

      <h2>그룹</h2>
      <p>
        <code>RadioGroup</code> 은 <code>role=&quot;radiogroup&quot;</code>{" "}
        이고, <code>Field</code> 의 라벨을 <code>aria-labelledby</code> 로
        잇는다. <code>disabled</code> · <code>readOnly</code> ·{" "}
        <code>isError</code> 를 하위 전부에 전파하고, 에러면 그룹에{" "}
        <code>aria-invalid</code> 가 붙는다.
      </p>
      <p>
        선택지 여럿이 값 하나를 채우므로{" "}
        <strong>필수 표시와 메시지는 그룹을 감싼 Field 가 갖는다.</strong> 점은
        그룹 라벨 하나에 붙고 항목마다 붙지 않는다 — 그래도{" "}
        <code>aria-required</code> 는 라디오 전부에 간다.
      </p>
      <CaseGrid
        columns={2}
        caption="Field.Item 은 항목의 라벨만 맡는다. 필수와 에러는 바깥 Field 가 맡는다"
        code={`<Field required errorMessage={error}>
  <Field.Label as="span">결제 수단</Field.Label>
  <RadioGroup name="payment">
    <Field.Item>
      <Radio value="card" checked={v === "card"} onChange={pick} />
      <Field.Label>신용카드</Field.Label>
    </Field.Item>
  </RadioGroup>
</Field>`}
      >
        <Case label="required" note="점은 그룹 라벨 하나">
          <Field required>
            <FieldLabel as="span">결제 수단</FieldLabel>
            <RadioGroup name="group-required">
              <FieldItem>
                <Radio value="card" />
                <FieldLabel>신용카드</FieldLabel>
              </FieldItem>
              <FieldItem>
                <Radio value="transfer" />
                <FieldLabel>계좌이체</FieldLabel>
              </FieldItem>
            </RadioGroup>
          </Field>
        </Case>
        <Case label="errorMessage" note="그룹 전체가 에러로 간다">
          <Field required errorMessage="결제 수단을 골라 주세요">
            <FieldLabel as="span">결제 수단</FieldLabel>
            <RadioGroup name="group-error">
              <FieldItem>
                <Radio value="card" />
                <FieldLabel>신용카드</FieldLabel>
              </FieldItem>
              <FieldItem>
                <Radio value="transfer" />
                <FieldLabel>계좌이체</FieldLabel>
              </FieldItem>
            </RadioGroup>
          </Field>
        </Case>
      </CaseGrid>

      <RHFRadioDemo />

      <h2>커스터마이징</h2>
      <p>
        크기와 테두리 두께를 연다. <code>Checkbox</code> · <code>Switch</code>{" "}
        는 각자의 변수를 가지므로 라디오만 손봐도 옆이 따라 움직이지 않는다.
        색을 바꾸는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 뿐이다.
      </p>
      <p>
        둥글기는 열지 않는다. 0 으로 내리면 라디오가 네모가 되어 체크박스와
        구분되지 않는다 — 「하나만 고른다」와 「여럿 고른다」를 가르는 것이 이
        모양이다.
      </p>
      <HookTable group="radio" />

      <h2>API</h2>
      <h3>Radio</h3>
      <PropsTable of="Radio" />
      <h3>RadioGroup</h3>
      <PropsTable of="RadioGroup" />
    </>
  );
}
