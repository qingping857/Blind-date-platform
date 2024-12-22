import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { ContactRequest } from "@/models/contact-request";
import { UserDetail, ApiResponse } from "@/types/shared";

// GET 获取用户详情
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. 获取当前会话
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 }
      );
    }

    // 2. 连接数据库
    await connectDB();

    // 3. 查询用户信息
    const user = await User.findById(params.id)
      .select("-password -verificationAnswer"); // 排除敏感信息

    if (!user) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    // 4. 返回用户信息
    const response: ApiResponse<UserDetail> = {
      success: true,
      data: {
        id: user._id.toString(),
        nickname: user.nickname,
        age: user.age,
        gender: user.gender,
        location: user.location || { province: "all", city: "all" },
        mbti: user.mbti,
        university: user.university,
        major: user.major,
        grade: user.grade,
        selfIntro: user.selfIntro,
        expectation: user.expectation,
        wechat: user.wechat,
        photos: user.photos,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }
    };

    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error("获取用户详情失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取用户详情失败" },
      { status: 500 }
    );
  }
}

// POST 申请联系方式
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. 获取当前会话
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 }
      );
    }

    // 2. 获取请求数据
    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, error: "请填写申请说明" },
        { status: 400 }
      );
    }

    // 3. 连接数据库
    await connectDB();

    // 4. 查询目标用户
    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    // 5. 查询当前用户
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "当前用户不存在" },
        { status: 404 }
      );
    }

    // 6. 检查是否已经申请过
    const existingRequest = await ContactRequest.findOne({
      requesterId: currentUser._id,
      targetId: targetUser._id,
      status: "pending",
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: "已经申请过了，请等待对方回复" },
        { status: 400 }
      );
    }

    // 7. 创建联系方式申请记录
    await ContactRequest.create({
      requesterId: currentUser._id,
      targetId: targetUser._id,
      message: message.trim(),
    });

    // 8. 返回成功响应
    return NextResponse.json({
      success: true,
      data: { message: "申请已发送" }
    });

  } catch (error: any) {
    console.error("申请联系方式失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "申请联系方式失败" },
      { status: 500 }
    );
  }
} 