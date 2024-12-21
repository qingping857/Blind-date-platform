import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      status: string;
      isEmailVerified: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    status: string;
    isEmailVerified: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    status: string;
    isEmailVerified: boolean;
  }
} 