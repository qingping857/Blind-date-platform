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
    index: { expires: 0 } // 过期后自动删除文档
  }
}, {
  timestamps: true
});

// 添加索引以优化查询
verificationCodeSchema.index({ email: 1, code: 1 });

export const VerificationCode = mongoose.models.VerificationCode || mongoose.model('VerificationCode', verificationCodeSchema); 