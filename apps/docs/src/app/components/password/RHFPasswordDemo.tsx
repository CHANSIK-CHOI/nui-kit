"use client";

import { useForm } from "react-hook-form";
import { Button, Field } from "@nui-kit/react";
import { RHFPassword } from "@nui-kit/react/rhf";
import { Example } from "@/components/guide";

type FormValues = { password: string };

export function RHFPasswordDemo() {
  const { control, handleSubmit, formState, reset } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { password: "" },
  });

  return (
    <>
      <h2>react-hook-form</h2>
      <p>
        <code>RHFPassword</code> 는 <code>/rhf</code> 서브패스에 있다. 표시/숨김
        토글은 컴포넌트가 갖고, 값과 에러는 RHF 가 갖는다. 지우기 버튼을 누르면
        값이 비고 표시 상태도 숨김으로 돌아간다.
      </p>
      <Example
        row={false}
        caption='mode: "onChange" — 규칙에 걸리면 바로 에러가 보인다'
        code={`<RHFPassword control={control} name="password" rules={{ minLength: { value: 8, message: "…" } }} isClearable />`}
      >
        <form
          onSubmit={handleSubmit(() => window.alert("제출되었습니다."))}
          style={{ maxWidth: 480 }}
        >
          <Field>
            <Field.Label>비밀번호</Field.Label>
            <Field.Description>8자 이상, 숫자를 하나 이상.</Field.Description>
            <RHFPassword
              control={control}
              name="password"
              rules={{
                required: "비밀번호를 입력해 주세요.",
                minLength: { value: 8, message: "8자 이상 입력해 주세요." },
                validate: (value: string) =>
                  /\d/.test(value) || "숫자를 하나 이상 넣어 주세요.",
              }}
              placeholder="8자 이상"
              isClearable
            />
          </Field>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              alignItems: "center",
            }}
          >
            <Button type="submit" size="medium">
              제출
            </Button>
            <Button
              type="button"
              size="medium"
              variant="line"
              onClick={() => reset({ password: "" })}
            >
              초기화
            </Button>
            <span style={{ fontSize: "var(--nui-font-size-3)" }}>
              isValid: {String(formState.isValid)}
            </span>
          </div>
        </form>
      </Example>
      <div className="doc-note">
        에러 메시지는 <code>fieldState.error.message</code> 가 그대로{" "}
        <code>errorMessage</code> 로 전달되어 컨트롤 아래에 표시되고{" "}
        <code>aria-describedby</code> 로 연결된다.
      </div>
    </>
  );
}
