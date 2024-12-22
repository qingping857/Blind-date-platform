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

    // 获取当前用户收到的联系请求
    const requests = await ContactRequest.find({ targetId: session.user.id })
      .populate("requesterId", "nickname photos province city wechat")
      .sort({ createdAt: -1 });

    // 转换为前端需要的格式
    const requestList: ContactRequestListItem[] = requests.map(request => ({
      id: request._id.toString(),
      requester: {
        id: request.requesterId._id.toString(),
        nickname: request.requesterId.nickname,
        avatar: request.requesterId.photos[0] || "",
        province: request.requesterId.province,
        city: request.requesterId.city,
        wechat: request.requesterId.wechat
      },
      target: {
        id: session.user.id,
        nickname: session.user.name || "",
        avatar: session.user.image || ""
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
    console.error("获取收到的联系请求失败:", error);
    return NextResponse.json(
      { success: false, error: "获取收到的联系请求失败" },
      { status: 500 }
    );
  }
} 