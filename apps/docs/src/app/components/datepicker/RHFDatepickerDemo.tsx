"use client";

import { useForm } from "react-hook-form";
import { Button, Field } from "@nui-kit/react";
import {
  RHFDateMultiplePicker,
  RHFDateRangePicker,
  RHFDatepicker,
} from "@nui-kit/react/rhf";
import type { DateRange } from "react-day-picker";
import { Example } from "@/components/guide";

type FormValues = {
  visitDate: Date | undefined;
  stay: DateRange | undefined;
  extraDates: Date[] | undefined;
};

export function RHFDatepickerDemo() {
  const { control, handleSubmit, formState, reset, watch } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: {
        visitDate: undefined,
        stay: undefined,
        extraDates: undefined,
      },
    });

  const values = watch();

  return (
    <>
      <h2>react-hook-form 연동</h2>
      <p>
        <code>@nui-kit/react/rhf</code> 의 <code>RHFDatepicker</code> ·{" "}
        <code>RHFDateRangePicker</code> · <code>RHFDateMultiplePicker</code> 는{" "}
        <code>control</code> 만 넘기면 값과 에러를 스스로 소유한다.{" "}
        <code>selected</code> · <code>name</code> · <code>onBlur</code> 는
        타입에서 제외되어 중복 소유가 생기지 않는다.
      </p>

      <Example row={false} caption='mode: "onChange"' overflow>
        <form
          onSubmit={handleSubmit(() => {
            window.alert("제출되었습니다.");
          })}
        >
          <Field>
            <Field.Label>방문일</Field.Label>
            <RHFDatepicker
              control={control}
              name="visitDate"
              rules={{ required: "방문일을 선택해주세요." }}
              placeholder="방문일"
              isClearable
            />
          </Field>

          <div style={{ marginTop: 16 }}>
            <Field>
              <Field.Label>숙박 기간</Field.Label>
              <Field.Description>
                시작일과 종료일을 모두 선택해야 합니다.
              </Field.Description>
              <RHFDateRangePicker
                control={control}
                name="stay"
                rules={{
                  validate: (value: DateRange | undefined) =>
                    Boolean(value?.from && value?.to) ||
                    "기간을 모두 선택해주세요.",
                }}
                placeholder="숙박 기간"
                isClearable
              />
            </Field>
          </div>

          <div style={{ marginTop: 16 }}>
            <Field>
              <Field.Label>추가 방문일</Field.Label>
              <Field.Description>
                여러 날짜를 고를 수 있습니다.
              </Field.Description>
              <RHFDateMultiplePicker
                control={control}
                name="extraDates"
                rules={{
                  validate: (value: Date[] | undefined) =>
                    (value?.length ?? 0) > 0 || "하루 이상 선택해주세요.",
                }}
                placeholder="추가 방문일"
                isClearable
              />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <Button type="submit">제출</Button>
            <Button
              type="button"
              variant="line"
              onClick={() =>
                reset({
                  visitDate: undefined,
                  stay: undefined,
                  extraDates: undefined,
                })
              }
            >
              초기화
            </Button>
          </div>

          <pre className="doc-code" style={{ marginTop: 16 }}>
            <code>
              {JSON.stringify(
                {
                  visitDate: values.visitDate
                    ? values.visitDate.toLocaleDateString("ko-KR")
                    : null,
                  stay: values.stay?.from
                    ? {
                        from: values.stay.from.toLocaleDateString("ko-KR"),
                        to: values.stay.to?.toLocaleDateString("ko-KR") ?? null,
                      }
                    : null,
                  extraDates:
                    values.extraDates?.map((d) =>
                      d.toLocaleDateString("ko-KR"),
                    ) ?? null,
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
