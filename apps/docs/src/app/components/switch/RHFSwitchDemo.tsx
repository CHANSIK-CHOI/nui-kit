"use client";

import { useForm } from "react-hook-form";
import { Button, Field } from "@chansikchoi/next-ui";
import { RHFSwitch } from "@chansikchoi/next-ui/rhf";
import { Example } from "@/components/guide";

type FormValues = { nightAlarm: boolean; weeklyDigest: boolean };

export function RHFSwitchDemo() {
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: { nightAlarm: true, weeklyDigest: false },
  });
  const values = watch();

  return (
    <>
      <h2>react-hook-form</h2>
      <p>
        <code>RHFSwitch</code> 는 <code>/rhf</code> 서브패스에 있다. 스위치
        하나가 boolean 필드 하나다. <code>checked</code> · <code>onChange</code>{" "}
        · <code>name</code> 은 RHF 가 소유한다.
      </p>
      <Example
        row={false}
        caption="설정 화면 — 스위치마다 필드 하나"
        code={`<RHFSwitch control={control} name="nightAlarm" />`}
      >
        <form
          onSubmit={handleSubmit(() => window.alert("저장되었습니다."))}
          style={{ maxWidth: 480 }}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <Field direction="row" align="center">
              <RHFSwitch control={control} name="nightAlarm" />
              <Field.Label>야간 알림 받기</Field.Label>
            </Field>
            <Field direction="row" align="center">
              <RHFSwitch control={control} name="weeklyDigest" />
              <Field.Label>주간 요약 메일</Field.Label>
            </Field>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button type="submit" size="medium">
              저장
            </Button>
            <Button
              type="button"
              size="medium"
              variant="line"
              onClick={() => reset({ nightAlarm: true, weeklyDigest: false })}
            >
              초기화
            </Button>
          </div>
          <pre className="doc-code" style={{ marginTop: 16 }}>
            <code>{JSON.stringify(values, null, 2)}</code>
          </pre>
        </form>
      </Example>
    </>
  );
}
