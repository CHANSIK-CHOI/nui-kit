"use client";

import { useCallback, useEffect, useRef } from "react";
import { px, pv } from "../../internal/prefix.js";
import { PORTAL_ROOT_ATTRIBUTE } from "../../internal/portal.js";

const PREVENT_SCROLL_CLASS = px("is-prevent-scroll");
const SCROLL_LOCK_TOP_VAR = pv("scroll-lock-top");

type UsePopupHostA11yParams = {
  hasPopup: boolean;
  /** 팝업이 렌더되는 portal 컨테이너. 이 요소만 inert 대상에서 제외한다 */
  portalRoot: HTMLElement | null;
};

/**
 * 팝업이 떠 있는 동안의 문서 전체 처리: 배경 스크롤 잠금 + 배경 inert.
 *
 * ⚠️ 특정 루트 요소(`#__next` 같은 것)를 찾아 inert 처리하지 않는다.
 *    App Router 에는 그런 고정 요소가 없다. 프레임워크에 의존하지 않도록
 *    **body 의 직계 자식 중 portal 컨테이너를 제외한 전부**를 inert 처리한다.
 *    (Next 의 dev 오버레이 등 스크립트성 요소는 inert 되어도 무해하다)
 */
export default function usePopupHostA11y({
  hasPopup,
  portalRoot,
}: UsePopupHostA11yParams) {
  const scrollTopRef = useRef(0);
  const isScrollLockedRef = useRef(false);
  const hasPopupRef = useRef(hasPopup);
  /** inert 를 우리가 건 요소들과, 걸기 전 aria-hidden 원래값 */
  const inertedRef = useRef<Map<HTMLElement, string | null>>(new Map());

  const unlockScroll = useCallback((force = false) => {
    if (!isScrollLockedRef.current) return;
    if (!force && hasPopupRef.current) return;

    document.body.classList.remove(PREVENT_SCROLL_CLASS);
    document.body.style.removeProperty(SCROLL_LOCK_TOP_VAR);
    window.scrollTo(0, scrollTopRef.current);
    scrollTopRef.current = 0;
    isScrollLockedRef.current = false;
  }, []);

  const setBackgroundInert = useCallback(
    (nextInert: boolean, root: HTMLElement | null) => {
      if (nextInert) {
        if (inertedRef.current.size > 0) return;

        for (const child of Array.from(document.body.children)) {
          if (!(child instanceof HTMLElement)) continue;
          // portal 컨테이너 자신과 그 조상은 건드리지 않는다
          if (root && (child === root || child.contains(root))) continue;
          // ⚠️ 우리 다른 portal 컨테이너(토스트·툴팁)도 건드리지 않는다.
          //    이것이 없으면 팝업 안에서 띄운 토스트가 **보이는데 눌리지 않고
          //    스크린리더에도 안 읽힌다** — z 는 팝업보다 위(1031)인데 inert 라서다.
          //    design-system.md §10 「팝업 안에서 띄워도 팝업 위」 계약과 어긋난다.
          if (child.hasAttribute(PORTAL_ROOT_ATTRIBUTE)) continue;
          // 이미 남이 inert 처리한 요소는 우리 책임이 아니다
          if (child.hasAttribute("inert")) continue;

          inertedRef.current.set(child, child.getAttribute("aria-hidden"));
          child.setAttribute("inert", "");
          child.setAttribute("aria-hidden", "true");
        }

        return;
      }

      for (const [element, previousAriaHidden] of inertedRef.current) {
        element.removeAttribute("inert");

        if (previousAriaHidden === null) {
          element.removeAttribute("aria-hidden");
        } else {
          element.setAttribute("aria-hidden", previousAriaHidden);
        }
      }

      inertedRef.current.clear();
    },
    [],
  );

  useEffect(() => {
    hasPopupRef.current = hasPopup;

    if (hasPopup && !isScrollLockedRef.current) {
      scrollTopRef.current =
        window.scrollY || document.documentElement.scrollTop || 0;
      document.body.classList.add(PREVENT_SCROLL_CLASS);
      document.body.style.setProperty(
        SCROLL_LOCK_TOP_VAR,
        `${scrollTopRef.current}px`,
      );
      isScrollLockedRef.current = true;
    }

    setBackgroundInert(hasPopup, portalRoot);

    if (!hasPopup && isScrollLockedRef.current) {
      unlockScroll();
    }
  }, [hasPopup, portalRoot, setBackgroundInert, unlockScroll]);

  // 언마운트 시 반드시 원복한다 (라우팅 중 팝업이 열린 채 사라져도 문서가 잠기지 않도록)
  useEffect(
    () => () => {
      unlockScroll(true);
      setBackgroundInert(false, null);
    },
    [setBackgroundInert, unlockScroll],
  );
}
