import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/user";

export function useUserDetail(userId: string) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);

        // 发送请求
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/user/${userId}`);
        if (!response.ok) {
          throw new Error("获取用户详情失败");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("获取用户详情失败:", error);
        toast({
          variant: "destructive",
          title: "错误",
          description: "获取用户详情失败，请稍后重试",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, toast]);

  return { user, isLoading };
} 