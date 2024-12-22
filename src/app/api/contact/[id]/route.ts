import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取当前用户会话
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "未登录" },
        { status: 401 }
      );
    }

    // 获取请求体
    const body = await request.json();
    const { action, message } = body;

    if (!action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json(
        { success: false, error: "无效的操作" },
        { status: 400 }
      );
    }

    if (action === "reject" && !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "拒绝时必须填写回复内容" },
        { status: 400 }
      );
    }

    // 连接数据库
    const { db } = await connectToDatabase();

    // 查找并更新申请
    const result = await db.collection("contact_requests").findOneAndUpdate(
      {
        _id: new ObjectId(params.id),
        targetId: new ObjectId(session.user.id),
        status: "pending",
      },
      {
        $set: {
          status: action === "approve" ? "approved" : "rejected",
          response: message?.trim(),
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "申请不存在或已处理" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("处理申请失败:", error);
    return NextResponse.json(
      { success: false, error: "处理申请失败" },
      { status: 500 }
    );
  }
} 