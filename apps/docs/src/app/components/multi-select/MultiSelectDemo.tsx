"use client";

import { useState } from "react";
import {
  Field,
  MultiSelect,
  type MultiSelectValue,
  type SelectOption,
} from "@nui-kit/react";
import { Case, CaseGrid, Example } from "@/components/guide";

const CITIES: SelectOption[] = [
  { label: "서울", value: "seoul" },
  { label: "부산", value: "busan" },
  { label: "대구", value: "daegu" },
  { label: "인천", value: "incheon" },
  { label: "광주", value: "gwangju" },
  { label: "대전", value: "daejeon" },
  { label: "울산", value: "ulsan" },
];

export function MultiSelectBasicDemo() {
  const [cities, setCities] = useState<MultiSelectValue>(["seoul", "busan"]);

  return (
    <Example
      row={false}
      caption="고른 순서대로 배열에 들어간다"
      code={`<MultiSelect options={OPTIONS} value={cities} onChange={setCities} isSearchable isClearable />`}
      overflow
    >
      <Field>
        <Field.Label>관심 지역</Field.Label>
        <MultiSelect
          options={CITIES}
          value={cities}
          onChange={(next) => setCities(next)}
          placeholder="지역을 고르세요"
          isSearchable
          isClearable
        />
      </Field>
      <p style={{ marginTop: 12 }}>
        현재 값: <code>{JSON.stringify(cities)}</code>
      </p>
    </Example>
  );
}

export function MultiSelectMenuDemo() {
  const [kept, setKept] = useState<MultiSelectValue>([]);
  const [shown, setShown] = useState<MultiSelectValue>(["seoul"]);

  return (
    <CaseGrid
      columns={2}
      code={`<MultiSelect closeMenuOnSelect={false} />
<MultiSelect hideSelectedOptions={false} />`}
    >
      <Case label="closeMenuOnSelect={false}" note="골라도 열려 있다">
        <MultiSelect
          options={CITIES}
          value={kept}
          onChange={(next) => setKept(next)}
          placeholder="지역을 고르세요"
          closeMenuOnSelect={false}
        />
      </Case>
      <Case label="hideSelectedOptions={false}" note="고른 것도 목록에 남는다">
        <MultiSelect
          options={CITIES}
          value={shown}
          onChange={(next) => setShown(next)}
          placeholder="지역을 고르세요"
          hideSelectedOptions={false}
        />
      </Case>
    </CaseGrid>
  );
}

export function MultiSelectChipDemo() {
  const [labeled, setLabeled] = useState<MultiSelectValue>(["seoul", "busan"]);

  return (
    <CaseGrid
      columns={2}
      caption="× 의 접근 이름을 바꾼다. readOnly 면 × 가 없다"
      code={`<MultiSelect removeButtonLabel={(label) => \`Remove \${label}\`} />`}
    >
      <Case label="removeButtonLabel" note="Remove 서울">
        <MultiSelect
          options={CITIES}
          value={labeled}
          onChange={(next) => setLabeled(next)}
          placeholder="지역을 고르세요"
          removeButtonLabel={(label) => `Remove ${label}`}
        />
      </Case>
      <Case label="readOnly" note="× 가 사라진다">
        <MultiSelect
          options={CITIES}
          value={["seoul", "busan"]}
          placeholder="지역을 고르세요"
          readOnly
        />
      </Case>
    </CaseGrid>
  );
}
