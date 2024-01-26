import axios from 'axios';
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: NextAuthOptions = {
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

          if (data.status === 'success') {
            // The login was successful
            console.log('Login successful');
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
      const user = session.user;

      if (token && user) {
        user.id = token.id;
        user.name = token.name;
        user.email = token.email;
        user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      return {};
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
