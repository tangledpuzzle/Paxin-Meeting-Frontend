import axios, { AxiosError } from 'axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
  },
  cookies: {
    // sessionToken: {
    //   name: '__Secure-next-auth.session-token',
    //   options: {
    //     httpOnly: true,
    //     secure: true,
    //     path: '/',
    //     domain: '.paxintrade.com',
    //   },
    // },
    // access_token: {
    //   name: 'access_token',
    //   options: {
    //     httpOnly: true,
    //     secure: true,
    //     path: '/',
    //     domain: '.paxintrade.com',
    //   },
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
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await axios.post(
            `${process.env.API_URL}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                session: credentials.session,
              },
            }
          );

          const data = response.data;

          if (data.status === 'success') {
            console.log(req)
            // req.setHeader(
            //   'Set-Cookie',
            //   `access_token=${encodeURIComponent(data.access_token)}; HttpOnly; Secure; Path=/; Domain=.paxintrade.com;`
            // );

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
