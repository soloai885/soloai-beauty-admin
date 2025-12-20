import { auth } from './src/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // 允許公開頁面
  if (
    nextUrl.pathname === '/' ||
    nextUrl.pathname.startsWith('/booking') ||
    nextUrl.pathname.startsWith('/api/auth') ||
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // 如果訪問登入頁面且已登入，重定向到後台
  if (nextUrl.pathname.startsWith('/login') && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // 如果訪問後台頁面但未登入，重定向到登入頁面
  if (
    (nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/dashboard')) &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

