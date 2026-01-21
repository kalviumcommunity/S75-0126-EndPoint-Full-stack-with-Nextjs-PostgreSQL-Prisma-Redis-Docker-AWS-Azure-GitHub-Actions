import { NextRequest } from 'next/server';
import { sendSuccess, sendError } from '../../../lib/responseHandler';
import { ERROR_CODES } from '../../../lib/errorCodes';
import { handleError } from '../../../lib/errorHandler';
import { logger } from '../../../lib/logger';

// Mock data for demonstration
let users = [
  { id: '1', phone: '+1234567890', is_verified: true, created_at: new Date().toISOString() },
  { id: '2', phone: '+0987654321', is_verified: false, created_at: new Date().toISOString() },
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

    logger.info('Users fetched successfully', {
      page,
      limit,
      totalCount,
      totalPages
    });

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
    return handleError(error, 'GET /api/users');
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.phone) {
      return sendError(
        'Phone number is required',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // Check if user already exists
    const existingUser = users.find(user => user.phone === body.phone);
    if (existingUser) {
      return sendError(
        'User with this phone number already exists',
        ERROR_CODES.CONFLICT_ERROR,
        409
      );
    }

    // Create new user
    const newUser = {
      id: generateId(),
      phone: body.phone,
      is_verified: body.is_verified || false,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);

    return sendSuccess(
      { data: newUser },
      'User created successfully',
      201
    );
  } catch (error) {
    return handleError(error, 'POST /api/users');
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

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...body,
      id: users[userIndex].id, // Preserve the ID
      created_at: users[userIndex].created_at, // Preserve creation date
    };

    return sendSuccess(
      { data: users[userIndex] },
      'User updated successfully'
    );
  } catch (error) {
    return handleError(error, 'PUT /api/users');
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
    return handleError(error, 'DELETE /api/users');
  }
}