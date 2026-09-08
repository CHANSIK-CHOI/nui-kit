"use client";

import { useState } from "react";
import {
  Field,
  Select,
  type SelectOption,
  type SingleSelectValue,
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

const WITH_DISABLED: SelectOption[] = [
  ...CITIES,
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

export function SelectBasicDemo() {
  const [city, setCity] = useState<SingleSelectValue>(null);

  return (
    <Example
      row={false}
      caption="고른 옵션의 value 가 그대로 상태에 들어간다"
      code={`<Select options={OPTIONS} value={city} onChange={setCity} />`}
      overflow
    >
      <Field>
        <Field.Label>거주 지역</Field.Label>
        <Select
          options={CITIES}
          value={city}
          onChange={(next) => setCity(next)}
          placeholder="지역을 고르세요"
        />
      </Field>
      <p style={{ marginTop: 12 }}>
        현재 값: <code>{JSON.stringify(city)}</code>
      </p>
    </Example>
  );
}

export function SelectSearchDemo() {
  const [searchable, setSearchable] = useState<SingleSelectValue>(null);
  const [clearable, setClearable] = useState<SingleSelectValue>("busan");

  return (
    <CaseGrid
      columns={2}
      caption="isSearchable 은 검색 결과가 없을 때의 문구를 함께 갖는다"
      code={`<Select options={OPTIONS} isSearchable isClearable />`}
    >
      <Case label="isSearchable" note="타이핑으로 거른다">
        <Select
          options={CITIES}
          value={searchable}
          onChange={(next) => setSearchable(next)}
          placeholder="지역 이름을 치세요"
          isSearchable
        />
      </Case>
      <Case label="isClearable" note="값이 있을 때만 버튼이 보인다">
        <Select
          options={CITIES}
          value={clearable}
          onChange={(next) => setClearable(next)}
          placeholder="지역을 고르세요"
          isClearable
        />
      </Case>
    </CaseGrid>
  );
}

export function SelectOptionsDemo() {
  const [grouped, setGrouped] = useState<SingleSelectValue>(null);
  const [partial, setPartial] = useState<SingleSelectValue>(null);

  return (
    <CaseGrid
      columns={3}
      caption="묶음 · 옵션별 isDisabled · isLoading"
      code={`options={[{ label: "수도권", options: [{ label: "서울", value: "seoul" }] }]}
options={[{ label: "세종", value: "sejong", isDisabled: true }]}`}
    >
      <Case label="묶음" note="{ label, options }">
        <Select
          options={GROUPED}
          value={grouped}
          onChange={(next) => setGrouped(next)}
          placeholder="지역을 고르세요"
        />
      </Case>
      <Case label="isDisabled" note="세종은 고를 수 없다">
        <Select
          options={WITH_DISABLED}
          value={partial}
          onChange={(next) => setPartial(next)}
          placeholder="지역을 고르세요"
        />
      </Case>
      <Case label="isLoading" note="불러오는 동안">
        <Select
          options={[]}
          value={null}
          placeholder="지역을 고르세요"
          isLoading
        />
      </Case>
    </CaseGrid>
  );
}

const CLIP_BOX = {
  overflow: "hidden",
  height: 120,
  padding: 12,
  border: "1px solid var(--nui-border-form)",
  borderRadius: 8,
} as const;

export function SelectPortalDemo() {
  const [clipped, setClipped] = useState<SingleSelectValue>(null);
  const [portaled, setPortaled] = useState<SingleSelectValue>(null);

  return (
    <CaseGrid
      columns={2}
      code={`<Select options={OPTIONS} hasPortal />   // 잘리는 상자 안에서`}
    >
      <Case label="기본" note="상자에 잘린다">
        <div style={CLIP_BOX}>
          <Select
            options={CITIES}
            value={clipped}
            onChange={(next) => setClipped(next)}
            placeholder="메뉴가 잘린다"
          />
        </div>
      </Case>
      <Case label="hasPortal" note="상자를 벗어난다">
        <div style={CLIP_BOX}>
          <Select
            hasPortal
            options={CITIES}
            value={portaled}
            onChange={(next) => setPortaled(next)}
            placeholder="잘리지 않는다"
          />
        </div>
      </Case>
    </CaseGrid>
  );
}
