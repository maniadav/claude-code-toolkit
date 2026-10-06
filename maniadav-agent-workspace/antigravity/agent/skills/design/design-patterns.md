---
name: design-patterns
description: Common design patterns and when to apply them
---

# Design Patterns Skill

## Purpose

Recognize when design patterns can improve code quality and apply them appropriately.

## Key Principle

**Use patterns only when they solve a real problem.**
Do not apply patterns for the sake of using patterns.

## React / Next.js Patterns

### 1. Compound Components

**When:** Components with complex internal state that need flexible composition

**Problem:**
```typescript
<Select value={value} onChange={handleChange} options={options} />
// Inflexible, can't customize option rendering
```

**Solution:**
```typescript
<Select value={value} onChange={handleChange}>
  <Select.Option value="1">Option 1</Select.Option>
  <Select.Option value="2">Option 2</Select.Option>
</Select>
```

**Example:**
```typescript
interface SelectContextValue {
  value: string;
  onChange: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function Select({ 
  value, 
  onChange, 
  children 
}: { 
  value: string; 
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      <div className="select">{children}</div>
    </SelectContext.Provider>
  );
}

function SelectOption({ value, children }: { value: string; children: React.ReactNode }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectOption must be used within Select');
  
  return (
    <div 
      className={context.value === value ? 'selected' : ''}
      onClick={() => context.onChange(value)}
    >
      {children}
    </div>
  );
}

Select.Option = SelectOption;
```

### 2. Render Props

**When:** Need to share logic but UI should be flexible

**Problem:**
```typescript
// Logic duplicated across components
function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => { /* fetch users */ }, []);
  return <div>{/* render users */}</div>;
}
```

**Solution:**
```typescript
function DataFetcher<T>({ 
  url, 
  render 
}: { 
  url: string; 
  render: (data: T[], loading: boolean, error: Error | null) => React.ReactNode;
}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return <>{render(data, loading, error)}</>;
}

// Usage
<DataFetcher<User>
  url="/api/users"
  render={(users, loading, error) => (
    loading ? <Spinner /> : <UserList users={users} />
  )}
/>
```

### 3. Custom Hooks (Preferred over Render Props)

**When:** Share stateful logic across components

**Example:**
```typescript
function useDataFetch<T>(url: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));
    
    return () => controller.abort();
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function UserList() {
  const { data: users, loading, error } = useDataFetch<User>('/api/users');
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return <div>{users.map(/* ... */)}</div>;
}
```

### 4. Container/Presenter Pattern

**When:** Separate business logic from UI

**Container (logic):**
```typescript
function UserListContainer() {
  const { data: users, loading, error } = useDataFetch<User>('/api/users');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <UserListPresenter
      users={filteredUsers}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      loading={loading}
      error={error}
    />
  );
}
```

**Presenter (UI only):**
```typescript
interface UserListPresenterProps {
  users: User[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading: boolean;
  error: Error | null;
}

function UserListPresenter({ 
  users, 
  searchTerm, 
  onSearchChange, 
  loading, 
  error 
}: UserListPresenterProps) {
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return (
    <div>
      <input 
        value={searchTerm} 
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Search users..."
      />
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## General Patterns

### 5. Factory Pattern

**When:** Need to create objects with complex setup logic

```typescript
interface NotificationConfig {
  type: 'email' | 'sms' | 'push';
  recipient: string;
  message: string;
}

interface Notification {
  send(): Promise<void>;
}

class NotificationFactory {
  static create(config: NotificationConfig): Notification {
    switch (config.type) {
      case 'email':
        return new EmailNotification(config.recipient, config.message);
      case 'sms':
        return new SMSNotification(config.recipient, config.message);
      case 'push':
        return new PushNotification(config.recipient, config.message);
      default:
        throw new Error(`Unknown notification type: ${config.type}`);
    }
  }
}

// Usage
const notification = NotificationFactory.create({
  type: 'email',
  recipient: 'user@example.com',
  message: 'Hello!'
});
await notification.send();
```

### 6. Strategy Pattern

**When:** Multiple algorithms for the same task

```typescript
interface PaymentStrategy {
  pay(amount: number): Promise<void>;
}

class CreditCardPayment implements PaymentStrategy {
  async pay(amount: number) {
    // Credit card payment logic
  }
}

class PayPalPayment implements PaymentStrategy {
  async pay(amount: number) {
    // PayPal payment logic
  }
}

class CryptoPayment implements PaymentStrategy {
  async pay(amount: number) {
    // Crypto payment logic
  }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}
  
  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }
  
  async processPayment(amount: number) {
    await this.strategy.pay(amount);
  }
}

// Usage
const processor = new PaymentProcessor(new CreditCardPayment());
await processor.processPayment(100);

// Switch strategy
processor.setStrategy(new PayPalPayment());
await processor.processPayment(100);
```

### 7. Observer Pattern (Pub/Sub)

**When:** Multiple parts of app need to react to changes

```typescript
type Listener<T> = (data: T) => void;

class EventEmitter<T> {
  private listeners: Listener<T>[] = [];
  
  subscribe(listener: Listener<T>): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  emit(data: T) {
    this.listeners.forEach(listener => listener(data));
  }
}

// Usage
interface UserLoggedIn {
  userId: string;
  timestamp: number;
}

const userEvents = new EventEmitter<UserLoggedIn>();

// Subscribe
const unsubscribe = userEvents.subscribe(event => {
  console.log(`User ${event.userId} logged in`);
});

// Emit
userEvents.emit({ userId: '123', timestamp: Date.now() });

// Cleanup
unsubscribe();
```

### 8. Singleton Pattern

**When:** Exactly one instance needed (use sparingly)

```typescript
class Database {
  private static instance: Database;
  private connection: any;
  
  private constructor() {
    this.connection = this.connect();
  }
  
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  
  private connect() {
    // Connection logic
  }
  
  query(sql: string) {
    return this.connection.query(sql);
  }
}

// Usage
const db = Database.getInstance();
await db.query('SELECT * FROM users');
```

**Note:** In Next.js, prefer module-level instances:
```typescript
// db.ts
const connection = createConnection();
export default connection;

// Usage
import db from './db';
await db.query('SELECT * FROM users');
```

## Anti-Patterns to Avoid

### ❌ Prop Drilling (3+ levels)

**Problem:**
```typescript
<App>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user} />
    </Sidebar>
  </Layout>
</App>
```

**Fix:** Use Context or state management
```typescript
const UserContext = createContext<User | null>(null);

<UserContext.Provider value={user}>
  <App>
    <Layout>
      <Sidebar>
        <UserMenu />
      </Sidebar>
    </Layout>
  </App>
</UserContext.Provider>
```

### ❌ God Components (500+ lines)

**Fix:** Split into smaller components

### ❌ Premature Abstraction

**Fix:** Write concrete code first, abstract when pattern emerges

## Decision Tree

```
Do I need to share logic across components?
├─ Yes, with different UI
│  └─ Use Custom Hook
├─ Yes, with related UI elements
│  └─ Use Compound Components
├─ Yes, need to swap implementations
│  └─ Use Strategy Pattern
└─ No
   └─ Keep it simple, no pattern needed
```

## When NOT to Use Patterns

- ❌ Code works and is simple
- ❌ Pattern adds more complexity than it solves
- ❌ Only used in one place
- ❌ Team unfamiliar with pattern
- ❌ Requirements unclear

## Remember

**Patterns are tools, not goals.**
Apply them when they make code simpler, not because they're "best practice."
