---
name: FastAPI Senior Engineering Standard
description: Production-grade FastAPI engineering standards covering architecture, API design, security, database access, testing, observability, scalability, and maintainability.
purpose: Ensure all FastAPI services meet senior backend engineering standards and are suitable for production environments.
when_to_use:
  - Building FastAPI applications
  - Creating REST APIs
  - Designing backend services
  - Building microservices
  - Implementing authentication
  - Creating database layers
  - Writing backend business logic
  - Refactoring backend code
  - Reviewing backend code
always_apply: true
priority: highest
---

# FastAPI Senior Engineering Standard

## Core Principles

- Clarity first
- Correctness always
- Security by default
- Performance when measurable
- Reliability over cleverness
- Simplicity over abstraction
- Production readiness is mandatory

---

# Planning First (Mandatory)

Before writing code:

1. Restate the problem.
2. Define API requirements.
3. Identify inputs and outputs.
4. Define validation requirements.
5. Identify edge cases.
6. Define failure scenarios.
7. Define security implications.
8. Determine the smallest viable implementation.
9. Ask for clarification if requirements are unclear.

Do not write code until these are understood.

---

# Backend Design Principles

## Service Boundaries

Each service should have a clear responsibility.

Examples:

✅ User Service

- Authentication
- Authorization
- User Profiles

✅ Order Service

- Orders
- Payments
- Fulfillment

❌ One service handling everything

---

## Single Responsibility

Each module should have one responsibility.

Examples:

```text
users/
├── router.py
├── service.py
├── repository.py
├── schemas.py
└── models.py
```

Avoid:

```text
users.py
```

containing:

- Routes
- Database
- Business Logic
- Validation
- Authentication

---

# Project Structure

Preferred structure:

```text
app/
├── api/
│   ├── v1/
│   │   ├── users/
│   │   ├── auth/
│   │   └── orders/
│
├── core/
│   ├── config.py
│   ├── security.py
│   └── logging.py
│
├── db/
│   ├── session.py
│   ├── base.py
│   └── migrations/
│
├── models/
├── repositories/
├── services/
├── schemas/
├── middleware/
├── dependencies/
├── tests/
└── main.py
```

---

# API Design Standards

## REST Principles

Use resource-based routes.

Good:

```http
GET    /users
GET    /users/{id}
POST   /users
PATCH  /users/{id}
DELETE /users/{id}
```

Avoid:

```http
POST /getUsers
POST /updateUser
POST /deleteUser
```

---

## Versioning

Always version APIs.

```text
/api/v1
/api/v2
```

Never expose unversioned production APIs.

---

## HTTP Status Codes

Use correct status codes.

```http
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
```

Do not return:

```http
200 OK
{
  "error": true
}
```

for failures.

---

# Request Validation

Use Pydantic models for all requests.

Never trust incoming data.

Example:

```python
class CreateUserRequest(BaseModel):
    email: EmailStr
    full_name: str
```

All external input must be validated.

---

# Response Standards

Always use response schemas.

Good:

```python
class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
```

Avoid returning ORM models directly.

---

# Business Logic

## Mandatory Rule

Business logic must never live inside route handlers.

Bad:

```python
@router.post("/")
async def create_user():
    # database logic
    # validation logic
    # business logic
```

Good:

```python
@router.post("/")
async def create_user(
    request: CreateUserRequest,
    service: UserService
):
    return await service.create_user(request)
```

---

# Service Layer

Services contain:

- Business Rules
- Validation Rules
- Workflow Logic
- Domain Logic

Services should not:

- Know HTTP details
- Return Response objects
- Access request objects

---

# Repository Layer

Repositories contain:

- Database access
- Query logic
- Persistence logic

Repositories should not:

- Contain business rules
- Perform authorization
- Handle API responses

---

# Database Standards

## ORM

Preferred:

- SQLAlchemy 2.x
- SQLModel

Avoid raw SQL unless justified.

---

## Async First

Use async database operations whenever possible.

Example:

```python
AsyncSession
```

Avoid mixing sync and async.

---

## Transactions

Use explicit transaction boundaries.

Good:

```python
async with session.begin():
```

Never rely on implicit commits.

---

# Security Standards

## Authentication

Preferred:

- JWT
- OAuth2
- OpenID Connect

Use FastAPI security dependencies.

---

## Password Storage

Only:

```python
bcrypt
argon2
```

Never:

- SHA256
- MD5
- Plain text

---

## Secrets

Store secrets in:

```env
.env
```

or

```text
Vault
Secrets Manager
```

Never hardcode:

- API Keys
- Tokens
- Passwords

---

## Authorization

Authentication and authorization are separate concerns.

Always verify:

```python
Can user perform action?
```

not merely:

```python
Is user authenticated?
```

---

# Dependency Injection

Use FastAPI dependency injection.

Good:

```python
Depends()
```

Avoid manually constructing dependencies inside routes.

---

# Error Handling

## Centralized Exception Handling

Use:

```python
app.exception_handler()
```

for application-wide exceptions.

Avoid repetitive try/catch blocks.

---

## Error Responses

Provide:

```json
{
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

Avoid exposing:

- SQL errors
- Stack traces
- Internal implementation details

---

# Logging Standards

Use structured logging.

Include:

- Request ID
- User ID
- Service Name
- Error Context

Never log:

- Passwords
- Tokens
- Secrets
- Sensitive PII

---

# Observability

Production services must include:

- Health checks
- Metrics
- Structured logging
- Error monitoring

Endpoints:

```http
/health
/ready
```

Preferred tools:

- Prometheus
- Grafana
- OpenTelemetry
- Sentry

---

# Performance Standards

Optimize only when measured.

Focus on:

- Database queries
- N+1 issues
- Slow endpoints
- Excessive serialization
- Excessive network calls

Avoid premature optimization.

---

# Background Tasks

Use:

```python
BackgroundTasks
```

for lightweight work.

Use:

- Celery
- RQ
- Dramatiq

for heavy asynchronous processing.

Do not block request threads.

---

# Testing Standards

## Coverage Areas

Test:

- Business Logic
- Services
- Repositories
- API Endpoints
- Authentication
- Authorization
- Error Cases

---

## Preferred Stack

```text
pytest
pytest-asyncio
httpx
factory-boy
```

---

## Test Rules

Tests must be:

- Independent
- Deterministic
- Fast
- Readable

Avoid shared state.

---

# Naming Conventions

## Classes

```python
UserService
UserRepository
UserResponse
```

---

## Functions

```python
create_user()
get_user_by_id()
```

---

## Booleans

```python
is_active
has_permission
can_edit
```

---

## Constants

```python
JWT_EXPIRATION_MINUTES
MAX_UPLOAD_SIZE
```

Module-level only.

---

# Code Review Checklist

Before completing work:

- Does it solve the requirement?
- Is validation complete?
- Are edge cases handled?
- Is security considered?
- Is authorization enforced?
- Is database access efficient?
- Is logging appropriate?
- Are tests included?
- Is the implementation maintainable?
- Would another senior backend engineer approve this?

---

# Prohibited Practices

- Business logic inside routes
- Direct ORM exposure
- Hardcoded secrets
- Silent exception handling
- Generic except blocks
- Massive service classes
- Massive routers
- SQL string concatenation
- Blocking I/O in async endpoints
- Unvalidated request data
- Returning raw exceptions
- Premature abstraction
- Copy-paste code duplication

---

# Final Rule

If this API would not pass a senior backend engineering review, rewrite it.

If the improvement is unclear, make no change.

Prioritize:

Security > Correctness > Reliability > Maintainability > Performance.

Assume this service will be maintained by another senior engineer and operated in production for years.
