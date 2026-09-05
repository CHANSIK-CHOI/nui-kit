"use client";

import { Controller, useForm } from "react-hook-form";
import { Button, Field, Radio, RadioGroup } from "@nui-kit/react";
import { Example } from "@/components/guide";

const PLANS = [
  { label: "무료", value: "free" },
  { label: "프로", value: "pro" },
  { label: "팀", value: "team" },
];

type FormValues = { plan: string | null };

export function RHFRadioDemo() {
  const { control, handleSubmit, formState, reset, watch } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: { plan: null },
    });
  const values = watch();

  return (
    <>
      <h2>react-hook-form</h2>
      <p>
        라디오 그룹은 <strong>선택지 여러 개가 필드 하나</strong>를 채운다.
        그래서 <code>Controller</code> 로 그룹을 감싸고 각 <code>Radio</code> 의{" "}
        <code>checked</code> 를 <code>field.value === value</code> 로 잇는다.
        에러는 <code>RadioGroup</code> 의 <code>isError</code> 에 준다.
      </p>
      <Example
        row={false}
        caption="Controller — 그룹 하나가 필드 하나"
        code={`<Controller control={control} name="plan" rules={{ required: "…" }} render={({ field, fieldState }) => (<RadioGroup name={field.name} isError={!!fieldState.error}>…</RadioGroup>)} />`}
      >
        <form
          onSubmit={handleSubmit(() => window.alert("제출되었습니다."))}
          style={{ maxWidth: 480 }}
        >
          <Field>
            <Field.Label>요금제</Field.Label>
            <Controller
              control={control}
              name="plan"
              rules={{ required: "요금제를 골라 주세요." }}
              render={({ field, fieldState }) => (
                <RadioGroup
                  name={field.name}
                  isError={Boolean(fieldState.error)}
                  onBlur={field.onBlur}
                >
                  {PLANS.map((plan) => (
                    <Field key={plan.value} direction="row" align="center">
                      <Radio
                        value={plan.value}
                        checked={field.value === plan.value}
                        onChange={() => field.onChange(plan.value)}
                      />
                      <Field.Label>{plan.label}</Field.Label>
                    </Field>
                  ))}
                </RadioGroup>
              )}
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
              onClick={() => reset({ plan: null })}
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
                  error: formState.errors.plan?.message,
                },
                null,
                2,
              )}
            </code>
          </pre>
        </form>
      </Example>
      <div className="doc-note doc-note--warn">
        <strong>
          <code>RHFRadio</code> 는 라디오 하나를 boolean 필드 하나로 잇는다.
        </strong>{" "}
        <code>checked</code> 를 <code>Boolean(field.value)</code> 로, 변경을{" "}
        <code>field.onChange(checked)</code> 로 넘기므로 선택지 여러 개가 값
        하나를 나눠 갖는 그룹에는 맞지 않는다. 지금은 위처럼{" "}
        <code>Controller</code> 를 쓴다.
      </div>
    </>
  );
}
