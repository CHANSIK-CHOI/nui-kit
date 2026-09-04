"use client";

import { useState } from "react";
import {
  Button,
  IconButton,
  LayerPopup,
  Tooltip,
  type TooltipPlacement,
} from "@chansikchoi/next-ui";
import { DelIcon } from "@chansikchoi/next-ui/icon";
import { Example } from "@/components/guide";

const PLACEMENTS: TooltipPlacement[] = [
  "topLeft",
  "topCenter",
  "topRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight",
];

export function TooltipDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <h2>기본</h2>
      <Example
        caption="hover 하거나 Tab 으로 포커스해보세요"
        code={`<Tooltip content="삭제하면 되돌릴 수 없습니다">
  <IconButton aria-label="삭제"><DelIcon /></IconButton>
</Tooltip>`}
      >
        <Tooltip content="삭제한 항목은 되돌릴 수 없습니다">
          <IconButton aria-label="삭제">
            <DelIcon />
          </IconButton>
        </Tooltip>
        <Tooltip content="긴 설명도 줄바꿈되어 들어갑니다. 최대 너비를 넘으면 여러 줄이 됩니다.">
          <span
            style={{
              textDecoration: "underline dotted",
              cursor: "help",
              fontSize: "var(--nui-font-size-3)",
            }}
            tabIndex={0}
          >
            긴 설명 보기
          </span>
        </Tooltip>
      </Example>

      <h2>잘리는 부모에서 — hasPortal</h2>
      <p>
        말풍선은 트리거 옆 <code>absolute</code> 라{" "}
        <code>overflow: hidden</code> 인 조상에서 잘린다.{" "}
        <code>hasPortal</code> 을 켜면 <code>body</code> 로 내보내고 스크롤과 창
        크기 변화를 따라간다.
      </p>
      <Example
        row={false}
        caption="같은 상자 안 — 왼쪽은 잘리고 오른쪽은 안 잘린다"
        code={`<Tooltip content="설명" hasPortal>…</Tooltip>`}
      >
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: 12,
            width: "100%",
            maxWidth: 420,
            border: "1px dashed var(--nui-border-form)",
            borderRadius: "var(--nui-radius-2)",
          }}
        >
          <Tooltip content="이 말풍선은 상자에 잘린다">
            <Button size="small">기본</Button>
          </Tooltip>
          <Tooltip content="이 말풍선은 상자를 벗어난다" hasPortal>
            <Button size="small">hasPortal</Button>
          </Tooltip>
        </div>
      </Example>

      <Example
        row={false}
        caption="팝업 안 — 아래 줄은 defaultOpen 이다. 왼쪽은 패널에 잘려 아무것도 안 보이고, 오른쪽은 패널 밖으로 나온다"
        code={`<LayerPopup …>
  <Tooltip content="설명" hasPortal>…</Tooltip>
</LayerPopup>`}
      >
        <Button onClick={() => setIsPopupOpen(true)}>팝업 열기</Button>
        <LayerPopup
          open={isPopupOpen}
          onRequestClose={() => setIsPopupOpen(false)}
          isTopmost
          title="툴팁이 있는 팝업"
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: 32 }}
          >
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

            {/* 열린 채로 두어 hover 없이도 잘림 차이가 보이게 한다 */}
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Tooltip
                content="열린 채 — 패널 아래가 잘린다"
                placement="bottomCenter"
                defaultOpen
              >
                <Button size="small" variant="line">
                  기본 · defaultOpen
                </Button>
              </Tooltip>
              <Tooltip
                content="열린 채 — 패널 밖으로 나온다"
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

      <h2>위치</h2>
      <p>
        <code>placement</code> 6종. 트리거 기준 위/아래 × 좌/중앙/우다.
      </p>
      <Example
        row={false}
        caption="placement — 각 버튼에 hover 해보세요"
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

      <h2>제어 모드</h2>
      <p>
        <code>open</code> 을 주면 열림 상태를 소비자가 소유한다. 온보딩 안내처럼
        hover 와 무관하게 띄워야 할 때 쓴다.
      </p>
      <Example
        caption="open prop 으로 직접 제어"
        code={`<Tooltip content="설명" open={isOpen} onOpenChange={setIsOpen}>…</Tooltip>`}
      >
        <Tooltip open={isOpen} content="버튼으로 제어되는 툴팁입니다">
          <span style={{ fontSize: "var(--nui-font-size-3)" }}>대상 요소</span>
        </Tooltip>
        <Button size="small" onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? "닫기" : "열기"}
        </Button>
      </Example>

      <h2>비활성</h2>
      <Example
        caption="disabled — 열려 있어도 즉시 닫힌다"
        code={`<Tooltip content="설명" disabled>…</Tooltip>`}
      >
        <Tooltip content="이 툴팁은 보이지 않습니다" disabled>
          <Button size="small" variant="line">
            disabled
          </Button>
        </Tooltip>
      </Example>
    </>
  );
}
