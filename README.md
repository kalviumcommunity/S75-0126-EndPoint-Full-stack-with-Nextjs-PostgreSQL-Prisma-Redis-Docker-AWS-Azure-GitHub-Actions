
# **Project Plan: DigitalCred**

### *A Low-Friction Digital Credibility System for Small-Scale Entrepreneurs*

---

## 1. Problem Statement

Small-scale entrepreneurs often lack a digital identity and credible online presence due to complex KYC requirements. This limits customer trust in informal and local businesses operating outside traditional platforms.

---

## 2. Project Goal

To build a **low-friction digital trust platform** that enables local businesses to establish credibility using **community verification, activity signals, and transparent trust scoring**, instead of heavy KYC processes.

---

## 3. Proposed Solution

**DigitalCred** is a web-based platform where local businesses can create a digital profile and gain credibility through:

* Community verification
* Customer reviews
* Activity-based trust scoring



---

## 4. Key Features

* OTP-based business onboarding
* Public business profile with shareable link and QR code
* Community verification and customer reviews
* Dynamic trust score based on activity and validations
* Reporting system and admin moderation dashboard

---

## 5. Technologies Used

### Frontend

* **Next.js** (React Framework)
* **Tailwind CSS**

### Backend

* **Node.js**
* **Next.js API Routes** (or Express.js if separated)

### Database & ORM

* **PostgreSQL**
* **Prisma ORM**

### Caching & Performance

* **Redis** (for OTPs, trust score caching, rate limiting)

### Authentication

* **OTP-based Authentication** (Phone / Email)

### Validation

* **Zod** (Runtime validation for API inputs)

### DevOps & Deployment

* **Docker** (Containerization)
* **GitHub Actions** (CI/CD)
* **AWS / Azure** (Cloud deployment)


## 6. 4-Week Sprint Plan

**Week 1**

* Requirement analysis
* UI/UX design
* Project setup (Next.js, Prisma, PostgreSQL)

**Week 2**

* OTP authentication
* Business onboarding
* Profile creation

**Week 3**

* Trust score algorithm
* Community verification
* Reviews and ratings system

**Week 4**

* Testing and bug fixes
* Deployment using Docker
* Demo and documentation preparation

---

## 7. Success Criteria

* Business onboarding completed in under **2 minutes**
* Trust score updates dynamically based on activity
* Public and shareable business profile
* Fully deployed and functional application



## Environment Variables Management

This project uses environment variables to manage configuration securely.
The .env.local file stores sensitive values such as database credentials and is ignored by Git, while .env.example is committed as a template for required variables.

Server-side secrets like DATABASE_URL are used only in backend code, and only variables prefixed with NEXT_PUBLIC_ are accessible on the client.
To replicate the setup, copy .env.example to .env.local, fill in the required values, and run the project normally.


## Branching Strategy & Naming Conventions for DigitalCred

**How this helps:**
This workflow ensures consistent code quality through reviews and automated checks.
It improves team collaboration by enforcing clear processes and shared standards.
It increases development velocity by reducing errors, rework, and merge conflicts.

**Consistent pattern for your team’s branches:**

**feature/<feature-name>** - New features or enhancements.

**errorfix/<issue-description>** - Bug fixes.

**task/<task-name>** - Specific tasks or chores.

**guide/<documentation-topic>** - Documentation updates.


Example : 
* feature/user-authentication
* errorfix/login-issue  
* task/setup-docker
* guide/api-documentation

## Pull Request Template

In digital/.github/pull_request_template.md


## PostgreSQL Schema Design (Supabase)
**Overview**

This project focuses on designing a normalized relational database schema using PostgreSQL on Supabase.
The schema supports user authentication via OTP and business signup information, while ensuring data integrity, scalability, and efficient querying.

ER Diagram (Textual Representation)
users
-----
id (PK)
phone (UNIQUE)
is_verified
created_at

   |
   | 1-to-1
   |
signup
------
id (PK)
user_id (FK → users.id)
business_name
category
area
created_at


otp
---
id (PK)
phone
otp
expires_at
created_at

Database Tables & Schema
**1.users Table**

Stores registered user details.

Primary Key: id (UUID)

Constraints:

phone is UNIQUE and NOT NULL

is_verified defaults to false

