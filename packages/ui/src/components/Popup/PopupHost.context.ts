"use client";

import { createContext } from "react";

declare const process: { env: { NODE_ENV?: string } };

/**
 * Host 표식 — `PopupHost` 가 portal 안에 그린 것만 `true` 다 (spec §6-2 · 2026-09-17).
 *
 * 팝업을 여는 길은 훅 하나뿐이다. 타입은 그 계약을 닫지 못한다 — 소비자 컴포넌트가
 * runtime 다섯을 스프레드해야 해서 `open` 을 타입에서 뺄 수 없다. 그래서 `PopupBase` 가
 * 이 표식을 읽고, 없으면 그리지 않는다. 다섯 셸이 전부 한 자리에서 막힌다.
 *
 * ⚠️ Host 의 `children`(앱 트리)은 감싸지 않는다 — 감싸면 앱 안에서 손으로 렌더한
 *    셸도 표식을 얻어 둘째 길이 되살아난다.
 */
export const PopupHostContext = createContext(false);

// Host 가 마운트돼 있나 — 훅 `open()` 이 Host 없이 불렸을 때 개발 모드 경고의 근거.
let hostCount = 0;

export function registerPopupHost() {
  hostCount += 1;
  return () => {
    hostCount -= 1;
  };
}

const warned = new Set<string>();

/**
 * 개발 모드에서 **한 번만** 경고한다 (spec §6-2 · §13). 프로덕션은 침묵.
 *
 * 「조용히 안 뜬다」는 소비자가 알아챌 수 없는 종류의 실패다 — 화면에 아무것도 없고
 * 에러도 없다(tokens.md §1-2 의 판단축). 그래서 Host 밖 렌더와 Host 없는 `open()` 둘 다
 * 한 줄을 낸다. 같은 키로는 다시 내지 않는다 — 렌더마다 찍히면 소음이다.
 */
export function warnPopupHostMissing(key: string, message: string) {
  if (process.env.NODE_ENV === "production" || warned.has(key)) return;
  warned.add(key);
  console.warn(`[nui-kit] ${message}`);
}

/**
 * `open()` 이 Host 없이 불렸는지 — **effect 가 다 돈 뒤에** 판정한다.
 *
 * ⚠️ 자식의 `useEffect` 가 부모 `PopupHost` 의 effect 보다 먼저 돈다. 마운트 즉시 `open()`
 *    하는 컴포넌트가 있으면 그 시점엔 Host 가 아직 등록 전이라 거짓 경고가 난다.
 *    마이크로태스크 하나면 같은 commit 의 effect 가 전부 끝난 뒤다.
 */
export function warnIfPopupHostMissing(actionName: string) {
  if (process.env.NODE_ENV === "production") return;

  queueMicrotask(() => {
    if (hostCount > 0) return;

    warnPopupHostMissing(
      "open-without-host",
      `${actionName}: PopupHost 가 없어 팝업이 그려지지 않는다. 앱 루트를 <PopupHost> 로 감싼다.`,
    );
  });
}
