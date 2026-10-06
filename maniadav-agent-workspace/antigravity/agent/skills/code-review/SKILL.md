---
name: Code Review Checklist
description: A skill for conducting thorough code reviews
---

# Code Review Checklist Skill

Use this skill when reviewing code changes, either your own or others'.

## Purpose

Ensure code quality, maintainability, and adherence to best practices through systematic review.

## When to Use

- Before committing significant changes
- When reviewing pull requests
- During pair programming sessions
- Before deploying to production

## Review Categories

### 1. Correctness

**Does the code work as intended?**

- [ ] Solves the stated problem
- [ ] Handles edge cases
- [ ] No obvious bugs or logic errors
- [ ] Error handling is appropriate
- [ ] Async operations handled correctly

**Questions to ask:**
- What happens if input is null/undefined?
- What happens if API call fails?
- Are all promises properly awaited?
- Are all error cases handled?

### 2. Code Quality

**Is the code well-written?**

- [ ] Functions are small and focused (< 50 lines)
- [ ] Variables and functions have clear names
- [ ] No unnecessary complexity
- [ ] No code duplication
- [ ] No dead code
- [ ] No commented-out code
- [ ] Follows DRY principle

**Red flags:**
- Functions with 5+ parameters
- Deeply nested conditionals (> 3 levels)
- Very long files (> 300 lines)
- Magic numbers without explanation
- Cryptic variable names (`x`, `temp`, `data2`)

### 3. Type Safety

**Is the code type-safe?**

- [ ] TypeScript strict mode enabled
- [ ] No `any` types (or justified)
- [ ] Interfaces defined for data structures
- [ ] Function signatures are complete
- [ ] Generics used appropriately
- [ ] Type assertions minimized

**Example:**
```typescript
// Bad
function processData(data: any): any {
  return data.map((item: any) => item.value);
}

// Good
interface DataItem {
  value: number;
  label: string;
}

function processData(data: DataItem[]): number[] {
  return data.map(item => item.value);
}
```

### 4. React/Next.js Specific

**For React components:**

- [ ] Uses functional components
- [ ] `'use client'` only when needed
- [ ] No side effects during render
- [ ] Proper dependency arrays in hooks
- [ ] State is minimal and local
- [ ] No derived state stored unnecessarily
- [ ] Props are properly typed
- [ ] Controlled form inputs

**Example issues:**
```typescript
// Bad: Side effect during render
function Component() {
  localStorage.setItem('key', 'value'); // Don't do this
  return <div>Content</div>;
}

// Good: Side effect in useEffect
function Component() {
  useEffect(() => {
    localStorage.setItem('key', 'value');
  }, []);
  return <div>Content</div>;
}
```

### 5. Performance

**Is the code performant?**

- [ ] No unnecessary re-renders
- [ ] Expensive computations memoized
- [ ] Large lists virtualized if needed
- [ ] Images optimized and lazy-loaded
- [ ] Bundle size considered
- [ ] Database queries optimized

**Only optimize if:**
- There's measured performance issue
- Impact is significant
- Solution doesn't add complexity

### 6. Security

**Is the code secure?**

- [ ] User input is validated
- [ ] SQL injection prevented (use prepared statements)
- [ ] XSS prevented (sanitize HTML)
- [ ] Secrets not in code
- [ ] Authentication/authorization checked
- [ ] Sensitive data not logged
- [ ] CORS configured correctly

**Red flags:**
```typescript
// Bad: SQL injection risk
const query = `SELECT * FROM users WHERE id = ${userId}`;

// Bad: XSS risk
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// Bad: Exposed secret
const API_KEY = 'sk-1234567890abcdef';
```

### 7. Error Handling

**Are errors handled properly?**

- [ ] Try-catch blocks where appropriate
- [ ] Errors logged with context
- [ ] User-friendly error messages
- [ ] Loading states handled
- [ ] Empty states handled
- [ ] Errors don't crash app

