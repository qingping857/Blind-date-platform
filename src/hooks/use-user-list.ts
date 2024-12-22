import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/user";

interface UseUserListParams {
  minAge: number;
  maxAge: number;
  city?: string;
  mbti?: string;
  grade?: string;
  query?: string;
}

export function useUserList(params: UseUserListParams) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);

        // 构建查询参数
        const searchParams = new URLSearchParams();
        searchParams.set("minAge", params.minAge.toString());
        searchParams.set("maxAge", params.maxAge.toString());
        if (params.city) searchParams.set("city", params.city);
        if (params.mbti) searchParams.set("mbti", params.mbti);
        if (params.grade) searchParams.set("grade", params.grade);
        if (params.query) searchParams.set("query", params.query);

        // 发送请求
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/user/list?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error("获取用户列表失败");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("获取用户列表失败:", error);
        toast({
          variant: "destructive",
          title: "错误",
          description: "获取用户列表失败，请稍后重试",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [params, toast]);

  return { users, isLoading };
} 