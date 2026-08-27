"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import {
  getButtonClassName,
  getButtonContentElement,
  type ButtonBaseProps,
  type ButtonDesignProps,
} from "./Button.js";

// ⚠️ 이 컴포넌트만 `next/link` 에 의존한다 (next 는 optional peer).
//    ButtonLink 를 import 하지 않는 소비자의 번들에는 포함되지 않는다.
type ButtonLinkNativeProps = Omit<
  ComponentProps<typeof Link>,
  "children" | "className"
>;

export type ButtonLinkProps = ButtonBaseProps &
  ButtonDesignProps &
  ButtonLinkNativeProps;

export default function ButtonLink({
  children,
  icon,
  className,
  size = "large",
  color = "neutral",
  variant = "solid",
  shape,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      {...rest}
      className={getButtonClassName({ className, size, color, variant, shape })}
    >
      {getButtonContentElement({ icon, children })}
    </Link>
  );
}
