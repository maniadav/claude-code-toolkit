---
description: Debug and fix a production issue
---

# Debug Issue Workflow

This workflow guides you through systematically debugging and fixing issues.

## Steps

### 1. Reproduce the Issue

- [ ] Get exact steps to reproduce
- [ ] Verify issue occurs in local environment
- [ ] Identify affected environment (dev, staging, prod)
- [ ] Note error messages and stack traces

### 2. Gather Information

```bash
# Check application logs
npm run logs

# Check browser console (for frontend issues)
# Open DevTools → Console tab

# Check network requests (for API issues)
# Open DevTools → Network tab
```

Review:
- Error messages
- Stack traces
- Request/response payloads
- Browser console warnings
- Server logs

### 3. Isolate the Problem

Questions to ask:
- When did this start happening?
- What changed recently?
- Does it happen consistently?
- What's the minimal reproduction case?
- Which component/module is affected?

### 4. Form a Hypothesis

Based on gathered information:
1. What do you think is causing the issue?
2. Why do you think this is the cause?
3. How can you test this hypothesis?

### 5. Test the Hypothesis

Add strategic logging:

```typescript
console.log('DEBUG: Function input:', input);
console.log('DEBUG: Intermediate value:', value);
console.log('DEBUG: Function output:', output);
```

Or use debugger:

```typescript
debugger; // Browser will pause here
```

### 6. Implement Fix

Once root cause is identified:

1. **Plan the fix**
   - What's the minimal change needed?
   - Will this break anything else?
   - Are there edge cases to consider?

2. **Write the fix**
   - Make targeted changes
   - Don't refactor unrelated code
   - Add error handling if missing

3. **Test the fix**
   - Verify issue is resolved
   - Test edge cases
   - Ensure no regressions

### 7. Verify Fix

// turbo
```bash
# Type check
npm run type-check
```

// turbo
```bash
# Run tests
npm run test
```

// turbo
```bash
# Build for production
npm run build
```

### 8. Document the Fix

Add comment explaining:
- What the issue was
- Why the fix works
- Any caveats or edge cases

```typescript
// Fixed: Users with null email were causing crashes
// We now validate email exists before accessing properties
if (!user.email) {
  return { error: 'Email is required' };
}
```

### 9. Clean Up

- [ ] Remove debug logging
- [ ] Remove commented code
- [ ] Update tests if needed
- [ ] Update documentation if needed

### 10. Prevent Future Issues

Consider:
- [ ] Add validation to prevent issue
- [ ] Add tests to catch regression
- [ ] Improve error messages
- [ ] Add monitoring/alerting

## Common Debugging Techniques

### Frontend Debugging

**React DevTools**
```bash
# Install React DevTools browser extension
# Inspect component props and state
```

**Performance Profiling**
```typescript
// Use React.memo for expensive components
const MemoizedComponent = React.memo(ExpensiveComponent);

// Use useCallback for stable function references
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);
```

**Network Issues**
```typescript
// Log API calls
console.log('API Request:', { url, method, body });

// Check response
const response = await fetch(url);
console.log('API Response:', await response.clone().json());
```

### Backend Debugging

**API Route Debugging**
```typescript
export async function POST(request: NextRequest) {
  console.log('Request received:', {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers),
  });

  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    // ... handler logic
  } catch (error) {
    console.error('Error in API route:', error);
    throw error;
  }
}
```

**Database Issues**
```typescript
// Log queries
console.log('Executing query:', query);

// Log results
console.log('Query result:', result);
```

### Environment Issues

**Check Environment Variables**
```typescript
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  // Don't log secrets!
});
```

**Check Dependencies**
```bash
# Verify installed versions
npm list [package-name]

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Common Issues & Solutions

### Issue: "Cannot read property of undefined"

**Cause**: Accessing property on undefined/null object

**Fix**: Add null checks
```typescript
// Before
const name = user.profile.name;

// After
const name = user?.profile?.name ?? 'Unknown';
```

### Issue: Infinite re-renders (React)

**Cause**: State update in render or dependency array issue

**Fix**: Move to useEffect or fix dependencies
```typescript
// Before (causes infinite loop)
function Component() {
  const [count, setCount] = useState(0);
  setCount(count + 1); // Don't do this
}

// After
function Component() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1);
  }, []); // Runs once
}
```

### Issue: API call fails with CORS error

**Cause**: CORS not configured

**Fix**: Add CORS headers
```typescript
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    },
  });
}
```

### Issue: Stale data in component

**Cause**: Missing dependency in useEffect

**Fix**: Add all dependencies
```typescript
// Before
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId

// After
useEffect(() => {
  fetchData(userId);
}, [userId]); // Correct
```

## Debugging Best Practices

1. **Start simple** - Check obvious things first
2. **Reproduce consistently** - Can't fix what you can't reproduce
3. **Change one thing at a time** - Know what fixed it
4. **Read error messages carefully** - They usually tell you what's wrong
5. **Use version control** - Commit before debugging, easy to revert
6. **Take breaks** - Fresh eyes often spot issues quickly
7. **Ask for help** - Two heads better than one

## Tools

- **Browser DevTools** - Frontend debugging
- **React DevTools** - Component inspection
- **Network tab** - API debugging
- **Console** - Quick logging
- **Debugger** - Step-through debugging
- **TypeScript** - Catch errors before runtime
- **ESLint** - Catch common mistakes

## Checklist Before Considering "Fixed"

- [ ] Issue no longer occurs in local environment
- [ ] Fix tested in all affected environments
- [ ] Edge cases handled
- [ ] No regressions introduced
- [ ] Tests updated/added
- [ ] Debug logging removed
- [ ] Code reviewed
- [ ] Documentation updated if needed
