import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { RegisterFormData } from '@/types/user';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      gender: 'male',
      age: 18,
      city: '',
      university: '',
      grade: '',
      selfIntro: '',
      expectation: '',
      wechat: '',
      photos: [],
      verificationAnswer: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      // TODO: 实现注册逻辑
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-full max-w-3xl">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">登录</TabsTrigger>
        <TabsTrigger value="register">注册</TabsTrigger>
      </TabsList>
      
      {/* 登录表单 */}
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>登录</CardTitle>
            <CardDescription>请输入您的邮箱和密码登录系统</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">邮箱</Label>
              <Input id="login-email" type="email" placeholder="请输入邮箱" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">密码</Label>
              <Input id="login-password" type="password" placeholder="请输入密码" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">登录</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* 注册表单 */}
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>注册</CardTitle>
            <CardDescription>请填写以下信息完成注册</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* 基本信息 */}
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  {...form.register('email')}
                  id="email"
                  type="email"
                  placeholder="请输入邮箱"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    {...form.register('password')}
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认密码</Label>
                  <Input
                    {...form.register('confirmPassword')}
                    id="confirmPassword"
                    type="password"
                    placeholder="请再次输入密码"
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">昵称</Label>
                  <Input
                    {...form.register('nickname')}
                    id="nickname"
                    placeholder="请输入昵称"
                  />
                  {form.formState.errors.nickname && (
                    <p className="text-sm text-red-500">{form.formState.errors.nickname.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">性别</Label>
                  <Select onValueChange={(value) => form.setValue('gender', value as 'male' | 'female')}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择性别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男</SelectItem>
                      <SelectItem value="female">女</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.gender && (
                    <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                  )}
                </div>
              </div>

              {/* 其他字段... */}
              {/* TODO: 添加其他注册字段的输入框 */}

              <div className="space-y-2">
                <Label>照片上传（1-3张）</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setSelectedPhotos(files);
                    form.setValue('photos', files);
                  }}
                />
                {form.formState.errors.photos && (
                  <p className="text-sm text-red-500">{form.formState.errors.photos.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationAnswer">验证问题</Label>
                <Select onValueChange={(value) => form.setValue('verificationAnswer', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="请从开营仪式上的十句话中选择一句" />
                  </SelectTrigger>
                  <SelectContent>
                    {VERIFICATION_ANSWERS.map((answer) => (
                      <SelectItem key={answer} value={answer}>
                        {answer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.verificationAnswer && (
                  <p className="text-sm text-red-500">{form.formState.errors.verificationAnswer.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '注册中...' : '注册'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 