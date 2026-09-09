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
  size,
  style,
  title,
  viewBox,
  width,
  ...rest
}: IconProps) {
  const iconStyle: CSSProperties = { ...style };

  if (color) iconStyle.color = color;
  // `size` 는 정사각 단축이다. 치수는 인라인으로 — 이유는 icons.tsx 참조.
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;
  if (resolvedWidth) iconStyle.width = resolvedWidth;
  if (resolvedHeight) iconStyle.height = resolvedHeight;

  return (
    <svg
      viewBox={viewBox}
      width={resolvedWidth}
      height={resolvedHeight}
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
