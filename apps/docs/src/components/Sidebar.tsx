"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/site/nav";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="doc-sidebar">
      <Link href="/" className="doc-brand">
        Next UI System
        <small>@chansikchoi/next-ui</small>
      </Link>

      <nav aria-label="문서 목차">
        {NAV.map((section) => (
          <div key={section.title} className="doc-nav-section">
            <p className="doc-nav-title">{section.title}</p>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="doc-nav-link"
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.title}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
