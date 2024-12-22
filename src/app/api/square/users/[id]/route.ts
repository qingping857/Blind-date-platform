import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { ContactRequest } from "@/models/contact-request";
import { ApiResponse, UserBasicInfo } from "@/types/shared";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 }
      );
    }

    await connectDB();

    // 获取当前用户
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    // 获取目标用户
    const targetUser = await User.findById(params.id)
      .select("-password -verificationAnswer");

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    // 如果是查看自己的资料，直接返回
    if (targetUser._id.toString() === currentUser._id.toString()) {
      const response: ApiResponse<UserBasicInfo> = {
        success: true,
        data: {
          nickname: targetUser.nickname,
          age: targetUser.age,
          gender: targetUser.gender,
          location: targetUser.location || { province: "all", city: "all" },
          mbti: targetUser.mbti,
          university: targetUser.university,
          major: targetUser.major,
          grade: targetUser.grade,
          selfIntro: targetUser.selfIntro,
          expectation: targetUser.expectation,
          wechat: targetUser.wechat,
          photos: targetUser.photos,
        }
      };
      return NextResponse.json(response);
    }

    // 如果是查看其他用户的资料，需要隐藏微信号
    const response: ApiResponse<UserBasicInfo> = {
      success: true,
      data: {
        nickname: targetUser.nickname,
        age: targetUser.age,
        gender: targetUser.gender,
        location: targetUser.location || { province: "all", city: "all" },
        mbti: targetUser.mbti,
        university: targetUser.university,
        major: targetUser.major,
        grade: targetUser.grade,
        selfIntro: targetUser.selfIntro,
        expectation: targetUser.expectation,
        wechat: "", // 隐藏微信号
        photos: targetUser.photos,
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