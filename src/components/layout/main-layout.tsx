"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* 侧边栏 */}
      <Sidebar className="w-[300px] border-r" />
      
      {/* 主内容区域 */}
      <main className="flex-1 border-l">
        <div className="container max-w-7xl h-full pt-4">
          {children}
        </div>
      </main>
    </div>
  );
} 