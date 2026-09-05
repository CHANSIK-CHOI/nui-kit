"use client";

import cn from "classnames";
import {
  Calendar,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { px } from "../../internal/prefix.js";
import type { IconBaseProps } from "./Icon.js";

/**
 * lucide 아이콘을 우리 `Icon` 계약에 맞춘다 (a11y.md §4).
 *
 *   title 없음 → `aria-hidden`      장식. 옆 글자나 버튼이 뜻을 전한다
 *   title 있음 → `role="img"` + `<title>`   아이콘만으로 뜻을 전한다
 *
 * lucide 는 `title`·`aria-*`·`role` 이 하나라도 있으면 자기 `aria-hidden` 을 빼고,
 * `role="img"` 는 붙이지 않는다 — 그래서 여기서 붙인다
 * (lucide 공식 문서 · React → Accessibility).
 *
 * 크기는 CSS 가 정한다. `.nui-icon { width: 100%; height: 100% }` 가 lucide 의
 * `width="24"` 속성을 이기므로 자리(버튼 박스)가 곧 크기다 — design-system.md §5-2.
 * `width`·`height` 를 직접 주면 그 값이 인라인 스타일로 들어간다.
 */
function fromLucide(
  LucideComponent: LucideIcon,
  displayName: string,
  extraClassName?: string,
) {
  function NuiIcon({
    className,
    color,
    size,
    width,
    height,
    style,
    title,
    focusable = false,
    ...rest
  }: IconBaseProps) {
    const iconStyle: CSSProperties = { ...style };
    if (color) iconStyle.color = color;
    if (width) iconStyle.width = width;
    if (height) iconStyle.height = height;

    return (
      <LucideComponent
        className={cn(px("icon"), extraClassName, className)}
        size={size ?? width ?? height}
        style={iconStyle}
        focusable={focusable}
        {...(title ? { role: "img" } : { "aria-hidden": true })}
        {...rest}
      >
        {title ? <title>{title}</title> : null}
      </LucideComponent>
    );
  }

  NuiIcon.displayName = displayName;
  return NuiIcon;
}

/** 지우기 — Textfield · Textarea · Search 의 값 비우기 */
export const DelIcon = fromLucide(X, "DelIcon");

/** 주의 — Message 의 에러 표시 · Alert · Confirm */
export const AttentionIcon = fromLucide(CircleAlert, "AttentionIcon");

/** 검색 */
export const SearchIcon = fromLucide(Search, "SearchIcon");

/** 비밀번호 보기 */
export const ShowPwIcon = fromLucide(Eye, "ShowPwIcon");

/** 비밀번호 숨기기 */
export const HidePwIcon = fromLucide(EyeOff, "HidePwIcon");

/** 닫기 — Popup */
export const CloseIcon = fromLucide(X, "CloseIcon");

/** 캘린더 — Datepicker 의 달력 열기 버튼 */
export const CalendarIcon = fromLucide(Calendar, "CalendarIcon");

/** 로딩 — Button 의 `isLoading`. 회전은 `_icon.scss` 의 `--spin` 이 담당한다 */
export const SpinnerIcon = fromLucide(
  LoaderCircle,
  "SpinnerIcon",
  `${px("icon")}--spin`,
);
