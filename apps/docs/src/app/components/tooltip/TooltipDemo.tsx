"use client";

import { useState } from "react";
import {
  Button,
  IconButton,
  LayerPopup,
  Tooltip,
  type TooltipPlacement,
} from "@nui-kit/react";
import { DelIcon, SearchIcon, CalendarIcon } from "@nui-kit/react/icon";
import { Case, CaseGrid, Example } from "@/components/guide";

const PLACEMENTS: TooltipPlacement[] = [
  "topLeft",
  "topCenter",
  "topRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight",
];

export function TooltipBasicDemo() {
  return (
    <Example
      caption="마우스를 올리거나 Tab 으로 포커스한다"
      code={`<Tooltip content="삭제한 항목은 되돌릴 수 없습니다">
  <IconButton aria-label="삭제"><DelIcon /></IconButton>
</Tooltip>`}
    >
      <Tooltip content="삭제한 항목은 되돌릴 수 없습니다">
        <IconButton aria-label="삭제">
          <DelIcon />
        </IconButton>
      </Tooltip>
      <Tooltip content="긴 설명은 폭 상한에서 줄이 바뀝니다. 두 줄 세 줄로 이어집니다.">
        <span
          style={{
            textDecoration: "underline dotted",
            cursor: "help",
            fontSize: "var(--nui-font-size-2)",
          }}
          tabIndex={0}
        >
          긴 설명 보기
        </span>
      </Tooltip>
    </Example>
  );
}

export function TooltipPlacementDemo() {
  return (
    <Example
      row={false}
      caption="여섯 자리. 각 버튼에 마우스를 올린다"
      code={`<Tooltip content="설명" placement="bottomLeft">…</Tooltip>`}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          padding: "48px 0",
          maxWidth: 560,
          justifyItems: "center",
        }}
      >
        {PLACEMENTS.map((placement) => (
          <Tooltip
            key={placement}
            placement={placement}
            content={`placement="${placement}"`}
          >
            <Button size="small" variant="line">
              {placement}
            </Button>
          </Tooltip>
        ))}
      </div>
    </Example>
  );
}

export function TooltipDelayDemo() {
  return (
    <CaseGrid
      columns={2}
      caption="왼쪽 둘을 비교한다. 오른쪽은 툴바를 가로질러 본다"
      code={`<Tooltip content="설명" openDelay={0}>…</Tooltip>`}
    >
      <Case label="openDelay" note="기본 400 과 0">
        <div style={{ display: "flex", gap: 12 }}>
          <Tooltip content="400ms 뒤에 열립니다">
            <Button size="small" variant="line">
              기본
            </Button>
          </Tooltip>
          <Tooltip content="바로 열립니다" openDelay={0}>
            <Button size="small" variant="line">
              openDelay=0
            </Button>
          </Tooltip>
        </div>
      </Case>
      <Case label="이웃 툴팁" note="하나 뜬 뒤 옆은 즉시">
        <div style={{ display: "flex", gap: 8 }}>
          <Tooltip content="검색">
            <IconButton aria-label="검색" size="small">
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip content="달력">
            <IconButton aria-label="달력" size="small">
              <CalendarIcon />
            </IconButton>
          </Tooltip>
          <Tooltip content="삭제">
            <IconButton aria-label="삭제" size="small">
              <DelIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Case>
    </CaseGrid>
  );
}

export function TooltipControlDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [changes, setChanges] = useState(0);

  return (
    <CaseGrid
      columns={2}
      code={`<Tooltip content="설명" open={isOpen} onOpenChange={setIsOpen}>…</Tooltip>
<Tooltip content="설명" defaultOpen>…</Tooltip>`}
    >
      <Case label="open" note="쓰는 쪽이 갖는다">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Tooltip open={isOpen} content="버튼으로 여닫는 툴팁이에요">
            <span style={{ fontSize: "var(--nui-font-size-2)" }}>
              대상 요소
            </span>
          </Tooltip>
          <Button
            size="small"
            variant="line"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? "닫기" : "열기"}
          </Button>
        </div>
      </Case>
      <Case label="defaultOpen · onOpenChange" note="처음만 열어 둔다">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Tooltip
            content="처음에 열려 있어요"
            defaultOpen
            onOpenChange={() => setChanges((n) => n + 1)}
          >
            <Button size="small" variant="line">
              defaultOpen
            </Button>
          </Tooltip>
          <span style={{ fontSize: "var(--nui-font-size-2)" }}>
            바뀐 횟수 {changes}
          </span>
        </div>
      </Case>
    </CaseGrid>
  );
}

const CLIP_BOX = {
  display: "flex",
  gap: 24,
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  padding: 12,
  border: "1px dashed var(--nui-border-form)",
  borderRadius: "var(--nui-radius-3)",
} as const;

export function TooltipPortalDemo() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <CaseGrid
        columns={2}
        code={`<Tooltip content="설명" hasPortal>…</Tooltip>`}
      >
        <Case label="기본" note="상자에 잘린다">
          <div style={CLIP_BOX}>
            <Tooltip content="이 말풍선은 상자에 잘린다">
              <Button size="small" variant="line">
                기본
              </Button>
            </Tooltip>
          </div>
        </Case>
        <Case label="hasPortal" note="상자를 벗어난다">
          <div style={CLIP_BOX}>
            <Tooltip content="이 말풍선은 상자를 벗어난다" hasPortal>
              <Button size="small" variant="line">
                hasPortal
              </Button>
            </Tooltip>
          </div>
        </Case>
      </CaseGrid>

      <Example
        row={false}
        caption="팝업 안에서. 아래 줄은 defaultOpen 이라 열린 채로 차이가 보인다"
        code={`<LayerPopup …>
  <Tooltip content="설명" hasPortal>…</Tooltip>
</LayerPopup>`}
      >
        <Button
          size="medium"
          variant="line"
          onClick={() => setIsPopupOpen(true)}
        >
          팝업 열기
        </Button>
        <LayerPopup
          open={isPopupOpen}
          onRequestClose={() => setIsPopupOpen(false)}
          title="툴팁이 있는 팝업"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Tooltip content="팝업 패널에 잘린다" placement="bottomCenter">
                <Button size="small">기본</Button>
              </Tooltip>
              <Tooltip
                content="팝업 위로 떠오른다"
                placement="bottomCenter"
                hasPortal
              >
                <Button size="small">hasPortal</Button>
              </Tooltip>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Tooltip
                content="열린 채. 패널 아래가 잘린다"
                placement="bottomCenter"
                defaultOpen
              >
                <Button size="small" variant="line">
                  기본 · defaultOpen
                </Button>
              </Tooltip>
              <Tooltip
                content="열린 채. 패널 밖으로 나온다"
                placement="bottomCenter"
                defaultOpen
                hasPortal
              >
                <Button size="small" variant="line">
                  hasPortal · defaultOpen
                </Button>
              </Tooltip>
            </div>
          </div>
        </LayerPopup>
      </Example>
    </>
  );
}

export function TooltipDisabledDemo() {
  return (
    <Example
      caption="열리지 않는다. 버튼은 그대로 눌린다"
      code={`<Tooltip content="설명" disabled>…</Tooltip>`}
    >
      <Tooltip content="이 툴팁은 보이지 않습니다" disabled>
        <Button size="small" variant="line">
          disabled
        </Button>
      </Tooltip>
    </Example>
  );
}
