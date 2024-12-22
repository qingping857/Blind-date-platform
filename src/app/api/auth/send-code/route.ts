import { NextResponse } from 'next/server';
import { generateVerificationCode, sendVerificationCode } from '@/lib/mail';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user';
import { VerificationCode } from '@/models/verification-code';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: '请提供邮箱地址' },
        { status: 400 }
      );
    }

    // 连接数据库
    await connectDB();

    // 检查邮箱是否已被注册
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 生成验证码
    const code = generateVerificationCode();
    // 设置10分钟过期
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // 存储验证码
    await VerificationCode.findOneAndUpdate(
      { email },
      { 
        code,
        expires,
      },
      { upsert: true, new: true }
    );

    // 发送验证码邮件
    await sendVerificationCode(email, code);

    return NextResponse.json({ 
      success: true,
      message: '验证码已发送' 
    });
  } catch (error: any) {
    console.error('发送验证码失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '发送验证码失败' 
      },
      { status: 500 }
    );
  }
}

// 验证码校验函数
export async function verifyCode(email: string, code: string): Promise<boolean> {
  await connectDB();
  
  const verificationCode = await VerificationCode.findOne({
    email,
    code,
    expires: { $gt: new Date() }
  });

  if (!verificationCode) {
    return false;
  }

  // 验证成功后删除验证码
  await VerificationCode.deleteOne({ _id: verificationCode._id });

  return true;
} 