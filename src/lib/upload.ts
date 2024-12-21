import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // 5MB

export async function uploadPhoto(file: File): Promise<string> {
  console.log('开始处理文件上传:', {
    name: file.name,
    type: file.type,
    size: file.size
  });

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    console.error('文件类型错误:', file.type);
    throw new Error('只能上传图片文件');
  }

  // 验证文件大小
  if (file.size > MAX_FILE_SIZE) {
    console.error('文件大小超出限制:', file.size);
    throw new Error('文件大小不能超过5MB');
  }

  try {
    // 确保上传目录存在
    const uploadDir = join(process.cwd(), UPLOAD_DIR);
    console.log('上传目录:', uploadDir);

    // 生成唯一文件名
    const ext = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = join(uploadDir, fileName);
    console.log('目标文件路径:', filePath);

    // 将文件写入服务器
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    console.log('文件写入成功');

    // 返回文件的相对路径
    const relativePath = `/uploads/${fileName}`;
    console.log('返回相对路径:', relativePath);
    return relativePath;
  } catch (error) {
    console.error('文件上传失败:', error);
    throw new Error('文件上传失败');
  }
} 