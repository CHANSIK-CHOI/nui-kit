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

      <h2>모양 — shape</h2>
      <p>
        상자를 그릴지, 체크만 둘지 정한다. 기본은 <code>square</code> 다.{" "}
        <code>ghost</code> 는 필수 선택이 아니고 항목이 셋 이하인 자리에 쓴다.
      </p>
      <CaseGrid
        columns={4}
        caption="ghost 는 미선택에도 체크가 보인다. 상자가 없는데 표시까지 사라지면 누를 것이 있다는 사실이 화면에서 사라진다"
        code={`<Checkbox shape="ghost" checked={agreed} onChange={toggle} />`}
      >
        <Case label="square" note="기본">
          <Checkbox />
        </Case>
        <Case label="square + checked">
          <Checkbox defaultChecked />
        </Case>
        <Case label="ghost" note="연한 체크">
          <Checkbox shape="ghost" />
        </Case>
        <Case label="ghost + checked" note="획이 굵어지고 커진다">
          <Checkbox shape="ghost" defaultChecked />
        </Case>
      </CaseGrid>

      <div className="doc-note doc-note--warn">
        <code>ghost</code> 에는 외곽선이 없어 KRDS 의 체크박스 외곽선 대비
        요건(3:1)을 만족하지 못한다. 공공 서비스처럼 KRDS 준수가 요구되는
        화면에서는 <code>square</code> 를 쓴다. 상자가 없으니 「일부」를 그릴
        자리도 없어 <code>ghost</code> 에는 <code>indeterminate</code> 를 줄 수
        없다 — 타입이 막는다.
      </div>

      <h3>ghost 의 상태</h3>
      <p>
        면도 테두리도 그리지 않는다. 에러 · 비활성 · 읽기 전용은 전부 체크 색이
        말하고, 면은 마우스를 올리거나 누르는 동안에만 나타난다.
      </p>
      <ChoiceStateCases
        columns={4}
        caption="선택 여부는 색이 아니라 획 두께와 크기가 말한다"
        code={`<Checkbox shape="ghost" checked={v} onChange={onChange} isError={hasError} />`}
        render={(p) => <Checkbox shape="ghost" {...p} />}
      />

      <DesignNote title="ghost 에서 선택 여부를 색으로만 말하지 않는 이유">
        <p>
          칠해진 체크와 미선택 회색은 밝기가 거의 같다. 라이트에서{" "}
          <code>brand</code> 는 1.38:1, <code>danger</code> 는 1.36:1 이다.
          밝기가 아니라 색상만 다른 쌍이라 색각 이상이 있거나 고대비 모드를 쓰면
          상태가 사라진다.
        </p>
        <p>
          <code>square</code> 에서는 체크의 <strong>유무</strong>가 상태를
          말하지만 ghost 는 체크가 늘 있어 그 채널이 없다. 그래서 획 두께(1 →
          2)와 크기가 상태를 말하고 색은 보조 채널이다.
        </p>
      </DesignNote>

      <h2>강조 — tone</h2>
      <p>
        기본 채움은 검정에 가까운 중립색이다. 약관 동의처럼{" "}
        <strong>화면에서 하나만 도드라져야 하는 자리</strong>에{" "}
        <code>tone=&quot;brand&quot;</code> 를 준다.
      </p>
      <CaseGrid
        columns={4}
        caption="tone 은 선택됐을 때만 나타난다 — square 는 채움을, ghost 는 체크 색을 바꾼다. 에러 · 비활성은 tone 과 무관하게 그려진다"
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
        <Case label="ghost + brand" note="체크 색이 바뀐다">
          <Checkbox shape="ghost" tone="brand" defaultChecked />
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
        크기 · 둥글기 · 테두리 두께가 열려 있다. <code>Radio</code> ·{" "}
        <code>Switch</code> 는 각자의 변수를 가지므로 체크박스만 손봐도 옆이
        따라 움직이지 않는다. 색이 바뀌는 창구는{" "}
        <Link href="/design-system/color">프리셋과 className</Link> 둘뿐이다.
      </p>
      <p>
        둥글기는 <code>square</code> 의 상자에 걸린다. 24×24 정사각이라{" "}
        <code>50%</code> 를 주면 타원이 아니라 <strong>원</strong>이 된다.
      </p>
      <pre className="doc-code">
        <code>{`:root { --nui-checkbox--square-radius: 50%; }   /* 동그란 체크박스 */`}</code>
      </pre>
      <HookTable group="checkbox" />

      <h2>API</h2>
      <h3>Checkbox</h3>
      <PropsTable of="Checkbox" />
      <h3>CheckboxGroup</h3>
      <PropsTable of="CheckboxGroup" />
    </>
  );
}
