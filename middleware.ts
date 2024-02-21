import { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { locales } from './navigation';

const publicPages = [
  '/',
  '/home',
  '/about',
  '/contact',
  '/privacy',
  '/rules',
  '/auto-join-meet',
  '/auto-join-meet/[slug]',
  '/auth/signin',
  '/auth/signup',
  '/auth/verify/[slug]',
  '/auth/forgot-password',
  '/auth/reset-password/[slug]',
  '/flows/[id]/[slug]',
  '/profiles/[username]',
  '/auto-join-meet',
  '/auto-join-meet/[slug]'

];

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix: 'as-needed',
  defaultLocale: 'en',
});

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  (req) => intlMiddleware(req),
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export default function middleware(req: NextRequest) {
  const formattedPublicPages = publicPages
    .map((p) =>
      p === '/'
        ? ['', '/']
        : p
            .replace('[slug]', '[a-zA-Z0-9-_]+')
            .replace('[id]', '[a-zA-Z0-9-_]+')
            .replace('[username]', '[a-zA-Z0-9-_]+')
    )
    .flat(); // Flatten the array here to ensure proper joining

  const publicPathnameRegex = new RegExp(
    `^(/(${locales.join('|')}))?(${formattedPublicPages.join('|')})/?$`,
    'i'
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
