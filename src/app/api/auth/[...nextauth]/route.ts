import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// 创建处理器实例
const handler = NextAuth(authOptions);

// 导出所有必要的HTTP方法处理函数
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;

// 添加类型声明以确保正确的响应类型
export type AuthResponse = Awaited<ReturnType<typeof handler>>; 