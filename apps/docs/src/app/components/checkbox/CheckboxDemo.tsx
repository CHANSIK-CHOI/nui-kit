"use client";

import { useState } from "react";
import { Checkbox, CheckboxGroup, Field } from "@chansikchoi/next-ui";
import { Example } from "@/components/guide";

const OPTIONS = [
  { value: "email", label: "이메일" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "앱 푸시" },
];

export function CheckboxDemo() {
  const [checked, setChecked] = useState<string[]>(["email"]);

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
