import Link from "next/link";
import { Checkbox, FieldItem, FieldLabel } from "@nui-kit/react";
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
      />

      <ExceptionBadges items={[{ kind: "ownSize", target: "Checkbox" }]} />

      <p>
        켜고 끄는 값 하나다. 값은 <code>checked</code> 와 <code>onChange</code>
        로 쓰는 쪽이 갖고, 처음 값만 필요하면 <code>defaultChecked</code> 를
        준다. 라벨은 <code>Field.Label</code> 로 붙이면 라벨을 눌러도 토글된다.
      </p>

      <CheckboxDemo />

      <h2>필수 표시와 메시지</h2>
      <p>
        체크박스 자체에는 메시지 자리가 없다. 필수 점 · 도움말 · 에러는 감싼{" "}
        <code>Field.Item</code> 이 그리고, 셋 다 Footer 한 줄에 모인다. 언제
        어느 표시를 쓰는지는 <Link href="/components/field">Field</Link> 가
        정한다.
      </p>
      <CaseGrid
        columns={3}
        caption="errorMessage 를 주면 에러 상태로 올라가 라벨도 빨개진다"
        code={`<Field.Item required errorMessage={error}>
  <Checkbox checked={agreed} onChange={toggle} />
  <Field.Label>이용약관 동의</Field.Label>
</Field.Item>`}
      >
        <Case label="required" note="점 + aria-required">
          <FieldItem required>
            <Checkbox />
            <FieldLabel>이용약관 동의</FieldLabel>
          </FieldItem>
        </Case>
        <Case label="infoMessage" note="aria-describedby 로 이어진다">
          <FieldItem infoMessage="만 14세 이상만 가입할 수 있어요">
            <Checkbox />
            <FieldLabel>본인 확인</FieldLabel>
          </FieldItem>
        </Case>
        <Case label="errorMessage" note="도움말 대신 에러가 선다">
          <FieldItem
            required
            infoMessage="만 14세 이상만 가입할 수 있어요"
            errorMessage="약관에 동의해 주세요"
          >
            <Checkbox />
            <FieldLabel>이용약관 동의</FieldLabel>
          </FieldItem>
        </Case>
      </CaseGrid>

      <h2>강조 — tone</h2>
      <p>
        기본 채움은 검정에 가까운 중립색이다. 약관 동의처럼{" "}
        <strong>화면에서 하나만 도드라져야 하는 자리</strong>에{" "}
        <code>tone=&quot;brand&quot;</code> 를 준다.
      </p>
      <CaseGrid
        columns={4}
        caption="tone 은 checked · indeterminate 의 채움만 바꾼다. 에러 · 비활성은 tone 과 무관하게 그려진다"
        code={`<Checkbox tone="brand" checked={agreed} onChange={toggle} />`}
      >
        <Case label="neutral" note="기본">
          <Checkbox defaultChecked />
        </Case>
        <Case label="brand">
          <Checkbox tone="brand" defaultChecked />
        </Case>
        <Case label="brand + indeterminate">
          <Checkbox tone="brand" defaultChecked indeterminate />
        </Case>
        <Case label="brand + isError" note="빨강 — tone 무관">
          <Checkbox tone="brand" defaultChecked isError />
        </Case>
      </CaseGrid>

      <DesignNote title="왜 기본이 브랜드색이 아닌가">
        <p>
          선택 컨트롤은 한 화면에 여럿 반복된다. 전부 브랜드색이면 목록이
          얼룩덜룩해지고 <strong>강조가 흔해져 강조가 아니게 된다.</strong>{" "}
          중립이 기본이고, 도드라져야 하는 하나에만 색을 준다.
        </p>
      </DesignNote>

      <h2>상태</h2>
      <ChoiceStateCases
        columns={4}
        caption="checked 가 다른 상태와 겹치면 함께 그린다"
        code={`<Checkbox checked={v} onChange={onChange} isError={hasError} />`}
        render={(p) => <Checkbox {...p} />}
      />

      <h2>readOnly 와 disabled</h2>
      <p>
        <code>readOnly</code> 는 값은 보여주되 바꿀 수 없을 때,{" "}
        <code>disabled</code> 는 조건이 맞으면 다시 쓸 수 있을 때 쓴다. readOnly
        는 포커스가 남아 스크린리더가 값을 읽는다.
      </p>
      <div className="doc-note doc-note--warn">
        <code>checked</code> 만 주고 <code>onChange</code> 가 없으면 React 가
        콘솔 경고를 낸다. <code>disabled</code> 로는 안 막힌다 — 표시 전용이면{" "}
        <code>readOnly</code> 를 함께 준다.
      </div>
      <pre className="doc-code">
        <code>{`<Checkbox checked disabled />            // ⚠️ 콘솔 경고
<Checkbox checked disabled readOnly />   // 표시 전용
<Checkbox checked onChange={toggle} />   // 값을 소유한다`}</code>
      </pre>

      <DesignNote title="왜 readOnly 를 직접 구현했나">
        <p>
          네이티브 checkbox 에는 <code>readonly</code> 가 없다. 그래서
          컴포넌트가 클릭과 Space · Enter 를 직접 막고{" "}
          <code>aria-readonly</code> 를 붙인다. <code>disabled</code> 와 달리
          포커스는 유지되므로 스크린리더가 값을 읽을 수 있다 — 조회 화면에서
          「이 항목이 켜져 있다」를 전하려면 이 길뿐이다.
        </p>
      </DesignNote>

      <RHFCheckboxDemo />

      <h2>커스터마이징</h2>
      <p>
        크기와 테두리 두께가 열려 있다. 아래 변수는 <code>Radio</code> ·{" "}
        <code>Switch</code> 와 함께 쓴다. 색이 바뀌는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 둘뿐이다.
      </p>
      <HookTable group="selector" />

      <h2>API</h2>
      <h3>Checkbox</h3>
      <PropsTable of="Checkbox" />
      <h3>CheckboxGroup</h3>
      <PropsTable of="CheckboxGroup" />
    </>
  );
}
