import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { userProfileSchema } from "@/lib/validations/user";
import { z } from "zod";

interface UseProfileReturn {
  isLoading: boolean;
  profile: z.infer<typeof userProfileSchema> | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: z.infer<typeof userProfileSchema>) => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<z.infer<typeof userProfileSchema> | null>(null);
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: error instanceof Error ? error.message : "获取资料失败",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: z.infer<typeof userProfileSchema>) => {
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
        title: "成功",
        description: "个人资料已更新",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: error instanceof Error ? error.message : "更新资料失败",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    profile,
    fetchProfile,
    updateProfile,
  };
} 