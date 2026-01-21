import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { email } = await req.json();
  // Password is extracted for future implementation
  void (await req.json()).password;

  const user = await prisma.users.findUnique({ where: { phone: email } });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: "user",
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return NextResponse.json({
    success: true,
    token,
  });
}
