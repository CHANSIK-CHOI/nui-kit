"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { IconButton } from "@nui-kit/react";
import { Icon } from "@nui-kit/react/icon";
import {
  FullPopup,
  useFullPopup,
  type FullPopupComponentProps,
} from "@nui-kit/react/popup";
import { Brand, NavList } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * 데스크톱 레이아웃이 시작되는 폭. `globals.scss` 의 `@media (max-width: 970px)` 와 짝이다 —
 * 한쪽만 바꾸면 사이드바와 메뉴 패널이 동시에 보이거나 둘 다 사라진다.
 */
const DESKTOP_QUERY = "(min-width: 971px)";
const MENU_POPUP_ID = "doc-mobile-menu";

/**
 * 목차 패널 내용. `PopupHost` 가 열고 runtime 다섯을 넣는다 — 그대로 `FullPopup` 에 펼친다.
 * 열 때 마운트되므로 배경 inert 와 포커스 복귀가 라이브러리에서 따라온다.
 */
function MenuPopup(runtime: FullPopupComponentProps) {
  const pathname = usePathname();
  const openedAtPathname = useRef(pathname);
  // PopupHost 가 주는 onRequestClose 는 렌더마다 새 함수다. 구독을 다시 걸지 않도록 ref 로 본다
  const requestCloseRef = useRef(runtime.onRequestClose);
  requestCloseRef.current = runtime.onRequestClose;

  // 링크를 눌러 페이지가 바뀌면 닫는다. 링크마다 onClick 을 달지 않는다 —
  // 같은 페이지 링크를 눌렀을 때는 pathname 이 그대로라 열린 채 남는 것이 맞다.
  useEffect(() => {
    if (pathname !== openedAtPathname.current) requestCloseRef.current?.();
  }, [pathname]);

  // 창을 데스크톱 폭으로 넓히면 닫는다. 사이드바가 다시 보이는데 전체 화면 패널이
  // 그 위에 남아 있으면 배경이 inert 인 채로 목차가 둘이 된다.
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const close = (event: MediaQueryListEvent) => {
      if (event.matches) requestCloseRef.current?.();
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  return (
    <FullPopup
      {...runtime}
      title="문서 목차"
      closeLabel="목차 닫기"
      panelClassName="doc-mobile-menu"
    >
      <NavList />
    </FullPopup>
  );
}

/**
 * 좁은 화면의 상단 바. 970px 이하에서만 보인다(CSS).
 *
 * 사이드바를 본문 위에 그대로 쌓으면 목차 2000px 을 지나야 글이 나온다.
 * 대신 우측 상단 메뉴 버튼이 전체 화면 패널로 목차를 연다 — 패널은 라이브러리의
 * `FullPopup` 그대로다. 포커스 가둠 · 배경 inert · Esc · 포커스 복귀를 사이트가
 * 다시 만들지 않는다.
 */
export function MobileHeader() {
  const fullPopup = useFullPopup();
  const isOpen = fullPopup.fullPopups.some((item) => item.id === MENU_POPUP_ID);

  return (
    <header className="doc-mobile-header">
      <Brand />
      <div className="doc-mobile-header__actions">
        <ThemeToggle variant="inline" />
        <IconButton
          aria-label="문서 목차 열기"
          aria-expanded={isOpen}
          variant="line"
          size="small"
          onClick={() => {
            // 닫히는 중(exit 모션)에도 스택에 남아 있다. 같은 id 로 다시 열면 스토어가 던진다
            if (isOpen) return;
            fullPopup.open({ id: MENU_POPUP_ID, component: MenuPopup });
          }}
        >
          <Icon icon={<Menu />} />
        </IconButton>
      </div>
    </header>
  );
}
