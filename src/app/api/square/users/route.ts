import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { UserListItem, ApiResponse, UserListResponse } from "@/types/shared";

export async function GET(req: Request) {
  try {
    // 1. 获取当前会话
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 }
      );
    }

    // 2. 获取查询参数
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const searchType = searchParams.get("searchType") || "selfIntro";
    const minAge = parseInt(searchParams.get("minAge") || "18");
    const maxAge = parseInt(searchParams.get("maxAge") || "100");
    const gender = searchParams.get("gender") || "all";
    const province = searchParams.get("province") || "all";
    const city = searchParams.get("city") || "all";
    const mbti = searchParams.get("mbti") || "all";
    const grade = searchParams.get("grade") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    // 3. 构建查询条件
    const filter: any = {
      email: { $ne: session.user.email }, // 排除当前用户
      age: { $gte: minAge, $lte: maxAge },
    };

    // 添��性别筛选
    if (gender !== "all") {
      filter.gender = gender;
    }

    // 添加地区筛选
    if (province !== "all") {
      filter["location.province"] = province;
      if (city !== "all") {
        filter["location.city"] = city;
      }
    }

    // 添加MBTI筛选
    if (mbti !== "all") {
      filter.mbti = mbti;
    }

    // 添加年级筛选
    if (grade !== "all") {
      filter.grade = grade;
    }

    // 添加搜索条件
    if (query) {
      filter[searchType] = { $regex: query, $options: "i" };
    }

    // 4. 连接数据库
    await connectDB();

    // 5. 查询用户列表
    const skip = (page - 1) * pageSize;
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -verificationAnswer")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(pageSize),
      User.countDocuments(filter),
    ]);

    // 6. 转换用户数据
    const userList: UserListItem[] = users.map(user => ({
      id: user._id.toString(),
      nickname: user.nickname,
      age: user.age,
      gender: user.gender,
      location: user.location || { province: "all", city: "all" },
      mbti: user.mbti,
      university: user.university,
      major: user.major,
      grade: user.grade,
      selfIntro: user.selfIntro,
      expectation: user.expectation,
      wechat: user.wechat,
      photos: user.photos,
    }));

    // 7. 返回用户列表和分页信息
    const response: ApiResponse<UserListResponse> = {
      success: true,
      data: {
        users: userList,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    };

    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error("获取用户列表失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取用户列表失败" },
      { status: 500 }
    );
  }
} 