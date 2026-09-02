"use client";

import { useState } from "react";
import {
  DateMultiplePicker,
  DateRangePicker,
  Datepicker,
  Field,
} from "@chansikchoi/next-ui";
import type { DateRange } from "react-day-picker";
import { Example } from "@/components/guide";

const TODAY = new Date();

export function DatepickerDemo() {
  const [date, setDate] = useState<Date | undefined>();
  const [range, setRange] = useState<DateRange | undefined>();
  const [dates, setDates] = useState<Date[] | undefined>();
  const [fieldDate, setFieldDate] = useState<Date | undefined>();
  const [limited, setLimited] = useState<Date | undefined>();

  return (
    <>
      <h2>기본 — 날짜 하나</h2>
      <p>
        입력창을 클릭하거나 캘린더 버튼을 누르면 달력이 열린다. 날짜를 고르면
        자동으로 닫힌다.
      </p>
      <Example
        row={false}
        caption="선택하면 닫힌다 (shouldCloseOnSelect 기본값)"
        code={`<Datepicker selected={date} onSelectedChange={setDate} />`}
        overflow
      >
        <Datepicker selected={date} onSelectedChange={setDate} isClearable />
        <p style={{ marginTop: 12 }}>
          현재 값:{" "}
          <code>{date ? date.toLocaleDateString("ko-KR") : "없음"}</code>
        </p>
      </Example>

      <h2>기간 선택</h2>
      <p>
        시작일과 종료일을 차례로 고른다. 둘 다 정해지기 전까지는{" "}
        <code>onSelectedChange</code> 가 <code>undefined</code> 를 넘긴다 —
        불완전한 기간이 폼에 들어가지 않는다.
      </p>
      <Example
        row={false}
        caption="from → to 순서로 선택"
        code={`<DateRangePicker selected={range} onSelectedChange={setRange} />`}
        overflow
      >
        <DateRangePicker
          selected={range}
          onSelectedChange={setRange}
          isClearable
        />
        <p style={{ marginTop: 12 }}>
          현재 값:{" "}
          <code>
            {range?.from
              ? `${range.from.toLocaleDateString("ko-KR")} ~ ${
                  range.to ? range.to.toLocaleDateString("ko-KR") : "(미정)"
                }`
              : "없음"}
          </code>
        </p>
      </Example>

      <h2>여러 날짜</h2>
      <p>
        날짜를 여러 개 고른다. 선택할 때마다 달력이 닫히면 불편하므로 열린
        상태를 유지한다.
      </p>
      <Example
        row={false}
        caption="선택해도 닫히지 않는다"
        code={`<DateMultiplePicker selected={dates} onSelectedChange={setDates} />`}
        overflow
      >
        <DateMultiplePicker
          selected={dates}
          onSelectedChange={setDates}
          isClearable
        />
        <p style={{ marginTop: 12 }}>
          현재 값: <code>{dates?.length ? `${dates.length}개` : "없음"}</code>
        </p>
      </Example>

      <h2>선택 가능 범위 제한</h2>
      <p>
        <code>dayPickerProps</code> 로 react-day-picker 에 그대로 전달한다. 오늘
        이전 날짜를 막은 예다.
      </p>
      <Example
        row={false}
        caption="dayPickerProps.disabled 로 과거 차단"
        code={`dayPickerProps={{ disabled: { before: new Date() } }}`}
        overflow
      >
        <Datepicker
          selected={limited}
          onSelectedChange={setLimited}
          dayPickerProps={{ disabled: { before: TODAY } }}
        />
      </Example>

      <h2>상태</h2>
      <Example
        row={false}
        caption="disabled"
        code={`<Datepicker selected={date} errorMessage="날짜를 선택해주세요" />`}
        overflow
      >
        <Datepicker selected={TODAY} disabled />
      </Example>
      <Example
        row={false}
        caption="readOnly — 값은 보이지만 달력이 열리지 않는다"
        overflow
      >
        <Datepicker selected={TODAY} readOnly />
      </Example>
      <Example
        row={false}
        caption="errorMessage — 아이콘과 텍스트를 함께 표시하고 aria-describedby 로 연결한다"
        overflow
      >
        <Datepicker errorMessage="날짜를 선택해주세요." />
      </Example>

      <h2>Field 와 함께</h2>
      <Example row={false} overflow>
        <Field>
          <Field.Label>예약 희망일</Field.Label>
          <Field.Description>영업일만 선택할 수 있습니다.</Field.Description>
          <Datepicker
            selected={fieldDate}
            onSelectedChange={setFieldDate}
            isClearable
          />
        </Field>
      </Example>
    </>
  );
}
