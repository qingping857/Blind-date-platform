import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    // 获取当前用户会话
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "未登录" },
        { status: 401 }
      );
    }

    // 连接数据库
    const { db } = await connectToDatabase();

    // 获取收到的申请列表
    const requests = await db
      .collection("contact_requests")
      .aggregate([
        {
          $match: {
            targetId: new ObjectId(session.user.id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "requesterId",
            foreignField: "_id",
            as: "requester",
          },
        },
        {
          $unwind: "$requester",
        },
        {
          $project: {
            _id: 0,
            id: { $toString: "$_id" },
            requesterId: {
              id: { $toString: "$requester._id" },
              nickname: "$requester.nickname",
              age: "$requester.age",
              gender: "$requester.gender",
              university: "$requester.university",
              location: "$requester.location",
              wechat: "$requester.wechat",
            },
            targetId: { $toString: "$targetId" },
            message: 1,
            response: 1,
            status: 1,
            createdAt: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray();

    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    console.error("获取收到的申请列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取申请列表失败" },
      { status: 500 }
    );
  }
} 