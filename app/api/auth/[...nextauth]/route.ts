import axios from 'axios';
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/register',
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

        console.log(credentials);

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

          console.log(data);

          if (data.status === 'success') {
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
            // The login failed
            console.log('Login failed');
          }
        } catch (error) {
          console.error('Error:', error);
        }

        return {
          id: '',
          name: '',
          email: '',
        };
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
