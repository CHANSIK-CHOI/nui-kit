"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, type NavItem } from "@/site/nav";

/**
 * 목차 본문. 데스크톱 사이드바와 모바일 메뉴 패널이 같은 것을 그린다 —
 * 두 곳이 따로 nav 를 순회하면 한쪽만 늙는다.
 */
export function NavList() {
  const pathname = usePathname();

  const renderLink = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      className="doc-nav-link"
      aria-current={pathname === item.href ? "page" : undefined}
    >
      {item.title}
    </Link>
  );

  return (
    <nav aria-label="문서 목차">
      {NAV.map((section) => (
        <div key={section.title} className="doc-nav-section">
          <p className="doc-nav-title">{section.title}</p>
          {section.items?.map(renderLink)}
          {section.groups?.map((group) => (
            <div key={group.title} className="doc-nav-group">
              <p className="doc-nav-group-title">{group.title}</p>
              {group.items.map(renderLink)}
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}

export function Brand() {
  return (
    <Link href="/" className="doc-brand">
      nui-kit
      <small>@nui-kit/react</small>
    </Link>
  );
}

/** 데스크톱 좌측 사이드바. 970px 이하에서는 CSS 가 숨기고 `MobileHeader` 가 맡는다. */
export function Sidebar() {
  return (
    <aside className="doc-sidebar">
      <Brand />
      <NavList />
    </aside>
  );
}
