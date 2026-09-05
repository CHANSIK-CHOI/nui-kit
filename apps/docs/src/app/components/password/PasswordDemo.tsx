"use client";

import { useState } from "react";
import { Field, Password } from "@nui-kit/react";
import { Example } from "@/components/guide";

/** 값 소유가 필요한 예제이므로 Client Component 로 분리한다. */
export function PasswordDemo() {
  const [value, setValue] = useState("secret1234");

  return (
    <Example
      row={false}
      caption="isClearable — 값이 있을 때만 지우기가 나타나고, 지우면 숨김으로 돌아간다"
    >
      {/* Client Component 이므로 dot notation 을 쓸 수 있다 */}
      <Field>
        <Field.Label>비밀번호</Field.Label>
        <Password
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onClear={() => setValue("")}
          isClearable
          placeholder="8자 이상 입력"
        />
      </Field>
    </Example>
  );
}
