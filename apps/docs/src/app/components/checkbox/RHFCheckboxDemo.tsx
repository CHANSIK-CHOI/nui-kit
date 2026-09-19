"use client";

import { useForm } from "react-hook-form";
import { Button, Field } from "@nui-kit/react";
import { RHFCheckbox } from "@nui-kit/react/rhf";
import { Example } from "@/components/guide";

type FormValues = { agree: boolean; marketing: boolean };

export function RHFCheckboxDemo() {
  const { control, handleSubmit, formState, reset, watch } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: { agree: false, marketing: false },
    });
  const values = watch();

  return (
    <>
      <h2>react-hook-form</h2>
      <p>
        <strong>체크박스 하나가 boolean 필드 하나다.</strong>{" "}
        <code>checked</code> · <code>onChange</code> · <code>name</code> 은 RHF
        가 소유하고, 에러는 <code>isError</code> 로 컨트롤에 표시된다. 여러 개를
        배열 값 하나로 묶는 형태는 없다. 항목마다 필드를 둔다.
      </p>
      <Example
        row={false}
        caption="validate 로 필수 동의를 검사한다"
        code={`<RHFCheckbox control={control} name="agree" rules={{ validate: (v) => v || "…" }} />`}
      >
        <form
          onSubmit={handleSubmit(() => window.alert("제출되었습니다."))}
          style={{ maxWidth: 480 }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <Field.Item
              required
              errorMessage={formState.errors.agree?.message ?? ""}
            >
              <RHFCheckbox
                control={control}
                name="agree"
                tone="brand"
                rules={{
                  validate: (value: boolean) =>
                    value || "약관에 동의해야 가입할 수 있어요",
                }}
              />
              <Field.Label>이용약관에 동의합니다</Field.Label>
            </Field.Item>
            <Field.Item>
              <RHFCheckbox control={control} name="marketing" shape="ghost" />
              <Field.Label>마케팅 정보 수신</Field.Label>
            </Field.Item>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button type="submit" size="medium">
              제출
            </Button>
            <Button
              type="button"
              size="medium"
              variant="line"
              onClick={() => reset({ agree: false, marketing: false })}
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
                  error: formState.errors.agree?.message,
                },
                null,
                2,
              )}
            </code>
          </pre>
        </form>
      </Example>
      <div className="doc-note doc-note--warn">
        <strong>에러 문구는 컨트롤이 그리지 않는다.</strong> 체크박스에는 메시지
        자리가 없어 <code>isError</code> 로 빨간 테두리만 나온다. 문구는 감싼{" "}
        <code>Field.Item</code> 의 <code>errorMessage</code> 에 넘긴다 — Footer
        한 줄에 그려지고 <code>aria-describedby</code> 로 이어진다.
      </div>
    </>
  );
}
