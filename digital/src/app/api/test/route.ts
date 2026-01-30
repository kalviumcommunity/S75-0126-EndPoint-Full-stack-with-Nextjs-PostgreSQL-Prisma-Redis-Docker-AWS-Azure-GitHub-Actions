import { getSecrets } from "@/lib/secrets";
import { NextResponse } from "next/server";

export async function GET() {
  const secrets = await getSecrets();

  console.log("Loaded secrets:", Object.keys(secrets));

  return NextResponse.json({
    db: secrets.DATABASE_URL ? "Loaded" : "Missing",
    jwt: secrets.JWT_SECRET ? "Loaded" : "Missing",
  });
}
