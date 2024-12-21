import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/user';
import connectDB from '@/lib/db';
import { User } from '@/models/user';
import { uploadPhoto } from '@/lib/upload';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    
    // 处理照片上传
    const photos = formData.getAll('photos') as File[];
    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: '请至少上传一张照片' },
        { status: 400 }
      );
    }

    if (photos.length > 3) {
      return NextResponse.json(
        { error: '最多只能上传3张照片' },
        { status: 400 }
      );
    }

    // 上传照片并获取URL
    const photoUrls = await Promise.all(
      photos.map(photo => uploadPhoto(photo))
    );
    
    // 验证其他数据
    const validatedData = registerSchema.parse({
      ...body,
      photos: photoUrls,
      age: parseInt(body.age as string, 10)
    });
    
    // 连接数据库
    await connectDB();
    
    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // 创建用户
    const user = await User.create({
      ...validatedData,
      password: hashedPassword,
      status: 'pending'
    });
    
    // 移除密码后返回用户数据
    const { password, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { error: error.message || '注册失败' },
      { status: 500 }
    );
  }
} 