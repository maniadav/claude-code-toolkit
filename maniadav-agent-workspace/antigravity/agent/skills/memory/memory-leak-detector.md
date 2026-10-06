---
name: memory-leak-detector
description: Detect and fix memory leaks in React/Next.js applications
---

# Memory Leak Detection Skill

## Purpose

Identify and fix common memory leak patterns in React/Next.js applications.

## When to Use

- Components unmount but effects continue running
- Event listeners not cleaned up
- Timers (setTimeout, setInterval) not cleared
- Subscriptions not unsubscribed
- Large objects retained in closures
- Memory usage grows over time

## Common Memory Leak Patterns

### 1. Missing Effect Cleanup

**Problem:**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Running...');
  }, 1000);
  // Missing cleanup - interval continues after unmount
}, []);
```

**Fix:**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Running...');
  }, 1000);
  
  return () => {
    clearInterval(interval);
  };
}, []);
```

### 2. Event Listeners Not Removed

**Problem:**
```typescript
useEffect(() => {
  const handleResize = () => {
    console.log('Resized');
  };
  
  window.addEventListener('resize', handleResize);
  // Missing cleanup - listener persists
}, []);
```

**Fix:**
```typescript
useEffect(() => {
  const handleResize = () => {
    console.log('Resized');
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

### 3. Async Operations After Unmount

**Problem:**
```typescript
useEffect(() => {
  fetchData().then(data => {
    setState(data); // Might set state after unmount
  });
}, []);
```

**Fix:**
```typescript
useEffect(() => {
  let isCancelled = false;
  
  fetchData().then(data => {
    if (!isCancelled) {
      setState(data);
    }
  });
  
  return () => {
    isCancelled = true;
  };
}, []);
```

### 4. Unclosed Subscriptions

**Problem:**
```typescript
useEffect(() => {
  const subscription = dataSource.subscribe(data => {
    setState(data);
  });
  // Missing cleanup
}, []);
```

**Fix:**
```typescript
useEffect(() => {
  const subscription = dataSource.subscribe(data => {
    setState(data);
  });
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 5. Large Objects in Closures

**Problem:**
```typescript
const handleClick = () => {
  const largeData = fetchLargeDataset();
  
  return () => {
    // This closure captures largeData
    // preventing garbage collection
    console.log(largeData[0]);
  };
};
```

**Fix:**
```typescript
const handleClick = () => {
  const largeData = fetchLargeDataset();
  const firstItem = largeData[0];
  
  return () => {
    // Only capture what you need
    console.log(firstItem);
  };
};
```

## Detection Checklist

### React DevTools Profiler

1. Open React DevTools
2. Go to Profiler tab
3. Record interaction
4. Check component mount/unmount cycles
5. Look for components that remount frequently

### Chrome DevTools Memory Profiler

1. Open Chrome DevTools → Memory tab
2. Take heap snapshot before interaction
3. Perform user action (navigate, click, etc.)
4. Take another heap snapshot
5. Compare snapshots
6. Look for objects that weren't garbage collected

### Common Indicators

- [ ] Memory usage increases over time
- [ ] Performance degrades after extended use
- [ ] Browser becomes sluggish
- [ ] Console warnings about setState on unmounted component
- [ ] Network requests continue after navigation

## Fix Patterns

### useEffect Cleanup Template

```typescript
useEffect(() => {
  // Setup code
  const resource = setupResource();
  
  // Cleanup function
  return () => {
    resource.cleanup();
  };
}, [dependencies]);
```

### AbortController for Fetch

```typescript
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => setState(data))
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    });
  
  return () => {
    controller.abort();
  };
}, []);
```

### Custom Hook for Mounted State

```typescript
function useIsMounted() {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return isMounted;
}

// Usage
function MyComponent() {
  const isMounted = useIsMounted();
  
  useEffect(() => {
    fetchData().then(data => {
      if (isMounted()) {
        setState(data);
      }
    });
  }, [isMounted]);
}
```

## Testing for Memory Leaks

### Manual Test

1. Navigate to page
2. Note memory usage
3. Interact with page (open modals, navigate, etc.)
4. Navigate away
5. Force garbage collection (Chrome DevTools)
6. Check if memory returned to baseline

### Automated Test

```typescript
describe('Memory Leaks', () => {
  it('should cleanup on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    
    const { unmount } = render(<MyComponent />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
```

## Prevention Guidelines

1. **Always return cleanup from useEffect** if setting up:
   - Timers (setInterval, setTimeout)
   - Event listeners
   - Subscriptions
   - WebSocket connections
   - Animation frames

2. **Cancel async operations** on unmount:
   - Fetch requests (AbortController)
   - Promises (cancellation flag)
   - API calls

3. **Avoid capturing large objects** in closures:
   - Extract only needed data
   - Use refs for mutable data
   - Clear refs on cleanup

4. **Be careful with third-party libraries**:
   - Check if they require cleanup
   - Read documentation for teardown methods
   - Test library integrations for leaks

## Quick Reference

| Resource Type | Cleanup Method |
|--------------|----------------|
| setInterval | clearInterval |
| setTimeout | clearTimeout |
| Event listener | removeEventListener |
| Subscription | unsubscribe() |
| WebSocket | close() |
| requestAnimationFrame | cancelAnimationFrame |
| Fetch | AbortController.abort() |
| Observer (Intersection, Resize, etc.) | disconnect() |

## Tools

- **React DevTools Profiler** - Component lifecycle
- **Chrome Memory Profiler** - Heap snapshots
- **Performance API** - Memory usage tracking
- **why-did-you-render** - Unnecessary re-renders
- **React Strict Mode** - Detect side effects

## Red Flags in Code Review

- useEffect without return statement (when needed)
- Event listeners in useEffect without cleanup
- setInterval/setTimeout without clear
- Async operations without cancellation
- Third-party library setup without teardown
- Large data structures in closures

---

**Remember:** Every useEffect that creates a resource should clean it up.
