import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// 配置S3客户端（Sealos Cloud对象存储使用S3兼容协议）
const s3Client = new S3Client({
  region: process.env.SEALOS_CLOUD_REGION || "default",
  endpoint: process.env.SEALOS_CLOUD_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SEALOS_CLOUD_ACCESS_KEY || "",
    secretAccessKey: process.env.SEALOS_CLOUD_SECRET_KEY || ""
  },
  forcePathStyle: true
});

// 配置
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const BUCKET_NAME = process.env.SEALOS_CLOUD_BUCKET || '';

// 验证文件
export function validateFile(file: File) {
  // 验证文件类型
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('不支持的文件类型');
  }

  // 验证文件大小
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('文件大小不能超过5MB');
  }

  return true;
}

// 上传单个文件到对象存储
export async function uploadPhoto(file: File): Promise<string> {
  console.log('开始处理文件上传:', {
    name: file.name,
    type: file.type,
    size: file.size
  });

  try {
    // 验证文件
    validateFile(file);

    // 生成唯一文件名
    const ext = file.name.split('.').pop();
    const fileName = `photos/${uuidv4()}.${ext}`;

    // 将文件转换为Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 上传到对象存储
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);
    console.log('文件上传成功');

    // 返回文件URL
    const fileUrl = `${process.env.SEALOS_CLOUD_ENDPOINT}/${BUCKET_NAME}/${fileName}`;
    console.log('文件URL:', fileUrl);
    return fileUrl;

  } catch (error: any) {
    console.error('文件上传失败:', error);
    throw new Error(error.message || '文件上传失败');
  }
}

// 批量上传文件到对象存储
export async function uploadPhotos(files: File[]): Promise<string[]> {
  return Promise.all(files.map(file => uploadPhoto(file)));
}

// 从对象存储删除文件
export async function deletePhoto(url: string): Promise<void> {
  try {
    // 从URL中提取文件名
    const urlObj = new URL(url);
    const key = urlObj.pathname.split('/').slice(2).join('/'); // 移除开头的 /bucket-name/

    if (!key) {
      throw new Error('无效的文件URL');
    }

    // 从对象存储删除文件
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    console.log('文件删除成功:', key);
  } catch (error: any) {
    console.error('文件删除失败:', error);
    throw new Error(error.message || '文件删除失败');
  }
} 