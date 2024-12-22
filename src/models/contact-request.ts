import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema({
  // 申请者ID
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // 目标用户ID
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // 申请说明
  message: {
    type: String,
    required: true,
  },
  // 申请状态：pending-待处理，approved-已通过，rejected-已拒绝
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  // 处理说明
  response: {
    type: String,
  },
  // 处理时间
  respondedAt: {
    type: Date,
  },
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
contactRequestSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

// 添加索引
contactRequestSchema.index({ requesterId: 1, targetId: 1 });
contactRequestSchema.index({ status: 1 });
contactRequestSchema.index({ createdAt: -1 });

export const ContactRequest = mongoose.models.ContactRequest || mongoose.model("ContactRequest", contactRequestSchema); 