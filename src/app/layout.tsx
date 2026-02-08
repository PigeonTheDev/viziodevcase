import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import LayoutWrapper from "@/components/LayoutWrapper";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-black text-white min-h-screen antialiased">
        <NextTopLoader color="#ffffff" height={3} showSpinner={false} shadow="0 0 10px #ffffff,0 0 5px #ffffff" />

        <Sidebar />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
