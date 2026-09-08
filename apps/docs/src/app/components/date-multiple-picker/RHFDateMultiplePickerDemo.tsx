"use client";

import { useForm } from "react-hook-form";
import { Button, ButtonGroup, Field } from "@nui-kit/react";
import { RHFDateMultiplePicker } from "@nui-kit/react/rhf";
import { Example } from "@/components/guide";

type FormValues = { extraDates: Date[] | undefined };

export function RHFDateMultiplePickerDemo() {
  const { control, handleSubmit, formState, reset, watch } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: { extraDates: undefined },
    });

  const extraDates = watch("extraDates");

  return (
    <>
      <h2>react-hook-form</h2>
      <p>
        <code>RHFDateMultiplePicker</code> 가 <code>@nui-kit/react/rhf</code> 에
        있다. 값은 <code>Date[]</code> 로 들어오고 확정 전에는{" "}
        <code>undefined</code> 다. 최소 개수는 <code>validate</code> 로 본다.
      </p>
      <Example
        row={false}
        caption="확정한 날짜들만 폼 값이 된다"
        code={`<RHFDateMultiplePicker control={control} name="extraDates" rules={{ validate: (v) => (v?.length ?? 0) > 0 || "하루 이상 골라 주세요" }} />`}
        overflow
      >
        <form
          onSubmit={handleSubmit(() => {
            window.alert("저장했습니다.");
          })}
        >
          <Field>
            <Field.Label>추가 방문일</Field.Label>
            <RHFDateMultiplePicker
              control={control}
              name="extraDates"
              rules={{
                validate: (value: Date[] | undefined) =>
                  (value?.length ?? 0) > 0 || "하루 이상 골라 주세요",
              }}
              placeholder="날짜를 고르세요"
              isClearable
            />
          </Field>

          <div style={{ marginTop: 20 }}>
            <ButtonGroup ratio="3:7">
              <ButtonGroup.Item>
                <Button
                  type="button"
                  variant="line"
                  onClick={() => reset({ extraDates: undefined })}
                >
                  초기화
                </Button>
              </ButtonGroup.Item>
              <ButtonGroup.Item>
                <Button type="submit">저장</Button>
              </ButtonGroup.Item>
            </ButtonGroup>
          </div>

          <pre className="doc-code" style={{ marginTop: 16 }}>
            <code>
              {JSON.stringify(
                {
                  extraDates:
                    extraDates?.map((d) => d.toLocaleDateString("ko-KR")) ??
                    null,
                  isValid: formState.isValid,
                  errors: Object.fromEntries(
                    Object.entries(formState.errors).map(([key, error]) => [
                      key,
                      error?.message,
                    ]),
                  ),
                },
                null,
                2,
              )}
            </code>
          </pre>
        </form>
      </Example>
    </>
  );
}
