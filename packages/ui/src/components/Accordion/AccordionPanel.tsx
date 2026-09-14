"use client";

import cn from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { px } from "../../internal/prefix.js";
import {
  motionTransition,
  reduceMotionTransition,
} from "../../internal/motion.js";
import { useAccordionContext, useResolvedIndex } from "./Accordion.context.js";

const block = px("accordion");

/**
 * 접힘/펼침은 **높이가 움직여야** 아코디언처럼 보인다.
 *
 * 예전에는 `opacity` 와 `y: -8` 만 애니메이션했다. 그러면 패널이 처음부터 제 높이를
 * 차지해 **아래 항목이 즉시 밀려나고 내용만 뒤늦게 페이드인**한다. 실측했더니
 * 열 때도 닫을 때도 높이가 62px 로 고정돼 있었다.
 *
 * `height: "auto"` 는 framer-motion 이 내부에서 실제 높이를 재어 px 로 애니메이션한다.
 * 높이가 움직이므로 `y` 는 빼야 한다 — 남겨두면 이중으로 움직인다.
 *
 * ⚠️ **트랜지션을 variant 안에 넣는다.** `transition` prop 으로 주면 닫을 때
 *    적용되지 않는다 — 항목이 JSX 에서 빠지는 순간 `AnimatePresence` 는
 *    **이전 렌더의 props** 로 exit 을 돌리기 때문이다. 실제로 닫힘에 enter 곡선이
 *    걸려 프레임당 최대 증분이 7px 이어야 할 것이 14px 로 튀었다.
 */
const panelVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: motionTransition.collapseExit,
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: motionTransition.collapse,
  },
};

/**
 * 모션 감소용 한 벌. **`transition` prop 으로는 못 끈다** (2026-09-14 실측).
 *
 * 위 주석대로 variant 안의 `transition` 이 prop 을 이기므로, `transition={{ duration: 0 }}` 을
 * 밖에서 줘도 `collapse` · `collapseExit` 가 그것을 덮는다. 실제로 `reducedMotion: "reduce"`
 * 컨텍스트에서 패널 높이가 120ms 사이 74 → 7px 로 움직이고 있었다 — **모션 감소가 무력화된
 * 채였다.** 끄려면 variant 를 통째로 갈아야 한다.
 *
 * 높이를 빼지 않는 것은 Accordion 만의 사정이다 — 다른 컴포넌트는 `reduceMotion()` 으로 이동·
 * 확대를 빼고 페이드만 남기지만, 여기서는 **높이 변화가 곧 기능**이라 빼면 닫혀도 자리를
 * 차지한다. 그래서 값은 그대로 두고 시간만 0 으로 만든다.
 */
const reducedPanelVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: reduceMotionTransition(motionTransition.collapseExit, true),
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: reduceMotionTransition(motionTransition.collapse, true),
  },
};

export type AccordionPanelProps = {
  children: ReactNode;
  /** 어느 항목의 본문인가. 생략하면 감싼 `Accordion.Item` 에서 온다 */
  index?: number;
  className?: string;
};

export default function AccordionPanel({
  children,
  index,
  className,
}: AccordionPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const { accordionId, activeIndices, shouldKeepMounted } =
    useAccordionContext();
  const resolvedIndex = useResolvedIndex(index, "Accordion.Panel");
  const isItemOpen = activeIndices.includes(resolvedIndex);
  const panelId = `${accordionId}-panel-${resolvedIndex}`;
  const buttonId = `${accordionId}-button-${resolvedIndex}`;

  // 모션 감소면 variant 를 통째로 바꾼다. `transition` prop 으로는 못 끈다 —
  // variant 안의 `transition` 이 이기기 때문이다 (위 `reducedPanelVariants` 주석).
  const variants = shouldReduceMotion ? reducedPanelVariants : panelVariants;

  // 높이를 애니메이션하는 동안 내용이 밖으로 새지 않게 잘라낸다.
  //
  // ⚠️ **`will-change` 는 여기 두지 않는다** — `_accordion.scss` 의 `__panel` 이 정본이고
  //    모션 감소 분기도 거기 media query 가 갖는다. 인라인으로 두면 `useReducedMotion()` 값이
  //    들어가는데 framer-motion 이 그것을 `useState` 초기값으로만 읽고 SSR 은 OS 설정을 모른다 —
  //    서버가 이미 열어 보낸 패널이 hydration 직후 `height, opacity` 인 채로 남았다(실측).
  const panelStyle = {
    overflow: "hidden" as const,
  };

  // shouldKeepMounted: 내용을 DOM 에 남긴다.
  // 폼 입력값 유지나 내부 콘텐츠 검색이 필요할 때 쓴다.
  //
  // `display: none` 으로 감추지 않는다. 높이 0 + overflow hidden 이면 화면에서
  // 사라지면서도 전환이 끊기지 않는다.
  if (shouldKeepMounted) {
    return (
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        // ⚠️ **감추는 수단은 `inert` 하나다. `aria-hidden` 도 `pointer-events` 도 겹쳐 걸지
        //    않는다** (2026-09-14). `inert` 가 셋을 한 번에 한다 — 접근성 트리에서 빼고(패널과
        //    그 안의 입력 둘 다 `ignored: true` · `ignoredReasons: [inertElement]` · CDP 실측),
        //    포커스를 막고(`focus()` 를 불러도 안 잡힌다), 포인터를 막는다.
        //
        //    포인터는 재서 확인했다 — 닫힌 패널에 `pointer-events: auto` 를 되돌리고 높이를
        //    열어도 `elementFromPoint` 가 패널을 건너뛰어 `__item` 을 돌려주고, `Range` 로 고른
        //    패널 안 텍스트가 빈 문자열이다. 인라인 한 줄이 하는 일이 없었다.
        //
        //    `aria-hidden` 은 첫째만 하고 **Tab 은 못 막는다** — 둘을 함께 걸면 `inert` 가 그
        //    위반("aria-hidden 인데 포커스 가능한 자손")을 가려줄 뿐이다. 게다가 패널 안 입력이
        //    포커스를 쥔 채 접히면 브라우저가 그 속성을 거부한다(`Blocked aria-hidden on an
        //    element because its descendant retained focus`). 되돌리면 그 경고가 돌아온다.
        //
        // ⚠️ **열렸을 때는 속성을 아예 뺀다** — `inert={false}` 로 넘기지 않는다. peer 가
        //    `react@^18 || ^19` 인데 **18 은 `inert="false"` 를 내보내고 브라우저는 값과 무관하게
        //    존재만 보고 참으로 읽는다.** 열린 패널이 통째로 죽는다.
        {...(isItemOpen ? {} : { inert: true })}
        className={cn(`${block}__panel`, className)}
        variants={variants}
        initial={false}
        animate={isItemOpen ? "open" : "closed"}
        style={panelStyle}
      >
        <div className={`${block}__panel-box`}>{children}</div>
      </motion.div>
    );
  }

  // 퇴장 200ms 동안 패널은 트리에 남는다. 그대로 둔다 — 닫히는 중에 포커스를 빼앗지 않는 것이
  // 맞고, 언마운트되면 브라우저가 포커스를 `body` 로 옮긴다 (spec §6-4).
  return (
    <AnimatePresence initial={false}>
      {isItemOpen ? (
        <motion.div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={cn(`${block}__panel`, className)}
          variants={variants}
          initial="closed"
          animate="open"
          exit="closed"
          style={panelStyle}
        >
          <div className={`${block}__panel-box`}>{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
