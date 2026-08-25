"use client";

import Icon, { type IconBaseProps } from "./Icon.js";

/** 입력값 지우기 */
export function DelIcon(props: IconBaseProps) {
  return (
    <Icon viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="10" cy="10" r="7" fill="currentColor" opacity="0.12" />
      <path
        d="M7 7L13 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13 7L7 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  );
}

/** 에러/주의 표시 */
export function AttentionIcon(props: IconBaseProps) {
  return (
    <Icon viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 6.5V10.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10" cy="13.5" r="1" fill="currentColor" />
    </Icon>
  );
}
