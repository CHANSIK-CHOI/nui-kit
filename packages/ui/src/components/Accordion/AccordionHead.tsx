"use client";

import cn from "classnames";
import { ChevronDown } from "lucide-react";
import { Children, type HTMLAttributes, type ReactNode } from "react";
import { px } from "../../internal/prefix.js";
import Icon from "../Icon/Icon.js";
import AccordionButton from "./AccordionButton.js";
import {
  AccordionHeadContext,
  useAccordionContext,
} from "./Accordion.context.js";

const block = px("accordion");

export type AccordionHeadProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** 주면 화살표 자리에 토글 버튼이 놓인다. 주지 않으면 장식용 화살표만 렌더된다 */
  buttonIndex?: number;
  /** 제목이 없을 때 토글 버튼의 접근 이름. 소비자의 어휘·언어로 바꿀 수 있어야 한다 (a11y.md §9) */
  toggleLabel?: string;
};

export default function AccordionHead({
  children,
  buttonIndex,
  toggleLabel = "아코디언 패널 토글",
  className,
  ...rest
}: AccordionHeadProps) {
  const { accordionId, headingLevel } = useAccordionContext();
  const hasToggleButton =
    typeof buttonIndex === "number" && !Number.isNaN(buttonIndex);

  // 「제목 글자가 있나」를 실제 렌더 결과로 본다. `Boolean(children)` 만으로는 빈 배열이
  // 참이 되어 **빈 heading** 이 생긴다 — 그 자체가 결함이다 (spec §6-6).
  const hasTitle =
    Children.toArray(children).filter(
      (child) => typeof child !== "string" || child.trim().length > 0,
    ).length > 0;

  const titleId =
    hasToggleButton && hasTitle
      ? `${accordionId}-title-${buttonIndex}`
      : undefined;

  // 모드 B 에서만 제목 상자가 heading 이다 — 모드 A 는 이 헤더가 버튼 **안**이라
  // heading 을 여기 두면 `<button>` 안에 들어간다. 그쪽은 버튼이 자기 바깥을 감싼다.
  // 헤더 전체가 아니라 제목 상자인 이유는, 모드 B 가 헤더에 체크박스·링크가 들어오는
  // 자리라 그것들까지 heading 에 담기면 안 되기 때문이다 (spec §6-6).
  const TitleBoxTag =
    hasToggleButton && hasTitle && headingLevel !== undefined
      ? (`h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6")
      : "div";

  return (
    <AccordionHeadContext.Provider value>
      <div {...rest} className={cn(`${block}__head`, className)}>
        <TitleBoxTag id={titleId} className={`${block}__title-box`}>
          {hasTitle ? (
            <div className={`${block}__title`}>{children}</div>
          ) : null}
        </TitleBoxTag>

        <span className={`${block}__arrow`}>
          {hasToggleButton ? (
            <AccordionButton
              index={buttonIndex}
              className={`${block}__button--icon`}
              // 제목이 있으면 그것을 접근 이름으로 삼고, 없을 때만 대체 텍스트를 쓴다
              aria-label={titleId ? undefined : toggleLabel}
              aria-labelledby={titleId}
            >
              <Icon icon={<ChevronDown />} className={`${block}__arrow-icon`} />
            </AccordionButton>
          ) : (
            <Icon icon={<ChevronDown />} className={`${block}__arrow-icon`} />
          )}
        </span>
      </div>
    </AccordionHeadContext.Provider>
  );
}
