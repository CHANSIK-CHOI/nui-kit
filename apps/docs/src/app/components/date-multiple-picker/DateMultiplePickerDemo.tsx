"use client";

import { useState } from "react";
import { DateMultiplePicker, Field } from "@nui-kit/react";
import { Case, CaseGrid, Example } from "@/components/guide";

function countOf(dates: Date[] | undefined) {
  return dates?.length ? `${dates.length}일` : "없음";
}

export function DateMultiplePickerBasicDemo() {
  const [dates, setDates] = useState<Date[] | undefined>();

  return (
    <Example
      row={false}
      caption="누를 때마다 더해지고, 확정을 눌러야 값이 나간다"
      code={`<DateMultiplePicker selected={dates} onSelectedChange={setDates} isClearable />`}
      overflow
    >
      <Field>
        <Field.Label>참석 가능일</Field.Label>
        <DateMultiplePicker
          selected={dates}
          onSelectedChange={setDates}
          placeholder="날짜를 고르세요"
          isClearable
        />
      </Field>
      <p style={{ marginTop: 12 }}>
        현재 값: <code>{countOf(dates)}</code>
      </p>
    </Example>
  );
}

export function DateMultiplePickerConfirmDemo() {
  const [labeled, setLabeled] = useState<Date[] | undefined>();
  const [instant, setInstant] = useState<Date[] | undefined>();

  return (
    <CaseGrid
      columns={2}
      caption="확정 버튼이 없으면 누를 때마다 값이 나간다"
      code={`<DateMultiplePicker confirmLabel="날짜 적용" />
<DateMultiplePicker hasConfirmButton={false} />`}
    >
      <Case label="confirmLabel" note="문구를 바꾼다">
        <DateMultiplePicker
          selected={labeled}
          onSelectedChange={setLabeled}
          placeholder="날짜를 고르세요"
          confirmLabel="날짜 적용"
        />
      </Case>
      <Case label="hasConfirmButton={false}" note="바로 반영">
        <DateMultiplePicker
          selected={instant}
          onSelectedChange={setInstant}
          placeholder="날짜를 고르세요"
          hasConfirmButton={false}
        />
        <p style={{ marginTop: 12 }}>
          현재 값: <code>{countOf(instant)}</code>
        </p>
      </Case>
    </CaseGrid>
  );
}
