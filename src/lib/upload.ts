import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // 5MB

export async function uploadPhoto(file: File): Promise<string> {
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    throw new Error('只能上传图片文件');
  }

  // 验证文件大小
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('文件大小不能超过5MB');
  }

  // 生成唯一文件名
  const ext = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${ext}`;
  const filePath = join(process.cwd(), UPLOAD_DIR, fileName);

  try {
    // 将文件写入服务器
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // 返回文件的相对路径
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('文件上传失败:', error);
    throw new Error('文件上传失败');
  }
} 