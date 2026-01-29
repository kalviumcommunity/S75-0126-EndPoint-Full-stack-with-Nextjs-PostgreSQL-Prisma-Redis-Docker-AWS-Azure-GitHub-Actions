import { NextResponse } from "next/server";
import { signupSchema } from "../../../utils/validation";
import { sanitizeInput } from "../../../utils/sanitize";
import { handleError } from "../../../lib/errorHandler";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validate
    const validated = signupSchema.parse(body);

    // ✅ Sanitize
    const cleanName = sanitizeInput(validated.name) as string;
    const cleanEmail = sanitizeInput(validated.email) as string;

    // Mock user creation (without database)
    const user = {
      id: Math.random().toString(36).substring(7),
      name: cleanName,
      email: cleanEmail,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ 
      message: "User created safely", 
      user,
      security: {
        originalName: validated.name,
        sanitizedName: cleanName,
        xssBlocked: validated.name !== cleanName
      }
    });
  } catch (err) {
    return handleError(err, "POST /api/test-xss");
  }
}
