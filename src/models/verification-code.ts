import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  code: { 
    type: String, 
    required: true 
  },
  expires: { 
    type: Date, 
    required: true,
    index: { expires: '10m' } // 设置10分钟后过期
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    required: true 
  }
});

// 添加复合索引
verificationCodeSchema.index({ email: 1, code: 1 });

// 确保索引存在
verificationCodeSchema.pre('save', async function() {
  if (this.isNew) {
    this.createdAt = new Date();
    this.expires = new Date(Date.now() + 10 * 60 * 1000);
  }
});

export const VerificationCode = mongoose.models.VerificationCode || 
  mongoose.model('VerificationCode', verificationCodeSchema); 