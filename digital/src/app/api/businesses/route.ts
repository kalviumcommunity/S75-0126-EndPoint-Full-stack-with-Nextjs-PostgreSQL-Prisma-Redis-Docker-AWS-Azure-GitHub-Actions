import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration
let businesses = [
  { id: '1', name: 'ABC Company', email: 'contact@abccompany.com', phone: '+1234567890', owner_id: '1', created_at: new Date().toISOString() },
  { id: '2', name: 'XYZ Enterprises', email: 'info@xyzent.com', phone: '+0987654321', owner_id: '2', created_at: new Date().toISOString() },
];

// Helper function to generate a new ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// GET /api/businesses - Get all businesses with pagination
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
    const paginatedBusinesses = businesses.slice(offset, offset + limit);
    const totalCount = businesses.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: paginatedBusinesses,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/businesses - Create a new business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Business name and email are required' },
        { status: 400 }
      );
    }

    // Check if business already exists
    const existingBusiness = businesses.find(business => business.email === body.email);
    if (existingBusiness) {
      return NextResponse.json(
        { error: 'Business with this email already exists' },
        { status: 409 }
      );
    }

    // Create new business
    const newBusiness = {
      id: generateId(),
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      owner_id: body.owner_id || null,
      created_at: new Date().toISOString(),
    };

    businesses.push(newBusiness);

    return NextResponse.json(
      { message: 'Business created successfully', data: newBusiness },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/businesses/:id - Update a business by ID
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1]; // Extract ID from path
    
    const body = await request.json();
    
    // Find business by ID
    const businessIndex = businesses.findIndex(business => business.id === id);
    if (businessIndex === -1) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Update business
    businesses[businessIndex] = {
      ...businesses[businessIndex],
      ...body,
      id: businesses[businessIndex].id, // Preserve the ID
      created_at: businesses[businessIndex].created_at, // Preserve creation date
    };

    return NextResponse.json({
      message: 'Business updated successfully',
      data: businesses[businessIndex],
    });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/businesses/:id - Delete a business by ID
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1]; // Extract ID from path
    
    const initialLength = businesses.length;
    businesses = businesses.filter(business => business.id !== id);
    
    if (businesses.length === initialLength) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Business deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}