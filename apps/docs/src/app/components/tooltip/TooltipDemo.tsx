"use client";

import { useState } from "react";
import {
  Button,
  IconButton,
  Tooltip,
  type TooltipPlacement,
} from "@chansikchoi/next-ui";
import { DelIcon } from "@chansikchoi/next-ui/icon";
import { Example } from "@/components/Example";

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

  return (
    <>
      <h2>기본</h2>
      <Example caption="hover 하거나 Tab 으로 포커스해보세요">
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

      <h2>위치</h2>
      <p>
        <code>placement</code> 6종. 트리거 기준 위/아래 × 좌/중앙/우다.
      </p>
      <Example row={false} caption="placement — 각 버튼에 hover 해보세요">
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
      <Example caption="open prop 으로 직접 제어">
        <Tooltip open={isOpen} content="버튼으로 제어되는 툴팁입니다">
          <span style={{ fontSize: "var(--nui-font-size-3)" }}>대상 요소</span>
        </Tooltip>
        <Button size="small" onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? "닫기" : "열기"}
        </Button>
      </Example>

      <h2>비활성</h2>
      <Example caption="disabled — 열려 있어도 즉시 닫힌다">
        <Tooltip content="이 툴팁은 보이지 않습니다" disabled>
          <Button size="small" variant="line">
            disabled
          </Button>
        </Tooltip>
      </Example>
    </>
  );
}
