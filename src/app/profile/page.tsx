"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/use-profile";
import { userProfileSchema } from "@/lib/validations/user";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "next-auth/react";
import { ProfileImageUpload } from "@/components/user/profile-image-upload";
import { useToast } from "@/hooks/use-toast";
import { CitySelect } from "@/components/shared/city-select";
import { UserBasicInfo } from "@/types/shared";

type FormData = z.infer<typeof userProfileSchema>;

const GRADES = ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '博士'] as const;
const MBTI_TYPES = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
] as const;

export default function ProfilePage() {
  const { isLoading, profile, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [province, setProvince] = useState("all");
  const [city, setCity] = useState("all");
  
  const form = useForm<FormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      nickname: "",
      age: 18,
      gender: "male",
      province: "all",
      city: "all",
      mbti: "",
      university: "",
      major: "",
      grade: "",
      selfIntro: "",
      expectation: "",
      wechat: "",
      photos: [],
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        ...profile,
        province: profile.province || "all",
        city: profile.city || "all"
      });
      setProvince(profile.province || "all");
      setCity(profile.city || "all");
    }
  }, [profile, form]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!province || province === "all" || !city || city === "all") {
        toast({
          title: "保存失败",
          description: "请选择有效的��市",
          variant: "destructive",
        });
        return;
      }

      const profileData: UserBasicInfo = {
        ...data,
        province,
        city
      };
      
      await updateProfile(profileData);
      
      toast({
        title: "更新成功",
        description: "个人资料已更新",
      });
    } catch (error: any) {
      toast({
        title: "更新失败",
        description: error.message || "发生未知错误",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: "/auth",
      redirect: true
    });
  };

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    form.setValue("province", value);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    form.setValue("city", value);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          </Card>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">个人资料</h1>
        <div className="space-x-2">
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            保存修改
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            退出登录
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 基本信息 */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">基本信息</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>昵称</Label>
              <Input 
                placeholder="输入昵称" 
                {...form.register("nickname")}
              />
              {form.formState.errors.nickname && (
                <p className="text-sm text-red-500">{form.formState.errors.nickname.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>年龄</Label>
                <Input 
                  type="number" 
                  placeholder="输入年龄" 
                  {...form.register("age", { valueAsNumber: true })}
                />
                {form.formState.errors.age && (
                  <p className="text-sm text-red-500">{form.formState.errors.age.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>性别</Label>
                <Select 
                  value={form.watch("gender")} 
                  onValueChange={(value) => form.setValue("gender", value as "male" | "female")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>城市</Label>
              <CitySelect
                province={province}
                city={city}
                onProvinceChange={handleProvinceChange}
                onCityChange={handleCityChange}
                error={form.formState.errors.city?.message || form.formState.errors.province?.message}
              />
              {(form.formState.errors.province || form.formState.errors.city) && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.province?.message || form.formState.errors.city?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>MBTI</Label>
              <Select 
                value={form.watch("mbti")} 
                onValueChange={(value) => form.setValue("mbti", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择MBTI类型" />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>学校</Label>
                <Input 
                  placeholder="输入学校名称" 
                  {...form.register("university")}
                />
                {form.formState.errors.university && (
                  <p className="text-sm text-red-500">{form.formState.errors.university.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>专业（选填）</Label>
                <Input 
                  placeholder="输入专业" 
                  {...form.register("major")}
                />
                {form.formState.errors.major && (
                  <p className="text-sm text-red-500">{form.formState.errors.major.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>年级</Label>
              <Select 
                value={form.watch("grade")} 
                onValueChange={(value) => form.setValue("grade", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择年级" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>自我介绍</Label>
              <Textarea 
                placeholder="描述一下自己..." 
                {...form.register("selfIntro")}
                error={form.formState.errors.selfIntro?.message}
              />
            </div>

            <div className="space-y-2">
              <Label>期待</Label>
              <Textarea 
                placeholder="描述你的期待..." 
                {...form.register("expectation")}
                error={form.formState.errors.expectation?.message}
              />
            </div>

            <div className="space-y-2">
              <Label>微信号</Label>
              <Input 
                placeholder="输入微信号" 
                {...form.register("wechat")}
                error={form.formState.errors.wechat?.message}
              />
            </div>
          </div>
        </Card>

        {/* 照片上传 */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">照片</h2>
          <ProfileImageUpload
            value={form.watch("photos")}
            onChange={(urls) => form.setValue("photos", urls)}
            maxFiles={3}
          />
          {form.formState.errors.photos && (
            <p className="text-sm text-destructive">{form.formState.errors.photos.message}</p>
          )}
        </Card>
      </div>
    </div>
  );
} 