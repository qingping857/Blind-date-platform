import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface UserProfile {
  nickname: string;
  age: number;
  gender: "male" | "female";
  city: string;
  mbti: string;
  university: string;
  major: string;
  grade: string;
  selfIntro: string;
  expectation: string;
  wechat: string;
  photos: string[];
}

export interface UseProfileReturn {
  isLoading: boolean;
  profile: UserProfile | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UserProfile) => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile");
      
      if (!response.ok) {
        throw new Error("获取资料失败");
      }

      const data = await response.json();
      setProfile(data);
    } catch (error: any) {
      console.error("获取资料失败:", error);
      toast({
        title: "获取资料失败",
        description: error.message || "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UserProfile) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("更新资料失败");
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      
      toast({
        title: "更新成功",
        description: "个人资料已更新",
      });
    } catch (error: any) {
      console.error("更新资料失败:", error);
      toast({
        title: "更新失败",
        description: error.message || "请稍后重试",
        variant: "destructive",
      });
      throw error; // 向上传递错误，让表单知道提交失败
    } finally {
      setIsLoading(false);
    }
  };

  // 组件加载时自动获取用户资料
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    isLoading,
    profile,
    fetchProfile,
    updateProfile,
  };
} 