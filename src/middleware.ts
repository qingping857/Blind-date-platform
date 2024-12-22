import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 需要认证的路由
const protectedRoutes = ["/messages", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 获取token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 如果用户已登录
  if (token) {
    // 如果访问根路径，重定向到广场页面
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/square", request.url));
    }
    // 已登录用户访问登录/注册页面，重定向到广场页面
    if (pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL("/square", request.url));
    }
  }

  // 如果用户未登录且访问受保护的路由，重定向到首页
  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 配置匹配的路由
export const config = {
  matcher: [
    /*
     * 匹配所有需要处理的路由:
     * - 根路径 (/)
     * - 认证路由 (/auth/*)
     * - 受保护路由 (/messages, /profile, /square)
     */
    "/",
    "/auth/:path*",
    "/messages",
    "/profile",
    "/square",
  ],
}; 