This table uniquely identifies each user and avoids duplicate phone numbers.

**2.otp Table**

Stores one-time passwords for verification.

Primary Key: id (UUID)

Constraints:

otp and expires_at are NOT NULL

This table is kept separate to avoid redundancy and to support secure, time-based OTP validation.

**3.signup Table**

Stores business-related details of users.

Primary Key: id (UUID)

Foreign Key: user_id → users.id

Constraint: ON DELETE CASCADE

Each signup record is linked to exactly one user, ensuring referential integrity.

**Keys, Constraints & Relationships**

Primary Keys (PK): Used in all tables to uniquely identify records

Foreign Key (FK): signup.user_id references users.id

ON DELETE CASCADE: Ensures no orphan records exist

UNIQUE Constraint: Enforced on phone numbers

**Relationship:**

One User → One Signup

**Normalization**

1NF: All fields contain atomic values

2NF: No partial dependency on composite keys

3NF: No redundant or derived data stored

This design avoids duplication and improves maintainability.


## API Route structure and naming

### API Route Hierarchy

- `/api/users` - User management endpoints
  - `GET /api/users` - Get all users with pagination
  - `POST /api/users` - Create a new user
  - `PUT /api/users/:id` - Update a user by ID
  - `DELETE /api/users/:id` - Delete a user by ID

- `/api/businesses` - Business management endpoints
  - `GET /api/businesses` - Get all businesses with pagination
  - `POST /api/businesses` - Create a new business
  - `PUT /api/businesses/:id` - Update a business by ID
  - `DELETE /api/businesses/:id` - Delete a business by ID

- `/api/signup` - User signup endpoints
  - `GET /api/signup` - Get all signups with pagination
  - `POST /api/signup` - Create a new signup
  - `PUT /api/signup/:id` - Update a signup by ID
  - `DELETE /api/signup/:id` - Delete a signup by ID

- `/api/otp` - OTP management endpoints
  - `POST /api/otp` - Create a new OTP
  - `POST /api/otp/verify` - Verify an OTP

### HTTP Verbs and Resource Actions

| HTTP Verb | Purpose             | Example Route           | Description              |
|-----------|---------------------|-------------------------|--------------------------|
| GET       | Read data           | `/api/users`            | Get all users            |
| POST      | Create data         | `/api/users`            | Create a new user        |
| PUT       | Update data         | `/api/users/:id`        | Update a user            |
| DELETE    | Remove data         | `/api/users/:id`        | Delete a user            |

### Sample Requests & Responses

**Get all users with pagination:**
```bash
curl -X GET http://localhost:3000/api/users?page=1&limit=10
```

**Create a new user:**

curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890"}'
```

**Update a user:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"phone":"+0987654321"}'
```

**Delete a user:**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

### Pagination

All GET requests that return large lists support pagination:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

Example: `/api/users?page=2&limit=20`

### Error Handling

The API returns appropriate HTTP status codes:

| Code | Meaning                   | Usage                             |
|------|---------------------------|-----------------------------------|
| 200  | OK                        | Successful GET                    |
| 201  | Created                   | POST success                      |
| 400  | Bad Request               | Invalid input                     |
| 404  | Not Found                 | Resource missing                  |
| 409  | Conflict                  | Resource already exists           |
| 500  | Internal Server Error     | Unexpected issue                  |

### Consistent Naming Benefits

Consistent naming improves maintainability and reduces integration errors by:

1. Making the API intuitive and predictable
2. Following RESTful conventions
3. Using plural nouns for resource collections
4. Maintaining uniform structure across all endpoints
5. Providing clear documentation for developers

## API Routes Documentation

This application includes several RESTful API endpoints under the `/api/` route:

### API Route Hierarchy

- `/api/users` - User management endpoints
  - `GET /api/users` - Get all users with pagination
  - `POST /api/users` - Create a new user
  - `PUT /api/users/:id` - Update a user by ID
  - `DELETE /api/users/:id` - Delete a user by ID

- `/api/businesses` - Business management endpoints
  - `GET /api/businesses` - Get all businesses with pagination
  - `POST /api/businesses` - Create a new business
  - `PUT /api/businesses/:id` - Update a business by ID
  - `DELETE /api/businesses/:id` - Delete a business by ID

