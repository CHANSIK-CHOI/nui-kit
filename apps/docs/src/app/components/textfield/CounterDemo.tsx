"use client";

import { useState } from "react";
import { Field, Textfield } from "@nui-kit/react";
import { Example } from "@/components/guide";

/** 값을 세는 예제이므로 Client Component 로 분리한다. */
export function CounterDemo() {
  const [nickname, setNickname] = useState("");

  return (
    <Example
      row={false}
      caption="maxLength — 왼쪽은 메시지, 오른쪽은 남은 글자다"
    >
      <Field>
        <Field.Label>별명</Field.Label>
        <Textfield
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          maxLength={10}
          placeholder="10자까지"
          infoMessage="다른 사람에게 보이는 이름이에요."
        />
      </Field>
    </Example>
  );
}
