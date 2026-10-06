---
name: Senior Backend Engineering Standard
description: Production-grade coding standards for Node.js, Express, TypeScript, APIs, architecture, security, testing, observability, and maintainability.
purpose: Ensure all generated backend code meets senior-level engineering expectations.
when_to_use:
  - Building components
  - Building APIs
  - Creating backend features
  - Creating Express routes
  - Writing controllers
  - Writing services
  - Writing repositories
  - Working with databases
  - Adding middleware
  - Refactoring backend code
  - Writing Node.js code
  - Writing Express code
  - Writing TypeScript
  - Reviewing backend code
always_apply: true
priority: highest
---

# Senior Engineering Standard

---



when_to_use:

* Building APIs
* Creating backend features
* Creating Express routes
* Writing controllers
* Writing services
* Writing repositories
* Working with databases
* Adding middleware
* Refactoring backend code
* Writing Node.js code
* Writing Express code
* Writing TypeScript
* Reviewing backend code
  always_apply: true
  priority: highest

---

# Senior Backend Engineering Standard

## Core Principles

* Clarity first.
* Correctness always.
* Security by default.
* Explicit boundaries.
* Predictable behavior.
* Fail loudly during development.
* Fail safely in production.
* Performance when measurable.
* Prefer boring, proven solutions.
* When in doubt, do less.

Do not introduce architecture merely because it looks sophisticated.

The goal is maintainable production software, not architectural complexity.

---

# Planning First

Before writing code:

1. Restate the problem.
2. Identify functional requirements.
3. Identify non-functional requirements.
4. Identify existing architecture and conventions.
5. Identify affected modules.
6. Identify data flow.
7. Identify external dependencies.
8. Identify failure modes.
9. Identify security implications.
10. Identify edge cases.
11. Determine what must remain unchanged.
12. Choose the smallest appropriate solution.

Do not write code until the implementation approach is clear.

If an important requirement is ambiguous, ask for clarification rather than inventing behavior.

---

# Architecture

## Default Architecture

Use a feature-first modular architecture.

Prefer:

```text
src/
├── app/
│   ├── app.ts
│   ├── routes.ts
│   └── container.ts
│
├── config/
│   ├── env.ts
│   └── logger.ts
│
├── modules/
│   └── articles/
│       ├── articles.controller.ts
│       ├── articles.routes.ts
│       ├── articles.service.ts
│       ├── articles.repository.ts
│       ├── articles.schema.ts
│       ├── articles.types.ts
│       └── articles.mapper.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── not-found.middleware.ts
│   ├── request-id.middleware.ts
│   └── validation.middleware.ts
│
├── infrastructure/
│   ├── database/
│   ├── cache/
│   ├── messaging/
│   └── external-services/
│
├── common/
│   ├── errors/
│   ├── types/
│   ├── constants/
│   └── utils/
│
└── index.ts
```

Do not create every directory automatically.

Create a directory only when the project actually needs it.

---

# Dependency Direction

Maintain this general dependency direction:

```text
HTTP
 ↓
Controller
 ↓
Service
 ↓
Repository / External Service
 ↓
Infrastructure
```

Rules:

* Controllers handle HTTP concerns.
* Services contain application and business logic.
* Repositories handle persistence.
* Infrastructure handles technical integrations.
* Middleware handles cross-cutting HTTP concerns.
* Domain/business logic must not depend directly on Express.
* Business logic must not depend directly on HTTP request or response objects.
* Services should not construct database clients.
* Controllers should not contain business logic.
* Routes should not contain business logic.
* Repositories should not decide HTTP status codes.
* Database models should not leak unnecessarily into API responses.

Avoid circular dependencies.

---

# Feature Modules

Organize business functionality by feature rather than technical layer.

Prefer:

```text
modules/
├── users/
├── auth/
├── articles/
├── comments/
└── payments/
```

over:

```text
controllers/
services/
repositories/
models/
```

Do not create a global folder containing hundreds of unrelated services.

A feature should own the code required to understand and maintain that feature.

---

# HTTP Layer

Controllers should be thin.