- `/api/signup` - User signup endpoints
  - `GET /api/signup` - Get all signups with pagination
  - `POST /api/signup` - Create a new signup
  - `PUT /api/signup/:id` - Update a signup by ID
  - `DELETE /api/signup/:id` - Delete a signup by ID

- `/api/otp` - OTP management endpoints
  - `POST /api/otp` - Create a new OTP
  - `PUT /api/otp/verify` - Verify an OTP

- `/api` - Root API endpoint
  - `GET /api` - Simple API test endpoint
  - `POST /api` - Simple API test endpoint

- `/api/transactions` - Transaction management endpoints
  - `POST /api/transactions` - Place an order with transaction handling
  - `GET /api/transactions` - Test transaction rollback behavior

- `/api/optimized-queries` - Performance optimized endpoints
  - `GET /api/optimized-queries/users` - Optimized user queries with proper selection
  - `POST /api/optimized-queries/batch-create-users` - Batch user creation

### HTTP Verbs and Resource Actions

| HTTP Verb | Purpose             | Example Route           | Description              |
|-----------|---------------------|-------------------------|--------------------------|
| GET       | Read data           | `/api/users`            | Get all users            |
| POST      | Create data         | `/api/users`            | Create a new user        |
| GET (by ID)| Read specific record| `/api/users/:id`        | Get user by ID           |
| PUT       | Update data         | `/api/users/:id`        | Update a user            |
| DELETE    | Remove data         | `/api/users/:id`        | Delete a user            |

### Sample Requests & Responses

**Get all users with pagination:**
```bash
curl -X GET http://localhost:3000/api/users?page=1&limit=10
```

**Create a new user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890", "email":"user@example.com"}'
```

**Place an order with transaction:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-id", "businessId":"business-id", "items":[{"productId":"prod-id", "quantity":2, "price":29.99}], "paymentMethod":"credit_card"}'
```

**Get optimized user queries:**
```bash
curl -X GET http://localhost:3000/api/optimized-queries/users?page=1&limit=20
```

**Batch create users:**
```bash
curl -X POST http://localhost:3000/api/optimized-queries/batch-create-users \
  -H "Content-Type: application/json" \
  -d '{"users":[{"phone":"+1234567890", "email":"user1@example.com", "name":"User 1", "password":"pass"}, {"phone":"+1234567891", "email":"user2@example.com", "name":"User 2", "password":"pass"}]}'
```

**Update a user:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"phone":"+0987654321"}'
```

**Delete a user:**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

### Pagination

All GET requests that return large lists support pagination:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

Example: `/api/users?page=2&limit=20`

### Error Handling

The API returns appropriate HTTP status codes:

| Code | Meaning                   | Usage                             |
|------|---------------------------|-----------------------------------|
| 200  | OK                        | Successful GET                      |
| 201  | Created                   | POST success                      |
| 400  | Bad Request               | Invalid input                     |
| 404  | Not Found                 | Resource missing                  |
| 409  | Conflict                  | Resource already exists           |
| 500  | Internal Server Error     | Unexpected issue                  |

### Consistent Naming Benefits

Consistent naming improves maintainability and reduces integration errors by:

1. Making the API intuitive and predictable
2. Following RESTful conventions
3. Using plural nouns for resource collections
4. Maintaining uniform structure across all endpoints
5. Providing clear documentation for developers


## Standardized Response Format

All API endpoints return responses in a consistent format:

**Success Response:**
```
{
  "success": true,
  "message": "Operation successful message",
  "data": { /* response payload */ },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

**Error Response:**
```
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": { /* optional error details */ }
  },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

### Defined Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| E001 | VALIDATION_ERROR | Request validation failed |
| E002 | NOT_FOUND | Resource not found |
| E003 | DATABASE_FAILURE | Database operation failed |
| E004 | CONFLICT_ERROR | Resource conflict (e.g., duplicate) |
| E500 | INTERNAL_ERROR | Internal server error |

### Reflection on Developer Experience and Observability

The standardized response format provides significant benefits:

1. **Predictable Frontend Logic**: All API responses follow the same structure, making it easier to handle responses consistently.
2. **Improved Error Handling**: Structured error responses with codes help identify issues quickly.
3. **Better Debugging**: Timestamps allow for tracking when issues occurred.
4. **Enhanced Monitoring**: Consistent format enables easier integration with logging and monitoring tools.
5. **Team Collaboration**: All developers work with the same response patterns, reducing cognitive load.


## Input Validation with Zod

This project implements robust input validation using Zod to ensure data integrity and security across all API endpoints. Zod provides runtime validation, TypeScript integration, and excellent error handling for all incoming requests.

### Schema Definitions

User schema definition (`src/lib/schemas/userSchema.ts`):

```typescript
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "User must be 18 or older"),
});
```

### Validation Examples

**Passing Validation:**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "age": 22
}
```
Result: Status 201 - User created successfully

