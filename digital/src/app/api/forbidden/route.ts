import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    success: false, 
    message: 'Access denied: insufficient permissions for this resource.' 
  }, { status: 403 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    success: false, 
    message: 'Access denied: insufficient permissions for this resource.' 
  }, { status: 403 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ 
    success: false, 
    message: 'Access denied: insufficient permissions for this resource.' 
  }, { status: 403 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ 
    success: false, 
    message: 'Access denied: insufficient permissions for this resource.' 
  }, { status: 403 });
}