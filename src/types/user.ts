import { Types } from 'mongoose';
import { UserBasicInfo } from "./shared";

export type Gender = 'male' | 'female';

// 数据库模型接口
export interface IUser extends UserBasicInfo {
  email: string;
  password: string;
  verificationAnswer: string;
  createdAt: Date;
  updatedAt: Date;
}

// 注册请求体
export interface RegisterBody extends UserBasicInfo {
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
  verificationAnswer: string;
}

// 登录请求体
export interface LoginBody {
  email: string;
  password: string;
}

// 注册表单数据
export interface RegisterFormData extends UserBasicInfo {
  email: string;
  password: string;
  confirmPassword: string;
  photos: File[];
  verificationAnswer: string;
  verificationCode: string;
}
  