import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export async function POST(req: Request) {
  const refreshToken = (await req.headers.get("cookie"))
    ?.split(";")
    .find((c) => c.trim().startsWith("refreshToken="))
    ?.split("=")[1];

  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, REFRESH_SECRET) as any;
      if (payload && payload.id) {
        await prisma.user.update({
          where: { id: payload.id },
          data: { refresh_token: null },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("refreshToken", "", { maxAge: 0 });
  return response;
}
