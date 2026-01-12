import { NextRequest, NextResponse } from 'next/server';

// Define TypeScript interfaces
interface User {
  id: string;
  phone?: string;
  email?: string;
  name?: string;
  password: string;
  is_verified: boolean;
  created_at: string;
}

// Mock data for demonstration
let users: User[] = [
  { id: '1', phone: '+1234567890', email: 'user1@example.com', name: 'John Doe', password: 'hashed_password_1', is_verified: true, created_at: new Date().toISOString() },
  { id: '2', phone: '+0987654321', email: 'user2@example.com', name: 'Jane Smith', password: 'hashed_password_2', is_verified: false, created_at: new Date().toISOString() },
];

// Helper function to generate a new ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// GET /api/signup - Get all signups with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Validate pagination parameters
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters. Page and limit must be positive integers, limit max 100.' },
        { status: 400 }
      );
    }

    // Apply pagination
    const paginatedUsers = users.slice(offset, offset + limit);
    const totalCount = users.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: paginatedUsers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching signups:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/signup - Create a new signup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.email && !body.phone) {
      return NextResponse.json(
        { error: 'Either email or phone number is required' },
        { status: 400 }
      );
    }

    if (!body.password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === body.email || user.phone === body.phone);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone number already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser: User = {
      id: generateId(),
      phone: body.phone,
      email: body.email,
      name: body.name,
      password: body.password, // In a real app, this should be hashed
      is_verified: false, // New signups are not verified initially
      created_at: new Date().toISOString(),
    };

    users.push(newUser);

    // Don't return the password in the response
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: 'Signup successful', data: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/signup/:id - Update a signup by ID
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1]; // Extract ID from path
    
    const body = await request.json();
    
    // Find user by ID
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...body,
      id: users[userIndex].id, // Preserve the ID
      created_at: users[userIndex].created_at, // Preserve creation date
      password: body.password || users[userIndex].password, // Only update password if provided
    };

    // Don't return the password in the response
    const { password, ...userWithoutPassword } = users[userIndex];

    return NextResponse.json({
      message: 'Signup updated successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error updating signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/signup/:id - Delete a signup by ID
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1]; // Extract ID from path
    
    const initialLength = users.length;
    users = users.filter(user => user.id !== id);
    
    if (users.length === initialLength) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Signup deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}