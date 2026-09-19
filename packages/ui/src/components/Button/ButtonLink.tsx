"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import {
  getButtonClassName,
  getButtonContentElement,
  type ButtonBaseProps,
  type ButtonDesignProps,
} from "./Button.js";

// ⚠️ 이 컴포넌트만 `next/link` 에 의존한다. 그래서 배럴이 아니라 `src/next.ts`
//    (`@nui-kit/react/next`) 로만 나가고 `next` 는 **optional peer** 다
//    (packaging.md: optional peer 를 쓰는 코드는 별도 엔트리로 분리한다).
//    타입 `ButtonLinkProps` 도 같이 간다 — 배럴 `.d.ts` 에 `next/link` 참조가 남으면
//    `next` 없는 소비자의 tsc 가 이 컴포넌트를 안 써도 깨진다.
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
  size = "medium",
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
