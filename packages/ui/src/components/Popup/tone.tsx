"use client";

import {
  AttentionIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "../Icon/index.js";
import type { PopupTone } from "./Popup.types.js";

/**
 * tone → 글리프. **한 곳에서만 고른다** — `Alert` 과 `Confirm` 이 같은 표를 본다
 * (spec §6-6). Toast 의 `TONE_ICON` 과 같은 모양이다.
 *
 * 색은 여기서 정하지 않는다. SCSS 의 tone 절이 `__icon` 의 `color` 를 바꾸고 글리프는
 * `currentColor` 로 그려진다 — **바뀌는 것은 선 색 하나다.** 면도 테두리도 없다.
 * 크기도 SCSS 가 정한다 — 컴포넌트가 `width`/`height` 를 숫자로 넘기지 않는다.
 */
const TONE_ICON: Record<PopupTone, typeof AttentionIcon> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  danger: AttentionIcon,
};

/** `hasIcon={false}` 면 `null` — `PopupBase` 가 아이콘 자리를 통째로 걸러낸다 */
export function getToneIcon(tone: PopupTone, hasIcon: boolean) {
  if (!hasIcon) return null;

  const ToneIcon = TONE_ICON[tone];

  return <ToneIcon />;
}
