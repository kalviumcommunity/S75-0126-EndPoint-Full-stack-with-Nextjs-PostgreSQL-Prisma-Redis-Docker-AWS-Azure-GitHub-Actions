# System Architecture – Digital Credential

## 1. Overview

Digital Credential is a comprehensive full-stack application for managing digital credentials and business operations with advanced features like RBAC, file uploads, transaction management, and real-time notifications.

### Tech Stack
- **Frontend:** Next.js 16 (React 19)
- **Backend:** Next.js API Routes (Node.js)
- **Database:** PostgreSQL with Prisma ORM
- **Caching:** Redis (ioredis)
- **Authentication:** JWT (jose)
- **File Storage:** AWS S3
- **Cloud Platforms:** AWS, Azure
- **CI/CD:** GitHub Actions
- **Testing:** Jest + React Testing Library
- **Security:** Bcrypt, DOMPurify, Sanitize-HTML

---

## 2. System Components

### 2.1 Frontend Layer
- **User Dashboard** - View credentials and profile
- **Authentication Pages** - Login, Signup, OTP verification
- **Business Management** - Create and manage business accounts
- **Admin Panel** - User management and system monitoring
- **File Upload** - Secure file uploads with progress tracking
- **Responsive UI** - Tailwind CSS styling

### 2.2 Backend API Layer
- **REST API** - Next.js API Routes at `/api/*`
- **Authentication Service** - JWT-based auth with refresh tokens
- **Authorization Service** - Role-Based Access Control (RBAC)
- **Data Validation** - Zod schema validation
- **Error Handling** - Centralized error handling with error codes
- **Logging** - Request/response logging
- **Security** - Input sanitization, XSS protection

### 2.3 Database Layer
- **Users** - User accounts with roles (user, business, admin)
- **Businesses** - Business profiles and metadata
- **Transactions** - Financial transaction records
- **Files** - File metadata and S3 references
- **Sessions** - JWT token management
- **Relationships** - User-Business associations

### 2.4 External Services
- **AWS S3** - File storage and presigned URLs
- **Redis** - Caching and session storage
- **Prisma Cloud** - Database schema management

---

## 3. Directory Structure

```
src/
 ├── app/
 │   ├── api/                    # API Routes
 │   │   ├── auth/              # Authentication endpoints
 │   │   ├── users/             # User management
 │   │   ├── businesses/        # Business operations
 │   │   ├── transactions/      # Transaction management
 │   │   ├── upload/            # File upload endpoints
 │   │   ├── files/             # File operations
 │   │   ├── rbac-test/         # RBAC testing
 │   │   ├── login/             # Login endpoint
 │   │   ├── signup/            # Registration endpoint
 │   │   ├── otp/               # OTP verification
 │   │   ├── security-test/     # Security testing
 │   │   ├── generate-token/    # Token generation
 │   │   └── docs/              # Swagger documentation
 │   ├── auth/                   # Auth pages
 │   ├── dashboard/              # User dashboard
 │   ├── admin/                  # Admin pages
 │   ├── business/               # Business pages
 │   ├── layout.tsx              # Root layout
 │   ├── page.tsx                # Home page
 │   └── globals.css             # Global styles
 │
 ├── components/
 │   ├── ui/                     # Reusable UI components
 │   ├── layout/                 # Layout components
 │   ├── Button.tsx              # Button component
 │   ├── FormInput.tsx           # Form input component
 │   ├── Modal.tsx               # Modal component
 │   ├── RBACWrapper.tsx         # Role-based access wrapper
 │   └── SkeletonLoader.tsx      # Loading skeleton
 │
 ├── context/
 │   ├── AuthContext.tsx         # Authentication state
 │   └── UIContext.tsx           # UI state management
 │
 ├── hooks/
 │   ├── useAuth.ts              # Auth hook
 │   ├── useApi.ts               # API call hook
 │   └── useUI.ts                # UI state hook
 │
 ├── lib/
 │   ├── auth.ts                 # Authentication utilities
 │   ├── authMiddleware.ts       # Auth middleware
 │   ├── errorCodes.ts           # Error code constants
 │   ├── errorHandler.ts         # Error handling logic
 │   ├── fetcher.ts              # API fetcher utility
 │   ├── fileUpload.ts           # File upload utilities
 │   ├── logger.ts               # Logging service
 │   ├── performanceMonitor.ts   # Performance monitoring
 │   ├── prisma.ts               # Prisma client
 │   ├── redis.ts                # Redis client
 │   ├── responseHandler.ts      # Response formatting
 │   ├── secrets.ts              # Environment variables
 │   ├── transactionExamples.ts  # Transaction examples
 │   └── schemas/                # Zod validation schemas
 │
 ├── utils/
 │   ├── sanitize.ts             # Input sanitization
 │   ├── sum.ts                  # Utility functions
 │   └── ...                     # Other utilities
 │
 └── config/
     └── swagger.ts              # Swagger configuration

prisma/
 ├── schema.prisma               # Database schema
 ├── seed.ts                     # Database seeding
 └── migrations/                 # Migration files

__tests__/
 ├── components/                 # Component tests
 ├── utils/                      # Utility tests
 └── setup.ts                    # Test setup

public/                          # Static assets
```

---

## 4. Data Flow

### 4.1 Authentication Flow
```
User Input
  ↓
Frontend Form Validation (Zod)
  ↓
POST /api/auth/signup or /api/login
  ↓
Backend Validation (Zod Schema)
  ↓
Hash Password (Bcrypt)
  ↓
Save to PostgreSQL (Prisma)
  ↓
Generate JWT Token (jose)
  ↓
Cache in Redis (Optional)
  ↓
Return Token to Client
  ↓
Store in localStorage (Client)
```

