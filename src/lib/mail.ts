import nodemailer from 'nodemailer';

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// 生成6位数字验证码
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 发送验证码邮件
export async function sendVerificationCode(email: string, code: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '验证码 - 浪前人相亲平台',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #333; text-align: center;">欢迎注册浪前人相亲平台</h1>
        <p style="color: #666;">亲爱的用户：</p>
        <p style="color: #666;">您的验证码是：</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f5f5f5; padding: 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
            ${code}
          </div>
        </div>
        <p style="color: #666;">验证码10分钟内有效，请尽快完成验证。</p>
        <p style="color: #666;">如果这不是您的操作，请忽略此邮件。</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
          <small>此邮件由系统自动发送，请勿回复</small>
        </div>
      </div>
    `,
  });
} 