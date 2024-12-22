import { Types } from 'mongoose';

export type Gender = 'male' | 'female';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface UserBasicInfo {
  nickname: string;
  gender: Gender;
  age: number;
  city: string;
  mbti?: string;
  university: string;
  major?: string;
  grade: string;
  selfIntro: string;
  expectation: string;
  wechat: string;
}

export interface User extends UserBasicInfo {
  id: string;
  email: string;
  photos: string[];
  verificationAnswer: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUserInfo extends UserBasicInfo {
  id: string;
  photos: string[];
}

export interface RegisterFormData extends UserBasicInfo {
  email: string;
  password: string;
  confirmPassword: string;
  photos: File[];
  verificationAnswer: string;
  verificationCode: string;
}

// 数据库模型接口
export interface DbUser {
  _id: Types.ObjectId;
  nickname: string;
  gender: "male" | "female";
  age: number;
  city: string;
  mbti: string;
  university: string;
  major: string;
  grade: string;
  selfIntro: string;
  expectation: string;
  photos: string[];
  password?: string;
  verificationAnswer?: string;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  __v?: number; // Mongoose version key
}

// 前端使用的接口
export interface UserProfile {
  id: string;
  nickname: string;
  gender: "male" | "female";
  age: number;
  city: string;
  mbti: string;
  university: string;
  major: string;
  grade: string;
  selfIntro: string;
  expectation: string;
  photos: string[];
}

// 转换函数
export const transformDbUser = (dbUser: DbUser): UserProfile => ({
  id: dbUser._id.toString(),
  nickname: dbUser.nickname,
  gender: dbUser.gender,
  age: dbUser.age,
  city: dbUser.city,
  mbti: dbUser.mbti,
  university: dbUser.university,
  major: dbUser.major,
  grade: dbUser.grade,
  selfIntro: dbUser.selfIntro,
  expectation: dbUser.expectation,
  photos: dbUser.photos,
}); 