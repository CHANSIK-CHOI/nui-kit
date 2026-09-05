"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, type NavItem } from "@/site/nav";

export function Sidebar() {
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
    <aside className="doc-sidebar">
      <Link href="/" className="doc-brand">
        nui-kit
        <small>@nui-kit/react</small>
      </Link>

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
    </aside>
  );
}
