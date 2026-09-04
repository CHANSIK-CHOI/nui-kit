"use client";

import { useState } from "react";
import { Field, Switch } from "@chansikchoi/next-ui";
import { Example } from "@/components/guide";

export function SwitchDemo() {
  const [on, setOn] = useState(true);

  return (
    <>
      <h2>기본</h2>
      <Example caption="label 클릭으로도 토글된다">
        <Field direction="row" align="center">
          <Switch checked={on} onChange={(e) => setOn(e.target.checked)} />
          <Field.Label>야간 알림 받기</Field.Label>
        </Field>
      </Example>

      <h2>상태</h2>
      <Example caption="on · off · disabled · readOnly · error">
        <Switch checked readOnly />
        <Switch checked={false} readOnly />
        <Switch checked disabled readOnly />
        <Switch checked={false} disabled />
        <Switch checked isError readOnly />
      </Example>

      <h2>커스터마이징</h2>
      <Example caption="--nui-switch--width / --nui-switch--height">
        <div
          style={
            {
              display: "flex",
              gap: 12,
              alignItems: "center",
              "--nui-switch--width": "3.5rem",
              "--nui-switch--height": "2rem",
            } as React.CSSProperties
          }
        >
          <Switch checked readOnly />
          <Switch checked={false} readOnly />
        </div>
      </Example>
    </>
  );
}
