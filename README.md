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
│   │   ├── auth/         # 认证相关API
│   │   ├── user/         # 用户相关API
│   │   └── upload/       # 文件上传API
│   ├── auth/              # 认证相关页面
│   ├── contact/           # 联系页面
│   ├── profile/           # 个人资料页面
│   ├── square/            # 广场页面（新增）
│   ├── favicon.ico        # 网站图标
│   ├── globals.css        # 全局样式
│   └── layout.tsx         # 根布局组件
│
├── components/            # React 组件
│   ├── auth/             # 认证相关组件
│   │   ├── auth-form.tsx     # 认证表单基础组件
│   │   ├── auth-tabs.tsx     # 认证页面标签切换
│   │   ├── login-form.tsx    # 登录表单
│   │   └── register-form.tsx # 注册表单
│   │
│   ├── layout/           # 布局组件
│   │   ├── main-layout.tsx   # 主布局组件
│   │   ├── root-layout.tsx   # 根布局组件
│   │   └── sidebar.tsx       # 侧边栏组件
│   │
│   ├── providers/        # 全局状态提供者
│   │   ├── session-provider.tsx # 会话状态提供者
│   │   └── toaster-provider.tsx # 提示消息提供者
│   │
│   ├── user/             # 用户相关组件
│   │   ├── user-card.tsx     # 用户卡片组件
│   │   └── user-filter.tsx   # 用户筛选组件
│   │
│   └── ui/              # UI基础组件（shadcn/ui）
│       ├── avatar.tsx       # 头像组件
│       ├── badge.tsx        # 徽章组件
│       ├── button.tsx       # 按钮组件
│       ├── card.tsx         # 卡片组件
│       ├── dialog.tsx       # 对话框组件
│       ├── form.tsx         # 表单组件
│       ├── input.tsx        # 输入框组件
│       ├── label.tsx        # 标签组件
│       ├── select.tsx       # 选择框组件
│       ���── skeleton.tsx     # 骨架屏组件
│       ├── tabs.tsx         # 标签页组件
│       ├── textarea.tsx     # 文本域组件
│       ├── toast.tsx        # 提示消息组件
│       └── toaster.tsx      # 提示消息容器
│
├── hooks/                # 自定义Hooks
│   ├── use-profile.ts    # 用户资料相关hook
│   └── use-toast.ts      # 提示消息相关hook
│
├── lib/                 # 工具函数库
│   ├── services/        # 服务层
│   ├── validations/     # 验证规则
│   │   └── user.ts      # 用户相关验证
│   ├── api-error.ts     # API错误处理
│   ├── auth.ts          # 认证相关工具
│   ├── db.ts            # 数据库连接
│   ├── errors.ts        # 错误处理工具
│   ├── mail.ts          # 邮件发送工具
│   ├── test-db.ts       # 数据库测试
│   ├── test-email.ts    # 邮件测试
│   ├── upload.ts        # 文件上传工具
│   └── utils.ts         # 通用工具函数
│
├── models/              # 数据模型
│   ├── user.ts          # 用户模型
│   └── verification-code.ts # 验证码模型
│
├── types/               # 类型定义
│   ├── api.ts           # API相关类型
│   ├── global.d.ts      # 全局类型声明
│   ├── next-auth.d.ts   # NextAuth类型扩展
│   └── user.ts          # 用户相关类型
│
└── middleware.ts        # Next.js中间件

其他配置文件：
├── .env                # 环境变量
├── .gitignore         # Git忽略配置
├── components.json    # shadcn/ui组件配置
├── next.config.js    # Next.js配置
├── package.json      # 项目依赖配置
├── postcss.config.js # PostCSS配置
├── tailwind.config.ts # Tailwind配置
└── tsconfig.json     # TypeScript配置
```

## 主要功能

1. 用户认证
   - 邮箱注册
   - 登录系统
   - 用户审核流程
   - 邮件验证

2. 用户资料
   - 基本信息管理
   - 照片上传（最多3张，每张限制5MB）
   - 资料修改
   - 个人主页

3. 信息匹配
   - 用户信息展示
   - 高级筛选
   - 搜索功能
   - 用户卡片展示

4. 联系功能
   - 申请查看联系方式
   - 申请处理
   - 微信号展示

## 开发进度

### 已完成
- [x] 项目基础架构搭建
- [x] UI组件库集成（shadcn/ui）
- [x] 用户认证系统
  - [x] 登录功能
  - [x] 注册功能
  - [x] 邮箱验证
- [x] 数据库集成
  - [x] 用户模型
  - [x] 验证码模型
- [x] 邮件系统集成
  - [x] 验证码发送
  - [x] 邮件模板
- [x] 表单验证（使用Zod）
- [x] 错误处理系统
- [x] 全局状态管理
- [x] 布局系统

### 进行中
- [ ] 文件上传功能
  - [x] 上传接口
  - [ ] 前端集成
- [ ] 个人资料管理
  - [x] 基础信息表单
  - [ ] 照片管理

### 待开发
- [ ] 广场页面
  - [ ] 用户列表API
  - [ ] 用户详情API
  - [ ] 筛选功能
  - [ ] 搜索功能
- [ ] 联系功能
  - [ ] 申请系统
  - [ ] 消息通知
- [ ] 搜索系统
  - [ ] 高级筛选
  - [ ] 智能推荐

## 开发指南

1. 环境要求
   - Node.js 18+
   - MongoDB
   - 邮件服务器（用于发送验证码）

2. 环境变量配置
   项目根目录下创建 `.env` 文件，包含以下配置：
   ```env
   # 数据库配置
   MONGODB_URI=

   # NextAuth配置
   NEXTAUTH_URL=
   NEXTAUTH_SECRET=

   # 邮件服务配置
   SMTP_HOST=
   SMTP_PORT=
   SMTP_USER=
   SMTP_PASS=
   ```

3. 开发命令
   ```bash
   # 安装依赖
   npm install

   # 开发环境运行
   npm run dev

   # 构建
   npm run build

   # 生产环境运行
   npm start
   ```
