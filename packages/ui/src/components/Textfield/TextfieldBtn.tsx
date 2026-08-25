"use client";

import cn from "classnames";
import type { ButtonHTMLAttributes } from "react";
import { px } from "../../internal/prefix.js";
import { DelIcon } from "../Icon/index.js";

const block = px("textfield");

// 파일럿 범위에서는 clear 만 사용한다.
// showPw / hidePw / search / date 는 각 컴포넌트(Password/Search/Datepicker) 이식 시 추가한다.
const ICON_MAP = {
  clear: <DelIcon />,
} as const;

export type TextfieldBtnIcon = keyof typeof ICON_MAP;

export type TextfieldBtnProps = {
  icon: TextfieldBtnIcon;
  title: string;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: () => void;
  disabled?: boolean;
};

export default function TextfieldBtn({
  icon,
  title,
  className,
  type = "button",
  onClick,
  disabled,
}: TextfieldBtnProps) {
  return (
    <button
      type={type}
      className={cn(`${block}__btn`, className)}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {ICON_MAP[icon]}
      <span className={px("sr-only")}>{title}</span>
    </button>
  );
}
