'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, VERIFICATION_ANSWERS } from '@/lib/validations/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { RegisterFormData } from '@/types/user';
import { toast } from '@/hooks/use-toast';

const GRADES = ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '博士'] as const;
const MBTI_TYPES = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'] as const;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
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
      console.log('开始注册流程');

      // 创建FormData对象
      const formData = new FormData();
      console.log('表单数据:', Object.entries(data).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: key === 'password' || key === 'confirmPassword' ? '***' : value
      }), {}));
      
      // 添加照片
      selectedPhotos.forEach(photo => {
        formData.append('photos', photo);
      });
      console.log('已添加照片数量:', selectedPhotos.length);
      
      // 添加其他字段
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'photos' && key !== 'confirmPassword') {
          formData.append(key, value.toString());
        }
      });

      console.log('发送注册请求...');
      // 发送注册请求
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      console.log('收到响应:', response.status, response.statusText);
      const responseText = await response.text();
      console.log('响应内容:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('JSON解析失败:', e);
        throw new Error('服务器响应格式错误');
      }

      if (!response.ok) {
        throw new Error(result.error || '注册失败');
      }

      toast({
        title: '注册成功',
        description: '请前往登录页面进行登录',
        duration: 5000,
      });

      // 清空表单
      form.reset();
      setSelectedPhotos([]);
      
      // 5秒后跳转到登录页面
      setTimeout(() => {
        router.push('/auth?tab=login');
      }, 5000);
    } catch (error: any) {
      console.error('注册失败:', error);
      toast({
        title: '注册失败',
        description: error.message || '发生未知错误，请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 发送验证码
  const handleSendCode = async () => {
    try {
      const email = form.getValues('email');
      if (!email) {
        toast({
          title: '发送失败',
          description: '请先输入邮箱地址',
          variant: 'destructive',
        });
        return;
      }

      setIsSendingCode(true);
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '发送验证码失败');
      }

      toast({
        title: '发送成功',
        description: '验证码已发送到您的邮箱',
      });

      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast({
        title: '发送失败',
        description: error.message || '发送验证码失败，请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>注册</CardTitle>
        <CardDescription>请填写以下信息完成注册</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* 邮箱和验证码 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <div className="flex gap-2">
                <Input
                  {...form.register('email')}
                  id="email"
                  type="email"
                  placeholder="请输入邮箱"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={isSendingCode || countdown > 0}
                >
                  {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
                </Button>
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="verificationCode">验证码</Label>
              <Input
                {...form.register('verificationCode')}
                id="verificationCode"
                placeholder="请输入验证码"
                maxLength={6}
              />
              {form.formState.errors.verificationCode && (
                <p className="text-sm text-red-500">{form.formState.errors.verificationCode.message}</p>
              )}
            </div>
          </div>

          {/* 昵称和密码 */}
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
          </div>

          {/* 确认密码 */}
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">性别</Label>
              <Select onValueChange={(value) => form.setValue('gender', value as 'male' | 'female')}>
                <SelectTrigger>
                  <SelectValue placeholder="��选择性别" />
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
            <div className="space-y-2">
              <Label htmlFor="age">年龄</Label>
              <Input
                {...form.register('age', { valueAsNumber: true })}
                id="age"
                type="number"
                min={18}
                max={100}
                placeholder="请输入年龄"
              />
              {form.formState.errors.age && (
                <p className="text-sm text-red-500">{form.formState.errors.age.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">城市</Label>
              <Input
                {...form.register('city')}
                id="city"
                placeholder="请输入城市"
              />
              {form.formState.errors.city && (
                <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university">学校</Label>
              <Input
                {...form.register('university')}
                id="university"
                placeholder="请输入学校"
              />
              {form.formState.errors.university && (
                <p className="text-sm text-red-500">{form.formState.errors.university.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">专业（选填）</Label>
              <Input
                {...form.register('major')}
                id="major"
                placeholder="请输入专业"
              />
              {form.formState.errors.major && (
                <p className="text-sm text-red-500">{form.formState.errors.major.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">年级</Label>
              <Select onValueChange={(value) => form.setValue('grade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择年级" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.grade && (
                <p className="text-sm text-red-500">{form.formState.errors.grade.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mbti">MBTI（选填）</Label>
            <Select onValueChange={(value) => form.setValue('mbti', value)}>
              <SelectTrigger>
                <SelectValue placeholder="请选择MBTI类型" />
              </SelectTrigger>
              <SelectContent>
                {MBTI_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="selfIntro">自我介绍</Label>
            <Textarea
              {...form.register('selfIntro')}
              id="selfIntro"
              placeholder="请输入自我介绍（100字以内）"
            />
            {form.formState.errors.selfIntro && (
              <p className="text-sm text-red-500">{form.formState.errors.selfIntro.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectation">对TA的期待</Label>
            <Textarea
              {...form.register('expectation')}
              id="expectation"
              placeholder="请描述对TA的期待（100字以内）"
            />
            {form.formState.errors.expectation && (
              <p className="text-sm text-red-500">{form.formState.errors.expectation.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wechat">微信号（保密）</Label>
            <Input
              {...form.register('wechat')}
              id="wechat"
              placeholder="其他用户向您申请后才能看到您的微信账号"
            />
            {form.formState.errors.wechat && (
              <p className="text-sm text-red-500">{form.formState.errors.wechat.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>照片上传（1-3张）</Label>
            <div className="flex flex-col gap-4">
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:border-primary cursor-pointer transition-colors"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                    <line x1="16" y1="5" x2="22" y2="5"/>
                    <line x1="19" y1="2" x2="19" y2="8"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                  <p className="text-sm text-muted-foreground">
                    {selectedPhotos.length === 0 
                      ? '点击或拖拽照片到这里上传' 
                      : '点击添加更多照片'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    支持 JPG, PNG 格式，每张不超过 5MB
                  </p>
                </div>
              </div>
              <Input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (selectedPhotos.length + files.length > 3) {
                    toast({
                      title: "上传失败",
                      description: "最多只能上传3张照片",
                      variant: "destructive",
                    });
                    return;
                  }
                  setSelectedPhotos(prev => [...prev, ...files]);
                  form.setValue('photos', [...selectedPhotos, ...files]);
                }}
              />
              {selectedPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {selectedPhotos.map((photo, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`预览图 ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const newPhotos = selectedPhotos.filter((_, i) => i !== index);
                          setSelectedPhotos(newPhotos);
                          form.setValue('photos', newPhotos);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18"/>
                          <path d="m6 6 12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {form.formState.errors.photos && (
              <p className="text-sm text-red-500">{form.formState.errors.photos.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="verificationAnswer">验证问题</Label>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                请输入开营仪式上的十句话中的任意一句：
              </p>
              <Textarea
                {...form.register('verificationAnswer')}
                id="verificationAnswer"
                placeholder="请准确输入完整的一句话"
              />
              {form.formState.errors.verificationAnswer && (
                <p className="text-sm text-red-500">{form.formState.errors.verificationAnswer.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '注册中...' : '注册'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 