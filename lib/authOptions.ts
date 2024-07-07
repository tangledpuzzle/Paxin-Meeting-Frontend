import axios, { AxiosError } from 'axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';

const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
  },
  providers: [
    CredentialsProvider({
      id: 'email',
      name: 'email',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'bruce@wayne.com' },
        password: { label: 'Password', type: 'password' },
        session: { label: 'Session', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await axios.post(
            `${process.env.API_URL}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
              session: credentials.session,
            }
          );

          const data = response.data;
          if (data.status === 'success') {
            cookies().set('access_token', data.access_token || '', {
              path: '/',
              maxAge: 60 * 60 * 24 * 30,
              domain:
                process.env.NODE_ENV === 'production'
                  ? '.myru.online'
                  : 'localhost',
              httpOnly: false,
              secure: process.env.NODE_ENV === 'production',
            });

            return {
              id: data.refresh_token.UserID,
              name: '',
              email: credentials.email,
              token: data.access_token,
              refreshToken: data.refresh_token.Token,
              expiresIn: data.refresh_token.ExpiresIn,
              tokenUuid: data.refresh_token.TokenUuid,
            };
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          const axiosError = error as AxiosError | any;

          throw new Error(
            axiosError.response?.data?.message ?? 'Something went wrong'
          );
        }
      },
    }),
  ],

  // JWT
  callbacks: {
    async session({ token, session }: { token: any; session: any }) {
      if (token) {
        session.user.id = token.id; // Customize as per your needs
        session.accessToken = token.accessToken; // Add fields that are necessary
        session.refreshToken = token.refreshToken;
        session.expiresIn = token.expiresIn;
        session.tokenUuid = token.tokenUuid;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.token;
        token.refreshToken = user.refreshToken;
        token.expiresIn = user.expiresIn;
        token.tokenUuid = user.tokenUuid;
        // Add other fields as necessary depending on your use case
      }
      return token;
    },
  },
};

export default authOptions;
