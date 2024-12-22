import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ContactRequest } from "@/models/contact-request";
import { User } from "@/models/user";
import { ApiResponse } from "@/types/shared";

export async function GET() {
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
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    // 获取发送的申请列表
    const requests = await ContactRequest.find({ requesterId: user._id })
      .populate("targetId", "-password -verificationAnswer")
      .sort({ createdAt: -1 });

    // 转换数据格式
    const formattedRequests = requests.map(request => ({
      id: request._id.toString(),
      requesterId: request.requesterId.toString(),
      targetId: {
        id: request.targetId._id.toString(),
        nickname: request.targetId.nickname,
        age: request.targetId.age,
        gender: request.targetId.gender,
        university: request.targetId.university,
        location: request.targetId.location,
        wechat: request.targetId.wechat,
      },
      message: request.message,
      response: request.response,
      status: request.status,
      createdAt: request.createdAt,
    }));

    const response: ApiResponse<typeof formattedRequests> = {
      success: true,
      data: formattedRequests,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("获取申请列表失败:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "获取申请列表失败",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 