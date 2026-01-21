import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Define which roles can access which routes
const routeRoles: { [key: string]: string[] } = {
  "/api/admin": ["admin"],
  "/api/users": ["admin", "user"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if route is protected
  const protectedRoute = Object.keys(routeRoles).find(route => pathname.startsWith(route));
  if (!protectedRoute) return NextResponse.next(); // public route

  const authHeader = req.headers.get("authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;

  if (!token) {
    return NextResponse.json({ success: false, message: "Token missing" }, { status: 401 });
  }

  try {
    const decoded: { email: string; role: string } = jwt.verify(token, JWT_SECRET) as { email: string; role: string };

    // Check if user's role is allowed
    if (!routeRoles[protectedRoute].includes(decoded.role)) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    // Attach user info to request
    const headers = new Headers(req.headers);
    headers.set("x-user-email", decoded.email);
    headers.set("x-user-role", decoded.role);

    return NextResponse.next({ request: { headers } });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 403 });
  }
}
