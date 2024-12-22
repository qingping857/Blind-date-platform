import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// 配置允许的文件类型
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp"
];

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
    for (const file of files) {
      // 检查文件类型
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "不支持的文件类型" },
          { status: 400 }
        );
      }

      // 检查文件大小
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "文件大小超过限制" },
          { status: 400 }
        );
      }
    }

    // 4. 保存文件并生成 URL
    const urls = await Promise.all(
      files.map(async (file) => {
        // 生成唯一文件名
        const ext = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${ext}`;
        
        // 确保上传目录存在
        const uploadDir = join(process.cwd(), "public", "uploads");
        await ensureDir(uploadDir);
        
        // 保存文件
        const filePath = join(uploadDir, fileName);
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        // 返回文件的访问 URL
        return `/uploads/${fileName}`;
      })
    );

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

// 确保目录存在的辅助函数
async function ensureDir(dir: string) {
  try {
    await import("fs/promises").then(fs => fs.mkdir(dir, { recursive: true }));
  } catch (error) {
    if ((error as any).code !== "EEXIST") {
      throw error;
    }
  }
} 