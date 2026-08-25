"use client";

import cn from "classnames";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { px } from "../../internal/prefix.js";

const block = px("button");

export type ButtonSize = "large" | "medium" | "small";
export type ButtonColor = "black" | "primary" | "secondary" | "point";
export type ButtonVariant = "solid" | "line" | "text";
export type ButtonShape = "round" | "square";

export type ButtonDesignProps =
  | {
      variant?: Exclude<ButtonVariant, "text">;
      shape?: ButtonShape;
      size?: ButtonSize;
    }
  | {
      variant: "text";
      shape?: never;
      size?: never;
    };

export type ButtonBaseProps = {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  color?: ButtonColor;
};

export type ButtonProps = ButtonBaseProps &
  ButtonDesignProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonClassNameParams = {
  className?: string;
  size?: ButtonSize;
  color?: ButtonColor;
  variant?: ButtonVariant;
  shape?: ButtonShape;
};

export function getButtonClassName({
  className,
  size = "large",
  color = "black",
  variant = "solid",
  shape = "square",
}: ButtonClassNameParams) {
  return cn(
    block,
    color !== "black" && `${block}--${color}`,
    variant !== "solid" && `${block}--${variant}`,
    variant !== "text" && shape !== "square" && `${block}--${shape}`,
    size !== "large" && `${block}--${size}`,
    className,
  );
}

export function getButtonContentElement({
  icon,
  children,
}: Pick<ButtonBaseProps, "icon" | "children">) {
  return (
    <span className={`${block}__wrap`}>
      {icon ? <span className={`${block}__icon`}>{icon}</span> : null}
      {children}
    </span>
  );
}

export default function Button({
  children,
  icon,
  className,
  size = "large",
  color = "black",
  variant = "solid",
  shape = "square",
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={getButtonClassName({ className, size, color, variant, shape })}
    >
      {getButtonContentElement({ icon, children })}
    </button>
  );
}