**Example:**
```typescript
// Good error handling
async function fetchUser(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', { id, error });
    throw new Error('Unable to load user. Please try again.');
  }
}
```

### 8. Testing

**Is the code testable and tested?**

- [ ] Critical logic has tests
- [ ] Tests are focused and clear
- [ ] Edge cases tested
- [ ] Mocks used appropriately
- [ ] Tests pass consistently

### 9. Maintainability

**Will this be easy to maintain?**

- [ ] Code is self-documenting
- [ ] Complex logic has comments explaining WHY
- [ ] Follows project conventions
- [ ] No clever tricks or obscure patterns
- [ ] Dependencies are justified
- [ ] Documentation updated if needed

**Ask:**
- Will I understand this in 6 months?
- Would a new team member understand this?
- Is this the simplest solution?

### 10. Architecture

**Does it fit the system design?**

- [ ] Follows existing patterns
- [ ] Separation of concerns maintained
- [ ] No business logic in UI components
- [ ] API layer used correctly
- [ ] State management follows conventions
- [ ] File organization is logical

**Red flags:**
- New global state without justification
- New architectural pattern for one feature
- Breaking existing abstractions
- Mixing concerns (UI + business logic)

## Review Process

### Step 1: Understand Context

- Read the issue/ticket
- Understand the problem being solved
- Know the acceptance criteria

### Step 2: High-Level Review

- Review file changes list
- Check overall approach
- Verify architecture fits

### Step 3: Detailed Review

- Go through each file
- Apply checklist items
- Note issues and questions

### Step 4: Test Locally

```bash
# Pull changes
git checkout branch-name

# Install dependencies
npm install

# Type check
npm run type-check

# Run tests
npm run test

# Run application
npm run dev
```

### Step 5: Provide Feedback

**Good feedback is:**
- Specific and actionable
- Explains the "why"
- Suggests alternatives
- Balances criticism with praise
- Prioritizes issues (blocking vs. nice-to-have)

**Example feedback:**

```
❌ Bad: "This is wrong"

✅ Good: "This could cause a race condition when multiple 
requests are in flight. Consider using useEffect cleanup 
to cancel pending requests."

❌ Bad: "Rename this"

✅ Good: "The name 'data' is too generic. Consider 
'userData' or 'userProfile' to make the intent clearer."
```

## Feedback Template

### Critical (Must Fix)

Issues that would cause:
- Bugs or crashes
- Security vulnerabilities
- Data loss
- Breaking changes

### Important (Should Fix)

Issues affecting:
- Maintainability
- Performance
- Code quality
- Type safety

### Suggestions (Nice to Have)

Ideas for:
- Simplification
- Better naming
- Future improvements
- Optimization opportunities

## Self-Review Checklist

Before submitting your own code:

- [ ] I've tested this locally
- [ ] All tests pass
- [ ] Type checking passes
- [ ] No console.logs left in code
- [ ] No commented-out code
- [ ] Documentation updated if needed
- [ ] I've reviewed my own changes
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Code follows project conventions

## Questions to Always Ask

1. **Is this the simplest solution?**
2. **What could go wrong?**
3. **Is it type-safe?**
4. **Is it testable?**
5. **Will someone else understand this?**
6. **Does it follow project patterns?**
7. **Are there edge cases not handled?**
8. **Is error handling sufficient?**

## Remember

- Code review is about code quality, not personal criticism
- Ask questions when uncertain
- Suggest, don't demand (unless critical)
- Praise good solutions
- Focus on learning (both reviewer and author)
- The goal is better code, not perfect code

## Approval Criteria

Approve when:
- ✅ Code solves the problem correctly
- ✅ No critical or security issues
- ✅ Follows project standards
- ✅ Tests pass
- ✅ Maintainable and readable

Request changes when:
- ❌ Critical bugs exist
- ❌ Security vulnerabilities present  
- ❌ Violates core principles
- ❌ Not maintainable

## Resources

- Project style guide
- TypeScript handbook
- React documentation
- Next.js documentation
- Team coding standards