**Failing Validation:**
```json
{
  "name": "A",
  "email": "bademail"
}
```
Result: Status 400 - Returns structured error response

**Expected Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "E001",
    "details": [
      {"field": "name", "message": "Name must be at least 2 characters long"},
      {"field": "email", "message": "Invalid email address"}
    ]
  }
}
```

### Schema Reuse

Schemas are designed for reuse between client and server:
- **Client**: Validate form inputs before submitting to reduce unnecessary API calls
- **Server**: Validate data again before processing (defense in depth strategy)

### Validation Consistency Benefits

Validation consistency provides significant advantages in team projects:
1. **Shared Understanding**: All team members work with the same validation rules
2. **Reduced Bugs**: Early detection of invalid data prevents downstream errors
3. **Better UX**: Consistent validation feedback across frontend and backend
4. **Maintainability**: Centralized validation logic that's easy to update
5. **Type Safety**: Compile-time and runtime validation with TypeScript support

## Transaction and Performance Optimizations

### Transaction Scenarios

**Location:** `digital/src/app/api/transactions/route.ts`

- **Order Placement Transaction**: Ensures atomicity when creating orders, updating inventory, and recording payments
- **Multiple Operations**: Combines order creation, inventory update, and payment recording in a single transaction
- **Use Case**: When placing an order, all three operations (create order, update product stock, record payment) must succeed together to maintain data consistency

### Rollback Logic

**Location:** `digital/src/app/api/transactions/route.ts`

- **Atomicity Guarantee**: Uses Prisma's `$transaction()` API to ensure all operations succeed or all fail
- **Error Handling**: Wraps transactions in try-catch blocks to handle errors gracefully
- **Verification**: Tests rollback behavior by intentionally triggering errors and confirming no partial writes occurred
- **Automatic Rollback**: Prisma automatically rolls back changes when any operation in the transaction fails

### Indexes Added

**Location:** `digital/prisma/schema.prisma`

**User Model:**
- `@@index([phone])` - Optimizes phone-based lookups
- `@@index([email])` - Optimizes email-based lookups
- `@@index([created_at])` - Optimizes chronological queries

**Business Model:**
- `@@index([owner_id])` - Optimizes user-business relationship queries
- `@@index([category])` - Optimizes category-based filtering
- `@@index([area])` - Optimizes location-based queries
- `@@index([is_active])` - Optimizes active/inactive filtering

**Product Model:**
- `@@index([business_id])` - Optimizes business-product relationship queries
- `@@index([category])` - Optimizes category-based filtering
- `@@index([stock])` - Optimizes inventory queries
- `@@index([is_active])` - Optimizes active/inactive filtering

**Order Model:**
- `@@index([user_id])` - Optimizes user-order relationship queries
- `@@index([business_id])` - Optimizes business-order relationship queries
- `@@index([status])` - Optimizes status-based filtering

### Performance Optimizations

**Location:** `digital/src/app/api/optimized-queries/route.ts`

- **Avoid Over-fetching**: Uses `select` to only fetch needed fields instead of full objects
- **Batch Operations**: Implements `createMany` for efficient bulk inserts
- **Proper Pagination**: Uses `skip` and `take` for efficient pagination
- **Count Optimization**: Separates count operations for better performance

### Performance Comparison

**Location:** `digital/src/lib/performanceMonitor.ts`

**Before Optimization:**
- Full table scans with `include` fetching all related data
- Individual record creation instead of batch operations
- No field selection, retrieving entire objects

**After Optimization:**
- Field-level selection with `select` only needed data
- Batch operations with `createMany` for bulk inserts
- Indexed queries for faster lookups
- Proper pagination to limit result sets

### Anti-patterns Avoided

- **N+1 Queries**: Fixed by using proper `include` and `select` with relation counts
- **Full Table Scans**: Prevented by adding appropriate database indexes
- **Over-fetching**: Resolved by selecting only required fields
- **Individual Operations**: Replaced with batch operations for bulk actions

### Production Monitoring Strategy

**Location:** `digital/src/lib/performanceMonitor.ts`

- **Latency Tracking**: Monitors query execution times with timing logs
- **Error Rate Monitoring**: Tracks transaction failures and rollbacks
- **Slow Query Detection**: Identifies queries exceeding threshold (default 100ms)
- **Performance Baselines**: Establishes metrics for query performance
- **Health Checks**: Regular database connectivity and performance tests

## Centralized Error Handling

### Explanation and Importance

Centralized error handling is a critical component of any robust application that provides consistent error responses, proper logging, and secure error messages. It ensures that all errors are processed through a unified system that maintains application stability and user trust.

**Why it's important:**
- Provides consistent error responses across all API endpoints
- Prevents sensitive information from leaking to clients
- Enables proper logging for debugging and monitoring
- Improves user experience with standardized error messages
- Facilitates systematic error tracking and analysis

### Code Snippets

#### logger.ts
```typescript
import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'app.log');

