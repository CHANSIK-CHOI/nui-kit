"use client";

import cn from "classnames";
import type { ReactNode } from "react";
import { px } from "../../internal/prefix.js";

// ⚠️ 원본 `.buttonGroup`(camelCase) → `.nui-button-group`(kebab) 으로 정규화됨.
const block = px("button-group");

export type ButtonGroupProps = {
  children: ReactNode;
  className?: string;
};

export type ButtonGroupItemProps = {
  children: ReactNode;
  className?: string;
  shouldAutoWidth?: boolean;
};

export function ButtonGroupItem({
  children,
  className,
  shouldAutoWidth = false,
}: ButtonGroupItemProps) {
  return (
    <div
      className={cn(`${block}__item`, className, {
        [`${block}__item--auto`]: shouldAutoWidth,
      })}
    >
      {children}
    </div>
  );
}

function ButtonGroupRoot({ children, className }: ButtonGroupProps) {
  return (
    <div className={cn(block, className)}>
      <div className={`${block}__wrap`}>{children}</div>
    </div>
  );
}

// dot notation(ButtonGroup.Item)은 Client Component 전용.
// Server Component 에서는 named export `ButtonGroupItem` 을 사용한다.
const ButtonGroup = Object.assign(ButtonGroupRoot, { Item: ButtonGroupItem });

export default ButtonGroup;
