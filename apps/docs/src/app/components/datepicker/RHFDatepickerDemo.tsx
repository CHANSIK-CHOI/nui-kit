"use client";

import { useForm } from "react-hook-form";
import { Button, ButtonGroup, Field } from "@nui-kit/react";
import { RHFDatepicker } from "@nui-kit/react/rhf";
import { Example } from "@/components/guide";

type FormValues = { visitDate: Date | undefined };

export function RHFDatepickerDemo() {
  const { control, handleSubmit, formState, reset, watch } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: { visitDate: undefined },
    });

  const visitDate = watch("visitDate");

  return (
    <>
      <h2>react-hook-form</h2>
      <p>
        <code>RHFDatepicker</code> 가 <code>@nui-kit/react/rhf</code> 에 있다.{" "}
        <code>control</code> 과 <code>name</code> 만 주면 값 · 검증 · 에러
        표시가 이어진다. 검증에 걸려 포커스가 이 입력으로 와도 달력은 열리지
        않는다. 에러 메시지를 가리지 않기 위해서다.
      </p>
      <Example
        row={false}
        caption="required 검증. 값은 Date 로 들어온다"
        code={`<RHFDatepicker control={control} name="visitDate" rules={{ required: "방문일을 골라 주세요" }} isClearable />`}
        overflow
      >
        <form
          onSubmit={handleSubmit(() => {
            window.alert("저장했습니다.");
          })}
        >
          <Field>
            <Field.Label>방문일</Field.Label>
            <RHFDatepicker
              control={control}
              name="visitDate"
              rules={{ required: "방문일을 골라 주세요" }}
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
                  onClick={() => reset({ visitDate: undefined })}
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
                  visitDate: visitDate
                    ? visitDate.toLocaleDateString("ko-KR")
                    : null,
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