export const logger = {
  info: (message: string, meta?: any) => {
    const logEntry = `[INFO] ${new Date().toISOString()} - ${message}${meta ? ` - Meta: ${JSON.stringify(meta)}` : ''}\n`;
    console.log(logEntry.trim());
    fs.appendFileSync(logFile, logEntry);
  },
  
  error: (message: string, error?: any) => {
    const logEntry = `[ERROR] ${new Date().toISOString()} - ${message}${error ? ` - Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}` : ''}\n`;
    console.error(logEntry.trim());
    fs.appendFileSync(logFile, logEntry);
  },
  
  warn: (message: string, meta?: any) => {
    const logEntry = `[WARN] ${new Date().toISOString()} - ${message}${meta ? ` - Meta: ${JSON.stringify(meta)}` : ''}\n`;
    console.warn(logEntry.trim());
    fs.appendFileSync(logFile, logEntry);
  }
};
```

#### errorHandler.ts
```typescript
import { logger } from './logger';
import { errorCodes } from './errorCodes';

export class ErrorHandler {
  static handle(error: any, isDev: boolean = process.env.NODE_ENV === 'development') {
    const errorId = this.generateErrorId();
    
    // Log the error with full details in development
    logger.error(`Error occurred (ID: ${errorId})`, {
      message: error.message,
      stack: isDev ? error.stack : undefined,
      name: error.name,
      timestamp: new Date().toISOString()
    });
    
    // Determine error response based on environment
    if (isDev) {
      // Full error details in development for debugging
      return {
        success: false,
        error: {
          code: error.code || errorCodes.INTERNAL_ERROR,
          message: error.message,
          stack: error.stack,
          errorId
        }
      };
    } else {
      // Safe, redacted error message in production
      return {
        success: false,
        error: {
          code: error.code || errorCodes.INTERNAL_ERROR,
          message: 'An internal server error occurred',
          errorId
        }
      };
    }
  }
  
  private static generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}
```

### Comparison Table: Development vs Production Error Responses

| Aspect | Development | Production |
|--------|-------------|------------|
| Stack Trace | Included for debugging | Hidden for security |
| Error Messages | Detailed with technical info | Generic, user-friendly |
| Error ID | Present in both | Present in both |
| Sensitive Data | May be exposed | Strictly redacted |
| Logging Level | Full details logged | Essential details only |

### Logs Showing Different Behaviors

#### Full Stack Trace in Development:
```
[ERROR] 2025-01-22T10:30:00.123Z - Database connection failed (ID: ERR_1705915800_A1B2C3D4E)
- Error: Connection timeout after 5000ms
- Stack: Error: Connection timeout
    at connectToDatabase (database.js:45:12)
    at initializeApp (app.js:23:5)
    ...
```

#### Redacted, Safe Message in Production:
```
[ERROR] 2025-01-22T10:30:00.123Z - Database connection failed (ID: ERR_1705915800_F5G6H7I8J)
- Error: An internal server error occurred
```

Sandbox mode, rate limits, and bounce handling considered