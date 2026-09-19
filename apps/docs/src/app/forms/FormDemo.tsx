"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ButtonGroup, Field } from "@nui-kit/react";
import { RHFTextfield, RHFSelect, RHFCheckbox } from "@nui-kit/react/rhf";
import { Example } from "@/components/guide";

type FormValues = {
  name: string;
  email: string;
  plan: string | number | null;
  agreed: boolean;
};

const PLANS = [
  { value: "basic", label: "베이직" },
  { value: "pro", label: "프로" },
  { value: "team", label: "팀" },
];

/**
 * 폼 하나가 갖춰야 할 것을 한자리에 모은 데모.
 * 필수 표시 · 검증 시점 · 에러 자리 · 제출 중 잠금이 전부 들어 있다.
 */
export function FormDemo() {
  const { control, handleSubmit, formState, reset } = useForm<FormValues>({
    // 형식처럼 그 자리에서 알 수 있는 것은 치는 동안 검사한다
    mode: "onChange",
    defaultValues: { name: "", email: "", plan: null, agreed: false },
  });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const submit = handleSubmit(async (values) => {
    setSaving(true);
    setResult(null);
    // 서버가 아는 것은 여기서 검사한다
    await new Promise((r) => window.setTimeout(r, 1200));
    setSaving(false);
    setResult(`${values.name} 님을 ${String(values.plan)} 로 등록했어요`);
  });

  return (
    <Example
      row={false}
      caption="필수 표시 · 치는 동안 검증 · 제출 중 잠금이 한 폼에 들어 있다"
      code={`<Field required>
  <Field.Label>이메일</Field.Label>
  <RHFTextfield
    control={control}
    name="email"
    rules={{ required: "이메일을 입력해 주세요", pattern: { … } }}
  />
</Field>`}
    >
      <form onSubmit={submit} style={{ maxWidth: 520 }}>
        <Field.Grid columns={2}>
          <Field required>
            <Field.Label>이름</Field.Label>
            <RHFTextfield
              control={control}
              name="name"
              rules={{ required: "이름을 입력해 주세요" }}
              placeholder="홍길동"
            />
          </Field>
          <Field required>
            <Field.Label>이메일</Field.Label>
            <RHFTextfield
              control={control}
              name="email"
              rules={{
                required: "이메일을 입력해 주세요",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "아이디@도메인 꼴로 입력해 주세요",
                },
              }}
              placeholder="hong@example.com"
            />
          </Field>
        </Field.Grid>

        <Field required>
          <Field.Label>요금제</Field.Label>
          <RHFSelect
            control={control}
            name="plan"
            options={PLANS}
            rules={{ required: "요금제를 골라 주세요" }}
            placeholder="고르세요"
          />
        </Field>

        <Field isError={!!formState.errors.agreed}>
          <Field.Item direction="row" align="center">
            <RHFCheckbox
              control={control}
              name="agreed"
              tone="brand"
              rules={{ required: "약관에 동의해야 가입할 수 있어요" }}
            />
            <Field.Label>이용약관에 동의합니다</Field.Label>
          </Field.Item>
          <Field.Message
            errorMessage={formState.errors.agreed?.message ?? ""}
          />
        </Field>

        <ButtonGroup ratio="3:7">
          <ButtonGroup.Item>
            <Button
              type="button"
              variant="line"
              onClick={() => {
                reset();
                setResult(null);
              }}
            >
              초기화
            </Button>
          </ButtonGroup.Item>
          <ButtonGroup.Item>
            <Button type="submit" color="primary" isLoading={saving}>
              가입하기
            </Button>
          </ButtonGroup.Item>
        </ButtonGroup>

        <p style={{ marginTop: 12, minHeight: 24 }} aria-live="polite">
          {result}
        </p>
      </form>
    </Example>
  );
}
