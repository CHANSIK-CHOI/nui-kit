"use client";

import { useState } from "react";
import { Field } from "@nui-kit/react";
import { Search } from "@nui-kit/react/textfield";
import { Case, CaseGrid } from "@/components/guide";

/**
 * 값 소유가 필요한 예제라 Client Component 로 분리한다.
 *
 * ⚠️ 지우기 버튼은 `isClearable && onClear && 값 있음 && !readOnly && !disabled`
 *    일 때만 나온다. `readOnly` 로 값을 고정해 두면 버튼이 보이지 않는다.
 */
export function SearchDemo() {
  const [value, setValue] = useState("검색어");

  return (
    <CaseGrid
      columns={2}
      code={`<Search value={v} onChange={onChange} onSearch={onSearch} isClearable onClear={clear} />`}
    >
      <Case label="기본">
        <Field>
          <Field.Label>검색</Field.Label>
          <Search placeholder="검색어를 입력하세요" />
        </Field>
      </Case>
      <Case label="isClearable" note="값이 있을 때만 버튼이 나온다">
        <Field>
          <Field.Label>검색</Field.Label>
          <Search
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onClear={() => setValue("")}
            isClearable
            placeholder="검색어를 입력하세요"
          />
        </Field>
      </Case>
    </CaseGrid>
  );
}
