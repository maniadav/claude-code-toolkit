# GitHub Copilot Configuration

This directory contains configuration files for [GitHub Copilot](https://github.com/features/copilot), GitHub's AI pair programmer.

## Files

### `.github/copilot-instructions.md`

Custom instructions that guide GitHub Copilot's code suggestions. This file defines coding standards, best practices, and patterns specific to your project.

## Usage

### Setup

1. **Copy to your project**:
   ```bash
   # Create .github directory if it doesn't exist
   mkdir -p /path/to/your/project/.github
   
   # Copy the instructions file
   cp copilot/.github/copilot-instructions.md /path/to/your/project/.github/copilot-instructions.md
   ```

2. **GitHub Copilot will automatically use** these instructions when you have this file in your repository's `.github` directory.

### How It Works

GitHub Copilot reads the `copilot-instructions.md` file and uses it as context when:
- Providing inline code completions
- Generating code from comments
- Responding in Copilot Chat
- Suggesting fixes and improvements

### Customization

You can customize the instructions to match your project:

```markdown
# Add project-specific frameworks
We use Next.js 14 with App Router and React Server Components.

# Add custom patterns
All API calls should use our custom `apiClient` wrapper:
\`\`\`typescript
import { apiClient } from '@/lib/api-client';
const data = await apiClient.get('/users');
\`\`\`

# Add architecture decisions
We use Zustand for global state management.
Authentication state is managed in `useAuthStore`.
```

## Features Covered

The provided `copilot-instructions.md` includes:

✅ **Role & Mindset**: Senior engineering approach  
✅ **Code Generation Principles**: Planning, type safety, naming  
✅ **Function Design**: Small, focused, pure functions  
✅ **React/Next.js**: Component structure, state management  
✅ **Error Handling**: Comprehensive error management patterns  
✅ **API Handling**: Next.js API routes, data validation  
✅ **Code Quality**: Comments, imports, organization  
✅ **Performance**: When and how to optimize  
✅ **Testing**: Testable code patterns  

## Best Practices

### 1. Be Specific in Comments

Copilot works best with clear, descriptive comments:

```typescript
// Good: Specific intent
// Fetch user data with retry logic and exponential backoff
async function fetchUserWithRetry(userId: string) {
  // Copilot will generate appropriate retry logic
}

// Less effective: Vague intent
// Get user
async function getUser(userId: string) {
  // Copilot has less context to work with
}
```

### 2. Use Types to Guide Suggestions

```typescript
// Copilot will respect type definitions
interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

// Copilot will suggest code that matches the interface
function validateUserForm(data: UserFormData): boolean {
  // Copilot knows what properties are available
}
```

### 3. Provide Context with Examples

```typescript
// Show Copilot the pattern once
const fetchUsers = () => apiClient.get<User[]>('/users');

// It will follow the pattern for similar functions
const fetchPosts = () => // Copilot suggests: apiClient.get<Post[]>('/posts');
```

### 4. Review Suggestions

Always review Copilot's suggestions:
- ✅ Check for type safety
- ✅ Verify error handling
- ✅ Ensure edge cases are covered
- ✅ Confirm it matches project patterns
- ✅ Test the generated code

## IDE Integration

### VS Code

1. Install [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
2. Place `copilot-instructions.md` in `.github/` directory
3. Copilot will automatically use project-specific instructions

### JetBrains IDEs

1. Install GitHub Copilot plugin
2. Place instructions file in `.github/` directory
3. Instructions are automatically applied

### Neovim/Vim

1. Use [copilot.vim](https://github.com/github/copilot.vim) or [copilot.lua](https://github.com/zbirenbaum/copilot.lua)
2. Place instructions file in `.github/` directory
3. Instructions are automatically applied

## Tips for Maximum Effectiveness

### 1. Start with Comments

Write a detailed comment describing what you need, then let Copilot generate:

```typescript
// Create a custom React hook that:
// 1. Fetches user data from /api/users/:id
// 2. Handles loading and error states
// 3. Automatically refetches when userId changes
// 4. Returns { user, isLoading, error, refetch }
export function useUser(userId: string) {
  // Copilot will generate appropriate implementation
}
```

### 2. Iterate on Suggestions

- Press `Alt + ]` (or `Option + ]` on Mac) to see alternative suggestions
- Accept suggestions with `Tab`
- Partially accept with `Ctrl + →` (word by word)

### 3. Use Copilot Chat

For complex tasks, use Copilot Chat:
- `/explain` - Understand existing code
- `/fix` - Fix bugs or errors
- `/tests` - Generate unit tests
- `/doc` - Add documentation

### 4. Context Files

Tell Copilot about related files:

```typescript
// See UserCard implementation in components/UserCard.tsx
// Create similar ProductCard component
export function ProductCard({ product }: ProductCardProps) {
  // Copilot will use UserCard as reference
}
```

## Common Workflows

### 1. Creating Components

```typescript
// Create a responsive product card component with:
// - Product image, name, price
// - Add to cart button
// - Heart icon for favorites
// - Grid layout on desktop, stack on mobile
export function ProductCard({ product }: { product: Product }) {
```

### 2. Writing API Routes

```typescript
// API route to create a new user
// - Validate request body with Zod
// - Check for duplicate email
// - Hash password with bcrypt
// - Save to database
// - Return user without password
export async function POST(request: NextRequest) {
```

### 3. Creating Hooks

```typescript
// Hook to manage form state with:
// - Validation on blur
// - Submit handler with loading state
// - Reset function
// - Error messages
export function useForm<T>(schema: z.Schema<T>) {
```

## Troubleshooting

### Suggestions Don't Match Standards

1. Check if `copilot-instructions.md` is in `.github/` directory
2. Restart your IDE to reload instructions
3. Make instructions more specific
4. Provide examples in the instructions file

### No Suggestions

1. Ensure GitHub Copilot is enabled in your IDE
2. Check your Copilot subscription status
3. Verify you're logged into GitHub in your IDE
4. Check file size (very large files may have fewer suggestions)

### Incorrect Suggestions

1. Provide more context in comments
2. Add type definitions to guide suggestions
3. Show examples of the pattern you want
4. Use Copilot Chat for complex logic

## Additional Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Copilot Instructions Reference](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Best Practices Guide](https://github.blog/2023-06-20-how-to-write-better-prompts-for-github-copilot/)
- [Copilot Keyboard Shortcuts](https://docs.github.com/en/copilot/using-github-copilot/getting-started-with-github-copilot#keyboard-shortcuts)

## Contributing

To improve these instructions:
1. Test changes in your project
2. Document what improved and why
3. Submit a pull request with examples
