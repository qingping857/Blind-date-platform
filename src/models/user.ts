import mongoose from 'mongoose';
import { IUser } from '@/types/user';

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true },
  gender: { type: String, required: true, enum: ['male', 'female'] },
  age: { type: Number, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  mbti: { type: String },
  university: { type: String, required: true },
  major: { type: String },
  grade: { type: String, required: true },
  selfIntro: { type: String, required: true },
  expectation: { type: String, required: true },
  wechat: { type: String, required: true },
  photos: { type: [String], required: true },
  verificationAnswer: { type: String, required: true }
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 