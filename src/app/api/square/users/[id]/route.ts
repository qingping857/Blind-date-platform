import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users");

    const user = await collection.findOne({
      _id: new ObjectId(params.id)
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { message } = await request.json();
    const db = await connectToDatabase();
    const collection = db.collection("contactRequests");

    // 创建联系方式申请记录
    await collection.insertOne({
      userId: new ObjectId(params.id),
      requesterId: new ObjectId("current-user-id"), // TODO: 替换为实际的当前用户ID
      message,
      status: "pending",
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact request:", error);
    return NextResponse.json(
      { error: "Failed to send contact request" },
      { status: 500 }
    );
  }
} 