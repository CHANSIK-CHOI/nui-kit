"use client";

import { useForm } from "react-hook-form";
import { Button, ButtonGroup, Field } from "@nui-kit/react";
import { RHFDateRangePicker } from "@nui-kit/react/rhf";
import type { DateRange } from "react-day-picker";
import { Example } from "@/components/guide";

type FormValues = { stay: DateRange | undefined };

export function RHFDateRangePickerDemo() {
  const { control, handleSubmit, formState, reset, watch } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: { stay: undefined },
    });

  const stay = watch("stay");

  return (
    <>
      <h2>react-hook-form</h2>
      <p>
        <code>RHFDateRangePicker</code> 가 <code>@nui-kit/react/rhf</code> 에
        있다. 확정 전에는 값이 <code>undefined</code> 라 <code>required</code>{" "}
        만으로도 미완성 기간이 걸린다. 시작과 끝이 둘 다 있는지는{" "}
        <code>validate</code> 로 본다.
      </p>
      <Example
        row={false}
        caption="확정한 기간만 폼 값이 된다"
        code={`<RHFDateRangePicker control={control} name="stay" rules={{ validate: (v) => Boolean(v?.from && v?.to) || "기간을 골라 주세요" }} />`}
        overflow
      >
        <form
          onSubmit={handleSubmit(() => {
            window.alert("저장했습니다.");
          })}
        >
          <Field infoMessage="체크인과 체크아웃 날짜를 골라 주세요">
            <Field.Label>숙박 기간</Field.Label>
            <RHFDateRangePicker
              control={control}
              name="stay"
              rules={{
                validate: (value: DateRange | undefined) =>
                  Boolean(value?.from && value?.to) || "기간을 골라 주세요",
              }}
              placeholder="기간을 고르세요"
              isClearable
            />
          </Field>

          <div style={{ marginTop: 20 }}>
            <ButtonGroup ratio="3:7">
              <ButtonGroup.Item>
                <Button
                  type="button"
                  variant="line"
                  onClick={() => reset({ stay: undefined })}
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
                  stay: stay?.from
                    ? {
                        from: stay.from.toLocaleDateString("ko-KR"),
                        to: stay.to?.toLocaleDateString("ko-KR") ?? null,
                      }
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
