---
name: Senior Frontend Engineering Standard
description: Production-grade coding standards for architecture, TypeScript, React, Next.js, testing, maintainability, and code quality.
purpose: Ensure all generated code meets senior-level engineering expectations.
when_to_use:
  - Building components
  - Creating features
  - Refactoring code
  - Writing React code
  - Writing Next.js code
  - Writing TypeScript
  - Reviewing code
always_apply: true
priority: highest
---

# Senior Engineering Standard

## Core Principles

- Clarity first
- Correctness always
- Performance when measurable
- When in doubt, do less

---

## Planning First (Mandatory)

Before writing code:

1. Restate the problem.
2. List requirements.
3. Identify constraints.
4. Identify edge cases.
5. Determine what must remain unchanged.
6. Choose the smallest possible solution.
7. Ask for clarification if uncertainty exists.

Do not write code until these are clear.

---

## Code Standards

### Structure

- Prefer explicit solutions.
- Avoid speculative abstractions.
- Remove dead code.
- Minimize duplication.
- One file should have one responsibility.
- Keep files reasonably small.

### Type Safety

- TypeScript strict mode.
- Avoid any.
- Define interfaces.
- Use generics appropriately.



### Naming Conventions

- **Components, Classes, Types**: `PascalCase`
- **Variables, Functions**: `camelCase`
- **Booleans**: Start with `is`, `has`, or `can`
- **React Hooks**: Start with `use`
- **Constants**: `ALL_CAPS_WITH_UNDERSCORE` (module-level only)

---

## Functions

- Single responsibility.
- Prefer pure functions.
- Avoid hidden side effects.
- Use early returns.
- Keep functions small.

---

## Architecture

### Separation of Concerns

Separate:

- UI
- Business Logic
- Data Access
- Side Effects

Business logic should not live inside UI components.

---

### State Management

- Keep state local.
- Lift state only when necessary.
- Avoid duplicate state.
- Prefer derived values.
- Use global state only when justified.

---

## React & Next.js

### Components

- App Router first.
- Server Components by default.
- Use client components only when necessary.
- Functional components only.
- Controlled components preferred.

### Performance

- Avoid unnecessary re-renders.
- Clean up effects.
- Memoize only when justified.
- Lazy load when beneficial.

---

## APIs

### Rules

- Never assume response shape.
- Validate external data.
- Normalize responses.
- Handle loading states.
- Handle empty states.
- Handle errors explicitly.

---

## Error Handling

### Development

Fail loudly.

### Production

Fail gracefully.

Always:

- Log actionable errors.
- Surface meaningful messages.
- Avoid silent failures.

---

## Comments

Only add comments when:

- Business logic is complex.
- Constraints are non-obvious.
- Workarounds require explanation.

Explain why.

Do not explain what.

Never leave commented-out code.

---

## Optimization

### Measure First

Do not optimize blindly.

Optimize only when:

- Profiling identifies bottlenecks.
- User experience improves.
- Resource usage improves.

---

## Testing

Test:

- Business logic
- Edge cases
- Failure states
- Critical workflows

Keep tests focused and maintainable.

---

## Review Checklist

Before completion:

- Does it solve the problem?
- Is it the simplest solution?
- Are edge cases handled?
- Is error handling correct?
- Are types accurate?
- Is the code maintainable?
- Would another senior engineer approve this?

---

## Prohibited

- Dead code
- Leftover console.log
- Premature abstractions
- Unnecessary state
- Invented APIs
- Commented-out code
- Mixed concerns

---

## Final Rule

If this code would not pass a senior code review, rewrite it.

If the improvement is unclear, make no change.

Optimize for maintainability over cleverness.

Assume another senior engineer will maintain this code.