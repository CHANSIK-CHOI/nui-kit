"use client";

import { useState } from "react";
import { Checkbox, CheckboxGroup, Field } from "@nui-kit/react";
import { Example } from "@/components/guide";

const OPTIONS = [
  { value: "email", label: "이메일" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "앱 푸시" },
];

export function CheckboxDemo() {
  const [checked, setChecked] = useState<string[]>(["email"]);

  const toggleAll = () =>
    setChecked((prev) =>
      prev.length === OPTIONS.length ? [] : OPTIONS.map((o) => o.value),
    );

  const toggle = (value: string) =>
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  return (
    <>
      <h2>기본</h2>
      <Example caption="Field.Label 을 label 로 쓰면 클릭으로도 토글된다">
        <Field direction="row" align="center">
          <Checkbox
            checked={checked.includes("email")}
            onChange={() => toggle("email")}
          />
          <Field.Label>이메일 수신 동의</Field.Label>
        </Field>
      </Example>

      <h2>전체 선택 — 중간 상태</h2>
      <p>
        하위 항목이 <strong>일부만</strong> 선택됐을 때 쓴다.{" "}
        <code>indeterminate</code> 를 주면 대시(−)로 그리고, 스크린리더에는{" "}
        <code>aria-checked=&quot;mixed&quot;</code> 로 읽힌다.{" "}
        <code>CheckboxGroup</code> 이 대신 계산해 주지는 않는다 — 값은 소비자가
        소유한다.
      </p>
      <Example
        row={false}
        caption="일부만 고르면 대시, 전부 고르면 체크"
        code={`<Checkbox
  checked={checked.length === OPTIONS.length}
  indeterminate={checked.length > 0 && checked.length < OPTIONS.length}
  onChange={toggleAll}
/>`}
      >
        <Field>
          <Field direction="row" align="center">
            <Checkbox
              checked={checked.length === OPTIONS.length}
              indeterminate={
                checked.length > 0 && checked.length < OPTIONS.length
              }
              onChange={toggleAll}
            />
            <Field.Label>전체 선택</Field.Label>
          </Field>
          <CheckboxGroup name="channel-all">
            {OPTIONS.map((option) => (
              <Field key={option.value} direction="row" align="center">
                <Checkbox
                  value={option.value}
                  checked={checked.includes(option.value)}
                  onChange={() => toggle(option.value)}
                />
                <Field.Label>{option.label}</Field.Label>
              </Field>
            ))}
          </CheckboxGroup>
        </Field>
      </Example>

      <h2>그룹</h2>
      <p>
        <code>CheckboxGroup</code> 은 <code>role=&quot;group&quot;</code> 을
        붙이고 <code>name</code> · <code>disabled</code> · <code>readOnly</code>{" "}
        · <code>isError</code> 를 하위에 전파한다.
      </p>
      <Example row={false} caption='direction="column" (기본)'>
        <Field>
          <Field.Label as="span">수신 방법</Field.Label>
          <CheckboxGroup name="channel">
            {OPTIONS.map((option) => (
              <Field key={option.value} direction="row" align="center">
                <Checkbox
                  value={option.value}
                  checked={checked.includes(option.value)}
                  onChange={() => toggle(option.value)}
                />
                <Field.Label>{option.label}</Field.Label>
              </Field>
            ))}
          </CheckboxGroup>
        </Field>
      </Example>

      <Example row={false} caption='direction="row"'>
        <CheckboxGroup name="channel-row" direction="row">
          {OPTIONS.map((option) => (
            <Field key={option.value} direction="row" align="center">
              <Checkbox
                value={option.value}
                checked={checked.includes(option.value)}
                onChange={() => toggle(option.value)}
              />
              <Field.Label>{option.label}</Field.Label>
            </Field>
          ))}
        </CheckboxGroup>
      </Example>

      <h2>상태</h2>
      <Example caption="checked · disabled · readOnly · error">
        <Checkbox checked readOnly />
        <Checkbox checked disabled readOnly />
        <Checkbox disabled />
        <Checkbox checked isError readOnly />
        <Checkbox isError />
      </Example>
    </>
  );
}
