"use client";

import { useState } from "react";
import { Field, Radio, RadioGroup } from "@chansikchoi/next-ui";
import { Example } from "@/components/guide";

const OPTIONS = [
  { value: "card", label: "신용카드" },
  { value: "transfer", label: "계좌이체" },
  { value: "phone", label: "휴대폰 결제" },
];

export function RadioDemo() {
  const [value, setValue] = useState("card");

  return (
    <>
      <h2>기본</h2>
      <Example row={false} caption="RadioGroup 이 name 을 전파한다">
        <Field>
          <Field.Label as="span">결제 수단</Field.Label>
          <RadioGroup name="payment">
            {OPTIONS.map((option) => (
              <Field key={option.value} direction="row" align="center">
                <Radio
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => setValue(option.value)}
                />
                <Field.Label>{option.label}</Field.Label>
              </Field>
            ))}
          </RadioGroup>
        </Field>
      </Example>

      <h2>가로 배치</h2>
      <Example row={false} caption='direction="row"'>
        <RadioGroup name="payment-row" direction="row">
          {OPTIONS.map((option) => (
            <Field key={option.value} direction="row" align="center">
              <Radio
                value={option.value}
                checked={value === option.value}
                onChange={() => setValue(option.value)}
              />
              <Field.Label>{option.label}</Field.Label>
            </Field>
          ))}
        </RadioGroup>
      </Example>

      <h2>상태</h2>
      <Example caption="checked · disabled · readOnly · error">
        <Radio name="state-demo" checked readOnly />
        <Radio name="state-demo-2" checked disabled readOnly />
        <Radio name="state-demo-3" disabled />
        <Radio name="state-demo-4" checked isError readOnly />
        <Radio name="state-demo-5" isError />
      </Example>
    </>
  );
}
