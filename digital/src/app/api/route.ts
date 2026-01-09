import { NextRequest, NextResponse } from 'next/server';

// GET handler
export async function GET() {
  return NextResponse.json({ message: 'API GET route works!' });
}

// POST handler
export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({
    message: 'API POST route works!',
    data: body,
  });
}
