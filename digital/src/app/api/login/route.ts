import { NextResponse } from "next/server";
import { loginSchema } from "../../../utils/validation";
import { sanitizeInput } from "../../../utils/sanitize";
import { prisma } from "../../../lib/prisma";
import { handleError } from "../../../lib/errorHandler";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validate
    const validated = loginSchema.parse(body);

    // ✅ Sanitize
    const cleanEmail = sanitizeInput(validated.email) as string;

    // ✅ Safe query
    const user = await prisma.users.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Login safe" }, { status: 200 });
  } catch (err) {
    return handleError(err, "POST /api/login");
  }
}
