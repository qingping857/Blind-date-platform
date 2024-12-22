import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { registerValidationSchema } from '@/lib/validations/user';
import connectDB from '@/lib/db';
import { User } from '@/models/user';
import { uploadPhoto } from '@/lib/upload';
import { verifyCode } from '../send-code/route';

export async function POST(req: Request) {
  console.log('开始处理注册请求');
  try {
    // 解析FormData
    const formData = await req.formData();
    console.log('收到的字段:', Array.from(formData.keys()));
    const body = Object.fromEntries(formData.entries());
    console.log('请求数据:', { ...body, password: '***' });
    
    // 验证邮箱验证码
    const email = body.email as string;
    const verificationCode = body.verificationCode as string;

    if (!verificationCode) {
      return NextResponse.json(
        { error: '请输入验证码' },
        { status: 400 }
      );
    }

    const isCodeValid = await verifyCode(email, verificationCode);
    if (!isCodeValid) {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      );
    }
    
    // 处理照片上传
    const photos = formData.getAll('photos') as File[];
    console.log('收到的照片数量:', photos.length);

    if (!photos || photos.length === 0) {
      console.log('错误: 没有上传照片');
      return NextResponse.json(
        { error: '请至少上传一张照片' },
        { status: 400 }
      );
    }

    if (photos.length > 3) {
      console.log('错误: 照片数量超过限制');
      return NextResponse.json(
        { error: '最多只能上传3张照片' },
        { status: 400 }
      );
    }

    // 上传照片并获取URL
    console.log('开始上传照片...');
    const photoUrls = await Promise.all(
      photos.map(async (photo, index) => {
        console.log(`上传第 ${index + 1} 张照片...`);
        return uploadPhoto(photo);
      })
    );
    console.log('照片上传完成, URLs:', photoUrls);
    
    // 验证其他数据
    console.log('验证表单数据...');
    const validatedData = registerValidationSchema.parse({
      ...body,
      photos: photoUrls,
      age: parseInt(body.age as string, 10)
    });
    console.log('数据验证通过');
    
    // 连接数据库
    console.log('连接数据库...');
    await connectDB();
    
    // 检查邮箱是否已存在
    console.log('检查邮箱是否已存在...');
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      console.log('错误: 邮箱已存在');
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }
    
    // 加密密码
    console.log('加密密码...');
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // 创建用户
    console.log('创建用户...');
    const user = await User.create({
      ...validatedData,
      password: hashedPassword
    });
    console.log('用户创建成功, ID:', user._id);
    
    // 移除密码后返回用户数据
    const { password, ...userWithoutPassword } = user.toObject();
    
    console.log('注册流程完成');
    return NextResponse.json({
      ...userWithoutPassword,
      message: '注册成功！'
    }, { status: 201 });
  } catch (error: any) {
    console.error('注册失败:', error);
    // 检查是否是验证错误
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: '表单数据验证失败', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || '注册失败' },
      { status: 500 }
    );
  }
} 