### 4.2 Protected Route Access Flow
```
Client Request with JWT
  ↓
Middleware Validation (authMiddleware.ts)
  ↓
Extract User Claims
  ↓
Check RBAC Permissions (RBACWrapper)
  ↓
Allow/Deny Access
  ↓
Route Handler Execution
  ↓
Return Response
```

### 4.3 File Upload Flow
```
User Selects File
  ↓
Frontend Validation
  ↓
POST /api/upload (Get presigned URL)
  ↓
Server validates auth + permissions
  ↓
Generate S3 Presigned URL
  ↓
Return URL to client
  ↓
Client uploads directly to S3
  ↓
POST /api/files (Register file metadata)
  ↓
Save in PostgreSQL
  ↓
Return file reference
```

---

## 5. API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/otp/generate` - Generate OTP
- `POST /api/otp/verify` - Verify OTP

### Users
- `GET /api/users` - List all users (Admin)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Businesses
- `GET /api/businesses` - List businesses
- `POST /api/businesses` - Create business
- `GET /api/businesses/:id` - Get business details
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business

### Files
- `POST /api/upload` - Get S3 presigned URL
- `POST /api/files` - Register file
- `GET /api/files/:id` - Get file details
- `DELETE /api/files/:id` - Delete file

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get transaction details

---

## 6. Security Features

### 6.1 Authentication
- JWT tokens with configurable expiry
- Bcrypt password hashing
- Token refresh mechanism
- Secure session management

### 6.2 Authorization
- Role-Based Access Control (RBAC)
- Permission-based endpoint protection
- User-level data isolation

### 6.3 Input Security
- Zod schema validation
- DOMPurify HTML sanitization
- sanitize-html for rich text
- XSS prevention

### 6.4 Data Protection
- Environment variable secrets management
- Encrypted database connections
- AWS S3 presigned URLs (time-limited)
- HTTPS enforcement in production

---

## 7. Deployment

### 7.1 Development
```bash
npm run dev
```
Runs on `http://localhost:3000`

### 7.2 Production Build
```bash
npm run build
npm start
```

### 7.3 Cloud Deployment
- **Hosting:** AWS EC2 / Vercel / Azure App Service
- **Database:** AWS RDS PostgreSQL / Azure Database
- **File Storage:** AWS S3 / Azure Blob Storage
- **Caching:** AWS ElastiCache / Azure Cache for Redis
- **CI/CD:** GitHub Actions
- **Monitoring:** CloudWatch / Azure Monitor

---

## 8. Environment Variables

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

# Redis
REDIS_URL=redis://localhost:6379

# API
API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

---

## 9. Testing

### Running Tests
```bash
npm test                           # Run all tests
npm test -- --coverage             # With coverage
npm test -- --watch                # Watch mode
npm test components/Button.test    # Specific test file
```

### Test Structure
- Unit tests for utilities and functions
- Component tests with React Testing Library
- Integration tests for API routes
- Mocking with Jest
- Coverage reporting

---

## 10. Performance Optimization

### 10.1 Frontend
- Next.js image optimization
- Code splitting and lazy loading
- CSS-in-JS with Tailwind
- React hooks for state management

### 10.2 Backend
- Redis caching for frequently accessed data
- Database query optimization (Prisma)
- Pagination for large datasets
- Compression middleware

### 10.3 Database
- Indexing on frequently queried columns
- Prisma query optimization
- Connection pooling
- Migration management

---

## 11. Monitoring & Logging

### 11.1 Logging
- Request/response logging (`logger.ts`)
- Error tracking (`errorHandler.ts`)
- Performance monitoring (`performanceMonitor.ts`)
- Log levels: debug, info, warn, error

### 11.2 Error Handling
- Centralized error codes (`errorCodes.ts`)
- Structured error responses
- Error recovery mechanisms
- User-friendly error messages

---

## 12. Development Workflow

### Adding New API Endpoints
1. Create route file: `src/app/api/resource/route.ts`
2. Implement GET/POST/PUT/DELETE handlers
3. Add Zod validation schema: `src/lib/schemas/resourceSchema.ts`
4. Add Swagger JSDoc comments to route
5. Write tests: `__tests__/api/resource.test.ts`
6. Update CHANGELOG.md
7. Update API documentation

### Database Schema Changes
1. Modify `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name description`
3. Test migrations locally
4. Update seeding if needed
5. Commit migration files

### Deployment Checklist
- [ ] All tests passing
- [ ] Code linting passes
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Documentation updated
- [ ] Swagger docs reviewed
- [ ] CHANGELOG.md updated
- [ ] Performance optimized
- [ ] Security audit passed

---

## 13. Documentation Updates

- **Swagger API Docs:** Regenerated on server start
- **Architecture:** Updated when major changes occur
- **CHANGELOG:** Updated for each release
- **README:** Updated for setup instructions
- **Inline Comments:** Maintained in complex logic

---

## 14. Key Utilities & Helpers

### Authentication (`lib/auth.ts`)
- Token generation and validation
- User claim extraction
- Permission checking

### Response Handler (`lib/responseHandler.ts`)
- Standardized JSON responses
- Error response formatting
- HTTP status code mapping

### Error Handler (`lib/errorHandler.ts`)
- Error categorization
- User-friendly messages
- Debug information

### File Upload (`lib/fileUpload.ts`)
- S3 presigned URL generation
- File validation
- Upload progress tracking

---

## 15. Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] GraphQL API layer
- [ ] Rate limiting per user/IP
- [ ] Advanced caching strategies
- [ ] Multi-language support
- [ ] Mobile app integration
- [ ] Analytics dashboard
- [ ] Advanced audit logging
