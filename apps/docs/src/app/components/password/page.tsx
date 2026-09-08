import Link from "next/link";
import { Field, FieldLabel } from "@nui-kit/react";
import { Password } from "@nui-kit/react/textfield";
import {
  GuideHeader,
  DesignNote,
  Case,
  CaseGrid,
  InputStateCases,
  PropsTable,
} from "@/components/guide";
import { PasswordDemo } from "./PasswordDemo";
import { RHFPasswordDemo } from "./RHFPasswordDemo";

export const metadata = { title: "Password" };

export default function PasswordPage() {
  return (
    <>
      <GuideHeader
        title="Password"
        named={["Password"]}
        subpath="textfield"
        css="textfield"
      />

      <p>
        표시 · 숨김 토글이 붙은{" "}
        <Link href="/components/textfield">Textfield</Link> 다. 입력 · 메시지 ·
        상태는 Textfield 와 같다.
      </p>

      <h2>표시 상태</h2>
      <CaseGrid
        columns={2}
        caption="defaultIsPasswordVisible — 처음부터 보이게"
        code={`<Password placeholder="8자 이상" autoComplete="new-password" />`}
      >
        <Case label="기본" note="숨김">
          <Field>
            <FieldLabel>비밀번호</FieldLabel>
            <Password placeholder="8자 이상" autoComplete="new-password" />
          </Field>
        </Case>
        <Case label="defaultIsPasswordVisible" note="처음부터 보인다">
          <Field>
            <FieldLabel>비밀번호</FieldLabel>
            <Password placeholder="8자 이상" defaultIsPasswordVisible />
          </Field>
        </Case>
      </CaseGrid>
      <div className="doc-note">
        토글의 접근 이름은 <code>showPasswordTitle</code> ·{" "}
        <code>hidePasswordTitle</code> 로 바꿀 수 있다. 기본은 「비밀번호 보기」
        · 「비밀번호 숨기기」다.
      </div>

      <h2>지우기</h2>
      <p>
        <code>isClearable</code> 과 <code>onClear</code> 를 함께 주면 지우기
        버튼이 토글 왼쪽에 놓이고,{" "}
        <strong>지우면 표시 상태가 숨김으로 돌아간다.</strong>
      </p>
      <PasswordDemo />

      <DesignNote title="왜 지우면 숨김으로 돌아가나">
        <p>
          보이는 상태로 지운 뒤 새로 치면 다음 비밀번호가 그대로 노출된다.
          지우는 순간은 「다시 입력하겠다」는 뜻이라 처음 상태로 되돌아간다.
        </p>
      </DesignNote>

      <h2>상태</h2>
      <InputStateCases
        columns={2}
        caption="isError · disabled · readOnly — 토글은 비활성에서 함께 꺼진다"
        render={(p) => (
          <Field>
            <FieldLabel>비밀번호</FieldLabel>
            <Password
              placeholder="8자 이상"
              value={p.disabled || p.readOnly ? "secret1234" : undefined}
              errorMessage={p.isError ? "8자 이상 입력해 주세요" : undefined}
              disabled={p.disabled}
              readOnly={p.readOnly}
            />
          </Field>
        )}
      />
      <CaseGrid
        columns={2}
        caption="isTextInputBlocked — 타이핑만 막는다"
        code={`<Password value={v} isTextInputBlocked />`}
      >
        <Case label="isTextInputBlocked">
          <Field>
            <FieldLabel>임시 비밀번호</FieldLabel>
            <Password value="temp-9f3k" isTextInputBlocked />
          </Field>
        </Case>
        <Case label="isTextInputBlocked + 보임">
          <Field>
            <FieldLabel>임시 비밀번호</FieldLabel>
            <Password
              value="temp-9f3k"
              isTextInputBlocked
              defaultIsPasswordVisible
            />
          </Field>
        </Case>
      </CaseGrid>

      <RHFPasswordDemo />

      <h2>API</h2>
      <PropsTable of="Password" />
    </>
  );
}
