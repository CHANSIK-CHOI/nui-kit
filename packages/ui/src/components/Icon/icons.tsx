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

/** 검색 */
export function SearchIcon(props: IconBaseProps) {
  return (
    <Icon viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="9" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12.5 12.5L16 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  );
}

/** 비밀번호 표시 */
export function ShowPwIcon(props: IconBaseProps) {
  return (
    <Icon viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M2.5 10C3.9 6.9 6.6 5 10 5C13.4 5 16.1 6.9 17.5 10C16.1 13.1 13.4 15 10 15C6.6 15 3.9 13.1 2.5 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}

/** 비밀번호 숨김 */
export function HidePwIcon(props: IconBaseProps) {
  return (
    <Icon viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M3.5 4L16.5 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 6.1C7.9 5.4 8.9 5 10 5C13.4 5 16.1 6.9 17.5 10C16.9 11.3 16.1 12.4 15.1 13.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.4 14.6C11.7 14.9 10.9 15 10 15C6.6 15 3.9 13.1 2.5 10C3.1 8.8 3.8 7.8 4.8 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.6 8.6C8.2 8.95 8 9.45 8 10C8 11.1 8.9 12 10 12C10.55 12 11.05 11.8 11.4 11.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
