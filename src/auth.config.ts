import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnPublic = nextUrl.pathname.startsWith('/booking') || nextUrl.pathname === '/';

      // 如果訪問登入頁面且已登入，重定向到後台首頁
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // 如果訪問後台頁面但未登入，重定向到登入頁面
      if (isOnAdmin && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
      }

      // 允許訪問公開頁面和 API 路由
      if (isOnPublic || nextUrl.pathname.startsWith('/api')) {
        return true;
      }

      // 其他情況允許訪問
      return true;
    },
  },
  providers: [], // 在 auth.ts 中定義
} satisfies NextAuthConfig;

