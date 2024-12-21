"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UserCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname();
  
  const routes = [
    {
      label: "广场",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "联系",
      icon: MessageCircle,
      href: "/contact",
      active: pathname === "/contact",
    },
    {
      label: "我的",
      icon: UserCircle,
      href: "/profile",
      active: pathname === "/profile",
    },
  ];

  return (
    <div className={cn("flex flex-col space-y-4 py-4", className)} {...props}>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">信息匹配平台</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                route.active ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 