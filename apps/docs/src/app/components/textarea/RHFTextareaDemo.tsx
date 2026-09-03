"use client";

import { useForm } from "react-hook-form";
import { Button, Field } from "@chansikchoi/next-ui";
import { RHFTextarea } from "@chansikchoi/next-ui/rhf";
import { Example } from "@/components/guide";

type FormValues = { bio: string };

export function RHFTextareaDemo() {
  const { control, handleSubmit, formState, reset, watch } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: { bio: "" },
    });
  const values = watch();

  return (
    <>
      <h2>react-hook-form</h2>
      <p>
        <code>RHFTextarea</code> 는 <code>/rhf</code> 서브패스에 있다.{" "}
        <code>control</code> 과 <code>name</code> 만 넘기면 값과 에러를 스스로
        소유한다. <code>value</code> · <code>onChange</code> · <code>name</code>{" "}
        · <code>onBlur</code> 는 타입에서 제외되어 중복 소유가 생기지 않는다.
      </p>
      <Example
        row={false}
        caption='mode: "onChange" — 값이 바뀔 때마다 검증한다'
        code={`<RHFTextarea control={control} name="bio" rules={{ required: "…", maxLength: { value: 80, message: "…" } }} />`}
      >
        <form
          onSubmit={handleSubmit(() => window.alert("제출되었습니다."))}
          style={{ maxWidth: 480 }}
        >
          <Field>
            <Field.Label>소개</Field.Label>
            <Field.Description>80자 이내로 적어 주세요.</Field.Description>
            <RHFTextarea
              control={control}
              name="bio"
              rules={{
                required: "소개를 입력해 주세요.",
                maxLength: { value: 80, message: "80자를 넘었습니다." },
              }}
              placeholder="한 줄로 소개해 주세요"
            />
          </Field>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button type="submit" size="medium">
              제출
            </Button>
            <Button
              type="button"
              size="medium"
              variant="line"
              onClick={() => reset({ bio: "" })}
            >
              초기화
            </Button>
          </div>
          <pre className="doc-code" style={{ marginTop: 16 }}>
            <code>
              {JSON.stringify(
                {
                  values,
                  isValid: formState.isValid,
                  error: formState.errors.bio?.message,
                },
                null,
                2,
              )}
            </code>
          </pre>
        </form>
      </Example>
      <div className="doc-note">
        <code>formatValue</code> 를 주면 입력값이 폼 상태에 들어가기 전에
        가공된다. <code>errorMessage</code> 를 직접 넘기면 RHF 에러가 없을 때의
        대체값으로 쓰인다. <code>react-hook-form</code> 은 optional peer 라
        래퍼를 쓸 때만 설치한다.
      </div>
    </>
  );
}
