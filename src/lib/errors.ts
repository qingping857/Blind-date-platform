// 基础API错误类
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
    
    // 确保 instanceof 正常工作
    Object.setPrototypeOf(this, ApiError.prototype);
    
    // 捕获错误堆栈
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  // 序列化错误信息
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      context: this.context,
      stack: this.stack
    };
  }
}

// 认证错误
export class AuthError extends ApiError {
  constructor(message = "认证失败", context?: Record<string, any>) {
    super(message, 401, 'AUTH_ERROR', context);
    this.name = 'AuthError';
  }
}

// 验证错误
export class ValidationError extends ApiError {
  constructor(message = "数据验证失败", context?: Record<string, any>) {
    super(message, 422, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
  }
}

// 格式错误
export class FormatError extends ApiError {
  constructor(message = "数据格式错误", context?: Record<string, any>) {
    super(message, 400, 'FORMAT_ERROR', context);
    this.name = 'FormatError';
  }
}

// 创建错误实例的工具函数
export function createApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500, 'UNKNOWN_ERROR', {
      originalError: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  }

  return new ApiError(
    typeof error === 'string' ? error : '未知错误',
    500,
    'UNKNOWN_ERROR',
    { originalError: error }
  );
}

// 错误处理工具函数
export function handleApiError(error: unknown): {
  message: string;
  status: number;
  code: string;
  context?: Record<string, any>;
} {
  const apiError = createApiError(error);
  
  console.error('[API_ERROR]', {
    name: apiError.name,
    message: apiError.message,
    status: apiError.status,
    code: apiError.code,
    context: apiError.context,
    stack: apiError.stack
  });

  return {
    message: apiError.message,
    status: apiError.status || 500,
    code: apiError.code || 'UNKNOWN_ERROR',
    context: apiError.context
  };
} 