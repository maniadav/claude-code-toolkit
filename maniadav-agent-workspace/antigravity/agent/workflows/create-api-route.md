---
description: Create a new API route in Next.js
---

# Create API Route Workflow

This workflow guides you through creating a new API route in Next.js App Router.

## Prerequisites

- Next.js 13+ with App Router
- TypeScript configured
- API requirements defined

## Steps

### 1. Define API Contract

Before coding, document:
- Endpoint path
- HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Request body schema
- Response schema
- Status codes and error cases
- Authentication requirements

### 2. Create Route File

```bash
# Create API route file
# Pattern: app/api/[resource]/route.ts
touch app/api/users/route.ts

# For dynamic routes
# Pattern: app/api/[resource]/[id]/route.ts
touch app/api/users/[id]/route.ts
```

### 3. Import Dependencies

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod'; // For validation
```

### 4. Define Validation Schema (if needed)

```typescript
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(18).optional(),
});

type CreateUserInput = z.infer<typeof createUserSchema>;
```

### 5. Implement HTTP Method Handlers

```typescript
// GET handler
export async function GET(request: NextRequest) {
  try {
    // 1. Parse query parameters
    // 2. Validate input
    // 3. Fetch data
    // 4. Return response
  } catch (error) {
    // Handle errors
  }
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    // 2. Validate input
    // 3. Process data
    // 4. Return response
  } catch (error) {
    // Handle errors
  }
}
```

### 6. Add Error Handling

Use consistent error responses:

```typescript
// Validation error
return NextResponse.json(
  { error: 'Invalid input', details: validationErrors },
  { status: 400 }
);

// Not found
return NextResponse.json(
  { error: 'Resource not found' },
  { status: 404 }
);

// Server error
return NextResponse.json(
  { error: 'Internal server error' },
  { status: 500 }
);
```

### 7. Test the API

// turbo
```bash
npm run dev
```

Test with curl or API client:
```bash
# GET request
curl http://localhost:3000/api/users

# POST request
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

### 8. Verify Build

// turbo
```bash
npm run build
```

## Complete Example: User CRUD API

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18).optional(),
});

// Mock database (replace with actual DB)
const users: Array<{ id: string; name: string; email: string; age?: number }> = [];

// GET /api/users - List all users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const paginatedUsers = users.slice(offset, offset + limit);

    return NextResponse.json({
      users: paginatedUsers,
      total: users.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.error.flatten() 
        },
        { status: 400 }
      );
    }

    const userData = validation.data;

    // Check for duplicate email
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const newUser = {
      id: crypto.randomUUID(),
      ...userData,
    };

    users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: { id: string };
}

// GET /api/users/:id - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params;
    
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/:id - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params;
    
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    users.splice(index, 1);

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Best Practices Checklist

- [ ] Input validation with Zod or similar
- [ ] Proper HTTP status codes
- [ ] Consistent error response format
- [ ] Try-catch for error handling
- [ ] No sensitive data in error messages
- [ ] Type-safe request/response
- [ ] Query parameter validation
- [ ] Authentication/authorization (if needed)
- [ ] Rate limiting (for production)
- [ ] Request logging

## Common Status Codes

- `200` - OK (successful GET, PUT, DELETE)
- `201` - Created (successful POST)
- `204` - No Content (successful DELETE with no body)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Security Considerations

1. **Validate all inputs** - Never trust client data
2. **Sanitize data** - Prevent SQL injection, XSS
3. **Rate limit** - Prevent abuse
4. **Authentication** - Verify user identity
5. **Authorization** - Check permissions
6. **CORS** - Configure allowed origins
7. **Logging** - Log errors (not sensitive data)

## Next Steps

After creating the API route:
1. Test all endpoints thoroughly
2. Document API in README or OpenAPI spec
3. Add authentication if needed
4. Implement rate limiting
5. Set up monitoring and logging
6. Write integration tests
