import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "access_secret";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin");
  const allowedOrigins = ["http://localhost:3000"]; // Add production domains here

  // Handle CORS preflight
  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const response = new NextResponse(null, { status: 204 });
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
  }

  // Public routes
  if (pathname.startsWith("/login") || pathname === "/" || pathname.startsWith("/api/auth")) {
    const response = NextResponse.next();
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    return response;
  }

  // Protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/users") || pathname.startsWith("/api/users")) {
    let token = req.headers.get("Authorization")?.split(" ")[1];
    
    // Fallback to cookie for non-API routes or legacy support
    if (!token) {
      token = req.cookies.get("token")?.value;
    }

    if (!token) {
      if (pathname.startsWith("/api/")) {
        const response = NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        if (origin && allowedOrigins.includes(origin)) {
          response.headers.set("Access-Control-Allow-Origin", origin);
        }
        return response;
      }
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      jwt.verify(token, JWT_SECRET);
      const response = NextResponse.next();
      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
      }
      return response;
    } catch {
      if (pathname.startsWith("/api/")) {
        const response = NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        if (origin && allowedOrigins.includes(origin)) {
          response.headers.set("Access-Control-Allow-Origin", origin);
        }
        return response;
      }
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*"],
};
