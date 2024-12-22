import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

interface UserProfile {
  email: string;
  nickname: string;
  gender: 'male' | 'female';
  age: number;
  city: string;
  university: string;
  major: string;
  grade: string;
  selfIntro: string;
  expectation: string;
  wechat: string;
  photos: string[];
}

export function useProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile");
      
      if (!response.ok) {
        throw new Error("获取用户资料失败");
      }

      const data = await response.json();
      setProfile(data);
      
    } catch (error: any) {
      toast({
        title: "获取用户资料失败",
        description: error.message,
        variant: "destructive",
      });
      setProfile(null);
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
    fetchProfile
  };
} 