"use client";

import { useState } from "react";
import {
  Button,
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

export function SelectSizeDemo() {
  const [medium, setMedium] = useState<SingleSelectValue>("seoul");
  const [large, setLarge] = useState<SingleSelectValue>("seoul");

  return (
    <CaseGrid
      columns={2}
      caption="size — medium(기본) · large. 옆의 Button 과 같은 높이"
      code={`<Select options={OPTIONS} size="large" value={city} onChange={setCity} />`}
    >
      <Case label="medium" note="48px · 기본">
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Select
            options={CITIES}
            value={medium}
            onChange={(next) => setMedium(next)}
            placeholder="지역을 고르세요"
          />
          <div style={{ flexShrink: 0, width: 120 }}>
            <Button>적용</Button>
          </div>
        </div>
      </Case>
      <Case label="large" note="56px · 둥글기 8">
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Select
            size="large"
            options={CITIES}
            value={large}
            onChange={(next) => setLarge(next)}
            placeholder="지역을 고르세요"
          />
          <div style={{ flexShrink: 0, width: 120 }}>
            <Button size="large">적용</Button>
          </div>
        </div>
      </Case>
    </CaseGrid>
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

export function SelectPlacementDemo() {
  const [auto, setAuto] = useState<SingleSelectValue>(null);
  const [bottom, setBottom] = useState<SingleSelectValue>(null);
  const [top, setTop] = useState<SingleSelectValue>(null);

  return (
    <CaseGrid
      columns={3}
      code={`<Select options={OPTIONS} />                        // 아래가 모자라면 위로 뒤집힌다
<Select options={OPTIONS} menuPlacement="bottom" /> // 언제나 아래
<Select options={OPTIONS} menuPlacement="top" />    // 언제나 위`}
    >
      <Case label="기본" note="화면에 맞춰 뒤집힌다">
        <Select
          options={CITIES}
          value={auto}
          onChange={(next) => setAuto(next)}
          placeholder="지역"
        />
      </Case>
      {/* `data-demo` — `check-menu-motion` 의 「방향 고정」 절이 이 두 케이스를 집는다 */}
      <Case label={`menuPlacement="bottom"`} note="언제나 아래">
        <div data-demo="placement-bottom">
          <Select
            menuPlacement="bottom"
            options={CITIES}
            value={bottom}
            onChange={(next) => setBottom(next)}
            placeholder="지역"
          />
        </div>
      </Case>
      <Case label={`menuPlacement="top"`} note="언제나 위">
        <div data-demo="placement-top">
          <Select
            menuPlacement="top"
            options={CITIES}
            value={top}
            onChange={(next) => setTop(next)}
            placeholder="지역"
          />
        </div>
      </Case>
    </CaseGrid>
  );
}

export function SelectPortalDemo() {
  const [inPlace, setInPlace] = useState<SingleSelectValue>(null);
  const [portaled, setPortaled] = useState<SingleSelectValue>(null);
  const [inFlow, setInFlow] = useState<SingleSelectValue>(null);
  const [portaledDoc, setPortaledDoc] = useState<SingleSelectValue>(null);

  return (
    <CaseGrid
      columns={2}
      code={`<Select options={OPTIONS} />                                  // 제자리 — 상자에 잘린다
<Select options={OPTIONS} hasPortal />                        // body 로 나가 잘리지 않는다. 화면에 맞춰 뒤집힌다
<Select options={OPTIONS} menuPosition="static" />           // 흐름 안 — 아래를 민다
<Select options={OPTIONS} hasPortal menuPosition="absolute" /> // body 로 나가되 문서 좌표로 따라간다`}
    >
      <Case label="기본" note="상자에 잘린다">
        <div style={CLIP_BOX}>
          <Select
            options={CITIES}
            value={inPlace}
            onChange={(next) => setInPlace(next)}
            placeholder="지역"
          />
        </div>
      </Case>
      {/* `data-demo` — `check-menu-motion` 의 뒤집힘 절이 이 케이스를 집는다 */}
      <Case label="hasPortal" note="상자를 벗어난다">
        <div style={CLIP_BOX} data-demo="has-portal">
          <Select
            hasPortal
            options={CITIES}
            value={portaled}
            onChange={(next) => setPortaled(next)}
            placeholder="지역"
          />
        </div>
      </Case>
      <Case label={`menuPosition="static"`} note="상자에 잘린다">
        <div style={CLIP_BOX}>
          <Select
            menuPosition="static"
            options={CITIES}
            value={inFlow}
            onChange={(next) => setInFlow(next)}
            placeholder="지역"
          />
        </div>
      </Case>
      <Case
        label={`hasPortal · menuPosition="absolute"`}
        note="상자를 벗어나고 문서 좌표로 따라간다"
      >
        {/* `data-demo` — `check-menu-motion` 의 「portal 추적」 절이 이 케이스를 집는다 */}
        <div style={CLIP_BOX} data-demo="has-portal-absolute">
          <Select
            hasPortal
            menuPosition="absolute"
            options={CITIES}
            value={portaledDoc}
            onChange={(next) => setPortaledDoc(next)}
            placeholder="지역"
          />
        </div>
      </Case>
    </CaseGrid>
  );
}
