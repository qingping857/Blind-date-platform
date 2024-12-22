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

// PUT 更新用户资料
export async function PUT(req: Request) {
  try {
    // 1. 获取当前会话
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

    // 2. 获取请求数据
    const data = await req.json();
    
    // 3. 连接数据库
    await connectDB();

    // 4. 查找并更新用户信息
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          nickname: data.nickname,
          age: data.age,
          gender: data.gender,
          city: data.city,
          mbti: data.mbti,
          university: data.university,
          major: data.major,
          grade: data.grade,
          selfIntro: data.selfIntro,
          expectation: data.expectation,
          wechat: data.wechat,
          photos: data.photos,
          updatedAt: new Date(),
        }
      },
      { 
        new: true, // 返回更新后的文档
        runValidators: true, // 运行验证器
      }
    ).select("-password -verificationAnswer"); // 排除敏感信息

    if (!updatedUser) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    // 5. 返回更新后的用户信息
    return NextResponse.json(updatedUser);

  } catch (error: any) {
    console.error("更新用户资料失败:", error);
    return NextResponse.json(
      { error: error.message || "更新用户资料失败" },
      { status: 500 }
    );
  }
} 