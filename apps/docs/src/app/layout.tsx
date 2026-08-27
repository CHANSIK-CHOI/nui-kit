import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { PopupProvider } from "@/components/PopupProvider";
import { ThemeToggle, THEME_STORAGE_KEY } from "@/components/ThemeToggle";

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

// 첫 페인트 전에 테마를 확정한다. React 가 마운트된 뒤에 칠하면
// 라이트로 한 번 그려졌다가 다크로 뒤집히는 깜빡임이 보인다.
const themeScript = `(function(){try{
var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
var t=s||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
document.documentElement.dataset.theme=t;
}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <PopupProvider>
          <div className="doc-shell">
            <Sidebar />
            <main className="doc-main">{children}</main>
          </div>
          <ThemeToggle />
        </PopupProvider>
      </body>
    </html>
  );
}
