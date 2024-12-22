import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiResponse, UserBasicInfo } from "@/types/shared";
import { userProfileSchema } from "@/lib/validations/user";

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

    const user = await User.findById(session.user.id).select("-password -verificationAnswer");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    const response: ApiResponse<UserBasicInfo> = {
      success: true,
      data: {
        nickname: user.nickname,
        gender: user.gender,
        age: user.age,
        province: user.province,
        city: user.city,
        mbti: user.mbti,
        university: user.university,
        major: user.major,
        grade: user.grade,
        selfIntro: user.selfIntro,
        expectation: user.expectation,
        wechat: user.wechat,
        photos: user.photos
      }
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("获取个人资料失败:", error);
    return NextResponse.json(
      { success: false, error: "获取个人资料失败" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "未登录" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = userProfileSchema.parse(body);

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    // 更新用户资料
    Object.assign(user, validatedData);
    await user.save();

    const response: ApiResponse<UserBasicInfo> = {
      success: true,
      data: {
        nickname: user.nickname,
        gender: user.gender,
        age: user.age,
        province: user.province,
        city: user.city,
        mbti: user.mbti,
        university: user.university,
        major: user.major,
        grade: user.grade,
        selfIntro: user.selfIntro,
        expectation: user.expectation,
        wechat: user.wechat,
        photos: user.photos
      }
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("更新个人资料失败:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "输入数据验证失败", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "更新个人资料失败" },
      { status: 500 }
    );
  }
} 