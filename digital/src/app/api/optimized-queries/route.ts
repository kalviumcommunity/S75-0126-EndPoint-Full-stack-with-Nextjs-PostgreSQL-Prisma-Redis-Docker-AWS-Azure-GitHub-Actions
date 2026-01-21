import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';

/**
 * GET /api/optimized-queries/users
 * Demonstrates optimized user queries with proper selection and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search') || '';

    // Validate pagination parameters
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1 || limit > 100) {
      return sendError(
        'Invalid pagination parameters. Page and limit must be positive integers, limit max 100.',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // Build where clause for search
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Optimized query - Select only needed fields
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          is_verified: true,
          created_at: true,
          // Count related entities efficiently
          _count: {
            select: {
              businesses: true,
              orders: true,
              payments: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.user.count({
        where: whereClause
      })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return sendSuccess({
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }, 'Users fetched successfully with optimized query');

  } catch (error) {
    console.error('Error in optimized users query:', error);
    return sendError(
      'Internal server error',
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}

/**
 * POST /api/optimized-queries/batch-create-users
 * Demonstrates batch operations for better performance
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { users } = body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return sendError(
        'Users array is required',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    if (users.length > 1000) {
      return sendError(
        'Maximum 1000 users can be created in batch',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // Batch create users - Much more efficient than individual creates
    const createdUsers = await prisma.user.createMany({
      data: users.map((user: any) => ({
        phone: user.phone,
        email: user.email,
        name: user.name,
        password: user.password || 'default_hashed_password',
        is_verified: user.is_verified ?? false
      })),
      skipDuplicates: true // Skip if phone or email already exists
    });

    // Fetch the created users with additional data
    const createdUserRecords = await prisma.user.findMany({
      where: {
        email: {
          in: users.map((u: any) => u.email)
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        is_verified: true,
        created_at: true
      }
    });

    return sendSuccess(
      { 
        data: createdUserRecords,
        count: createdUsers.count 
      },
      `Successfully created ${createdUsers.count} users in batch`,
      201
    );

  } catch (error: any) {
    console.error('Error in batch create users:', error);
    
    if (error.code === 'P2002') {
      return sendError(
        'One or more users already exist with the same phone or email',
        ERROR_CODES.CONFLICT_ERROR,
        409
      );
    }

    return sendError(
      'Internal server error',
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}