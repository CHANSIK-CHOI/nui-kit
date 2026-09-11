"use client";

import { useForm } from "react-hook-form";
import { Button, ButtonGroup, Field, type SelectOption } from "@nui-kit/react";
import { RHFSelect } from "@nui-kit/react/rhf";
import { Example } from "@/components/guide";

const CITIES: SelectOption[] = [
  { label: "서울", value: "seoul" },
  { label: "부산", value: "busan" },
  { label: "대구", value: "daegu" },
  { label: "인천", value: "incheon" },
  { label: "광주", value: "gwangju" },
];

type FormValues = { city: string | null };

export function RHFSelectDemo() {
  const { control, handleSubmit, formState, reset, watch } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: { city: null },
    });

  const city = watch("city");

  return (
    <>
      <h2>react-hook-form</h2>
      <p>
        <code>RHFSelect</code> 가 <code>@nui-kit/react/rhf</code> 에 있다.{" "}
        <code>control</code> 과 <code>name</code> 만 주면 값 · 검증 · 에러
        표시가 이어진다. 에러가 생겼다 사라져도 입력이 다시 만들어지지 않아
        포커스와 치던 검색어가 남는다.
      </p>
      <Example
        row={false}
        caption="required 검증. 값은 옵션의 value 로 들어온다"
        code={`<RHFSelect control={control} name="city" rules={{ required: "지역을 골라 주세요" }} options={OPTIONS} isSearchable isClearable />`}
        overflow
      >
        <form
          onSubmit={handleSubmit(() => {
            window.alert("저장했습니다.");
          })}
        >
          <Field infoMessage="배송지 기준으로 골라 주세요">
            <Field.Label>거주 지역</Field.Label>
            <RHFSelect
              control={control}
              name="city"
              rules={{ required: "지역을 골라 주세요" }}
              options={CITIES}
              placeholder="지역을 고르세요"
              isSearchable
              isClearable
            />
          </Field>

          <div style={{ marginTop: 20 }}>
            <ButtonGroup ratio="3:7">
              <ButtonGroup.Item>
                <Button
                  type="button"
                  variant="line"
                  onClick={() => reset({ city: null })}
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
                  city,
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
