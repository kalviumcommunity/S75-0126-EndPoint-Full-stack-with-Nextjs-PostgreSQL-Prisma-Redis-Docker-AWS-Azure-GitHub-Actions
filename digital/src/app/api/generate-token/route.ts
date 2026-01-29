import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { Role } from '../../../config/roles';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, role } = body;

    // Validate input
    if (!userId || !email || !role) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: userId, email, or role' 
      }, { status: 400 });
    }

    // Validate role
    const validRoles: Role[] = ['admin', 'editor', 'viewer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        success: false, 
        message: `Invalid role. Valid roles: ${validRoles.join(', ')}` 
      }, { status: 400 });
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
    const token = await new SignJWT({ userId, email, role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret);

    return NextResponse.json({ 
      success: true,
      token,
      user: { userId, email, role },
      message: `Token generated successfully for ${role} user`
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error generating token' 
    }, { status: 500 });
  }
}