import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

// GET 获取用户资料
export async function GET() {
  try {
    // 1. 获取当前会话
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

    // 2. 连接数据库
    await connectDB();

    // 3. 查询用户信息
    const user = await User.findOne({ email: session.user.email })
      .select("-password -verificationAnswer"); // 排除敏感信息

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    // 4. 返回用户信息
    return NextResponse.json(user);
    
  } catch (error: any) {
    console.error("获取用户资料失败:", error);
    return NextResponse.json(
      { error: error.message || "获取用户资料失败" },
      { status: 500 }
    );
  }
} 