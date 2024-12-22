import mongoose from 'mongoose';
import { Location } from '@/types/shared';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  location: {
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  mbti: {
    type: String,
  },
  university: {
    type: String,
    required: true,
  },
  major: {
    type: String,
  },
  grade: {
    type: String,
    required: true,
  },
  selfIntro: {
    type: String,
    required: true,
  },
  expectation: {
    type: String,
    required: true,
  },
  wechat: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length >= 1 && v.length <= 3;
      },
      message: '照片数量必须在1-3张之间',
    },
  },
  verificationAnswer: {
    type: String,
    required: true,
  },
  verificationCode: String,
  verificationCodeExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 更新时自动更新updatedAt字段
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.models.User || mongoose.model('User', userSchema); 