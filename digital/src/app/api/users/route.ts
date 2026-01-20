import { NextRequest, NextResponse } from 'next/server';
import { sendSuccess, sendError } from '../../../lib/responseHandler';
import { ERROR_CODES } from '../../../lib/errorCodes';
import { userSchema } from '../../../lib/schemas/userSchema';
import { ZodError } from 'zod';

// Mock data for demonstration
let users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 30, created_at: new Date().toISOString() },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25, created_at: new Date().toISOString() },
];

// Helper function to generate a new ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// GET /api/users - Get all users with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Validate pagination parameters
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1 || limit > 100) {
      return sendError(
        'Invalid pagination parameters. Page and limit must be positive integers, limit max 100.',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // Apply pagination
    const paginatedUsers = users.slice(offset, offset + limit);
    const totalCount = users.length;
    const totalPages = Math.ceil(totalCount / limit);

    return sendSuccess({
      data: paginatedUsers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }, 'Users fetched successfully');
  } catch (error) {
    console.error('Error fetching users:', error);
    return sendError(
      'Internal server error',
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Zod validation
    const validatedData = userSchema.parse(body);
    
    // Check if user already exists (by email)
    const existingUser = users.find(user => user.email === validatedData.email);
    if (existingUser) {
      return sendError(
        'User with this email already exists',
        ERROR_CODES.CONFLICT_ERROR,
        409
      );
    }

    // Create new user
    const newUser = {
      id: generateId(),
      ...validatedData,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);

    return sendSuccess(
      { data: newUser },
      'User created successfully',
      201
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        'Validation failed',
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        }))
      );
    }
    
    console.error('Error creating user:', error);
    return sendError(
      'Internal server error',
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}

// PUT /api/users/:id - Update a user by ID
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1]; // Extract ID from path
    
    const body = await request.json();
    
    // Find user by ID
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return sendError(
        'User not found',
        ERROR_CODES.NOT_FOUND,
        404
      );
    }

    // Zod validation for update
    const validatedData = userSchema.partial().parse(body); // Allow partial updates
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...validatedData,
      id: users[userIndex].id, // Preserve the ID
      created_at: users[userIndex].created_at, // Preserve creation date
    };

    return sendSuccess(
      { data: users[userIndex] },
      'User updated successfully'
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        'Validation failed',
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        }))
      );
    }
    
    console.error('Error updating user:', error);
    return sendError(
      'Internal server error',
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}

// DELETE /api/users/:id - Delete a user by ID
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1]; // Extract ID from path
    
    const initialLength = users.length;
    users = users.filter(user => user.id !== id);
    
    if (users.length === initialLength) {
      return sendError(
        'User not found',
        ERROR_CODES.NOT_FOUND,
        404
      );
    }

    return sendSuccess(
      {},
      'User deleted successfully'
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return sendError(
      'Internal server error',
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}