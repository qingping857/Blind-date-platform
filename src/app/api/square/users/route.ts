import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiResponse, UserListResponse } from "@/types/shared";

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

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const gender = searchParams.get("gender") || "all";
    const province = searchParams.get("province") || "all";
    const city = searchParams.get("city") || "all";
    const mbti = searchParams.get("mbti") || "all";
    const grade = searchParams.get("grade") || "all";
    const minAge = parseInt(searchParams.get("minAge") || "18");
    const maxAge = parseInt(searchParams.get("maxAge") || "100");
    const query = searchParams.get("query") || "";
    const searchType = searchParams.get("searchType") || "selfIntro";

    // 构建查询条件
    const filter: any = {
      _id: { $ne: session.user.id } // 排除当前用户
    };

    if (gender !== "all") {
      filter.gender = gender;
    }

    if (province !== "all") {
      filter.province = province;
    }

    if (city !== "all") {
      filter.city = city;
    }

    if (mbti !== "all") {
      filter.mbti = mbti;
    }

    if (grade !== "all") {
      filter.grade = grade;
    }

    if (minAge > 18 || maxAge < 100) {
      filter.age = {
        $gte: minAge,
        $lte: maxAge
      };
    }

    if (query) {
      filter[searchType] = { $regex: query, $options: "i" };
    }

    // 计算总数
    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / pageSize);

    // 获取用户列表
    const users = await User.find(filter)
      .select("-password -verificationAnswer")
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const response: ApiResponse<UserListResponse> = {
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id.toString(),
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
          wechat: "", // 隐藏微信号
          photos: user.photos
        })),
        pagination: {
          total,
          page,
          pageSize,
          totalPages
        }
      }
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("获取用户列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取用户列表失败" },
      { status: 500 }
    );
  }
} 