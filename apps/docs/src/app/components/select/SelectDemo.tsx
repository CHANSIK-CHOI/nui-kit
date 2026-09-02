"use client";

import { useState } from "react";
import {
  Field,
  MultiSelect,
  Select,
  type MultiSelectValue,
  type SelectOption,
  type SingleSelectValue,
} from "@chansikchoi/next-ui";
import { Example } from "@/components/guide";

const CITIES: SelectOption[] = [
  { label: "서울", value: "seoul" },
  { label: "부산", value: "busan" },
  { label: "대구", value: "daegu" },
  { label: "인천", value: "incheon" },
  { label: "광주", value: "gwangju" },
  { label: "대전", value: "daejeon" },
  { label: "울산", value: "ulsan" },
  { label: "세종", value: "sejong", isDisabled: true },
];

const GROUPED = [
  {
    label: "수도권",
    options: [
      { label: "서울", value: "seoul" },
      { label: "인천", value: "incheon" },
      { label: "경기", value: "gyeonggi" },
    ],
  },
  {
    label: "영남권",
    options: [
      { label: "부산", value: "busan" },
      { label: "대구", value: "daegu" },
      { label: "울산", value: "ulsan" },
    ],
  },
];

export function SelectDemo() {
  const [city, setCity] = useState<SingleSelectValue>(null);
  const [searchable, setSearchable] = useState<SingleSelectValue>("busan");
  const [grouped, setGrouped] = useState<SingleSelectValue>(null);
  const [cities, setCities] = useState<MultiSelectValue>(["seoul", "busan"]);
  const [fieldCity, setFieldCity] = useState<SingleSelectValue>(null);

  return (
    <>
      <h2>기본</h2>
      <p>
        값은 옵션 객체가 아니라 <strong>원시값</strong>(<code>value</code>) 으로
        주고받는다. 폼 상태에 그대로 넣을 수 있다.
      </p>
      <Example
        row={false}
        caption="선택한 값이 그대로 상태에 들어간다"
        code={`<Select options={OPTIONS} value={city} onChange={setCity} />`}
        overflow
      >
        <Select
          options={CITIES}
          value={city}
          onChange={(next) => setCity(next)}
        />
        <p style={{ marginTop: 12 }}>
          현재 값: <code>{JSON.stringify(city)}</code>
        </p>
      </Example>

      <h2>검색과 지우기</h2>
      <p>
        <code>isSearchable</code> 로 타이핑 필터를, <code>isClearable</code> 로
        선택 해제 버튼을 켠다. 둘 다 기본값은 <code>false</code> 다.
      </p>
      <Example
        row={false}
        caption="isSearchable + isClearable"
        code={`<Select options={OPTIONS} isSearchable isClearable />`}
        overflow
      >
        <Select
          options={CITIES}
          value={searchable}
          onChange={(next) => setSearchable(next)}
          isSearchable
          isClearable
        />
      </Example>

      <h2>옵션 그룹</h2>
      <Example
        row={false}
        caption="options 에 { label, options } 를 넣는다"
        code={`options={[{ label: "수도권", options: [{ label: "서울", value: "seoul" }] }]}`}
        overflow
      >
        <Select
          options={GROUPED}
          value={grouped}
          onChange={(next) => setGrouped(next)}
        />
      </Example>

      <h2>다중 선택</h2>
      <p>
        <code>MultiSelect</code> 는 값이 배열이다. 선택 항목은 칩으로 표시되고
        칩의 × 로 개별 해제한다.
      </p>
      <Example
        row={false}
        caption="값이 원시값 배열로 들어온다"
        code={`<MultiSelect options={OPTIONS} value={cities} onChange={setCities} />`}
        overflow
      >
        <MultiSelect
          options={CITIES}
          value={cities}
          onChange={(next) => setCities(next)}
          isSearchable
          isClearable
        />
        <p style={{ marginTop: 12 }}>
          현재 값: <code>{JSON.stringify(cities)}</code>
        </p>
      </Example>

      <h2>상태</h2>
      <p>
        우선순위는 <strong>disabled &gt; error &gt; readonly</strong> 다.{" "}
        <code>readOnly</code> 는 값을 보여주되 메뉴를 열지 않는다 —{" "}
        <code>disabled</code> 와 달리 포커스는 받는다.
      </p>
      <Example
        row={false}
        caption="disabled"
        code={`<Select options={OPTIONS} errorMessage="지역을 선택해주세요" />`}
        overflow
      >
        <Select options={CITIES} value="seoul" disabled />
      </Example>
      <Example row={false} caption="readOnly — 열리지 않는다" overflow>
        <Select options={CITIES} value="busan" readOnly />
      </Example>
      <Example
        row={false}
        caption="errorMessage — 아이콘과 텍스트를 함께 표시하고 aria-describedby 로 연결한다"
        overflow
      >
        <Select
          options={CITIES}
          value={null}
          errorMessage="지역을 선택해주세요."
        />
      </Example>
      <Example row={false} caption="infoMessage" overflow>
        <Select
          options={CITIES}
          value={null}
          infoMessage="배송 가능 지역만 표시됩니다."
        />
      </Example>

      <h2>Field 와 함께</h2>
      <p>
        <code>Field</code> 안에 넣으면 라벨의 <code>htmlFor</code> 와 컨트롤의{" "}
        <code>id</code>, 설명·에러의 <code>aria-describedby</code> 가 자동으로
        연결된다.
      </p>
      <Example row={false} overflow>
        <Field>
          <Field.Label>거주 지역</Field.Label>
          <Field.Description>배송지 기준으로 선택해주세요.</Field.Description>
          <Select
            options={CITIES}
            value={fieldCity}
            onChange={(next) => setFieldCity(next)}
            isSearchable
          />
        </Field>
      </Example>
    </>
  );
}
