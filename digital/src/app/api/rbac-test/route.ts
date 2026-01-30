import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { Role, hasPermission } from '../../../config/roles';

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

export async function GET(request: NextRequest) {
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

  // Log the access attempt for auditing
  console.log(`[RBAC] ${payload.role} accessed RBAC test endpoint`);

  // Return user's role and permissions
  return NextResponse.json({ 
    success: true,
    user: {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    },
    permissions: {
      canRead: hasPermission(payload.role, 'read'),
      canCreate: hasPermission(payload.role, 'create'),
      canUpdate: hasPermission(payload.role, 'update'),
      canDelete: hasPermission(payload.role, 'delete'),
      canManageUsers: hasPermission(payload.role, 'manage_users'),
      canViewReports: hasPermission(payload.role, 'view_reports'),
    },
    message: `Welcome, ${payload.role}! You have access to this resource.`
  });
}

export async function POST(request: NextRequest) {
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

  // Check if user has 'create' permission
  if (!hasPermission(payload.role, 'create')) {
    console.log(`[RBAC] ${payload.role} attempted to create resource: DENIED`);
    return NextResponse.json({ 
      success: false, 
      message: 'Access denied: insufficient permissions to create resources.' 
    }, { status: 403 });
  }

  console.log(`[RBAC] ${payload.role} attempted to create resource: ALLOWED`);
  
  // Process the creation request
  const body = await request.json();
  
  return NextResponse.json({ 
    success: true,
    message: `Resource created successfully by ${payload.role}.`,
    data: body
  });
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

  // Check if user has 'update' permission
  if (!hasPermission(payload.role, 'update')) {
    console.log(`[RBAC] ${payload.role} attempted to update resource: DENIED`);
    return NextResponse.json({ 
      success: false, 
      message: 'Access denied: insufficient permissions to update resources.' 
    }, { status: 403 });
  }

  console.log(`[RBAC] ${payload.role} attempted to update resource: ALLOWED`);
  
  // Process the update request
  const body = await request.json();
  
  return NextResponse.json({ 
    success: true,
    message: `Resource updated successfully by ${payload.role}.`,
    data: body
  });
}

export async function DELETE(request: NextRequest) {
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

  // Check if user has 'delete' permission
  if (!hasPermission(payload.role, 'delete')) {
    console.log(`[RBAC] ${payload.role} attempted to delete resource: DENIED`);
    return NextResponse.json({ 
      success: false, 
      message: 'Access denied: insufficient permissions to delete resources.' 
    }, { status: 403 });
  }

  console.log(`[RBAC] ${payload.role} attempted to delete resource: ALLOWED`);
  
  // Extract ID from URL or request body
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  return NextResponse.json({ 
    success: true,
    message: `Resource with ID ${id} deleted successfully by ${payload.role}.`
  });
}