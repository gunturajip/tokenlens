import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('auth-token')
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/calculator', '/calculator/history', '/calculator/compare']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/auth', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/auth' && isLoggedIn) {
    return NextResponse.redirect(new URL('/calculator', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/calculator/:path*', '/auth'],
}
