"use client";

import { useState } from "react";
import { Field, Textfield } from "@chansikchoi/next-ui";
import { Example } from "@/components/Example";

/** 값 소유가 필요한 예제이므로 Client Component 로 분리한다. */
export function TextfieldDemo() {
  const [value, setValue] = useState("지워보세요");

  return (
    <Example row={false} caption="isClearable — 값이 있을 때만 버튼이 나타난다">
      {/* Client Component 이므로 dot notation 을 쓸 수 있다 */}
      <Field>
        <Field.Label>검색어</Field.Label>
        <Textfield
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onClear={() => setValue("")}
          isClearable
          placeholder="입력해보세요"
        />
      </Field>
    </Example>
  );
}
