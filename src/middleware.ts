import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 不需要认证的路由
const publicRoutes = ['/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 获取认证token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 处理根路由重定向
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // 已登录用户访问登录页面，重定向到广场页面
  if (pathname === '/auth' && token) {
    return NextResponse.redirect(new URL('/square', request.url));
  }

  // 未登录用户访问需要认证的页面，重定向到登录页面
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

// 配置中间件匹配的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路由，除了：
     * - api 路由
     * - _next 系统文件
     * - 静态文��（图片、字体等）
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 