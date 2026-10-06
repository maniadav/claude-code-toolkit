---
name: performance-optimization
description: Identify and fix performance issues in React/Next.js
---

# Performance Optimization Skill

## Core Principle

**Measure first, optimize second.**
Never optimize without profiling data.

## When to Use

- App feels slow or unresponsive
- Profiler shows performance issues
- Metrics indicate slow load times
- User complaints about performance

## Measurement Tools

### 1. React DevTools Profiler

```
1. Open React DevTools
2. Go to Profiler tab
3. Click record
4. Perform slow interaction
5. Stop recording
6. Analyze component render times
```

**What to look for:**
- Components rendering unnecessarily
- Long render times
- Many re-renders for single interaction

### 2. Chrome DevTools Performance

```
1. Open Chrome DevTools → Performance
2. Click record
3. Perform interaction
4. Stop recording
5. Analyze flame graph
```

**What to look for:**
- Long tasks (> 50ms)
- Layout thrashing
- Expensive JavaScript execution

### 3. Lighthouse

```bash
# Run Lighthouse
npm run build
npm run start
# Open Chrome → DevTools → Lighthouse → Analyze
```

**Key metrics:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

## Common Performance Issues

### 1. Unnecessary Re-renders

**Problem:** Component re-renders when props haven't changed

**Detection:**
```typescript
function MyComponent({ data }) {
  console.log('Rendering MyComponent');
  return <div>{data.name}</div>;
}
```

**Fix with React.memo:**
```typescript
const MyComponent = React.memo(function MyComponent({ data }) {
  return <div>{data.name}</div>;
});
```

**Fix with useMemo:**
```typescript
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  // Bad: New object every render
  const user = { name: 'John', age: 30 };
  
  // Good: Memoized object
  const user = useMemo(() => ({ 
    name: 'John', 
    age: 30 
  }), []);
  
  return <UserCard user={user} />;
}
```

### 2. Expensive Computations

**Problem:** Heavy calculation on every render

```typescript
function ProductList({ products }) {
  // Runs on every render!
  const sortedProducts = products.sort((a, b) => 
    b.price - a.price
  );
  
  return <div>{/* render sortedProducts */}</div>;
}
```

**Fix with useMemo:**
```typescript
function ProductList({ products }) {
  const sortedProducts = useMemo(() => 
    products.sort((a, b) => b.price - a.price),
    [products]
  );
  
  return <div>{/* render sortedProducts */}</div>;
}
```

### 3. Callback Recreation

**Problem:** New function instance on every render causes child re-renders

```typescript
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  // New function every render
  const handleClick = () => {
    console.log('Clicked');
  };
  
  return <ChildComponent onClick={handleClick} />;
}
```

**Fix with useCallback:**
```typescript
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // Dependencies
  
  return <ChildComponent onClick={handleClick} />;
}
```

### 4. Large Lists

**Problem:** Rendering thousands of items

```typescript
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

**Fix with virtualization:**
```typescript
import { FixedSizeList } from 'react-window';

function UserList({ users }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={users.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <UserCard user={users[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### 5. Unoptimized Images

**Problem:** Large images slow down page load

```typescript
// Bad
<img src="/large-image.jpg" alt="Product" />
```

**Fix with Next.js Image:**
```typescript
import Image from 'next/image';

<Image
  src="/large-image.jpg"
  alt="Product"
  width={500}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

### 6. Bundle Size

**Problem:** Large JavaScript bundle

**Check bundle size:**
```bash
npm run build
# Check .next/build output
```

**Fix: Code splitting**
```typescript
import dynamic from 'next/dynamic';

// Lazy load component
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false, // Optional: disable server-side rendering
});

function Page() {
  return (
    <div>
      <HeavyComponent />
    </div>
  );
}
```

**Fix: Tree shaking**
```typescript
// Bad: Imports entire library
import _ from 'lodash';

// Good: Import only needed function
import debounce from 'lodash/debounce';
```

### 7. Blocking Render

**Problem:** Heavy computation blocks UI

**Fix with Web Workers:**
```typescript
// worker.ts
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};

// Component
function MyComponent() {
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url));
    
    worker.onmessage = (e) => {
      setResult(e.data);
    };
    
    worker.postMessage(inputData);
    
    return () => worker.terminate();
  }, [inputData]);
  
  return <div>{result}</div>;
}
```

**Fix with requestIdleCallback:**
```typescript
useEffect(() => {
  const id = requestIdleCallback(() => {
    performNonUrgentWork();
  });
  
  return () => cancelIdleCallback(id);
}, []);
```

## Optimization Checklist

### React Component Level

- [ ] Use React.memo for expensive components
- [ ] Use useMemo for expensive computations
- [ ] Use useCallback for functions passed as props
- [ ] Avoid inline object/array creation in props
- [ ] Virtualize long lists (react-window, react-virtualized)
- [ ] Lazy load components with dynamic import

### Next.js Application Level

- [ ] Use Next.js Image component
- [ ] Implement incremental static regeneration (ISR)
- [ ] Use server components where possible
- [ ] Optimize fonts with next/font
- [ ] Enable compression in next.config.js
- [ ] Use static generation over server-side rendering

### Bundle Optimization

- [ ] Analyze bundle with next/bundle-analyzer
- [ ] Tree-shake unused code
- [ ] Code split with dynamic imports
- [ ] Remove unused dependencies
- [ ] Use lightweight alternatives (date-fns vs moment)

### Network Optimization

- [ ] Implement caching headers
- [ ] Use CDN for static assets
- [ ] Compress images (WebP, AVIF)
- [ ] Lazy load images
- [ ] Prefetch critical resources
- [ ] Use HTTP/2 or HTTP/3

## Performance Patterns

### Debouncing User Input

```typescript
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      performSearch(term);
    }, 300),
    []
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };
  
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  
  return <input value={searchTerm} onChange={handleChange} />;
}
```

### Pagination

```typescript
function UserList() {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  
  const { data: users } = useQuery(['users', page], () =>
    fetchUsers({ page, limit: ITEMS_PER_PAGE })
  );
  
  return (
    <div>
      {users?.map(user => <UserCard key={user.id} user={user} />)}
      <Pagination 
        currentPage={page} 
        onPageChange={setPage}
      />
    </div>
  );
}
```

### Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

function InfiniteUserList() {
  const { ref, inView } = useInView();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 0 }) => fetchUsers(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  
  return (
    <div>
      {data?.pages.map(page =>
        page.users.map(user => (
          <UserCard key={user.id} user={user} />
        ))
      )}
      <div ref={ref}>
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
}
```

## Benchmarking

```typescript
function measurePerformance(fn: () => void, label: string) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${label}: ${end - start}ms`);
}

// Usage
measurePerformance(() => {
  heavyComputation();
}, 'Heavy Computation');
```

## Performance Budget

Set limits and measure:

| Metric | Target | Max |
|--------|--------|-----|
| FCP | < 1.8s | 3s |
| LCP | < 2.5s | 4s |
| TTI | < 3.8s | 7.3s |
| CLS | < 0.1 | 0.25 |
| Bundle Size | < 200KB | 350KB |

## Remember

1. **Measure before optimizing** - Profile to find real bottlenecks
2. **Optimize the critical path** - Focus on what users see first
3. **Don't over-optimize** - Balance performance with maintainability
4. **Test on real devices** - Especially low-end mobile devices
5. **Monitor in production** - Use Real User Monitoring (RUM)

---

**Performance is a feature, but so is simplicity.**
Optimize when necessary, not preemptively.
