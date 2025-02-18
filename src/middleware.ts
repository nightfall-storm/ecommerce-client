import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication (user role)
const protectedRoutes = [
  '/orders',
  '/checkout',
  '/profile',
]

// Define admin routes that require admin role
const adminRoutes = [
  '/admin/manage-orders',
  '/admin/manage-products',
  '/admin/manage-clients',
]

// Helper function to check if the path starts with any of the given prefixes
function pathStartsWith(path: string, prefixes: string[]): boolean {
  return prefixes.some(prefix => path.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)

  // Get token from cookies
  const token = request.cookies.get('accessToken')

  // Check if the route requires authentication
  const isProtectedRoute = pathStartsWith(pathname, protectedRoutes)
  const isAdminRoute = pathStartsWith(pathname, adminRoutes)

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    // Store the attempted URL to redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If it's an admin route, verify admin role
  if (isAdminRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verify admin role using the token
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to verify admin role')
      }

      const user = await response.json()

      if (user.role !== 'admin') {
        // Redirect non-admin users to home page with an error message
        const homeUrl = new URL('/', request.url)
        homeUrl.searchParams.set('error', 'unauthorized')
        return NextResponse.redirect(homeUrl)
      }
    } catch (error) {
      // If verification fails, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('error', 'session_expired')
      return NextResponse.redirect(loginUrl)
    }
  }

  // For auth pages (login/register), redirect to home if already authenticated
  if (pathname.startsWith('/login') && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Match all pathnames except static files and api routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
