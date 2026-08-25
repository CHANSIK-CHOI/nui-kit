"use client";

import type { ReactNode } from "react";
import { PopupHost } from "@chansikchoi/next-ui/popup";

/**
 * PopupHost 는 클라이언트 컴포넌트라 Server Component 인 layout 에서
 * 직접 쓰려면 경계가 필요하다. 이 얇은 래퍼가 그 경계다.
 */
export function PopupProvider({ children }: { children: ReactNode }) {
  return <PopupHost>{children}</PopupHost>;
}
