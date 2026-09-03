import { Field, FieldLabel } from "@chansikchoi/next-ui";
import { Password } from "@chansikchoi/next-ui/textfield";
import {
  GuideHeader,
  Case,
  CaseGrid,
  InputStateCases,
  PropsTable,
} from "@/components/guide";
import { PasswordDemo } from "./PasswordDemo";

export const metadata = { title: "Password" };

export default function PasswordPage() {
  return (
    <>
      <GuideHeader
        title="Password"
        named={["Password"]}
        subpath="textfield"
        css="textfield"
      >
        표시 토글이 붙은 <code>Textfield</code> 다.
      </GuideHeader>

      <h2>표시 상태</h2>
      <p>
        <code>defaultIsPasswordVisible</code> 을 주면 처음부터 값이 보인다.
      </p>
      <CaseGrid
        columns={2}
        code={`<Password placeholder="8자 이상" defaultIsPasswordVisible />`}
      >
        <Case label="기본" note="숨김">
          <Field>
            <FieldLabel>비밀번호</FieldLabel>
            <Password placeholder="8자 이상 입력" />
          </Field>
        </Case>
        <Case label="defaultIsPasswordVisible">
          <Field>
            <FieldLabel>비밀번호</FieldLabel>
            <Password placeholder="입력값이 보인다" defaultIsPasswordVisible />
          </Field>
        </Case>
      </CaseGrid>

      <h2>지우기</h2>
      <p>
        <code>isClearable</code> 과 <code>onClear</code> 를 함께 준다. 지우기
        버튼은 표시 토글 왼쪽에 놓이고, Textfield · Textarea · Datepicker ·
        Select 의 지우기와 같은 버튼이다.
      </p>
      <PasswordDemo />
      <div className="doc-note">
        값을 지우면 표시 상태가 숨김으로 되돌아간다. 지운 뒤 새로 입력할 때
        비밀번호가 노출된 채로 남지 않게 한 동작이다.
      </div>
      <p>
        <code>showPasswordTitle</code> 과 <code>hidePasswordTitle</code> 로
        토글의 접근 이름을 바꾼다.
      </p>

      <h2>상태</h2>
      <InputStateCases
        columns={2}
        caption="isError · disabled · readOnly"
        render={(p) => (
          <Field>
            <FieldLabel>비밀번호</FieldLabel>
            <Password
              placeholder="8자 이상 입력"
              value={p.disabled || p.readOnly ? "secret1234" : undefined}
              errorMessage={p.isError ? "8자 이상 입력해주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />

      <h2>API</h2>
      <PropsTable of="Password" />
    </>
  );
}
