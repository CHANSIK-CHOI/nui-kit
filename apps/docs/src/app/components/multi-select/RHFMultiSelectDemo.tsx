"use client";

import { useForm } from "react-hook-form";
import { Button, ButtonGroup, Field, type SelectOption } from "@nui-kit/react";
import { RHFMultiSelect } from "@nui-kit/react/rhf";
import { Example } from "@/components/guide";

const CITIES: SelectOption[] = [
  { label: "서울", value: "seoul" },
  { label: "부산", value: "busan" },
  { label: "대구", value: "daegu" },
  { label: "인천", value: "incheon" },
  { label: "광주", value: "gwangju" },
];

type FormValues = { interests: string[] };

export function RHFMultiSelectDemo() {
  const { control, handleSubmit, formState, reset, watch } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: { interests: [] },
    });

  const interests = watch("interests");

  return (
    <>
      <h2>react-hook-form</h2>
      <p>
        <code>RHFMultiSelect</code> 가 <code>@nui-kit/react/rhf</code> 에 있다.
        값은 배열로 들어오고 빈 배열이 「없음」이다. 최소 개수는{" "}
        <code>validate</code> 로 본다.
      </p>
      <Example
        row={false}
        caption="고른 순서가 폼 값의 순서다"
        code={`<RHFMultiSelect control={control} name="interests" rules={{ validate: (v) => v.length > 0 || "한 곳 이상 골라 주세요" }} options={OPTIONS} isSearchable />`}
        overflow
      >
        <form
          onSubmit={handleSubmit(() => {
            window.alert("저장했습니다.");
          })}
        >
          <Field>
            <Field.Label>관심 지역</Field.Label>
            <RHFMultiSelect
              control={control}
              name="interests"
              rules={{
                validate: (value: string[]) =>
                  value.length > 0 || "한 곳 이상 골라 주세요",
              }}
              options={CITIES}
              placeholder="지역을 고르세요"
              isSearchable
            />
          </Field>

          <div style={{ marginTop: 20 }}>
            <ButtonGroup ratio="3:7">
              <ButtonGroup.Item>
                <Button
                  type="button"
                  variant="line"
                  onClick={() => reset({ interests: [] })}
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
                  interests,
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
