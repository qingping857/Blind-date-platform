import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

// 数据库连接状态
let isConnected = false;

/**
 * 连接数据库
 */
export const connectDB = async () => {
  // 如果已经连接，直接返回
  if (isConnected) {
    return;
  }

  try {
    // 设置严格模式
    mongoose.set('strictQuery', true);

    // 连接数据库
    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });

    isConnected = true;
    console.log('数据库连接成功');
    return db;
  } catch (error) {
    isConnected = false;
    console.error('数据库连接失败:', error);
    throw error;
  }
};

// 导出 mongoose 实例
export default mongoose; 