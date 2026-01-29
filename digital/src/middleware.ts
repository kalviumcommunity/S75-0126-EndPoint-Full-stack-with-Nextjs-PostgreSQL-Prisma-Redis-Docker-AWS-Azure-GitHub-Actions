import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { Role } from './config/roles';

interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

export async function middleware(request: NextRequest) {
  // Define protected routes and their required roles
  const protectedRoutes = [
    { path: /^\/admin\/?.*/, requiredRole: 'admin' as Role },
    { path: /^\/dashboard\/?.*/, requiredRole: 'viewer' as Role },
    { path: /^\/users\/?.*/, requiredRole: 'viewer' as Role },
    { path: /^\/business\/?.*/, requiredRole: 'viewer' as Role },
  ];

  // Check if the current path matches any protected route
  const matchedRoute = protectedRoutes.find(route => route.path.test(request.nextUrl.pathname));

  if (matchedRoute) {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirect to login if no token exists
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
      const verified = await jwtVerify(token, secret) as { payload: JWTPayload };
      const userRole = verified.payload.role;

      // Check if user has required role for the route
      if (!hasRequiredRole(userRole, matchedRoute.requiredRole)) {
        // Return 403 Forbidden if user doesn't have required role
        return NextResponse.rewrite(new URL('/api/forbidden', request.url));
      }

      // Attach user info to request for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', verified.payload.userId);
      requestHeaders.set('x-user-role', userRole);
      requestHeaders.set('x-user-email', verified.payload.email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // For public routes, just continue
  return NextResponse.next();
}

// Helper function to check if user has required role
function hasRequiredRole(userRole: Role, requiredRole: Role): boolean {
  // For simplicity, we'll implement basic role hierarchy
  // In a real app, you'd use the roleHierarchy from roles.ts
  const roleLevels: Record<Role, number> = {
    viewer: 1,
    editor: 2,
    admin: 3
  };

  return roleLevels[userRole] >= roleLevels[requiredRole];
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}