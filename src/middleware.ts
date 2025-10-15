import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const pathname = request.nextUrl.pathname;

  // Protected routes
  const protectedPaths = ['/admin'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // If accessing protected route without session, redirect to login
  if (isProtectedPath && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login with session, redirect to admin
  if (pathname === '/login' && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
  ]
}

