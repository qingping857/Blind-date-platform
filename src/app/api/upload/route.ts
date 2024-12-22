import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadPhotos } from "@/lib/upload";

// 配置最大文件大小 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    // 1. 验证用户登录状态
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

    // 2. 解析 FormData
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    // 3. 验证文件
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "请选择要上传的文件" },
        { status: 400 }
      );
    }

    // 4. 上传文件并获取URL
    const urls = await uploadPhotos(files);

    // 5. 返回文件 URL
    return NextResponse.json({ urls });

  } catch (error: any) {
    console.error("文件上传失败:", error);
    return NextResponse.json(
      { error: error.message || "文件上传失败" },
      { status: 500 }
    );
  }
} 