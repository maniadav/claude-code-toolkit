---
description: Build a new React component
---

# Build React Component Workflow

This workflow guides you through creating a new React component following best practices.

## Prerequisites

- Project uses React or Next.js
- TypeScript is configured
- Component requirements are clear

## Steps

### 1. Plan the Component

Before writing code, clarify:
- Component purpose and responsibility
- Props interface (inputs)
- State requirements (if any)
- Dependencies and integrations
- Edge cases and error states

### 2. Create Component File

```bash
# For Next.js App Router
touch app/components/[component-name].tsx

# For components directory
touch components/[component-name].tsx
```

### 3. Define TypeScript Interface

Start with the props interface:

```typescript
interface ComponentNameProps {
  // Required props
  title: string;
  onAction: () => void;
  
  // Optional props
  description?: string;
  className?: string;
}
```

### 4. Implement Component Structure

```typescript
export function ComponentName({ 
  title, 
  onAction,
  description,
  className 
}: ComponentNameProps) {
  // 1. Hooks (if needed)
  // 2. Derived values
  // 3. Event handlers
  // 4. Early returns for edge cases
  // 5. Main JSX return
}
```

### 5. Add Client Directive (if needed)

Only add `'use client'` if component needs:
- Browser APIs (window, document)
- Event handlers (onClick, onChange)
- React hooks (useState, useEffect)
- Third-party libraries that use browser APIs

### 6. Write Tests (optional but recommended)

```bash
touch components/[component-name].test.tsx
```

### 7. Export Component

```typescript
// Named export (preferred)
export function ComponentName() { }

// Default export (if required by framework)
export default ComponentName;
```

### 8. Verify

// turbo
```bash
npm run build
```

// turbo
```bash
npm run type-check
```

## Best Practices Checklist

- [ ] Component has single responsibility
- [ ] Props are typed with interface
- [ ] No business logic in component (use hooks/utils)
- [ ] Early returns for edge cases
- [ ] Controlled form inputs (if applicable)
- [ ] Error states handled
- [ ] Loading states handled (if async)
- [ ] Accessible (semantic HTML, ARIA)
- [ ] No console.logs left in code
- [ ] File is < 300 lines

## Example: Complete Component

```typescript
'use client'; // Only if needed

import { useState } from 'react';

interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
  onContact?: () => void;
}

export function UserCard({ 
  name, 
  email, 
  avatar,
  onContact 
}: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Early return for invalid data
  if (!name || !email) {
    return <div>Invalid user data</div>;
  }

  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="user-card">
      {avatar && <img src={avatar} alt={name} />}
      <h2>{name}</h2>
      {isExpanded && <p>{email}</p>}
      
      <button onClick={handleToggle}>
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
      
      {onContact && (
        <button onClick={onContact}>Contact</button>
      )}
    </div>
  );
}
```

## Common Pitfalls to Avoid

- Don't add `'use client'` by default
- Don't put business logic in component
- Don't create unnecessary state
- Don't duplicate derived values in state
- Don't forget to handle edge cases
- Don't make components too complex (split instead)

## Next Steps

After creating the component:
1. Import and use it in parent component
2. Test in development environment
3. Verify responsive behavior
4. Check accessibility
5. Review with team (if applicable)
