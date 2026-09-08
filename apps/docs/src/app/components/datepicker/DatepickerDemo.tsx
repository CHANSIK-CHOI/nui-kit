"use client";

import { useState } from "react";
import { Datepicker, Field } from "@nui-kit/react";
import { Case, CaseGrid, Example } from "@/components/guide";

const TODAY = new Date();
const THIS_YEAR = TODAY.getFullYear();

export function DatepickerBasicDemo() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Example
      row={false}
      caption="고르면 닫힌다. isClearable 은 값이 있을 때만 지우기 버튼을 보인다"
      code={`<Datepicker selected={date} onSelectedChange={setDate} isClearable />`}
      overflow
    >
      <Field>
        <Field.Label>예약일</Field.Label>
        <Datepicker
          selected={date}
          onSelectedChange={setDate}
          placeholder="날짜를 고르세요"
          isClearable
        />
      </Field>
      <p style={{ marginTop: 12 }}>
        현재 값: <code>{date ? date.toLocaleDateString("ko-KR") : "없음"}</code>
      </p>
    </Example>
  );
}

export function DatepickerAllowedDemo() {
  const [future, setFuture] = useState<Date | undefined>();
  const [inYear, setInYear] = useState<Date | undefined>();

  return (
    <CaseGrid
      columns={2}
      caption="막힌 날짜는 달력에서도 타이핑에서도 받지 않는다"
      code={`<Datepicker dayPickerProps={{ disabled: { before: new Date() } }} />`}
    >
      <Case label="disabled" note="오늘 이전을 막는다">
        <Datepicker
          selected={future}
          onSelectedChange={setFuture}
          placeholder="오늘 이후"
          dayPickerProps={{ disabled: { before: TODAY } }}
        />
      </Case>
      <Case label="startMonth · endMonth" note="올해 안에서만 오간다">
        <Datepicker
          selected={inYear}
          onSelectedChange={setInYear}
          placeholder="올해 안"
          dayPickerProps={{
            startMonth: new Date(THIS_YEAR, 0),
            endMonth: new Date(THIS_YEAR, 11),
          }}
        />
      </Case>
    </CaseGrid>
  );
}

const CLIP_BOX = {
  overflow: "hidden",
  height: 130,
  padding: 12,
  border: "1px solid var(--nui-border-form)",
  borderRadius: 8,
} as const;

export function DatepickerPortalDemo() {
  const [clipped, setClipped] = useState<Date | undefined>();
  const [portaled, setPortaled] = useState<Date | undefined>();

  return (
    <CaseGrid
      columns={2}
      code={`<Datepicker hasPortal />   // 잘리는 상자 안에서`}
    >
      <Case label="기본" note="상자에 잘린다">
        <div style={CLIP_BOX}>
          <Datepicker
            selected={clipped}
            onSelectedChange={setClipped}
            placeholder="달력이 잘린다"
          />
        </div>
      </Case>
      <Case label="hasPortal" note="상자를 벗어난다">
        <div style={CLIP_BOX}>
          <Datepicker
            hasPortal
            selected={portaled}
            onSelectedChange={setPortaled}
            placeholder="잘리지 않는다"
          />
        </div>
      </Case>
    </CaseGrid>
  );
}
