"use client";

import { useState } from "react";
import { Field, Radio, RadioGroup } from "@nui-kit/react";
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
    </>
  );
}
