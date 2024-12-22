import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { ContactRequest } from "@/models/contact-request";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiResponse, ContactRequestListItem } from "@/types/shared";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "未登录" },
        { status: 401 }
      );
    }

    await connectDB();

    // 获取当前用户发送的联系请求
    const requests = await ContactRequest.find({ requesterId: session.user.id })
      .populate("targetId", "nickname photos province city wechat")
      .sort({ createdAt: -1 });

    // 转换为前端需要的格式
    const requestList: ContactRequestListItem[] = requests.map(request => ({
      id: request._id.toString(),
      requester: {
        id: session.user.id,
        nickname: session.user.name || "",
        avatar: session.user.image || ""
      },
      target: {
        id: request.targetId._id.toString(),
        nickname: request.targetId.nickname,
        avatar: request.targetId.photos[0] || "",
        province: request.targetId.province,
        city: request.targetId.city,
        wechat: request.targetId.wechat
      },
      message: request.message,
      status: request.status,
      response: request.response,
      respondedAt: request.respondedAt?.toISOString(),
      createdAt: request.createdAt.toISOString()
    }));

    const response: ApiResponse<ContactRequestListItem[]> = {
      success: true,
      data: requestList
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("获取发送的联系请求失败:", error);
    return NextResponse.json(
      { success: false, error: "获取发送的联系请求失败" },
      { status: 500 }
    );
  }
} 