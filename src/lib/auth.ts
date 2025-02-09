import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User } from '@/models/user';
import { connectDB } from '@/lib/db';

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
          console.log('尝试登录用户:', credentials.email);

          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            console.log('用户不存在');
            throw new Error('邮箱或密码错误');
          }
          console.log('找到用户:', user.email);

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            console.log('密码不正确');
            throw new Error('邮箱或密码错误');
          }
          console.log('密码验证通过');

          console.log('登录成功');
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.nickname,
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}; 