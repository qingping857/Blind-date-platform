import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { userProfileSchema } from "@/lib/validations/user";
import { z } from "zod";
import { isErrorResponse, isUserProfileResponse, checkResponseStatus, debugResponse } from "@/types/api";
import { AuthError, FormatError, ValidationError, handleApiError } from "@/lib/errors";

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
      
      // 检查HTTP状态
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new AuthError("请先登录", errorData);
        }
        throw new ApiError(
          errorData.error || "获取用户资料失败",
          response.status,
          "FETCH_PROFILE_ERROR",
          errorData
        );
      }

      const responseData = await response.json();

      // 打印详细的响应信息用于调试
      debugResponse('FETCH_PROFILE', responseData);

      // 检查响应格式
      if (!responseData || typeof responseData !== 'object') {
        throw new FormatError("服务器响应格式错误", {
          responseType: typeof responseData,
          responseValue: responseData
        });
      }

      // 获取用户数据，支持多种格式：
      // 1. { data: { user: {...} } }
      // 2. { user: {...} }
      // 3. {...} (直接是用户数据)
      const userData = responseData.data?.user || responseData.user || responseData;
      
      // 打印详细的数据结构信息
      console.log('准备验证用户数据:', {
        原始响应: responseData,
        提取的用户数据: userData,
        包含data字段: 'data' in responseData,
        包含user字段: 'user' in responseData,
        数据类型: typeof userData,
        字段列表: Object.keys(userData || {})
      });

      // 检查数据是否为空
      if (!userData || Object.keys(userData).length === 0) {
        throw new ValidationError("获取到的用户数据为空", {
          received: userData,
          message: "服务器返回了空的用户数据"
        });
      }

      // 使用zod验证用户数据
      const validationResult = userProfileSchema.safeParse(userData);
      
      if (!validationResult.success) {
        // 格式化验证错误信息
        const errorDetails = validationResult.error.errors.map(err => ({
          字段: err.path.join('.'),
          错误信息: err.message,
          收到的值: err.path.reduce((obj, key) => obj?.[key], userData)
        }));

        console.error('数据验证失败:', {
          验证错误: errorDetails,
          接收到的数据: userData,
          期望的数据结构: Object.keys(userProfileSchema.shape)
        });
        
        throw new ValidationError("用户数据验证失败", {
          errors: errorDetails,
          received: userData,
          expectedFields: Object.keys(userProfileSchema.shape)
        });
      }

      setProfile(validationResult.data);
      
    } catch (error) {
      // 使用统一的错误处理
      const { message, toastType } = handleApiError(error);
      toast({
        title: "获取用户资料失败",
        description: message,
        variant: toastType,
      });
      
      // 出错时清空资料
      setProfile(null);
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
      const responseData = await response.json();

      // 打印详细的响应信息
      debugResponse('UPDATE_PROFILE', responseData);

      // 检查响应格式
      if (typeof responseData !== 'object' || !responseData) {
        throw new FormatError("服务器响应格式错误", {
          responseType: typeof responseData,
          responseValue: responseData
        });
      }

      // 使用类型守卫检查错误响应
      if (isErrorResponse(responseData)) {
        // 处理特定状态
        if (responseData.status === 401) {
          throw new AuthError(responseData.error || "请先登录");
        }
        if (responseData.status === 422) {
          throw new ValidationError(responseData.error || "提交的资料格式不正确");
        }
        throw new ValidationError(responseData.error || "更新资料失败", {
          status: responseData.status
        });
      }

      // 验证是否是有效的用户资料响应
      if (!isUserProfileResponse(responseData)) {
        throw new FormatError("返回的数据格式不正确", {
          response: responseData
        });
      }

      // 检查响应状态
      if (!checkResponseStatus(responseData)) {
        throw new ValidationError(`服务器响应状态错误: ${responseData.status}`, {
          status: responseData.status
        });
      }

      setProfile(responseData.data);
      
      toast({
        title: "成功",
        description: "个人资料已更新",
      });
    } catch (error) {
      const { message, status, code, context } = handleApiError(error);

      toast({
        variant: "destructive",
        title: "更新失败",
        description: message,
      });

      if (status === 401) {
        window.location.href = "/auth/login";
      }
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