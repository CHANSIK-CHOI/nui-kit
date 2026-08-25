"use client";

import cn from "classnames";
import type { CSSProperties, ReactNode, SVGProps } from "react";
import { px } from "../../internal/prefix.js";

export type IconBaseProps = Omit<
  SVGProps<SVGSVGElement>,
  "children" | "color"
> & {
  color?: string;
  size?: number | string;
  title?: string;
};

export type IconProps = IconBaseProps & {
  children: ReactNode;
  viewBox: string;
};

export default function Icon({
  children,
  className,
  color,
  focusable = false,
  height,
  style,
  title,
  viewBox,
  width,
  ...rest
}: IconProps) {
  const iconStyle: CSSProperties = { ...style };

  if (color) iconStyle.color = color;
  if (width) iconStyle.width = width;
  if (height) iconStyle.height = height;

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={cn(px("icon"), className)}
      style={iconStyle}
      focusable={focusable}
      {...(title ? { role: "img" } : { "aria-hidden": true })}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
