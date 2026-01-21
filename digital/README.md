This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

## Authentication System

### Flow
1. **Signup** → User registers → Password hashed with bcrypt (10 salt rounds)
2. **Login** → Credentials verified → JWT token generated (1-hour expiry)
3. **Protected Routes** → Token validated → Access granted/denied

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

**JWT Token:**
- Algorithm: HS256
- Expiry: 1 hour
- Payload: `{id, email, iat, exp}`

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

## Consistent Naming Benefits

Consistent naming improves maintainability and reduces integration errors by:

1. Making the API intuitive and predictable
2. Following RESTful conventions
3. Using plural nouns for resource collections
4. Maintaining uniform structure across all endpoints
5. Providing clear documentation for developers

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
