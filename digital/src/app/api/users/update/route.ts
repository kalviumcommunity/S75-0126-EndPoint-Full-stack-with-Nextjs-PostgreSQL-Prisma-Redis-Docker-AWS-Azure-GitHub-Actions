import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import redis from "../../../../lib/redis";

export async function POST(req: Request) {
  try {
    const { id, phone } = await req.json();
    const updatedUser = await prisma.users.update({ where: { id }, data: { phone } });

    // Invalidate cache after update
    await redis.del("users:list");

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed", error }, { status: 500 });
  }
}
