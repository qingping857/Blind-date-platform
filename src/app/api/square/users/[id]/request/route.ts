import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { ContactRequest } from "@/models/contact-request";
import { ApiResponse } from "@/types/shared";

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
    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: "申请已发送" }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("申请联系方式失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "申请联系方式失败" },
      { status: 500 }
    );
  }
}

// GET 获取申请状态
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

    // 3. 查询当前用户
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "当前用户不存在" },
        { status: 404 }
      );
    }

    // 4. 查询申请记录
    const request = await ContactRequest.findOne({
      requesterId: currentUser._id,
      targetId: params.id,
    }).sort({ createdAt: -1 });

    // 5. 返回申请状态
    const response: ApiResponse<{
      status: string | null;
      message: string | null;
      response: string | null;
    }> = {
      success: true,
      data: {
        status: request?.status || null,
        message: request?.message || null,
        response: request?.response || null,
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("获取申请状态失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取申请状态失败" },
      { status: 500 }
    );
  }
} 