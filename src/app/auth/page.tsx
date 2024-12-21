import { AuthTabs } from '@/components/auth/auth-tabs';

export default function AuthPage() {
  return (
    <main className="container min-h-screen py-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-bold">欢迎来到浪前人的相亲平台</h1>
        <p className="text-muted-foreground">请登录或注册以继续使用</p>
        <AuthTabs />
      </div>
    </main>
  );
} 