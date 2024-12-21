import { z } from "zod";
import { userProfileSchema } from "@/lib/validations/user";

// API 响应的基础接口
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// 用户资料响应
export type UserProfileResponse = ApiResponse<z.infer<typeof userProfileSchema>>;

// 调试工具 - 打印响应详情
export function debugResponse(tag: string, response: any) {
  console.log(`[DEBUG:${tag}]`, {
    type: typeof response,
    isNull: response === null,
    isObject: typeof response === 'object',
    hasStatus: response && 'status' in response,
    statusType: response && typeof response.status,
    hasError: response && 'error' in response,
    errorType: response && typeof response.error,
    hasData: response && 'data' in response,
    dataType: response && typeof response.data,
    raw: response
  });
}

// 类型守卫函数 - 错误响应
export function isErrorResponse(response: any): response is ApiResponse<never> {
  if (!response || typeof response !== 'object') {
    console.warn('[ERROR_RESPONSE_CHECK] Response is not an object:', response);
    return false;
  }

  const hasStatus = 'status' in response && typeof response.status === 'number';
  const hasError = 'error' in response && typeof response.error === 'string';

  if (!hasStatus || !hasError) {
    console.warn('[ERROR_RESPONSE_CHECK] Missing required fields:', {
      hasStatus,
      hasError,
      response
    });
  }

  return hasStatus && hasError;
}

// 类型守卫函数 - 用户资料响应
export function isUserProfileResponse(response: any): response is UserProfileResponse {
  if (!response || typeof response !== 'object') {
    console.warn('[PROFILE_RESPONSE_CHECK] Response is not an object:', response);
    return false;
  }

  const hasStatus = 'status' in response && typeof response.status === 'number';
  const hasData = 'data' in response && response.data && typeof response.data === 'object';

  if (!hasStatus || !hasData) {
    console.warn('[PROFILE_RESPONSE_CHECK] Missing required fields:', {
      hasStatus,
      hasData,
      response
    });
    return false;
  }

  const data = response.data;
  const requiredFields = ['nickname', 'age', 'gender', 'city', 'photos'];
  const missingFields = requiredFields.filter(field => !(field in data));

  if (missingFields.length > 0) {
    console.warn('[PROFILE_RESPONSE_CHECK] Missing data fields:', {
      missingFields,
      data
    });
    return false;
  }

  if (!Array.isArray(data.photos)) {
    console.warn('[PROFILE_RESPONSE_CHECK] Photos is not an array:', data.photos);
    return false;
  }

  return true;
}

// 辅助函数 - 检查响应状态
export function checkResponseStatus(response: ApiResponse<any>): boolean {
  const isValid = response.status >= 200 && response.status < 300;
  if (!isValid) {
    console.warn('[STATUS_CHECK] Invalid status code:', response.status);
  }
  return isValid;
} 