A controller should generally:

1. Read validated request data.
2. Call the appropriate service.
3. Map the result to an HTTP response.
4. Return the response.

Avoid:

```text
controller
├── database queries
├── business rules
├── complex transformations
├── transaction management
└── external API logic
```

Prefer:

```text
request
  ↓
validation
  ↓
controller
  ↓
service
  ↓
repository
  ↓
database
```

Never pass Express `Request` or `Response` objects into business logic.

---

# Services

Services contain application-level behavior.

A service may:

* Coordinate multiple repositories.
* Apply business rules.
* Manage workflows.
* Coordinate external services.
* Execute transactional operations.
* Enforce business invariants.

Services should not:

* Know about HTTP status codes.
* Construct Express responses.
* Parse raw HTTP requests.
* Depend unnecessarily on Express.
* Contain database implementation details.

Keep services focused.

If a service becomes a large collection of unrelated operations, split the responsibilities.

---

# Repositories

Repositories own persistence operations.

Repositories may:

* Query databases.
* Insert records.
* Update records.
* Delete records.
* Handle persistence-specific concerns.
* Translate database errors where appropriate.

Repositories should not:

* Return HTTP responses.
* Know about Express.
* Contain controller logic.
* Implement unrelated business rules.

Do not create repositories for every trivial operation unless the abstraction provides real value.

---

# Database Rules

Database access must be centralized.

Do not create database clients inside controllers or services.

Prefer:

```text
infrastructure/database/
```

for:

* Database client initialization.
* Connection management.
* Transactions.
* Database configuration.

Handle:

* Connection failures.
* Timeouts.
* Constraint violations.
* Transactions.
* Query failures.

Do not expose raw database errors to API consumers.

---

# Validation

Validate all untrusted external input.

Validate:

* Request body.
* Query parameters.
* Route parameters.
* Headers when required.
* Environment variables.
* External API responses when their shape matters.

Never assume client input is valid.

Prefer schema-based validation using an established validation library.

Example:

```text
articles.schema.ts
```

Validation should happen before business logic executes.

Do not duplicate validation logic throughout controllers and services.

---

# TypeScript

Use strict TypeScript.

Required:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Rules:

* Avoid `any`.
* Prefer `unknown` for unknown external data.
* Narrow types before use.
* Define explicit domain types.
* Use generics when they improve correctness.
* Avoid unnecessary type assertions.
* Avoid `as any`.
* Avoid non-null assertions unless genuinely justified.
* Keep types close to the feature that owns them.
* Do not duplicate types unnecessarily.

Types must describe actual runtime behavior.

TypeScript types do not replace runtime validation.

---

# API Design

Design APIs consistently.

Define clearly:

* HTTP method.
* URL structure.
* Request schema.
* Response schema.
* Status codes.
* Error format.
* Authentication requirements.

Use appropriate HTTP status codes.

Examples:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```

Do not return `200` for every outcome.

Do not expose internal implementation details in API responses.

---

# Response Format

Use a consistent response contract.

For example:

```text
Success:
{
  "data": ...
}

Error:
{
  "error": {
    "code": "...",
    "message": "...",
    "details": ...
  }
}
```

Do not create response wrappers unless the project actually benefits from them.

Follow the existing API contract when modifying an existing project.

Never silently change an established response shape.

---

# Error Handling

Centralize HTTP error handling.

Prefer:

```text
throw application/domain error
        ↓
error middleware
        ↓
