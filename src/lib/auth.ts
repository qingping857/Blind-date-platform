import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User } from '@/models/user';
import connectDB from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('请输入邮箱和密码');
          }

          await connectDB();

          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('邮箱或密码错误');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error('邮箱或密码错误');
          }

          if (!user.isEmailVerified) {
            throw new Error('请先验证您的邮箱后再登录');
          }

          if (user.status !== 'approved') {
            throw new Error('您的账号正在审核中，请等待审核通过后再登录');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.nickname,
            status: user.status,
            isEmailVerified: user.isEmailVerified,
          };
        } catch (error: any) {
          console.error('认证过程中发生错误:', error);
          throw new Error(error.message || '登录失败，请稍后重试');
        }
      }
    })
  ],
  pages: {
    signIn: '/auth',
    error: '/auth',
    newUser: '/auth?tab=register',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.status = user.status;
        token.isEmailVerified = user.isEmailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).status = token.status;
        (session.user as any).isEmailVerified = token.isEmailVerified;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}; 