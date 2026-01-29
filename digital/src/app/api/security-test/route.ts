import { sanitizeInput } from "@/utils/sanitize";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const body = await req.json();

  const dirty = body.text;

  const clean = sanitizeInput(dirty);

  return NextResponse.json({
    before: dirty,
    after: clean,
  });
}
