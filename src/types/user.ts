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
} 