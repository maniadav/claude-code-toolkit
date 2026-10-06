---
name: Frontend SDE Standard
description: Production-grade standards for TypeScript, React, Next.js, architecture, testing, accessibility, security, and maintainability.
always_apply: true
priority: highest
---

# Frontend SDE Standard

## Core Principles

- Clarity over cleverness.
- Correctness before optimization.
- Prefer simple solutions.
- Performance only when measurable.
- Maintainability over brevity.
- When uncertain, ask for clarification.

---

# Planning First

Before writing code:

1. Restate the problem.
2. Identify requirements.
3. Identify constraints.
4. Consider edge cases.
5. Determine what must remain unchanged.
6. Reuse existing patterns when possible.
7. Choose the smallest correct solution.

If requirements are unclear, ask questions before implementation.

---

# Existing Codebase First

Always:

- Follow existing project conventions.
- Reuse existing components, hooks, utilities, and patterns.
- Prefer consistency over introducing new abstractions.
- Avoid architectural changes unless explicitly required.

---

# Architecture

## Separation of Concerns

Keep these concerns separate:

- UI
- Business Logic
- Data Access
- State Management
- Side Effects

Business logic should not live inside UI components.

---

## File Organization

- One file should have one responsibility.
- Keep files reasonably small.
- Remove dead code.
- Minimize duplication.
- Extract reusable logic only when justified.

Avoid speculative abstractions.

---

# TypeScript

## Type Safety

- Use strict TypeScript.
- Avoid `any`.
- Use `unknown` when types are uncertain.
- Define explicit interfaces and types.
- Use generics when they improve safety and reuse.
- Prefer narrow types over broad types.

## External Data

Treat all external data as untrusted.

- Validate API responses.
- Validate user input.
- Parse unknown data before use.
- Prefer schema validation (Zod or project standard).

Never assume response shapes.

---

# Naming

## Conventions

- Components, Classes, Types: `PascalCase`
- Variables and Functions: `camelCase`
- Hooks: `use*`
- Booleans: `is*`, `has*`, `can*`

Use descriptive names.

Avoid abbreviations unless universally understood.

---

# Functions

- Single responsibility.
- Prefer pure functions.
- Avoid hidden side effects.
- Use early returns.
- Keep functions focused and readable.

Prefer composition over deeply nested logic.

---

# React & Next.js

## Components

- Use App Router conventions.
- Prefer Server Components by default.
- Use Client Components only when necessary.
- Use functional components only.
- Keep components focused on presentation.
- Move complex logic into hooks or utilities.

## State Management

- Keep state local whenever possible.
- Lift state only when necessary.
- Avoid duplicate state.
- Prefer derived values over stored values.
- Use global state only when justified.

## Rendering

- Avoid unnecessary re-renders.
- Avoid side effects during render.
- Clean up effects properly.
- Memoize only when measurable benefit exists.
- Lazy load when beneficial.

Do not optimize preemptively.

---

# Async Operations

- Prefer async/await.
- Handle loading states.
- Handle success states.
- Handle empty states.
- Handle failure states.
- Never ignore rejected promises.
- Prevent race conditions where relevant.
- Cancel stale requests when appropriate.

---

# API Design

Always:

- Validate inputs.
- Validate outputs.
- Handle unexpected responses.
- Return meaningful errors.
- Normalize data when beneficial.

Never trust network responses.

---

# Error Handling

## Development

Fail loudly.

## Production

Fail gracefully.

Always:

- Surface actionable error messages.
- Log useful debugging information.
- Handle known failure scenarios.
- Avoid silent failures.

---

# Security

- Never expose secrets, tokens, or API keys.
- Sanitize user-generated content.
- Validate all external input.
- Verify authorization, not only authentication.
- Avoid unsafe HTML rendering.
- Avoid dynamic code execution.

Security is a default requirement.

---

# Accessibility

Always:

- Use semantic HTML first.
- Use buttons for actions.
- Use links for navigation.
- Provide labels for form controls.
- Support keyboard navigation.
- Use ARIA only when semantic HTML is insufficient.

Accessibility is not optional.

---

# Comments

Add comments only when:

- Business rules are non-obvious.
- Constraints require explanation.
- Workarounds need context.

Explain why.

Do not explain what.

Never leave commented-out code.

---

# Performance

Measure before optimizing.

Optimize only when:

- Profiling identifies a bottleneck.
- User experience improves.
- Resource usage improves.

Avoid premature optimization.

---

# Testing

Test:

- Business logic.
- Edge cases.
- Failure states.
- Critical user flows.

Prefer deterministic and maintainable tests.

---

# Review Checklist

Before completing any task:

- Does this solve the problem?
- Is this the simplest correct solution?
- Does it follow existing project patterns?
- Are edge cases handled?
- Are types accurate?
- Is external data validated?
- Is error handling appropriate?
- Is accessibility addressed?
- Is security considered?
- Is the code maintainable?

---

# Prohibited

Do not introduce:

- Dead code
- Commented-out code
- Leftover debugging code
- Premature abstractions
- Unnecessary state
- Invented APIs
- Mixed concerns
- Unvalidated external data
- Unnecessary complexity

---

# Final Rule

Write code that another senior engineer can immediately understand, trust, and maintain.

If a change would not pass a senior code review, revise it before presenting it.
