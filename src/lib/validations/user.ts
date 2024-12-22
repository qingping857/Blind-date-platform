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

// 验证城市选择是否有效
const validateCity = (province: string, city: string) => {
  // 如果省份或城市为空，返回 false
  if (!province || !city) {
    return false;
  }

  // 如果是初始值，返回 false
  if (province === "all" || city === "all") {
    return false;
  }

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

// 验证答案处理函数
const normalizeAnswer = (answer: string) => {
  return answer
    .trim() // 去除首尾空格
    .replace(/\s+/g, '') // 去除所有空格
    .replace(/[，,。.、]/g, '') // 去除常见标点符号
    .toLowerCase(); // 转换为小写
};

// 预处理验证答案列表
const normalizedAnswers = VERIFICATION_ANSWERS.map(normalizeAnswer);

// 基础注册表单验证
export const registerSchema = z.object({
  email: z.string()
    .min(1, "请输入邮箱")
    .email("邮箱格式不正确"),
  password: z.string()
    .min(6, "密码至少6位")
    .max(20, "密码最多20位"),
  confirmPassword: z.string()
    .min(1, "请确认密码"),
  verificationCode: z.string()
    .min(1, "请输入验证码")
    .length(6, "验证码为6位数字"),
  verificationAnswer: z.string()
    .min(1, "请输入验证答案")
    .refine(
      (value) => normalizedAnswers.includes(normalizeAnswer(value)),
      {
        message: "请输入开营仪式上的十句话中的任意一句，需要完全匹配"
      }
    ),
  nickname: z.string()
    .min(2, "昵称至少2个字符")
    .max(20, "昵称最多20个字符"),
  gender: z.enum(["male", "female"], {
    required_error: "请选择性别",
    invalid_type_error: "性别选择无效",
  }),
  age: z.number({
    required_error: "请输入年龄",
    invalid_type_error: "年龄必须是数字",
  })
    .min(18, "年龄必须大于等于18岁")
    .max(100, "年龄必须小于等于100岁"),
  province: z.string()
    .min(1, "请选择省份"),
  city: z.string()
    .min(1, "请选择城市"),
  mbti: z.string().optional(),
  university: z.string()
    .min(1, "请输入学校"),
  major: z.string().optional(),
  grade: z.string()
    .min(1, "请选择年级"),
  selfIntro: z.string()
    .min(1, "请输入自我介绍")
    .max(100, "自我介绍最多100字"),
  expectation: z.string()
    .min(1, "请输入期待")
    .max(100, "期待最多100字"),
  wechat: z.string()
    .min(1, "请输入微信号"),
  photos: z.array(z.any())
    .min(1, "请上传至少1张照片")
    .max(3, "最多上传3张照片"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
}).refine((data) => validateCity(data.province, data.city), {
  message: "请选择有效的城市",
  path: ["city"],
});

// 用户资料验证（不包含密码和验证相关字段）
export const userProfileSchema = z.object({
  nickname: z.string()
    .min(2, "昵称至少2个字符")
    .max(20, "昵称最多20个字符"),
  gender: z.enum(["male", "female"]),
  age: z.number()
    .min(18, "年龄必须大于等于18岁")
    .max(100, "年龄必须小于等于100岁"),
  province: z.string(),
  city: z.string(),
  mbti: z.string().optional(),
  university: z.string()
    .min(1, "请输入学校"),
  major: z.string().optional(),
  grade: z.string()
    .min(1, "请选择年级"),
  selfIntro: z.string()
    .min(1, "请输入自我介绍")
    .max(100, "自我介绍最多100字"),
  expectation: z.string()
    .min(1, "请输入期待")
    .max(100, "期待最多100字"),
  wechat: z.string()
    .min(1, "请输入微信号"),
  photos: z.array(z.any())
    .min(1, "请上传至少1张照片")
    .max(3, "最多上传3张照片"),
}).refine((data) => data.province !== "all", {
  message: "请选择省份",
  path: ["province"],
}).refine((data) => data.city !== "all", {
  message: "请选择城市",
  path: ["city"],
}).refine((data) => validateCity(data.province, data.city), {
  message: "请选择有效的城市",
  path: ["city"],
});
  