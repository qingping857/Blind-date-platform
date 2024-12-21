import mongoose from 'mongoose';
import { type } from 'os';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 20,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  mbti: {
    type: String,
    trim: true,
  },
  university: {
    type: String,
    required: true,
    trim: true,
  },
  major: {
    type: String,
    trim: true,
  },
  grade: {
    type: String,
    required: true,
    trim: true,
  },
  selfIntro: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 100,
  },
  expectation: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 100,
  },
  wechat: {
    type: String,
    required: true,
    trim: true,
  },
  photos: [{
    type: String,
    required: true,
  }],
  verificationAnswer: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// 添加索引
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// 在返回用户数据时去除密码
userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema); 