HTTP response
```

Do not scatter:

```text
try/catch
res.status(...)
```

through every controller unnecessarily.

Catch errors when you can:

* recover,
* add meaningful context,
* translate an error,
* perform cleanup,
* or intentionally change behavior.

Otherwise allow centralized error handling to process them.

Never silently swallow errors.

Never expose:

* stack traces,
* SQL queries,
* internal paths,
* secrets,
* credentials,
* infrastructure details

to production clients.

---

# Error Taxonomy

Distinguish between meaningful error categories where useful.

Examples:

```text
ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
DomainError
ExternalServiceError
InfrastructureError
```

Do not create dozens of custom error classes without a real need.

The error model should make failure behavior predictable.

---

# Async Code

Use `async/await` consistently.

Rules:

* Handle rejected promises.
* Do not create floating promises unintentionally.
* Avoid unnecessary sequential awaits.
* Use `Promise.all` when operations are independent.
* Preserve transaction boundaries.
* Handle cancellation/timeouts where appropriate.

Never ignore asynchronous failures.

---

# Middleware

Middleware should have one clear responsibility.

Examples:

```text
authentication
authorization
request-id
logging
validation
rate-limiting
error-handling
not-found
```

Avoid middleware that performs unrelated business logic.

Order middleware intentionally.

For example:

```text
security
→ request ID
→ body parsing
→ logging
→ routes
→ not found
→ error handler
```

Adapt the order to the actual application.

---

# Authentication & Authorization

Authentication and authorization are different concerns.

Authentication answers:

```text
Who are you?
```

Authorization answers:

```text
Are you allowed to do this?
```

Do not mix them unnecessarily.

Rules:

* Never trust client-provided identity fields.
* Never store plaintext passwords.
* Never log credentials or tokens.
* Validate authentication credentials at the boundary.
* Enforce authorization in the application layer.
* Deny access by default when authorization cannot be established.

---

# Security

Security is part of implementation, not a later task.

Consider:

* Helmet.
* CORS.
* Rate limiting.
* Request body size limits.
* Input validation.
* Output encoding where relevant.
* Secure cookies.
* CSRF protection where applicable.
* Password hashing.
* Secret management.
* Dependency vulnerabilities.
* SQL/NoSQL injection.
* SSRF.
* Path traversal.
* Prototype pollution.
* Authentication abuse.
* Authorization bypasses.

Never hardcode:

* API keys.
* Passwords.
* Tokens.
* Private keys.
* Database credentials.

Use environment/configuration management.

---

# Environment Configuration

Centralize environment configuration.

Prefer:

```text
config/
└── env.ts
```

Validate required variables during application startup.

Fail fast when required configuration is missing.

Do not access `process.env` throughout the application.

Prefer:

```text
config.env.databaseUrl
```

over repeated direct access to environment variables.

Never log secrets.

---

# Logging

Use structured logging in production.

Logs should help answer:

* What happened?
* When did it happen?
* Which request caused it?
* Which operation failed?
* What context is relevant?

Prefer structured fields:

```text
requestId
userId
operation
statusCode
duration
errorCode
```

Never log:

* passwords
* access tokens
* refresh tokens
* API keys
* secrets
* sensitive personal data unless explicitly required

Do not leave random `console.log` statements in production code.

Use the project's logger.

---

# Request IDs

Where appropriate, assign a unique request ID to each incoming request.

Propagate the request ID through:

* logs
* service calls
* external requests
* error reporting

This is especially important for distributed systems.

---

# External Services

Treat external systems as unreliable.

For HTTP APIs, queues, caches, payment providers, and other dependencies:

* Set timeouts.
* Handle failures.
* Validate responses.
* Avoid infinite retries.
* Use bounded retries where appropriate.
* Use exponential backoff when justified.
* Handle rate limits.
* Consider circuit breaking for critical dependencies.
* Log useful failure context.
* Never leak provider-specific failures directly to users.

Never assume an external API is always available.

---

# Transactions

Use database transactions when multiple operations must succeed or fail together.

Do not create transactions automatically for every operation.

A transaction should represent a meaningful consistency boundary.

Keep transaction scope as small as practical.

Avoid external network calls inside database transactions unless there is a strong reason.

---

# Caching

Do not add caching without a clear reason.

Before introducing a cache, define:

* What is cached?
* Why is it cached?
* TTL.
* Invalidation strategy.
* Failure behavior.
* Consistency requirements.

A cache must never become an accidental source of truth.

---

# Performance

Do not optimize blindly.

Measure first.

Pay attention to:

* N+1 queries.
* Missing database indexes.
* Large payloads.
* Unbounded queries.
* Excessive serialization.
* Unnecessary network calls.
* Memory leaks.
* Event-loop blocking.
* Sequential independent operations.

Use pagination for potentially large collections.

Never load unbounded user-controlled datasets into memory.

---

# Node.js Specific Rules

Remember that Node.js uses an event loop.

Avoid CPU-heavy synchronous operations in request paths.

Avoid:

* Large synchronous filesystem operations.
* Expensive synchronous cryptography.
* CPU-heavy loops over unbounded input.
* Blocking operations inside request handlers.

For CPU-intensive work, consider:

* Worker threads.
* Background jobs.
* Queue-based processing.
* Separate services.

Use streaming when processing genuinely large data.

---

# Express Rules

Keep Express at the HTTP boundary.

Business logic should remain framework-independent whenever practical.

Prefer:

```text
Express
  ↓
