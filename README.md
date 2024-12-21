# 信息匹配平台

这是一个私域信息匹配平台，用户需要通过注册和审核才能使用完整功能。

## 技术栈

- 前端：React 19 + Next.js + Tailwind CSS + shadcn/ui
- 后端：Next.js API Routes
- 数据库：MongoDB
- 表单验证：Zod
- 认证：NextAuth.js

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── auth/              # 认证相关页面
│   ├── contact/           # 联系页面
│   ├── profile/           # 个人资料页面
│   └── square/            # 广场页面
├── components/            # React 组件
│   ├── auth/             # 认证相关组件
│   ├── layout/           # 布局组件
│   └── ui/               # UI 组件
├── lib/                   # 工具函数
├── models/               # MongoDB 模型
└── types/                # TypeScript 类型定义
```

## 主要功能

1. 用户认证
   - 邮箱注册
   - 登录系统
   - 用户审核流程

2. 用户资料
   - 基本信息管理
   - 照片上传
   - 资料修改

3. 信息匹配
   - 用户信息展示
   - 高级筛选
   - 搜索功能

4. 联系功能
   - 申请查看联系方式
   - 申请处理
   - 微信号展示

## 开发进度

- [ ] 用户认证系统
- [ ] 个人资料管理
- [ ] 广场页面
- [ ] 联系功能
- [ ] 搜索和筛选

## 项目配置

项目配置和环境变量将在开发过程中逐步完善。
