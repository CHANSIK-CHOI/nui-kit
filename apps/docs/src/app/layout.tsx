import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { PopupProvider } from "@/components/PopupProvider";

// 라이브러리 전체 스타일 (토큰 포함). reset 은 포함되지 않는다.
import "@chansikchoi/next-ui/styles/index.css";
// 문서 사이트 자체 스타일
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: {
    default: "Next UI System",
    template: "%s · Next UI System",
  },
  description:
    "Next.js App Router 전용 React UI 컴포넌트 시스템 — 디자인 파운데이션과 컴포넌트 API 문서",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <PopupProvider>
          <div className="doc-shell">
            <Sidebar />
            <main className="doc-main">{children}</main>
          </div>
        </PopupProvider>
      </body>
    </html>
  );
}
