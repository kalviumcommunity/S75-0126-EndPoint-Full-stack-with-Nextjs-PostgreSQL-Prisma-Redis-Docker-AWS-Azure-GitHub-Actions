import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { Role, hasPermission } from '../../../../config/roles';
import { prisma } from '../../../../lib/prisma';

interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
    const verified = await jwtVerify(token, secret) as { payload: JWTPayload };
    return verified.payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    }, { status: 401 });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const payload = await verifyToken(token);
  
  if (!payload) {
    return NextResponse.json({ 
      success: false, 
      message: 'Access denied. Invalid token.' 
    }, { status: 401 });
  }

  // Check if user has 'manage_users' permission (typically admins)
  if (!hasPermission(payload.role, 'manage_users')) {
    console.log(`[RBAC] ${payload.role} attempted to update user role: DENIED`);
    return NextResponse.json({ 
      success: false, 
      message: 'Access denied: insufficient permissions to manage users.' 
    }, { status: 403 });
  }

  console.log(`[RBAC] ${payload.role} attempted to update user role: ALLOWED`);
  
  try {
    const body = await request.json();
    const { userId, newRole } = body;

    // Validate input
    if (!userId || !newRole) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: userId or newRole' 
      }, { status: 400 });
    }

    // Validate role
    const validRoles: Role[] = ['admin', 'editor', 'viewer'];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json({ 
        success: false, 
        message: `Invalid role. Valid roles: ${validRoles.join(', ')}` 
      }, { status: 400 });
    }

    // Update user role in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        is_verified: true,
        created_at: true,
        updated_at: true
      }
    });

    return NextResponse.json({ 
      success: true,
      message: `User role updated successfully to ${newRole}`,
      data: updatedUser
    });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Error updating user role' 
    }, { status: 500 });
  }
}