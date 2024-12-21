import { NextResponse } from 'next/server';
import { generateVerificationCode, sendVerificationCode } from '@/lib/mail';
import connectDB from '@/lib/db';
import { User } from '@/models/user';

// 存储邮箱验证码的Map
const verificationCodes = new Map<string, { code: string; expires: number }>();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: '请提供邮箱地址' },
        { status: 400 }
      );
    }

    await connectDB();

    // 检查邮箱是否已被注册
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 生成验证码
    const code = generateVerificationCode();
    // 设置10分钟过期
    const expires = Date.now() + 10 * 60 * 1000;

    // 存储验证码
    verificationCodes.set(email, { code, expires });

    // 发送验证码邮件
    await sendVerificationCode(email, code);

    // 清理过期的验证码
    for (const [key, value] of verificationCodes.entries()) {
      if (value.expires < Date.now()) {
        verificationCodes.delete(key);
      }
    }

    return NextResponse.json({ message: '验证码已发送' });
  } catch (error: any) {
    console.error('发送验证码失败:', error);
    return NextResponse.json(
      { error: error.message || '发送验证码失败' },
      { status: 500 }
    );
  }
}

// 验证码校验函数
export function verifyCode(email: string, code: string): boolean {
  const storedData = verificationCodes.get(email);
  if (!storedData) {
    return false;
  }

  if (storedData.expires < Date.now()) {
    verificationCodes.delete(email);
    return false;
  }

  return storedData.code === code;
} 