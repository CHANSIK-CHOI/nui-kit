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
  const [value, setValue] = useState("운동화");
  const [ran, setRan] = useState<string | null>(null);

  return (
    <CaseGrid
      columns={2}
      caption="onSearch 를 주면 버튼은 그 콜백만 부른다. 폼 제출은 일어나지 않는다"
      code={`<Search value={v} onChange={onChange} onSearch={run} isClearable onClear={clear} />`}
    >
      <Case label="기본" note="버튼은 submit">
        <Field>
          <Field.Label>검색어</Field.Label>
          <Search placeholder="상품명 · 브랜드" />
        </Field>
      </Case>
      <Case
        label="onSearch + isClearable"
        note="버튼은 button. 값이 있을 때만 지우기"
      >
        <Field>
          <Field.Label>검색어</Field.Label>
          <Search
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onSearch={() => setRan(value)}
            onClear={() => setValue("")}
            isClearable
            placeholder="상품명 · 브랜드"
          />
        </Field>
        <p
          style={{ marginTop: 8, minHeight: 20, fontSize: 13 }}
          aria-live="polite"
        >
          {ran ? `「${ran}」 로 검색했어요` : ""}
        </p>
      </Case>
    </CaseGrid>
  );
}
