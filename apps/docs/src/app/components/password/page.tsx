import { Field, FieldLabel } from "@chansikchoi/next-ui";
import { Password } from "@chansikchoi/next-ui/textfield";
import { Example } from "@/components/Example";
import { PropsTable } from "@/components/PropsTable";

export const metadata = { title: "Password" };

export default function PasswordPage() {
  return (
    <>
      <h1>Password</h1>
      <p className="doc-lead">
        표시/숨김 토글이 붙은 <code>Textfield</code> 파생 컴포넌트다.
      </p>

      <h2>기본</h2>
      <Example row={false} caption="눈 아이콘으로 표시 상태를 토글한다">
        <Field>
          <FieldLabel>비밀번호</FieldLabel>
          <Password placeholder="8자 이상 입력" />
        </Field>
      </Example>

      <h2>표시 상태 초기값</h2>
      <Example row={false} caption="defaultIsPasswordVisible">
        <Field>
          <FieldLabel>처음부터 보이기</FieldLabel>
          <Password placeholder="입력값이 보인다" defaultIsPasswordVisible />
        </Field>
      </Example>

      <div className="doc-note">
        입력값을 지우면(<code>onClear</code>) 표시 상태가 자동으로 숨김으로
        되돌아간다. 지운 뒤 새로 입력할 때 비밀번호가 노출된 채로 남지 않도록 한
        동작이다.
      </div>

      <h2>API</h2>
      <PropsTable of="Password" />
    </>
  );
}
