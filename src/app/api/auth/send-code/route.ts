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
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 生成验证码
    const code = generateVerificationCode();
    
    // 创建新的验证码记录
    const verificationCode = new VerificationCode({
      email,
      code,
      createdAt: new Date(),
      expires: new Date(Date.now() + 10 * 60 * 1000)
    });

    // 保存验证码
    await verificationCode.save();

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
  try {
    console.log('开始验证码验证:', { email, code });
    await connectDB();
    
    // 查找验证码记录
    const verificationCode = await VerificationCode.findOne({
      email: email.toLowerCase(),
      code,
      expires: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!verificationCode) {
      console.log('验证失败: 未找到有效的验证码记录');
      return false;
    }

    // 检查是否过期
    const now = new Date();
    const timeDiff = verificationCode.expires.getTime() - now.getTime();
    
    console.log('验证码状态:', {
      createdAt: verificationCode.createdAt.toISOString(),
      expires: verificationCode.expires.toISOString(),
      now: now.toISOString(),
      timeDiffMinutes: Math.floor(timeDiff / (1000 * 60))
    });

    if (timeDiff <= 0) {
      console.log('验证失败: 验证码已过期');
      await VerificationCode.deleteOne({ _id: verificationCode._id });
      return false;
    }

    // 验证成功后删除验证码
    console.log('验证成功，删除验证码记录');
    await VerificationCode.deleteOne({ _id: verificationCode._id });

    return true;
  } catch (error) {
    console.error('验证码验证过程出错:', error);
    return false;
  }
} 