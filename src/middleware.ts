import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // 如果用户已登录但未通过审核，重定向到等待审核页面
    if (req.nextauth.token?.status === 'pending') {
      return NextResponse.redirect(new URL('/pending', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth',
    },
  }
);

// 配置需要保护的路由
export const config = {
  matcher: [
    '/profile/:path*',
    '/square/:path*',
    '/admin/:path*',
  ],
}; 