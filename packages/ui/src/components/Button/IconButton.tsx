"use client";

import cn from "classnames";
import { px } from "../../internal/prefix.js";
import { getButtonClassName, type ButtonProps } from "./Button.js";

const block = px("button");

export type IconButtonVariant = "solid" | "line";

export type IconButtonProps = Omit<ButtonProps, "icon" | "variant"> & {
  variant?: IconButtonVariant;
};

export default function IconButton({
  children,
  className,
  size = "large",
  color = "neutral",
  variant = "solid",
  shape,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={getButtonClassName({
        className: cn(className, `${block}--icon`),
        size,
        color,
        variant,
        shape,
      })}
    >
      <span className={`${block}__wrap`}>
        <span className={`${block}__icon`}>{children}</span>
      </span>
    </button>
  );
}
