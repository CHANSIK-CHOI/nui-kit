"use client";

import cn from "classnames";
import type { ReactNode } from "react";
import { px } from "../../internal/prefix.js";

// ⚠️ 원본 `.buttonGroup`(camelCase) → `.nui-button-group`(kebab) 으로 정규화됨.
const block = px("button-group");

/**
 * 나란히 놓을 때의 폭 비율.
 *
 * `"3:7"` 은 첫 항목이 **Dismiss**(취소 · 닫기 · 초기화)일 때 쓴다 — 위계를
 * 폭으로도 드러낸다. SEED `action-button.mdx` 「Button의 배치」가 정본이다.
 * 임의 비율을 열지 않는 이유는 그 문서가 3:7 하나만 권장하기 때문이다.
 *
 * ⚠️ 항목이 둘일 때의 값이다. 애초에 셋을 나란히 놓지 않는다
 *    (design-system.md §2-4-1).
 */
export type ButtonGroupRatio = "equal" | "3:7";

export type ButtonGroupProps = {
  children: ReactNode;
  className?: string;
  /** 기본은 균등 분할. 첫 항목이 취소·닫기면 "3:7" */
  ratio?: ButtonGroupRatio;
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

function ButtonGroupRoot({
  children,
  className,
  ratio = "equal",
}: ButtonGroupProps) {
  return (
    <div
      className={cn(block, className, {
        [`${block}--ratio-dismiss`]: ratio === "3:7",
      })}
    >
      <div className={`${block}__wrap`}>{children}</div>
    </div>
  );
}

// dot notation(ButtonGroup.Item)은 Client Component 전용.
// Server Component 에서는 named export `ButtonGroupItem` 을 사용한다.
const ButtonGroup = Object.assign(ButtonGroupRoot, { Item: ButtonGroupItem });

export default ButtonGroup;
