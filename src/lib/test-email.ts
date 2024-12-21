import nodemailer from 'nodemailer';
import 'dotenv/config';

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_SERVER_USER, // 发送给自己测试
      subject: '邮件发送测试',
      text: '如果您收到这封邮件，说明邮件发送功能配置正确。',
      html: '<b>如果您收到这封邮件，说明邮件发送功能配置正确。</b>',
    });

    console.log('邮件发送成功!');
    console.log('邮件ID:', info.messageId);
    process.exit(0);
  } catch (error) {
    console.error('邮件发送失败:', error);
    process.exit(1);
  }
}

testEmail(); 