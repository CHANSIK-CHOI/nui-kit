"use client";

import { useState } from "react";
import { DateRangePicker, Field } from "@nui-kit/react";
import type { DateRange } from "react-day-picker";
import { Case, CaseGrid, Example } from "@/components/guide";

function formatRange(range: DateRange | undefined) {
  if (!range?.from) return "없음";
  const from = range.from.toLocaleDateString("ko-KR");
  const to = range.to ? range.to.toLocaleDateString("ko-KR") : "(미정)";
  return `${from} ~ ${to}`;
}

export function DateRangePickerSizeDemo() {
  const [medium, setMedium] = useState<DateRange | undefined>();
  const [large, setLarge] = useState<DateRange | undefined>();

  return (
    <CaseGrid
      columns={2}
      caption="size — medium(기본) · large. 달력은 크기와 무관하다"
      code={`<DateRangePicker size="large" selected={range} onSelectedChange={setRange} />`}
    >
      <Case label="medium" note="48px · 기본">
        <DateRangePicker
          selected={medium}
          onSelectedChange={setMedium}
          placeholder="기간을 고르세요"
          calendarLabel="숙박 기간 달력"
        />
      </Case>
      <Case label="large" note="56px · 둥글기 8">
        <DateRangePicker
          size="large"
          selected={large}
          onSelectedChange={setLarge}
          placeholder="기간을 고르세요"
          calendarLabel="숙박 기간 달력"
        />
      </Case>
    </CaseGrid>
  );
}

export function DateRangePickerBasicDemo() {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <Example
      row={false}
      caption="from → to 순서로 고르고 확정한다"
      code={`<DateRangePicker selected={range} onSelectedChange={setRange} isClearable />`}
      overflow
    >
      <Field>
        <Field.Label>숙박 기간</Field.Label>
        <DateRangePicker
          selected={range}
          onSelectedChange={setRange}
          placeholder="기간을 고르세요"
          isClearable
        />
      </Field>
      <p style={{ marginTop: 12 }}>
        현재 값: <code>{formatRange(range)}</code>
      </p>
    </Example>
  );
}

export function DateRangePickerConfirmDemo() {
  const [labeled, setLabeled] = useState<DateRange | undefined>();
  const [instant, setInstant] = useState<DateRange | undefined>();

  return (
    <CaseGrid
      columns={2}
      caption="확정 버튼이 없으면 둘 다 정해지는 순간 값이 나간다"
      code={`<DateRangePicker confirmLabel="기간 적용" />
<DateRangePicker hasConfirmButton={false} />`}
    >
      <Case label="confirmLabel" note="문구를 바꾼다">
        <DateRangePicker
          selected={labeled}
          onSelectedChange={setLabeled}
          placeholder="기간을 고르세요"
          confirmLabel="기간 적용"
        />
      </Case>
      <Case label="hasConfirmButton={false}" note="바로 반영">
        <DateRangePicker
          selected={instant}
          onSelectedChange={setInstant}
          placeholder="기간을 고르세요"
          hasConfirmButton={false}
        />
      </Case>
    </CaseGrid>
  );
}
