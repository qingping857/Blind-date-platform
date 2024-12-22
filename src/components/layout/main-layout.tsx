"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode, useState } from "react";

const menuItems = [
  {
    title: "广场",
    href: "/square",
    icon: "🏠",
    requireAuth: true
  },
  {
    title: "联系",
    href: "/contact",
    icon: "💬",
    requireAuth: true
  },
  {
    title: "我的",
    href: "/profile",
    icon: "👤",
    requireAuth: true
  }
];

interface MainLayoutProps {
  children: ReactNode;
  defaultValue?: string;
  className?: string;
}

export function MainLayout({ children, defaultValue = "home", className = "" }: MainLayoutProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [value, setValue] = useState(defaultValue);

  const handleNavigation = (requireAuth: boolean, href: string) => {
    if (requireAuth && !session) {
      toast({
        title: "访问受限",
        description: "请完成登录/注册后浏览其他页面",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // 如果是登录或注册页面，直接显示内容
  if (pathname.startsWith('/auth/')) {
    return children;
  }

  // 基础布局（包含侧边栏）
  const baseLayout = (
    <div className="flex h-screen">
      {/* 固定的侧边栏 */}
      <div className="w-64 bg-card border-r fixed h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold">LOVE 直聘</h1>
        </div>
        
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (!handleNavigation(item.requireAuth, item.href)) {
                  e.preventDefault();
                }
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                pathname === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-muted"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 ml-64">
        <main className="container max-w-screen-xl mx-auto p-6">
          {/* 如果是根路径且未登录，显示登录/注册表单 */}
          {pathname === "/" && !session ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)]">
              <div className="w-full max-w-3xl space-y-6">
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    欢迎来到浪前人的相亲平台
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    请登录或注册以继续使用
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <Tabs 
                    value={value} 
                    onValueChange={setValue} 
                    defaultValue={defaultValue} 
                    className="space-y-6"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">登录</TabsTrigger>
                      <TabsTrigger value="register">注册</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <LoginForm />
                    </TabsContent>
                    <TabsContent value="register">
                      <RegisterForm />
                    </TabsContent>
                  </Tabs>

                  <p className="text-center text-sm text-muted-foreground mt-6">
                    请完成登录/注册后浏览其他页面
                  </p>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );

  return baseLayout;
} 