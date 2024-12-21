import connectDB from './db';

async function testConnection() {
  try {
    const conn = await connectDB();
    console.log('数据库连接成功!');
    console.log('数据库版本:', await conn.connection.db.command({ buildInfo: 1 }));
    process.exit(0);
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
}

testConnection(); 