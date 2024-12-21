import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "信息匹配平台",
  description: "一个私域信息匹配平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className="dark">
      <body className={cn(
        inter.className,
        "min-h-screen bg-background font-sans antialiased"
      )}>
        <MainLayout>{children}</MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
