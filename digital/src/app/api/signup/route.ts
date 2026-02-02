import { sanitizeInput } from "../../../utils/sanitize";
import { NextRequest } from "next/server";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";
import { signupSchema } from "../../../utils/validation";
import { ZodError, z } from "zod";
import { prisma } from "../../../lib/prisma";

// Define TypeScript interface
interface User {
  id: string;
  phone?: string;
  email?: string;
  name?: string;
  password: string;
  is_verified: boolean;
  created_at: string;
  role?: string;
}

// Mock data
let users: User[] = [
  {
    id: "1",
    phone: "+1234567890",
    email: "user1@example.com",
    name: "John Doe",
    password: "hashed_password_1",
    is_verified: true,
    created_at: new Date().toISOString(),
  },
];

/* =====================================
   GET /api/signup
===================================== */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1 || limit > 100) {
      return sendError(
        "Invalid pagination parameters",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const paginatedUsers = users.slice(offset, offset + limit);

    return sendSuccess(
      {
        data: paginatedUsers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(users.length / limit),
          totalItems: users.length,
        },
      },
      "Signups fetched successfully"
    );
  } catch (error) {
    console.error(error);

    return sendError(
      "Internal server error",
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}

/* =====================================
   POST /api/signup (CREATE USER)
===================================== */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

 signup-api
    // ✅ Validate
    const validated = signupSchema.parse(body);

    // Create new user
    const newUser: User = {
      id: generateId(),
      phone: validatedData.phone,
      email: validatedData.email,
      name: validatedData.name,
      password: validatedData.password, // In a real app, this should be hashed
      is_verified: false, // New signups are not verified initially
      created_at: new Date().toISOString(),
      role: 'viewer', // Assign default role to new users
    };
 main

    // ✅ Sanitize
    const cleanName = sanitizeInput(validated.name) as string;
    const cleanEmail = sanitizeInput(validated.email) as string;

 signup-api
    // ✅ Safe DB query (Prisma protects against injections)
    const user = await prisma.users.create({
      data: {
        phone: cleanName, // using name as phone for now since schema requires phone
        email: cleanEmail,
        password: validated.password, // hash before production
      },
    });

    // Don't return the password and role in the response for security
    const { password, role, ...userWithoutPassword } = newUser;
 main

    // Remove password before returning
    const { password: _password, ...safeUser } = user;

    return sendSuccess({ data: safeUser }, "User created safely", 201);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return sendError(
        "Validation failed",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }))
      );
    }

    console.error(error);

    return sendError(
      "Internal server error",
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}

/* =====================================
   PUT /api/signup/:id (UPDATE USER)
===================================== */
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const body = await request.json();

    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return sendError(
        "User not found",
        ERROR_CODES.NOT_FOUND,
        404
      );
    }

    // Zod Partial Validation
    const validatedData = signupSchema.extend({
      phone: z.string().optional()
    }).partial().parse(body);

    // Sanitize Updated Fields (STEP 5)
    const cleanData: Record<string, unknown> = {};

    if (validatedData.email) {
      cleanData.email = sanitizeInput(validatedData.email);
    }

    if (validatedData.name) {
      cleanData.name = sanitizeInput(validatedData.name);
    }

    if (validatedData.phone) {
      cleanData.phone = sanitizeInput(validatedData.phone);
    }

    if (validatedData.password) {
      cleanData.password = validatedData.password;
    }

    // Update User
    users[index] = {
      ...users[index],
      ...cleanData,
    };

    // Don't return the password in the response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = users[index];

    return sendSuccess(
      { data: safeUser },
      "Signup updated successfully"
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return sendError(
        "Validation failed",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }))
      );
    }

    console.error(error);

    return sendError(
      "Internal server error",
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}

/* =====================================
   DELETE /api/signup/:id
===================================== */
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const before = users.length;

    users = users.filter((u) => u.id !== id);

    if (before === users.length) {
      return sendError(
        "User not found",
        ERROR_CODES.NOT_FOUND,
        404
      );
    }

    return sendSuccess({}, "Signup deleted");
  } catch (error) {
    console.error(error);

    return sendError(
      "Internal server error",
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
}
