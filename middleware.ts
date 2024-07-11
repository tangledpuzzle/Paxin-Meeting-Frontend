import { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import cookie from 'cookie';
import { locales } from './navigation';

const publicPages = [
  '/',
  '/home',
  '/about',
  '/contact',
  '/privacy',
  '/rules',
  '/stream',
  '/stream/[slug]', 
  '/auth/signin',
  '/auth/signup',
  '/auth/verify/[slug]',
  '/auth/forgot-password',
  '/auth/reset-password/[slug]',
  '/flows/[id]/[slug]',
  '/profiles/[username]',
  '/meet',
  '/meet/[slug]',
];

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix: 'as-needed',
  defaultLocale: 'en',
});

const checkTokenFromCookies = (req: any) => {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const token = cookies.access_token; // Измените это на название вашей куки
  if (!token) return false;
  
  // Ваша логика проверки токена
  return validateToken(token);
};

const authMiddleware = withAuth(
  (req) => intlMiddleware(req),
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (token) {
          return true;
        }
        return checkTokenFromCookies(req);
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

const validateToken = (token: any) => {
  // Добавьте свою логику проверки токена здесь
  // Например, запрос к вашему серверу для валидации токена
  // return fetch(`https://your-backend/validate-token?token=${token}`)
  //   .then(response => response.json())
  //   .then(data => data.isValid);
  return true; // Примерный результат
};

export default function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', req.nextUrl.pathname);
  req.headers.set('x-pathname', req.nextUrl.pathname);

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
