import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

/**
 * 连接数据库
 * @returns mongoose connection
 */
export async function connectDB() {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI);
    
    if (connection.readyState === 1) {
      console.log('数据库连接成功');
      return connection;
    }
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}

// 导出 mongoose 实例以供其他模块使用
export { mongoose }; 