import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ContactRequest } from "@/models/contact-request";
import { User } from "@/models/user";
import { ApiResponse } from "@/types/shared";
import mongoose from "mongoose";

// GET: 获取单个联系请求详情
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

    const request = await ContactRequest.findById(params.id)
      .populate("requesterId", "-password -verificationAnswer")
      .populate("targetId", "-password -verificationAnswer");

    if (!request) {
      return NextResponse.json(
        { success: false, error: "联系请求不存在" },
        { status: 404 }
      );
    }

    // 检查权限
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    if (
      request.requesterId.toString() !== user._id.toString() &&
      request.targetId.toString() !== user._id.toString()
    ) {
      return NextResponse.json(
        { success: false, error: "无权访问此请求" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: request });
  } catch (error: any) {
    console.error("获取联系请求失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取联系请求失败" },
      { status: 500 }
    );
  }
}

// POST: 创建联系请求
export async function POST(
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

    const { message } = await req.json();

    await connectDB();

    // 获取当前用户
    const requester = await User.findOne({ email: session.user.email });
    if (!requester) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    // 获取目标用户
    const target = await User.findById(params.id);
    if (!target) {
      return NextResponse.json(
        { success: false, error: "目标用户不存在" },
        { status: 404 }
      );
    }

    // 检查是否已经存在未处理的请求
    const existingRequest = await ContactRequest.findOne({
      requesterId: requester._id,
      targetId: target._id,
      status: "pending",
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: "已存在未处理的联系请求" },
        { status: 400 }
      );
    }

    // 创建新的联系请求
    const newRequest = await ContactRequest.create({
      requesterId: requester._id,
      targetId: target._id,
      message,
      status: "pending",
    });

    return NextResponse.json({ success: true, data: newRequest });
  } catch (error: any) {
    console.error("创建联系请求失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "创建联系请求失败" },
      { status: 500 }
    );
  }
}

// PUT: 更新联系请求状态
export async function PUT(
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

    const { status, response } = await req.json();

    await connectDB();

    // 获取当前用户
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    // 获取联系请求
    const request = await ContactRequest.findById(params.id)
      .populate("requesterId", "-password -verificationAnswer")
      .populate("targetId", "-password -verificationAnswer");

    if (!request) {
      return NextResponse.json(
        { success: false, error: "联系请求不存在" },
        { status: 404 }
      );
    }

    // 检查权限
    if (request.targetId._id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, error: "无权处理此请求" },
        { status: 403 }
      );
    }

    // 更新请求状态
    request.status = status;
    request.response = response;
    await request.save();

    return NextResponse.json({ success: true, data: request });
  } catch (error: any) {
    console.error("更新联系请求失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "更新联系请求失败" },
      { status: 500 }
    );
  }
} 