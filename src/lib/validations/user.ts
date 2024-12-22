import { z } from 'zod';
import { locationData } from '@/components/shared/city-select';

export const VERIFICATION_ANSWERS = [
  "真正重要的东西，往往需要重复重复再重复，才能够被人消化吸收再利用",
  "很多时候，做完比做好重要的多",
  "一旦不合理是设计出来的，它背后一定有你尚未发现的合理之处",
  "很多事情只是看起来困难，真正上手了也就那样",
  "实践既是学习的终极目的，也是学习的终极手段",
  "主动，真的会有故事",
  "一个人可以走的很快，一群人可以走的更远",
  "少说两句，去做",
  "利他就是利己",
  "越参与，越收获"
] as const;

// 验证城市是否有效
const isValidCity = (province: string, city: string) => {
  if (!province || province === 'all' || !city || city === 'all') return false;

  // 检查直辖市
  if (locationData.municipalities.some(m => m.value === province)) {
    return province === city;
  }

  // 检查特别行政区
  if (locationData.specialRegions.some(r => r.value === province)) {
    return province === city;
  }

  // 检查普通省份
  const provinceData = locationData.provinces[province as keyof typeof locationData.provinces];
  if (!provinceData) return false;

  return provinceData.cities.some(c => c.value === city);
};

// 基础注册schema（不包含密码确认）
export const baseRegisterSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  verificationCode: z.string().length(6, '验证码必须是6位数字'),
  password: z.string().min(6, '密码至少6个字符'),
  nickname: z.string().min(2, '昵称至少2个字符').max(20, '昵称最多20个字符'),
  gender: z.enum(['male', 'female'], { required_error: '请选择性别' }),
  age: z.number().min(18, '年龄必须大于18岁').max(100, '年龄必须小于100岁'),
  province: z.string().min(1, '请选择省份'),
  city: z.string().min(1, '请选择城市'),
  mbti: z.string().optional(),
  university: z.string().min(2, '请输入有效的学校名称'),
  major: z.string().optional(),
  grade: z.string().min(1, '请选择年级'),
  selfIntro: z.string().min(10, '自我介绍至少10个字符').max(100, '自我介绍最多100个字符'),
  expectation: z.string().min(10, '期待描述至少10个字符').max(100, '期待描述最多100个字符'),
  wechat: z.string().min(6, '请输入有效的微信号'),
  photos: z.array(z.any()).min(1, '请至少上���1张照片').max(3, '最多上传3张照片'),
  verificationAnswer: z.string()
    .refine(
      (value) => VERIFICATION_ANSWERS.includes(value as typeof VERIFICATION_ANSWERS[number]),
      {
        message: '请输入开营仪式上的十句话中的任意一句，需要完全匹配'
      }
    ),
}).refine(
  (data) => isValidCity(data.province, data.city),
  {
    message: '请选择有效的城市',
    path: ['city']
  }
);

// 前端使用的完整注册schema（包含密码确认）
export const registerSchema = z.object({
  ...baseRegisterSchema.shape,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

// 后端使用的注册验证schema（使用基础schema）
export const registerValidationSchema = baseRegisterSchema;

// 用户资料schema
export const userProfileSchema = z.object({
  nickname: z.string().min(2, "昵称至少2个字符").max(20, "昵称最多20个字符"),
  age: z.number().min(18, "年龄必须大于等于18岁").max(100, "年龄必须小于等于100岁"),
  gender: z.enum(["male", "female"], {
    required_error: "请选择性别",
  }),
  province: z.string().min(1, "请选择省份"),
  city: z.string().min(1, "请选择城市"),
  mbti: z.string().optional(),
  university: z.string().min(2, "学校名称至少2个字符").max(50, "学校名称最多50个字符"),
  major: z.string().optional(),
  grade: z.string().min(1, "请选择年级"),
  selfIntro: z.string().min(10, "自我介绍至少10个字符").max(500, "自我介绍最多500个字符"),
  expectation: z.string().min(10, "期待至少10个字符").max(500, "期待最多500个字符"),
  wechat: z.string().min(1, "请输入微信号"),
  photos: z.array(z.string()).min(1, "至少上传1张照片").max(3, "最多上传3张照片"),
}).refine(
  (data) => isValidCity(data.province, data.city),
  {
    message: '请选择有效的城市',
    path: ['city']
  }
);
  