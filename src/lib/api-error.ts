export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code,
      }),
      {
        status: error.statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // 处理其他类型的错误
  const message = error instanceof Error ? error.message : '发生未知错误';
  return new Response(
    JSON.stringify({
      error: message,
      code: 'INTERNAL_SERVER_ERROR',
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
} 