"use client";

import { useState } from "react";
import {
  DateMultiplePicker,
  DateRangePicker,
  Datepicker,
  Field,
} from "@nui-kit/react";
import type { DateRange } from "react-day-picker";
import { Case, CaseGrid, Example } from "@/components/guide";

const TODAY = new Date();

export function DatepickerDemo() {
  const [date, setDate] = useState<Date | undefined>();
  const [range, setRange] = useState<DateRange | undefined>();
  const [dates, setDates] = useState<Date[] | undefined>();
  const [fieldDate, setFieldDate] = useState<Date | undefined>();
  const [clipDate, setClipDate] = useState<Date | undefined>();
  const [portalDate, setPortalDate] = useState<Date | undefined>();
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
        <Datepicker
          selected={date}
          onSelectedChange={setDate}
          placeholder="예약일을 고르세요"
          isClearable
        />
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
          placeholder="숙박 기간"
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
          placeholder="참석 가능한 날"
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
          placeholder="오늘 이후"
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
        <Datepicker placeholder="방문일" errorMessage="날짜를 선택해주세요." />
      </Example>

      <h2>잘리는 상자 안에서 — hasPortal</h2>
      <p>
        달력은 기본적으로 <strong>제자리에 뜬다.</strong> 조상에{" "}
        <code>overflow: hidden</code> 이 있으면 잘려서 날짜를 고를 수 없다. 카드나
        팝업 안에 넣을 때 <code>hasPortal</code> 을 켜면 달력이{" "}
        <code>body</code> 로 나가 잘리지 않는다. <code>Tooltip</code> ·{" "}
        <code>Select</code> 의 같은 이름 prop 과 한 규칙이다.
      </p>
      <CaseGrid
        columns={2}
        code={`<Datepicker hasPortal />   // 잘리는 상자 안에서`}
      >
        <Case label="기본" note="상자에 잘린다">
          <div
            style={{
              overflow: "hidden",
              height: 130,
              padding: 12,
              border: "1px solid var(--nui-border-form)",
              borderRadius: 8,
            }}
          >
            <Datepicker
              selected={clipDate}
              onSelectedChange={setClipDate}
              placeholder="달력이 잘린다"
            />
          </div>
        </Case>
        <Case label="hasPortal" note="상자를 벗어난다">
          <div
            style={{
              overflow: "hidden",
              height: 130,
              padding: 12,
              border: "1px solid var(--nui-border-form)",
              borderRadius: 8,
            }}
          >
            <Datepicker
              hasPortal
              selected={portalDate}
              onSelectedChange={setPortalDate}
              placeholder="잘리지 않는다"
            />
          </div>
        </Case>
      </CaseGrid>

      <h2>Field 와 함께</h2>
      <Example row={false} overflow>
        <Field>
          <Field.Label>예약 희망일</Field.Label>
          <Field.Description>영업일만 선택할 수 있습니다.</Field.Description>
          <Datepicker
            selected={fieldDate}
            onSelectedChange={setFieldDate}
            placeholder="예약 희망일"
            isClearable
          />
        </Field>
      </Example>
    </>
  );
}
