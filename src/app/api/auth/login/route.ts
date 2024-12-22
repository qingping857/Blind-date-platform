import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 连接数据库
    await connectDB();

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "密码错误" },
        { status: 401 }
      );
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user.toObject();
    return NextResponse.json(userWithoutPassword);

  } catch (error: any) {
    console.error("登录失败:", error);
    return NextResponse.json(
      { error: error.message || "登录失败" },
      { status: 500 }
    );
  }
} 