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

    // 获取发出的申请列表
    const requests = await db
      .collection("contact_requests")
      .aggregate([
        {
          $match: {
            requesterId: new ObjectId(session.user.id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "targetId",
            foreignField: "_id",
            as: "target",
          },
        },
        {
          $unwind: "$target",
        },
        {
          $project: {
            _id: 0,
            id: { $toString: "$_id" },
            requesterId: {
              id: { $toString: "$target._id" },
              nickname: "$target.nickname",
              age: "$target.age",
              gender: "$target.gender",
              university: "$target.university",
              location: "$target.location",
              wechat: {
                $cond: {
                  if: { $eq: ["$status", "approved"] },
                  then: "$target.wechat",
                  else: null,
                },
              },
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
    console.error("获取发出的申请列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取申请列表失败" },
      { status: 500 }
    );
  }
} 