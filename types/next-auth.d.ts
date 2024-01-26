import 'next-auth';
import { Session as DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
  }
}
