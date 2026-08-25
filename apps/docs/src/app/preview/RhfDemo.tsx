"use client";

import { useForm } from "react-hook-form";
import { Field } from "@chansikchoi/next-ui";
import { RHFTextfield } from "@chansikchoi/next-ui/rhf";

type FormValues = { email: string; phone: string };

export function RhfDemo() {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { email: "", phone: "" },
    mode: "onTouched",
  });

  return (
    <form onSubmit={handleSubmit(() => undefined)} noValidate>
      <Field>
        <Field.Label>이메일 (필수 · RHF 검증)</Field.Label>
        <RHFTextfield
          name="email"
          control={control}
          rules={{ required: "이메일을 입력해주세요." }}
          placeholder="name@example.com"
          isClearable
        />
      </Field>

      <div style={{ height: 12 }} />

      <Field>
        <Field.Label>전화번호 (formatValue 로 숫자만)</Field.Label>
        <RHFTextfield
          name="phone"
          control={control}
          placeholder="01012345678"
          formatValue={(value) => value.replace(/[^0-9]/g, "")}
          isClearable
        />
      </Field>
    </form>
  );
}
