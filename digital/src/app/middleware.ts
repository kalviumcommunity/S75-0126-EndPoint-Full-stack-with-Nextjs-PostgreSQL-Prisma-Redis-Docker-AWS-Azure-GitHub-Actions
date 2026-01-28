import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "access_secret";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  if (pathname.startsWith("/login") || pathname === "/" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
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
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*"],
};
