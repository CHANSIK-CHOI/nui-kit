"use client";

import cn from "classnames";
import {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from "react";
import { px } from "../../internal/prefix.js";

export type IconBaseProps = Omit<
  SVGProps<SVGSVGElement>,
  "children" | "color"
> & {
  color?: string;
  size?: number | string;
  title?: string;
};

// ⚠️ `icon` 은 **컴포넌트가 아니라 엘리먼트다** (2026-09-09). `icon={Star}` 로 함수를
//    넘기면 서버 컴포넌트에서 깨진다 — `lucide-react` 의 아이콘 파일과
//    `createLucideIcon.mjs` 에는 `"use client"` 가 없어서 서버가 실제 `forwardRef`
//    객체를 잡고, 그것을 클라이언트 컴포넌트인 `Icon` 에 prop 으로 주는 순간
//    직렬화가 실패한다("Functions cannot be passed directly to Client Components").
//    App Router 는 페이지가 기본으로 서버다. spec §6-2-1.
export type IconProps = IconBaseProps & {
  /** 그릴 아이콘 엘리먼트. `<Star />` 처럼 만들어 넘긴다 */
  icon?: ReactElement;
  /** 직접 그린 SVG 의 좌표계. `icon` 이 없으면 실질 필수다 */
  viewBox?: string;
  /** 직접 그린 SVG 의 도형. `icon` 이 없으면 실질 필수다 */
  children?: ReactNode;
};

// 번들러(Next/webpack/vite)가 빌드 시 치환하는 전역. 이 라이브러리는 Node 타입에
// 의존하지 않으므로 @types/node 대신 파일 로컬로 최소 선언만 둔다 (Select.utils.ts 와 같다).
declare const process: { env: { NODE_ENV?: string } };

/** 엘리먼트가 이미 들고 온 것 중 우리가 양보하거나 합쳐야 하는 props */
type IncomingProps = {
  className?: string;
  color?: string;
  size?: number | string;
  children?: ReactNode;
};

/**
 * 소비자가 접근성 prop 을 하나라도 줬는가.
 *
 * ⚠️ **`...rest` 를 뒤에 펼치는 것만으로는 부족하다** (2026-09-09). spread 는 **같은
 * 키만** 덮으므로 `aria-label` 을 준 소비자에게 우리 `aria-hidden` 이 그대로 남아
 * **접근 이름이 죽는다** — 이름을 준 쪽은 화면에서 그것을 알 수 없다.
 * lucide 의 `hasA11yProp` 과 같은 판정을 쓴다.
 */
function hasA11yProp(props: Record<string, unknown>) {
  for (const key in props) {
    if (key.startsWith("aria-") || key === "role") return true;
  }
  return false;
}

/**
 * 아이콘 하나를 우리 규칙에 얹는 **단일 입구**.
 *
 *   <Icon icon={<Star />} size={20} />         lucide 세트
 *   <Icon viewBox="0 0 24 24">…</Icon>         직접 그린 SVG
 *
 * 라이브러리가 쓰는 아홉 이름(`icons.tsx`)과 서드파티 슬롯 넷(Accordion 화살표 ·
 * Select 인디케이터 · Datepicker 화살표)도 전부 여기를 지난다. 크기 · title · aria
 * 처리를 **한 벌**로 두기 위해서다 — 두 벌이면 한쪽만 고쳐진다.
 *
 * 접근성 계약은 a11y.md §4 다.
 *   title 없음 → `aria-hidden`             장식. 옆 글자나 버튼이 뜻을 전한다
 *   title 있음 → `role="img"` + `<title>`   아이콘만으로 뜻을 전한다
 * lucide 는 `title`·`aria-*`·`role` 이 하나라도 있으면 자기 `aria-hidden` 을 빼지만
 * `role="img"` 는 붙이지 않는다 — 그래서 여기서 붙인다
 * (lucide 공식 문서 · React → Accessibility).
 */
export default function Icon({
  children,
  className,
  color,
  focusable = false,
  height,
  icon,
  size,
  style,
  title,
  viewBox,
  width,
  ...rest
}: IconProps) {
  const hasIcon = isValidElement(icon);
  const incoming: IncomingProps = hasIcon ? (icon.props as IncomingProps) : {};

  if (process.env.NODE_ENV !== "production" && !hasIcon && !viewBox) {
    // 조용히 빈 `<svg>` 가 나가는 것을 막는다. 타입은 `icon` 을 거부하지만
    // JS 소비자와 `any` 는 여기까지 온다.
    console.error(
      "Icon: `icon` 엘리먼트나 `viewBox` + 도형 중 하나가 필요합니다.",
    );
  }

  const iconStyle: CSSProperties = { ...style };

  if (color) iconStyle.color = color;

  // ⚠️ 치수는 인라인 style 로 준다 (2026-09-09). `.nui-icon` 이 `width: 100%` 라
  //    svg 의 `width` 속성을 이긴다 — 단독으로 둔 `<SearchIcon size={20} />` 가
  //    부모를 채웠다(문서 격자에서 24 → 259px). 슬롯이 상자를 잡는 라이브러리
  //    안에서는 드러나지 않았다. `size` 는 정사각, `width`/`height` 는 따로 준다.
  //
  //    ⚠️ 엘리먼트가 들고 온 `size` 도 함께 본다 — `<Icon icon={<Star size={16} />} />`
  //    는 속성만 16 이 되고 화면은 부모를 채웠다. 같은 결함의 다른 입구다.
  const resolvedWidth = width ?? size ?? incoming.size;
  const resolvedHeight = height ?? size ?? incoming.size;
  // ⚠️ 한쪽만 줘도 **둘 다** 인라인으로 넣는다. 하나라도 주는 것은 「자리가 아니라
  //    내가 크기를 정한다」는 신호인데, 한쪽만 넣으면 다른 쪽에 `100%` 가 남아
  //    단독 배치에서 가로만 20px 이고 세로는 부모를 채운다. 안 준 쪽은 `auto` 라
  //    `viewBox` 의 종횡비가 정한다.
  if (resolvedWidth || resolvedHeight) {
    iconStyle.width = resolvedWidth ?? "auto";
    iconStyle.height = resolvedHeight ?? "auto";
  }

  const shared = {
    style: iconStyle,
    focusable,
    ...(title
      ? { role: "img" }
      : hasA11yProp(rest)
        ? {}
        : { "aria-hidden": true as const }),
    // 소비자가 준 것이 마지막 말을 갖는다.
    ...rest,
  };

  const titleNode = title ? <title>{title}</title> : null;

  if (hasIcon) {
    const resolvedSize = size ?? width ?? height ?? incoming.size;
    // lucide 는 `size` prop 을 알지만 호스트 엘리먼트(`<svg>` 를 직접 쓴 것)는 모른다 —
    // 그대로 두면 SVG 에 없는 `size` 속성이 DOM 에 샌다. 그쪽에는 치수 속성으로 준다.
    const isHost = typeof icon.type === "string";

    const merged = {
      ...shared,
      // ⚠️ 클래스는 **합친다**. 덮으면 엘리먼트가 들고 온 것이 사라진다 —
      //    서버 컴포넌트에서는 `<Star />` 가 서버에서 렌더돼 `lucide-star` 가
      //    이미 props 에 들어 있고, 클라이언트에서는 나중에 붙는다. 덮어쓰면
      //    **같은 호출이 페이지가 서버냐 클라이언트냐에 따라 다른 DOM** 을 낸다.
      className: cn(incoming.className, px("icon"), className),
      ...(resolvedSize === undefined
        ? {}
        : isHost
          ? { width: resolvedWidth, height: resolvedHeight }
          : { size: resolvedSize }),
      // 소비자의 `LucideProvider` 가 Context 로 내리는 `color` 를 막는다 —
      // 자리의 색 매트릭스를 덮기 때문이다 (spec §6-2-3). 엘리먼트에 **직접**
      // 준 색은 명시적 의도라 그대로 둔다. lucide 가 `color ?? context` 로
      // 읽으므로 없을 때만 넣으면 Context 만 막힌다.
      //
      // 호스트 엘리먼트(`<svg>` 를 직접 쓴 것)에는 넣지 않는다 — 읽을 Context 가
      // 없고, 넣으면 raw 경로와 DOM 이 갈린다(§6-1 「두 경로의 결과가 같다」).
      ...(!isHost && incoming.color === undefined
        ? { color: "currentColor" }
        : {}),
    };

    // ⚠️ `cloneElement` 의 세 번째 인자는 **주는 순간** 원래 children 을 덮는다.
    //    lucide 는 도형이 `iconNode` prop 에서 나와 무사하지만, 소비자가 인라인
    //    SVG 를 넘기면 도형이 통째로 사라진다. title 이 없으면 아예 주지 않는다.
    return titleNode
      ? cloneElement(
          icon as ReactElement<Record<string, unknown>>,
          merged,
          <>
            {titleNode}
            {incoming.children}
          </>,
        )
      : cloneElement(icon as ReactElement<Record<string, unknown>>, merged);
  }

  return (
    <svg
      {...shared}
      className={cn(px("icon"), className)}
      viewBox={viewBox}
      width={resolvedWidth}
      height={resolvedHeight}
    >
      {titleNode}
      {children}
    </svg>
  );
}
