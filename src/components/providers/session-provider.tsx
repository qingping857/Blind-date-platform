'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider
      // 7天的会话时间（单位：秒）
      refetchInterval={7 * 24 * 60 * 60}
    >
      {children}
    </NextAuthSessionProvider>
  );
} 