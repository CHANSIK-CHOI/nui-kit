"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { pv } from "./prefix.js";

/**
 * 드롭다운(Select 메뉴 · Datepicker 달력)이 **어느 쪽으로 열리나**를 정한다 (2026-09-17).
 *
 * **두 컴포넌트가 이 파일 하나를 같이 쓴다** — 「드롭다운 관련해서는 Datepicker 와 Select 가
 * 동일해야」(사용자 요청)를 구조로 지킨다. 한쪽에 복제하면 한쪽만 고쳐진다.
 * 규칙은 `Select.md §6-7` 「넘침」 · `Datepicker.md §6-9` 가 정본이다.
 *
 * SEED `raw/menu.md` 「Smart Positioning」의 **Flip + Viewport Margin `x2`**:
 *   1. 아래에 들어가면 아래
 *   2. 위에만 들어가면 위
 *   3. 둘 다 모자라면 **넓은 쪽**(같으면 아래). **높이는 줄이지 않는다** — 달력은 줄일 수
 *      없고 Select 만 줄이면 둘이 갈린다(사용자 결정)
 *
 * ⚠️ **react-select 의 `getMenuPlacement` 를 쓰지 않는 이유** — 여백 축이 없고, `absolute` 에서는
 *    문서 기준이라 문서 중간에서 뒤집지 않고, 뒤집기 전에 높이를 줄이고, `top` 을 넘겨도 공간이
 *    모자라면 아래로 되돌린다. 어떤 값을 넘겨도 위 규칙이 안 나온다.
 */

export type DropdownPlacement = "top" | "bottom";
/** 소비자가 방향을 고정할 수 있는 자리(Select `menuPlacement`)의 값. Datepicker 는 언제나 `"auto"` */
export type DropdownPlacementPreference = DropdownPlacement | "auto";

export type DropdownPlacementInput = {
  /** 패널이 붙는 상자(기준 상자 A)의 뷰포트 좌표 */
  anchorTop: number;
  anchorBottom: number;
  /** 패널의 **레이아웃** 높이 — `offsetHeight`. 등장 모션의 `scale` 을 재지 않는다 */
  panelHeight: number;
  /** 레이아웃 뷰포트 높이 — `documentElement.clientHeight` (가로 스크롤바 제외) */
  viewportHeight: number;
  /** 뷰포트 가장자리 여백 — SEED `overflowPadding` */
  pad: number;
  /** 트리거와 패널 사이 간격 — SEED `gutter` */
  gutter: number;
};

/** 판정만 하는 순수 함수 — `check-select-placement` 가 표로 잰다. */
export function resolveDropdownPlacement({
  anchorTop,
  anchorBottom,
  panelHeight,
  viewportHeight,
  pad,
  gutter,
}: DropdownPlacementInput): DropdownPlacement {
  const below = viewportHeight - pad - (anchorBottom + gutter);
  const above = anchorTop - gutter - pad;

  if (panelHeight <= below) return "bottom";
  if (panelHeight <= above) return "top";
  return above > below ? "top" : "bottom";
}

/**
 * CSS 변수의 길이를 px 로 읽는다.
 *
 * ⚠️ **8 을 코드에 박지 않는다.** 간격은 CSS 가 `space-2`(0.5rem)로 그리므로 루트 글꼴이 16px 이
 *    아니면 박은 숫자와 화면이 갈린다. 사용자 정의 속성은 계산값이 아니라 **적힌 문자열**로 오므로
 *    단위를 여기서 푼다.
 */
function readCssLength(element: Element, name: string): number {
  const raw = getComputedStyle(element).getPropertyValue(name).trim();
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return 0;
  if (raw.endsWith("rem")) {
    return (
      value *
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  }
  if (raw.endsWith("em")) {
    return value * Number.parseFloat(getComputedStyle(element).fontSize);
  }
  return value;
}

/**
 * 마운트된 패널을 재 방향을 정한다.
 *
 * 기준 상자는 패널의 `offsetParent` 다 — 제자리면 컴포넌트의 `position: relative` 상자
 * (`.nui-select__container` · `.nui-datepicker`), portal 이면 **트리거 rect 를 입은 유령 래퍼**다.
 * 어느 쪽이든 패널의 `top: 100%` · `bottom: 100%` 가 기대는 바로 그 상자라 계산과 CSS 가 한 벌이다.
 */
export function measureDropdownPlacement(
  panel: HTMLElement,
): DropdownPlacement {
  const anchor = panel.offsetParent;
  if (!anchor) return "bottom";

  const { top, bottom } = anchor.getBoundingClientRect();
  const space = readCssLength(panel, pv("space-2"));

  return resolveDropdownPlacement({
    anchorTop: top,
    anchorBottom: bottom,
    panelHeight: panel.offsetHeight,
    viewportHeight: document.documentElement.clientHeight,
    pad: space,
    gutter: space,
  });
}

/**
 * 방향 상태를 **remount 되지 않는 층**에 둔다.
 *
 * 패널(motion 요소)은 `key={placement}` 로 remount 해야 framer 의 `initial`(방향 부호)이 다시
 * 읽힌다. 그래서 상태를 그 요소 안에 두면 remount 와 함께 `"bottom"` 으로 돌아가 영원히 못
 * 뒤집는다. **이 훅을 부르는 컴포넌트는 key 를 받지 않는 바깥 층이어야 한다.**
 *
 * - **한 번만 잰다** — 패널이 처음 붙은 커밋의 layout effect. 위로 정해지면 같은 커밋에서 다시
 *   그려 **첫 페인트 전에** 끝난다. 열린 동안 스크롤 · 리사이즈 · 높이 변화로 다시 재지 않는다
 * - `"top"` · `"bottom"` 이면 재지 않고 그 값이다
 */
export function useDropdownPlacement<T extends HTMLElement = HTMLDivElement>(
  preference: DropdownPlacementPreference,
): { placement: DropdownPlacement; panelRef: RefObject<T | null> } {
  const panelRef = useRef<T | null>(null);
  const [measured, setMeasured] = useState<DropdownPlacement>("bottom");
  const isAuto = preference === "auto";

  useLayoutEffect(() => {
    if (!isAuto) return;
    const panel = panelRef.current;
    if (!panel) return;
    setMeasured(measureDropdownPlacement(panel));
    // deps 가 비어 있는 것은 의도다 — 마운트 때 한 번만 잰다. 열린 뒤에는 방향을 바꾸지 않는다
    // (Select.md §6-7). `isAuto` 가 열린 채로 바뀌어도 다음에 열 때 반영된다
  }, []);

  return { placement: isAuto ? measured : preference, panelRef };
}

/**
 * `useDropdownPlacement` 의 컴포넌트 꼴 — 패널이 `AnimatePresence` 의 **직계 자식**인 자리에 쓴다.
 *
 * ⚠️ **직계 자식의 key 를 placement 로 바꾸면 달력이 둘 그려진다** — 아래 패널의 퇴장과 위 패널의
 *    등장이 겹친다. 이 층이 key 고정 직계 자식이 되고, remount 는 render prop 안쪽 motion 요소만 한다.
 *    framer 의 퇴장은 직계 자식 아래 어디의 motion 요소에도 전달된다.
 */
export function DropdownPlacementScope<T extends HTMLElement = HTMLDivElement>({
  preference,
  children,
}: {
  preference: DropdownPlacementPreference;
  children: (
    placement: DropdownPlacement,
    panelRef: RefObject<T | null>,
  ) => ReactNode;
}) {
  const { placement, panelRef } = useDropdownPlacement<T>(preference);
  return <>{children(placement, panelRef)}</>;
}
