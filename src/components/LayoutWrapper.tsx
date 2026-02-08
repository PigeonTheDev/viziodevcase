"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div 
      className="min-h-screen flex justify-center" 
      style={{ marginLeft: isLoginPage ? '0' : '320px' }}
    >
      <main className="w-full max-w-3xl px-8 py-12">
        {children}
      </main>
    </div>
  );
}