Controller
  ↓
Application Service
  ↓
Domain / Business Logic
  ↓
Repository
```

Avoid:

```text
Service
  ↓
Express Request
  ↓
Express Response
```

Do not tightly couple the entire application to Express.

---

# Dependency Injection

Use dependency injection when it provides a real benefit.

Good candidates:

* Repositories.
* External API clients.
* Email providers.
* Payment providers.
* Clocks.
* Message publishers.

Do not introduce a dependency injection framework just because the project is "senior."

Simple constructor/function injection is often enough.

---

# Testing

Testing should reflect the architecture.

Test:

* Business rules.
* Services.
* Validation.
* Error behavior.
* Repositories where valuable.
* Critical API workflows.
* Authentication.
* Authorization.
* Important edge cases.

Prefer:

```text
tests/
├── unit/
├── integration/
└── e2e/
```

when the project complexity justifies it.

### Unit tests

Test business logic in isolation.

### Integration tests

Test boundaries such as:

```text
service + database
repository + database
external adapter
```

### E2E tests

Test critical workflows through the HTTP boundary.

Do not write tests purely to increase coverage numbers.

Test behavior, not implementation details.

---

# Test Quality

Tests should be:

* deterministic
* isolated
* readable
* fast where possible
* explicit about failures

Avoid excessive mocking.

Mock external boundaries, not every internal function.

Do not make tests depend on execution order.

---

# API Testing

Critical endpoints should cover:

* Successful request.
* Invalid input.
* Unauthorized request.
* Forbidden request.
* Missing resource.
* Conflict.
* External dependency failure.
* Database failure where relevant.
* Edge cases.

Verify both:

```text
status code
response body
```

---

# Database Testing

Do not rely exclusively on mocked repositories.

For important persistence behavior, use integration tests against a real or disposable database where practical.

Test:

* constraints
* transactions
* relationships
* indexes where relevant
* persistence behavior
* migration compatibility

---

# Graceful Shutdown

Production services should shut down cleanly.

Handle:

```text
SIGTERM
SIGINT
```

When shutting down:

1. Stop accepting new work.
2. Allow active requests to complete where practical.
3. Close database connections.
4. Close queues and external connections.
5. Flush important logs.
6. Exit with the appropriate status.

Do not terminate the process abruptly unless necessary.

---

# Health Checks

For production services, consider separate endpoints for:

```text
/liveness
/readiness
```

Liveness answers:

```text
Is this process alive?
```

Readiness answers:

```text
Can this instance safely receive traffic?
```

Do not make liveness checks depend on every external dependency.

---

# Observability

Production services should provide enough information to diagnose failures.

Consider:

* Structured logs.
* Request IDs.
* Metrics.
* Error tracking.
* Health checks.
* Request duration.
* Dependency latency.
* Database performance.

Do not add observability tooling without understanding what information it provides.

---

# File Organization

One file should have one primary responsibility.

Prefer:

```text
articles.controller.ts
articles.service.ts
articles.repository.ts
articles.schema.ts
```

over:

```text
articles.ts
```

containing everything.

Avoid extremely large files.

As a guideline, when a file becomes difficult to understand or navigate, consider splitting it by responsibility.

Do not split files purely to satisfy an arbitrary line count.

---

# Naming

Use consistent naming.

### Files

Prefer:

```text
articles.controller.ts
articles.service.ts
articles.repository.ts
articles.schema.ts
```

### Types and Classes

Use:

```text
PascalCase
```

### Variables and Functions

Use:

```text
camelCase
```

### Constants

Use:

```text
UPPER_SNAKE_CASE
```

for true module-level constants.

### Booleans

Prefer:

```text
isActive
hasPermission
canPublish
shouldRetry
```

Names should describe intent rather than implementation.

---

# Functions

Functions should have one clear responsibility.

Prefer:

* Small functions.
* Early returns.
* Explicit inputs.
* Explicit outputs.
* Minimal side effects.

Avoid:

* Deep nesting.
* Hidden mutations.
* Large conditional blocks.
* Functions that perform unrelated operations.
* Functions that depend on global mutable state.

Do not split simple code into dozens of meaningless helper functions.

---

# Comments

Comments should explain:

* Why something exists.
* Why a non-obvious decision was made.
* Important constraints.
* Workarounds.
* External limitations.

Do not write comments explaining obvious code.

Never leave commented-out code.

Bad:

```text
// Increment counter
counter++;
```

Good:

```text
// Provider requires a minimum 30-second delay before retrying.
```

---

# API Documentation

For public APIs, document:

* Endpoints.
* Authentication.
* Request schemas.
* Response schemas.
* Error responses.
* Important constraints.

Use OpenAPI/Swagger when appropriate.

Do not let documentation drift from implementation.

---

# Migrations

Database schema changes must be reproducible.

Never manually modify production databases without a migration strategy.

Migrations should be:

* versioned
* reviewable
* deterministic
* safe to run in deployment environments

Consider backward compatibility when deploying schema changes independently from application code.

---

# Configuration & Secrets

Never commit secrets.

Never place secrets in:

* source code
* tests
* logs
* README files
* Docker images
* configuration committed to Git

Use environment variables or an appropriate secret manager.

Provide safe example configuration files where useful.

---

# Docker

Production containers should:

* Run as a non-root user where practical.
* Use a minimal appropriate base image.
* Avoid unnecessary packages.
* Have deterministic dependency installation.
* Handle signals correctly.
* Avoid storing application logs inside the container filesystem.
* Avoid embedding secrets.

Use multi-stage builds when they provide meaningful size or security benefits.

---

# CI/CD

CI should verify at minimum:

```text
install
→ typecheck
→ lint
→ test
→ build
```

For production systems, also consider:

```text
security audit
→ migration validation
→ integration tests
→ container build
```

CI failures should be actionable.

Do not disable checks merely to make CI pass.

---

# Dependency Management

Before adding a dependency:

1. Check whether the functionality already exists.
2. Check whether Node.js provides a suitable primitive.
3. Consider maintenance status.
4. Consider security history.
5. Consider bundle/runtime cost.
6. Consider whether the dependency creates unnecessary coupling.

Do not add a package for trivial functionality.

Keep dependencies updated intentionally.

---

# Backward Compatibility

When modifying existing APIs:

* Preserve existing behavior unless a breaking change is intentional.
* Identify consumers.
* Avoid unnecessary response changes.
* Avoid unnecessary database migrations.
* Consider versioning for breaking API changes.

Never silently break existing clients.

---

# Refactoring

When refactoring:

1. Understand existing behavior.
2. Identify the actual problem.
3. Preserve externally observable behavior unless change is intentional.
4. Make one meaningful architectural change at a time.
5. Keep tests passing.
6. Remove obsolete code after migration.
7. Avoid unrelated cleanup.

Do not rewrite working code merely because you prefer another style.

---

# Edge Cases

Before considering a feature complete, consider:

* Empty input.
* Missing input.
* Invalid input.
* Duplicate requests.
* Missing resources.
* Unauthorized access.
* Concurrent requests.
* Database failure.
* Network timeout.
* External service failure.
* Partial failure.
* Large input.
* Unexpected external responses.
* Duplicate records.
* Race conditions.
* Retry behavior.

Not every edge case needs custom handling.

Handle the ones that can realistically affect correctness or safety.

---

# Idempotency

For operations that may be retried, consider whether they need to be idempotent.

This is especially important for:

* payments
* webhooks
* message processing
* resource creation
* background jobs

Do not assume clients or infrastructure will send a request exactly once.

---

# Concurrency

Assume requests can execute concurrently.

Do not rely on:

* in-memory mutable state
* request ordering
* process-local locks
* race-prone read-then-write operations

Use appropriate database constraints, transactions, atomic operations, or distributed coordination where required.

---

# Background Jobs

Long-running or retryable work should not unnecessarily block HTTP requests.

Consider a queue or worker for:

* emails
* report generation
* media processing
* notifications
* large imports
* scheduled jobs
* external synchronization

HTTP endpoints should return promptly when asynchronous processing is appropriate.

---

# What Not To Do

Never:

* Put business logic in routes.
* Put database queries in controllers.
* Pass Express objects into services.
* Access `process.env` everywhere.
* Return raw database errors.
* Log secrets.
* Commit runtime logs.
* Use `any` to silence TypeScript.
* Ignore promise failures.
* Swallow exceptions.
* Trust client input.
* Trust external API responses blindly.
* Create unnecessary abstractions.
* Create unnecessary interfaces.
* Create repositories with no meaningful boundary.
* Add dependencies for trivial functionality.
* Add caching without an invalidation strategy.
* Optimize without measurement.
* Introduce microservices prematurely.
* Introduce event-driven architecture without a real requirement.
* Create a generic `utils` dumping ground.
* Create a generic `services` dumping ground.
* Create giant controllers.
* Create giant service files.
* Mix infrastructure concerns with business rules.
* Leave commented-out code.
* Leave debugging statements.
* Invent API behavior when requirements are unclear.

---

# Review Checklist

Before considering implementation complete, verify:

## Architecture

* Is responsibility in the correct layer?
* Are module boundaries clear?
* Is dependency direction correct?
* Is Express isolated from business logic?
* Is infrastructure isolated?

## TypeScript

* Is strict mode enabled?
* Are types accurate?
* Is `any` avoided?
* Are external inputs runtime-validated?
* Are unnecessary type assertions avoided?

## API

* Are request inputs validated?
* Are status codes appropriate?
* Is the response contract consistent?
* Are errors predictable?
* Are breaking changes avoided?

## Security

* Are inputs validated?
* Are secrets protected?
* Are authentication and authorization correct?
* Could an attacker bypass access controls?
* Are sensitive values excluded from logs?

## Reliability

* Are database failures handled?
* Are external calls protected by timeouts?
* Are retry behaviors safe?
* Are transactions used where required?
* Are concurrency issues considered?

## Testing

* Is business logic tested?
* Are failure cases tested?
* Are important edge cases tested?
* Are critical API workflows covered?
* Are tests deterministic?

## Production

* Is logging useful?
* Are request IDs available where needed?
* Is graceful shutdown implemented where appropriate?
* Are health checks available where appropriate?
* Does CI typecheck, lint, test, and build?

## Maintainability

* Is the solution simple?
* Are files focused?
* Are names clear?
* Is duplication justified?
* Are abstractions necessary?
* Would another senior engineer understand this six months from now?

---

# Final Engineering Rule

Build the simplest architecture that can safely support the requirements.

Do not make code more complex to appear senior.

Senior-level code should make it easy to answer:

```text
Where does this request enter?
Where is it validated?
Where does the business rule live?
Where does data come from?
Where can this operation fail?
How is the failure handled?
How is the behavior tested?
How will we debug it in production?
```

If those answers are not obvious from the codebase, improve the boundaries.

If the architecture is already clear and the proposed abstraction does not solve a real problem, do not add it.

Optimize for:

```text
correctness
→ security
→ maintainability
→ observability
→ simplicity
→ performance
```

in that order, unless the project has explicit requirements that change the priorities.

If the implementation would not survive a thoughtful senior backend code review, rewrite it before considering the task complete.
