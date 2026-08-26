"use client";

import cn from "classnames";
import type { ButtonHTMLAttributes } from "react";
import { px } from "../../internal/prefix.js";
import {
  DelIcon,
  SearchIcon,
  ShowPwIcon,
  HidePwIcon,
  CalendarIcon,
} from "../Icon/index.js";

const block = px("textfield");

const ICON_MAP = {
  clear: <DelIcon />,
  search: <SearchIcon />,
  showPw: <ShowPwIcon />,
  hidePw: <HidePwIcon />,
  date: <CalendarIcon />,
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
