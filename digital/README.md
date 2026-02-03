# 🔐 Digital Credential - Full-Stack Application

A comprehensive full-stack application for managing digital credentials with advanced features including RBAC, file uploads, transaction management, and real-time notifications.

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Tech Stack:** Next.js 16 | React 19 | PostgreSQL | Prisma | Redis | AWS S3

---

## 📚 Documentation

### Quick Links
- 🔗 **API Documentation:** [Swagger UI](http://localhost:3000/api/docs)
- 📖 **Architecture Guide:** [ARCHITECTURE.md](../ARCHITECTURE.md)
- 📝 **Changelog:** [CHANGELOG.md](../CHANGELOG.md)
- 🚀 **Getting Started:** See below

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 8+ or yarn
- PostgreSQL 12+
- Redis 6+ (optional, for caching)

### Installation

**Step 1:** Install dependencies
```bash
npm install
```

**Step 2:** Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

**Step 3:** Set up database
```bash
npx prisma migrate dev
npx prisma db seed
```

**Step 4:** Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Viewing Documentation

Once the development server is running:
- **Swagger API Docs:** Visit [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **System Architecture:** See [ARCHITECTURE.md](../ARCHITECTURE.md)
- **API Changelog:** See [CHANGELOG.md](../CHANGELOG.md)

---

## 🔌 API Documentation

All API endpoints are fully documented with Swagger/OpenAPI 3.0.

### How to Access
1. Run the development server: `npm run dev`
2. Visit [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
3. Explore and test endpoints directly in the browser
4. View request/response schemas
5. Test with authentication tokens

### Key API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/otp/generate` - Generate OTP
- `POST /api/otp/verify` - Verify OTP

#### Users
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Businesses
- `GET /api/businesses` - List all businesses
- `POST /api/businesses` - Create new business
- `GET /api/businesses/:id` - Get business details
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business

#### Files & Uploads
- `POST /api/upload` - Get S3 presigned upload URL
- `POST /api/files` - Register file metadata
- `GET /api/files/:id` - Get file details
- `DELETE /api/files/:id` - Delete file

#### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get transaction details

### Adding Swagger Documentation

To document a new API endpoint, add JSDoc comments:

```typescript
/**
 * @swagger
 * /api/resource:
 *   get:
 *     summary: Get resource
 *     tags: [Resource]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: NextRequest) {
  // Implementation
}
```

See [ARCHITECTURE.md](../ARCHITECTURE.md#3-system-components) for full API documentation details.

---

## 🏗️ Project Structure

```
digital/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   ├── auth/                # Authentication pages
│   │   ├── dashboard/           # Dashboard pages
│   │   ├── admin/               # Admin pages
│   │   └── layout.tsx           # Root layout
│   ├── components/              # Reusable components
│   ├── context/                 # React context
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utilities and helpers
│   ├── utils/                   # Utility functions
│   └── config/                  # Configuration
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # Database seeding
│   └── migrations/              # Database migrations
├── __tests__/                   # Test files
├── public/                      # Static assets
├── ARCHITECTURE.md              # System architecture
├── CHANGELOG.md                 # Version history
└── package.json                 # Dependencies

```

---

## 🧪 Testing Setup

This project uses Jest and React Testing Library for comprehensive testing.

### Setup
```bash
npm install
npm test
```

### Test Structure
```
project/
 ├─ src/
 ├─ __tests__/
 ├─ jest.config.js
 ├─ jest.setup.js
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Examples

#### Utility Function Tests
```typescript
// __tests__/sum.test.ts
import { sum } from '../src/utils/sum';

test('adds two numbers', () => {
  expect(sum(2, 3)).toBe(5);
});
```

#### React Component Tests
```typescript
// __tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../src/components/Button';

test('renders button and handles click', () => {
  const handleClick = jest.fn();
  render(<Button label="Click Me" onClick={handleClick} />);
  
  const button = screen.getByText('Click Me');
  fireEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### Security Tests
```typescript
// __tests__/sanitize.test.ts
import { sanitizeInput } from '../src/utils/sanitize';

test('sanitizes HTML tags', () => {
  const maliciousInput = '<script>alert("XSS")</script>';
  const sanitized = sanitizeInput(maliciousInput);
  expect(sanitized).toBe('');
});
```

### Coverage

Current coverage targets (can be enabled in jest.config.js):
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Continuous Integration

Tests automatically run on GitHub Actions for every push and pull request. See `.github/workflows/test.yml` for configuration.

---

## 🔐 Security Features

- **Authentication:** JWT-based with Bcrypt password hashing
- **Authorization:** Role-based access control (RBAC)
- **Input Security:** XSS protection with DOMPurify and sanitize-html
- **Database:** SQL injection prevention via Prisma
- **File Security:** AWS S3 presigned URLs with time limits
- **Environment:** Secure secrets management

See [ARCHITECTURE.md](../ARCHITECTURE.md#6-security-features) for detailed security documentation.

---

## 📦 Tech Stack

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - RESTful API
- **Node.js** - Runtime
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching layer

### Authentication & Security
- **jose** - JWT handling
- **bcrypt** - Password hashing
- **DOMPurify** - HTML sanitization
- **sanitize-html** - Rich text sanitization

### Cloud & DevOps
- **AWS S3** - File storage
- **AWS/Azure** - Hosting options
- **Docker** - Containerization
- **GitHub Actions** - CI/CD

### Testing
- **Jest** - Test runner
- **React Testing Library** - Component testing
- **ts-jest** - TypeScript support

---

## 📝 Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm test                 # Run tests
npm test -- --coverage   # Run tests with coverage
npm run docs             # Show API docs location

# Database
npx prisma migrate dev   # Create migration
npx prisma studio       # Open Prisma Studio
npx prisma db seed      # Seed database
```

---

## 🌍 Environment Variables

Create a `.env` file with the following:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/digital_cred

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h

# AWS
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# API
API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

See `ARCHITECTURE.md#8-environment-variables` for detailed configuration.

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deployment Options
- **Vercel** - Recommended for Next.js
- **AWS EC2** - For full control
- **Azure App Service** - Microsoft ecosystem
- **Docker** - Container orchestration

See [ARCHITECTURE.md#7-deployment](../ARCHITECTURE.md#7-deployment) for detailed deployment instructions.

---

## 📊 Monitoring & Logging

The application includes:
- Request/response logging
- Performance monitoring
- Error tracking and reporting
- Structured error codes
- Debug information in development

See [ARCHITECTURE.md#11-monitoring--logging](../ARCHITECTURE.md#11-monitoring--logging) for details.

---

## 💡 Reflection

### Why Proper Documentation?

Maintaining comprehensive documentation improves:
- **Onboarding:** New developers understand the system faster
- **Maintenance:** Complex logic is easier to understand
- **Collaboration:** Team members stay aligned
- **Debugging:** Issues are resolved more quickly
- **Portfolio:** Shows professional software engineering practices

### Key Documentation Components

1. **Swagger/OpenAPI** - Interactive API documentation
2. **ARCHITECTURE.md** - System design and components
3. **CHANGELOG.md** - Version history and features
4. **README.md** - Quick start guide
5. **Inline Comments** - Complex logic explanation

This project demonstrates enterprise-grade documentation practices.

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Write tests for new features
3. Update documentation
4. Submit a pull request
5. Ensure CI/CD checks pass

### Before Committing

- [ ] Tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] Code is formatted: `prettier --write .`
- [ ] Documentation updated
- [ ] CHANGELOG.md updated

---

## 🐛 Reporting Issues

Found a bug? Please create an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support & Contact

- **Email:** support@digitalcred.com
- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation:** [ARCHITECTURE.md](../ARCHITECTURE.md)
- **API Docs:** [Swagger UI](http://localhost:3000/api/docs) (when running)

---

## 🎯 Getting Help

### Common Issues

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Database connection error?**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify credentials

**Redis connection error?**
- Redis is optional
- Set REDIS_URL if using Redis
- Application works without Redis

**API docs not loading?**
- Ensure development server is running
- Visit [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Check browser console for errors

### Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Swagger/OpenAPI](https://swagger.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📈 Roadmap

See [CHANGELOG.md](../CHANGELOG.md#roadmap) for planned features and enhancements.

---

## 🎉 Acknowledgments

Built with modern web technologies and best practices for scalability, security, and maintainability.
## Centralized Error Handling & Logging

This application implements a centralized error handling and logging system to improve debugging, security, and maintainability.

### Why Centralized Error Handling Matters

- **Consistency**: All API responses follow the same error format
- **Security**: Stack traces are hidden in production environments
- **Debugging**: Structured JSON logs make troubleshooting easier
- **Maintainability**: Error logic is centralized, reducing code duplication

### Implementation

#### Logger Utility (`src/lib/logger.ts`)

Provides structured JSON logging with timestamps and metadata:

```typescript
export const logger = {
  info: (message: string, meta?: unknown) => {
    console.log(JSON.stringify({
      level: "info",
      message,
      meta,
      timestamp: new Date().toISOString(),
    }));
  },

  error: (message: string, meta?: unknown) => {
    console.error(JSON.stringify({
      level: "error",
      message,
      meta,
      timestamp: new Date().toISOString(),
    }));
  },
};
```

#### Error Handler (`src/lib/errorHandler.ts`)

Centralized error handling with environment-aware responses:

```typescript
export function handleError(error: unknown, context: string) {
  const isProd = process.env.NODE_ENV === "production";

  const errorResponse = {
    success: false,
    message: isProd
      ? "Something went wrong. Please try again later."
      : error instanceof Error ? error.message : "Unknown error",
    ...(isProd ? {} : { stack: error instanceof Error ? error.stack : undefined }),
  };

  logger.error(`Error in ${context}`, {
    message: error instanceof Error ? error.message : "Unknown error",
    stack: isProd ? "REDACTED" : (error instanceof Error ? error.stack : "No stack trace"),
  });

  return NextResponse.json(errorResponse, { status: 500 });
}
```

### Environment Behavior

| Environment | Client Response | Internal Logs |
|-------------|------------------|----------------|
| Development | Full error + stack trace | Full details |
| Production | Generic message | Detailed but redacted |

### Usage Example

```typescript
import { handleError } from '../../../lib/errorHandler';

export async function GET() {
  try {
    // Your logic here
    throw new Error("Database connection failed!");
  } catch (error) {
    return handleError(error, "GET /api/users");
  }
}
```

### Key Benefits

1. **Structured Logs**: JSON format is machine-readable and easy to parse
2. **Security**: Production responses don't leak sensitive information
3. **Context**: Error context tells you exactly where failures occur
4. **Scalability**: Easy to extend with custom error types

### Future Extensions

You can add custom error classes for different HTTP status codes:

```typescript
class ValidationError extends Error {
  statusCode = 400;
}

class NotFoundError extends Error {
  statusCode = 404;
}
```

Then update `handleError()` to return appropriate status codes based on error type.

 task/optimisation
 main

## 🔐 Security Implementation

This application implements comprehensive security measures to protect against common web vulnerabilities including XSS (Cross-Site Scripting) and SQL Injection attacks.

### Security Libraries Used

- **sanitize-html**: Removes malicious HTML/JavaScript content
- **zod**: Runtime type validation and schema enforcement
- **dompurify**: Additional HTML sanitization for frontend rendering

### Input Sanitization (`src/utils/sanitize.ts`)

All user inputs are sanitized before processing or storage:

```typescript
import sanitizeHtml from "sanitize-html";

export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return input;

  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}
```

### Validation Schemas (`src/utils/validation.ts`)

Strict validation using Zod schemas ensures data integrity:

```typescript
export const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
```

### XSS Prevention

#### Backend Protection
- All HTML tags and scripts are stripped from user inputs
- Sanitization occurs before database storage
- Safe rendering with React's auto-escaping

#### Frontend Protection
- React automatically escapes JSX content
- Form validation prevents malicious input submission
- Optional DOMPurify for controlled HTML rendering

### SQL Injection Prevention

#### ORM Protection
- **Prisma ORM** uses parameterized queries
- No raw SQL string concatenation
- Type-safe database operations

#### Validation Layer
- Zod schemas validate input format before database queries
- Email validation prevents SQL injection patterns
- Type safety prevents injection attacks

### Security Test Results

#### XSS Protection Test
```bash
# Input
{"name": "<script>alert(\"XSS\")</script>", "email": "test@gmail.com", "password": "123456"}

# Result
{
  "originalName": "<script>alert(\"XSS\")</script>",
  "sanitizedName": "",
  "xssBlocked": true
}
```

#### SQL Injection Protection Test
```bash
# Malicious Input
{"email": "test@gmail.com' OR 1=1 --", "password": "123456"}

# Result: BLOCKED by Zod validation (invalid email format)
```

### Before & After Comparison

| Attack Type | Before Protection | After Protection |
|-------------|------------------|------------------|
| XSS Script | `<script>alert("hack")</script>` | `alert("hack")` (sanitized) |
| SQL Injection | `' OR 1=1 --` | **BLOCKED** (validation error) |
| HTML Injection | `<img src=x onerror=alert(1)>` | `img src=x onerror=alert(1)` (sanitized) |

### Implementation Examples

#### Secure API Route
```typescript
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // ✅ Validate input
    const validated = signupSchema.parse(body);
    
    // ✅ Sanitize input
    const cleanName = sanitizeInput(validated.name);
    const cleanEmail = sanitizeInput(validated.email);
    
    // ✅ Safe database query
    const user = await prisma.users.create({
      data: { name: cleanName, email: cleanEmail }
    });
    
    return NextResponse.json({ message: "User created safely", user });
  } catch (error) {
    return handleError(error, "POST /api/signup");
  }
}
```

#### Safe Frontend Rendering
```typescript
// React auto-escapes - SAFE
<p>{userInput}</p>

// Controlled HTML rendering with DOMPurify
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### Security Benefits

1. **XSS Prevention**: Scripts and malicious HTML are stripped from all inputs
2. **SQL Injection Protection**: Parameterized queries and input validation
3. **Data Integrity**: Strict validation ensures only valid data is processed
4. **Safe Rendering**: Multiple layers of protection in frontend display
5. **Centralized Security**: Consistent protection across all endpoints

### Future Security Enhancements

- **CSP Headers**: Content Security Policy implementation
- **Rate Limiting**: API endpoint protection
- **JWT Security**: Secure authentication tokens
- **HTTPS Enforcement**: SSL/TLS for all communications
- **Security Headers**: Helmet middleware integration

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

- `/api/auth` - Authentication endpoints
  - `POST /api/auth/signup` - Register new user
  - `POST /api/auth/login` - Login and get JWT token

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
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"phone":"+1234567890", "email":"user@example.com"}'
```

**Update a user:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \\
  -H "Content-Type: application/json" \\
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
| 401  | Unauthorized              | Token missing                     |
| 403  | Forbidden                 | Invalid/expired token             |
| 404  | Not Found                 | Resource missing                  |
| 409  | Conflict                  | Resource already exists           |
| 500  | Internal Server Error     | Unexpected issue                  |

## Security Headers (HSTS, CSP, CORS)

### Overview
- **HSTS (HTTP Strict Transport Security)**: Forces browsers to communicate over HTTPS only, preventing SSL stripping attacks.
- **CSP (Content Security Policy)**: Mitigates XSS by defining allowed sources for scripts, styles, and images.
- **CORS (Cross-Origin Resource Sharing)**: Restricts API access to trusted domains, preventing unauthorized cross-site requests.

### Configuration

**HSTS & CSP (`next.config.ts`):**
```typescript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload',
},
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'https://apis.google.com'; img-src 'self' data:; style-src 'self' 'unsafe-inline';",
}
```

**CORS (`middleware.ts`):**
```typescript
const allowedOrigins = ["http://localhost:3000"];
if (origin && allowedOrigins.includes(origin)) {
  response.headers.set("Access-Control-Allow-Origin", origin);
}
```

### Verification
Security headers can be verified in Browser DevTools (Network tab -> Response Headers) or via [securityheaders.com](https://securityheaders.com).

### Reflection
- **HTTPS Enforcement**: Using HSTS ensures all user data is encrypted and protects against protocol downgrade attacks.
- **Third-Party Impact**: A strict CSP can block essential third-party services (like analytics or fonts). Our setup permits Google APIs while maintaining a strong `'self'` baseline.
- **Security vs Flexibility**: By using `unsafe-inline` for styles, we allow Next.js optimizations while maintaining strict control over executable scripts and data origins.

## Authentication & Security (JWT)

### JWT Structure
JSON Web Tokens (JWT) consist of three parts separated by dots:
- **Header**: Contains the algorithm (`HS256`) and token type (`JWT`).
- **Payload**: Contains claims such as user `id`, `email`, `role`, and expiration timestamps (`iat`, `exp`).
- **Signature**: Created by hashing the encoded header and payload with a server-side secret, ensuring the token's integrity and authenticity.

### Access vs Refresh Tokens
- **Access Token (15m)**: Short-lived token used for immediate authentication in API requests. It minimizes the damage if a token is stolen.
- **Refresh Token (7d)**: Long-lived token used to generate new access tokens. It allows users to stay logged in without re-entering credentials frequently.

### Storage & Security Choices
- **Access Token**: Sent in the response body and stored in application memory (state) to prevent persistence-based XSS attacks.
- **Refresh Token**: Stored in an **HTTP-only, Secure, SameSite: Strict** cookie. This prevents client-side scripts from accessing it (XSS) and restricts cross-site usage (CSRF).

### Refresh Flow & Evidence
When an access token expires:
1. The client calls `/api/auth/refresh`.
2. The server verifies the Refresh Token from the cookie against the database.
3. If valid, the server performs **Token Rotation**:
   - Generates a new Access Token.
   - Generates a new Refresh Token and updates the database record.
   - Sets a new HTTP-only cookie.
4. **Evidence**: Server logs show `Refresh error` if invalid or successful database updates during the process.

### Security Reflection: XSS & CSRF
- **XSS (Cross-Site Scripting)**: Mitigated by using `httpOnly` cookies for refresh tokens. Even if a script is injected, it cannot read the token.
- **CSRF (Cross-Site Request Forgery)**: Mitigated by `sameSite: "strict"`. The browser will only send the cookie if the request originates from the same site, preventing unauthorized actions from third-party sites.

### Auth Flow
1. **Signup** → User registers → Password hashed with bcrypt (10 salt rounds).
2. **Login** → Credentials verified → JWT tokens generated → Refresh token stored in DB.
3. **Protected Routes** → Access Token validated via middleware/utility.
4. **Logout** → Refresh token invalidated in DB and cookie cleared.

### API Examples

**Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"mypassword"}'
```
Response:
```json
{"success":true,"message":"Signup successful","user":{"id":"...","email":"alice@example.com"}}
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"mypassword"}'
```
Response:
```json
{"success":true,"message":"Login successful","token":"eyJhbGci..."}
```

**Access Protected Route:**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Response:
```json
{"success":true,"message":"Protected data","user":{"id":"...","email":"..."}}
```

### Security Details

**Password Hashing:**
- Algorithm: bcrypt
- Salt rounds: 10
- Passwords never stored in plain text

**JWT Token (Access):**
- Algorithm: HS256
- Expiry: 15 minutes
- Payload: `{id, email, role, iat, exp}`

**JWT Token (Refresh):**
- Algorithm: HS256
- Expiry: 7 days
- Storage: HTTP-Only Cookie + Database

### Token Management

| Strategy | Storage | Pros | Cons |
|----------|---------|------|------|
| **localStorage** | Browser storage | Simple, persists across tabs | XSS vulnerable |
| **Cookies (HttpOnly)** | Server-set cookies | XSS protected | CSRF vulnerable (needs protection) |
| **Refresh Token** | Separate long-lived token | Better UX, secure | More complex |

**Recommendation:** Use HttpOnly cookies + refresh tokens for production.

### Test Results
✅ Signup: User created with hashed password  
✅ Login: JWT token generated successfully  
✅ Protected route with valid token: Access granted  
✅ Protected route without token: 401 Unauthorized  
✅ Protected route with invalid token: 403 Forbidden

## Next.js App Router & Navigation

### Route Map
- **Public Routes**: `/` (Home), `/login` (Auth)
- **Protected Routes**: `/dashboard` (User Portal), `/users/[id]` (Dynamic Profiles)

### Auth Middleware
```typescript
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token && isProtectedRoute) return NextResponse.redirect("/login");
  return NextResponse.next();
}
```

### Dynamic Routing
```typescript
export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>User ID: {id}</div>;
}
```

### Visuals (Expected)
- **Navigation**: Persistent top bar for easy access across routes.
- **Dynamic Pages**: Context-aware rendering for `/users/1`, `/users/2`.
- **Error Handling**: Custom `not-found.tsx` for graceful 404 recovery.

### Reflection
- **Scalability**: Dynamic routes allow a single template to serve millions of users.
- **SEO**: Structured, keyword-rich URLs (/users/john-doe) improve search ranking.
- **UX**: Persistent navigation and breadcrumbs provide clear context and reduce bounce rates.

## Redis Caching Implementation

### Caching Strategy (Cache-Aside)
We use the **Cache-Aside (Lazy Loading)** pattern to optimize user data retrieval:
1. **Hit**: Serve data directly from Redis.
2. **Miss**: Fetch from DB -> Store in Redis (60s TTL) -> Return response.

### Implementation Details
- **Utility**: `lib/redis.ts` handles the `ioredis` connection.
- **Cache Key**: `users:list` stores the full user list.
- **TTL**: 60 seconds to balance performance and fresh data.
- **Invalidation**: `api/users/update/route.ts` clears the cache on any update via `redis.del("users:list")`.

### Core Logic
```typescript
// GET /api/users
const cachedData = await redis.get("users:list");
if (cachedData) return JSON.parse(cachedData);

const users = await prisma.users.findMany();
await redis.set("users:list", JSON.stringify(users), "EX", 60);
return users;

// Cache Invalidation on Update
await prisma.users.update({ where: { id }, data: { phone } });
await redis.del("users:list");
```

### Latency Improvement
| Request Type | Response Time | Status |
|--------------|---------------|--------|
| First Fetch  | ~120ms        | Cache Miss |
| Subsequent   | ~10ms         | Cache Hit |

### Reflection
- **Stale Data**: Minimal risk due to manual invalidation on updates.
- **Counterproductive**: Caching is less effective for data that changes very frequently or for large, rarely accessed datasets where memory cost outweighs speed gains.

# Context API & Custom Hooks: DigitalCred

## Why AuthContext exists
AuthContext provides a single source of truth for authentication state (user, login, logout) across the app. This avoids prop drilling and ensures any component can access or update auth state globally.

## Why UIContext exists
UIContext manages UI-related state (theme, sidebar open/close) in one place. This keeps UI logic centralized, so toggling theme or sidebar is consistent and accessible from anywhere.

## Why custom hooks are used
Custom hooks (useAuth, useUI) abstract away context logic and error handling. Components use these hooks for a clean, simple API, improving reusability and maintainability.

## Folder Structure
```
digital/
├── app/
│   ├── layout.tsx      # Providers wrapped globally
│   └── page.tsx        # Demo usage of hooks
├── context/
│   ├── AuthContext.tsx # Auth state, login/logout, provider
│   └── UIContext.tsx   # Theme/sidebar state, toggles, provider
├── hooks/
│   ├── useAuth.ts      # Custom hook for AuthContext
│   └── useUI.ts        # Custom hook for UIContext
```

## State Flow
Provider → Context → Hook → Component
- Providers wrap the app in layout.tsx
- Contexts store and provide state/actions
- Hooks expose context values/actions to components
- Components use hooks to read/update state

## Reflection
- **Performance:** Context consumers only re-render when their subscribed values change, keeping updates efficient.
- **Reusability:** New global states can be added as new contexts/hooks without changing existing code.
- **No prop drilling:** Hooks access context directly, so no need to pass state/actions through many layers.
- **Pitfalls:** Overusing context for high-frequency updates can cause unnecessary re-renders. For large apps, split state into multiple contexts or use useReducer for complex logic.
- **Debugging:** Use React DevTools to inspect context values and check for unnecessary re-renders.

---

✔ AuthContext working
✔ UIContext working
✔ Custom hooks created
✔ Providers wrapped globally
✔ State visibly changes
✔ README completed

---

## Secret Management

Secrets are stored in **AWS Secrets Manager** instead of `.env` files, ensuring sensitive data is never committed to version control.

### Storage Strategy

The following secrets are managed in AWS Secrets Manager:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JSON Web Token signing key

### How It Works

1. **Storage**: Secrets are stored encrypted in AWS Secrets Manager under the name `nextjs/app-secrets`
2. **Retrieval**: The app fetches secrets at runtime using the AWS SDK (`lib/secrets.ts`)
3. **Configuration**: Only the secret ARN and AWS region are stored in `.env.local` (non-sensitive references)

### Implementation Files

- **src/lib/secrets.ts** - Utility function to fetch secrets from AWS
- **src/app/api/test/route.ts** - Test endpoint to verify secrets are loaded correctly
- **.env.local** - Contains only `AWS_REGION` and `SECRET_ARN` (no actual passwords)

### Access Control (IAM)

An IAM policy with least privilege access is attached to your app's role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:ap-south-1:123456789:secret:nextjs/app-secrets*"
    }
  ]
}
```

**Important**: The policy grants only `GetSecretValue` permission and is scoped to the specific secret.

### Setup Steps

1. **Create Secret in AWS**
   - Go to AWS Console → Secrets Manager → Store a new secret
   - Choose "Other type of secret"
   - Add your secrets as JSON:
     ```json
     {
       "DATABASE_URL": "your-db-connection-string",
       "JWT_SECRET": "your-jwt-signing-key"
     }
     ```
   - Name it: `nextjs/app-secrets`
   - Copy the ARN

2. **Update .env.local**
   ```
   AWS_REGION=ap-south-1
   SECRET_ARN=arn:aws:secretsmanager:ap-south-1:123456789:secret:nextjs/app-secrets
   ```

3. **Configure IAM**
   - Create an IAM policy with the least privilege statement above
   - Attach to your EC2 role, ECS task role, or IAM user

4. **Test Retrieval**
   ```bash
   npm run dev
   # Visit http://localhost:3000/api/test
   ```
   Expected response:
   ```json
   {
     "db": "Loaded",
     "jwt": "Loaded"
   }
   ```

### Security Benefits

✔ **Encrypted at rest** - AWS handles encryption  
✔ **Encrypted in transit** - AWS SDK uses TLS  
✔ **Not in version control** - Never committed to Git  
✔ **Least privilege access** - IAM policy scoped to specific secret  
✔ **Audit trail** - CloudTrail logs all secret access  
✔ **Rotation ready** - Can enable automatic rotation with Lambda  

### Future Improvements

- Enable AWS automatic secret rotation with Lambda
- Set up CloudTrail monitoring for secret access
- Implement secret caching to reduce API calls
- Add secret versioning for safer updates
````
