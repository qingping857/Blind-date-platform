import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProfileSchema } from "@/lib/validations/user";
import { z } from "zod";
import { ApiResponse } from "@/types/api";

// 获取用户资料
export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({
        error: "请先登录",
        status: 401
      } as ApiResponse<never>);
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        nickname: true,
        age: true,
        gender: true,
        city: true,
        mbti: true,
        university: true,
        major: true,
        grade: true,
        selfIntro: true,
        expectation: true,
        wechat: true,
        photos: true,
      },
    }).catch((error) => {
      console.error("[DB_ERROR]", error);
      throw new Error("数据库查询失败");
    });

    if (!user) {
      return NextResponse.json({
        error: "未找到用户资料",
        status: 404
      } as ApiResponse<never>);
    }

    return NextResponse.json({
      data: user,
      status: 200
    });
  } catch (error) {
    console.error("[USER_PROFILE_GET]", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "获取资料失败",
      status: 500
    } as ApiResponse<never>);
  }
}

// 更新用户资料
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({
        error: "请先登录",
        status: 401
      } as ApiResponse<never>);
    }

    const body = await req.json();
    
    try {
      const validatedData = userProfileSchema.parse(body);
      
      const updatedUser = await db.user.update({
        where: {
          id: session.user.id,
        },
        data: validatedData,
      }).catch((error) => {
        console.error("[DB_ERROR]", error);
        throw new Error("数据库更新失败");
      });

      return NextResponse.json({
        data: updatedUser,
        status: 200
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({
          error: "提交的资料格式不正确",
          details: error.errors,
          status: 422
        } as ApiResponse<never>);
      }
      throw error;
    }
  } catch (error) {
    console.error("[USER_PROFILE_UPDATE]", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "更新资料失败",
      status: 500
    } as ApiResponse<never>);
  }
} 