import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// 创建认证中间件
const authMiddleware = withAuth(
  function middleware(req) {
    if (req.nextauth.token?.status === 'pending') {
      return NextResponse.redirect(new URL('/pending', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// 导出配置，明确定义需要保护的路由
export const config = {
  matcher: [
    '/profile/:path*',
    '/square/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
  ],
};

// 导出中间件
export default authMiddleware; 