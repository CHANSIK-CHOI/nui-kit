"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Field } from "@nui-kit/react";
import { RHFSearch } from "@nui-kit/react/rhf";
import { Example } from "@/components/guide";

type FormValues = { keyword: string };

export function RHFSearchDemo() {
  const { control, handleSubmit, formState, reset } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { keyword: "" },
  });
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <>
      <h2>react-hook-form</h2>
      <p>
        <code>RHFSearch</code> 에 <code>onSearch</code> 를 주지 않으면 버튼이 폼
        제출이라 <strong>검증에 걸리면 검색이 실행되지 않는다.</strong> 검증과
        검색을 한 흐름으로 묶는 가장 짧은 길이다.
      </p>
      <Example
        row={false}
        caption="검색 버튼이 submit — 검증을 통과해야 handleSubmit 이 불린다"
        code={`<RHFSearch control={control} name="keyword" rules={{ minLength: { value: 2, message: "…" } }} isClearable />`}
      >
        <form
          onSubmit={handleSubmit(({ keyword }) => setSubmitted(keyword))}
          style={{ maxWidth: 480 }}
        >
          <Field>
            <Field.Label>검색어</Field.Label>
            <RHFSearch
              control={control}
              name="keyword"
              rules={{
                required: "검색어를 입력해 주세요.",
                minLength: { value: 2, message: "두 글자 이상 입력해 주세요." },
              }}
              placeholder="두 글자 이상"
              isClearable
            />
          </Field>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              alignItems: "center",
            }}
          >
            <Button
              type="button"
              size="medium"
              variant="line"
              onClick={() => {
                reset({ keyword: "" });
                setSubmitted(null);
              }}
            >
              초기화
            </Button>
            <span style={{ fontSize: "var(--nui-font-size-3)" }}>
              {submitted
                ? `"${submitted}" 로 검색했습니다`
                : `isValid: ${String(formState.isValid)}`}
            </span>
          </div>
        </form>
      </Example>
      <div className="doc-note">
        <code>onSearch</code> 를 주면 버튼이{" "}
        <code>type=&quot;button&quot;</code> 이 되어 폼 제출 없이 그 콜백만
        부른다. 이때는 검증과 무관하게 실행되므로 값을 <code>getValues()</code>{" "}
        로 읽는다.
      </div>
    </>
  );
}
