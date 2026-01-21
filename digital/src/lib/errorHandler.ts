import { NextResponse } from "next/server";
import { logger } from "./logger";

export function handleError(error: unknown, context: string) {
  const isProd = process.env.NODE_ENV === "production";

  // Response sent to client
  const errorResponse = {
    success: false,
    message: isProd
      ? "Something went wrong. Please try again later."
      : error instanceof Error ? error.message : "Unknown error",
    ...(isProd ? {} : { stack: error instanceof Error ? error.stack : undefined }),
  };

  // Internal logging (always detailed)
  logger.error(`Error in ${context}`, {
    message: error instanceof Error ? error.message : "Unknown error",
    stack: isProd ? "REDACTED" : (error instanceof Error ? error.stack : "No stack trace"),
  });

  return NextResponse.json(errorResponse, { status: 500 });
}
