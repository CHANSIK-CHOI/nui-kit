"use client";

import { useForm } from "react-hook-form";
import { Button, Field, type SelectOption } from "@chansikchoi/next-ui";
import { RHFMultiSelect, RHFSelect } from "@chansikchoi/next-ui/rhf";
import { Example } from "@/components/Example";

const CITIES: SelectOption[] = [
  { label: "서울", value: "seoul" },
  { label: "부산", value: "busan" },
  { label: "대구", value: "daegu" },
  { label: "인천", value: "incheon" },
  { label: "광주", value: "gwangju" },
];

type FormValues = {
  city: string | null;
  interests: string[];
};

export function RHFSelectDemo() {
  const { control, handleSubmit, formState, reset, watch } =
    useForm<FormValues>({
      // onChange 모드에서는 값이 바뀔 때마다 에러가 생겼다 사라진다.
      // 그때 컨트롤이 remount 되지 않는지 확인하는 것이 이 예제의 핵심이다.
      mode: "onChange",
      defaultValues: { city: null, interests: [] },
    });

  const values = watch();

  return (
    <>
      <h2>react-hook-form 연동</h2>
      <p>
        <code>@chansikchoi/next-ui/rhf</code> 의 <code>RHFSelect</code> ·{" "}
        <code>RHFMultiSelect</code> 는 <code>control</code> 만 넘기면 값과 에러를
        스스로 소유한다. <code>value</code> · <code>onChange</code> ·{" "}
        <code>name</code> 은 타입에서 제외되어 있어 중복 소유가 생기지 않는다.
      </p>

      <Example row={false} caption='mode: "onChange" — 값이 바뀔 때마다 검증한다'>
        <form
          onSubmit={handleSubmit(() => {
            window.alert("제출되었습니다.");
          })}
        >
          <Field>
            <Field.Label>거주 지역</Field.Label>
            <Field.Description>필수 항목입니다.</Field.Description>
            <RHFSelect
              control={control}
              name="city"
              rules={{ required: "지역을 선택해주세요." }}
              options={CITIES}
              isSearchable
              isClearable
            />
          </Field>

          <div style={{ marginTop: 16 }}>
            <Field>
              <Field.Label>관심 지역</Field.Label>
              <Field.Description>하나 이상 선택해주세요.</Field.Description>
              <RHFMultiSelect
                control={control}
                name="interests"
                rules={{
                  validate: (value: string[]) =>
                    value.length > 0 || "최소 한 곳을 선택해주세요.",
                }}
                options={CITIES}
                isSearchable
              />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <Button type="submit">제출</Button>
            <Button
              type="button"
              variant="line"
              onClick={() => reset({ city: null, interests: [] })}
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

      <div className="doc-note">
        에러 메시지는 <code>fieldState.error.message</code> 가 그대로{" "}
        <code>errorMessage</code> 로 전달되어 컨트롤 아래에 표시되고,{" "}
        <code>aria-describedby</code> 로 연결된다. 직접{" "}
        <code>errorMessage</code> 를 넘기면 RHF 에러가 없을 때의 대체값으로
        쓰인다.
      </div>
    </>
  );
}
