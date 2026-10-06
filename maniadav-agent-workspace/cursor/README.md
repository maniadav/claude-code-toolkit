# Cursor AI Configuration

This directory contains configuration files for [Cursor](https://cursor.sh/), an AI-powered code editor.

## Files

### `.cursorrules`

The `.cursorrules` file contains project-specific instructions that guide Cursor's AI assistant when generating or modifying code. This file defines coding standards, best practices, and architectural guidelines.

## Usage

### Setup

1. **Copy to your project root**:
   ```bash
   cp cursor/.cursorrules /path/to/your/project/.cursorrules
   ```

2. **Cursor will automatically detect** the `.cursorrules` file in your project root and apply these rules when:
   - Generating code with Cmd+K (inline generation)
   - Using the AI chat (Cmd+L)
   - Accepting AI suggestions

### Customization

You can customize the `.cursorrules` file to match your project's specific needs:

- **Add framework-specific rules**: Include guidelines for your specific tech stack (React, Vue, Angular, etc.)
- **Add project conventions**: Include naming conventions, file organization, or architectural patterns specific to your project
- **Add team preferences**: Include team-specific coding styles and preferences

### Best Practices

1. **Keep it concise**: Focus on the most important rules and patterns
2. **Be specific**: Provide clear examples and concrete guidelines
3. **Update regularly**: Keep the rules file in sync with your evolving codebase
4. **Version control**: Commit the `.cursorrules` file to your repository so the entire team benefits

## Features Covered

The provided `.cursorrules` file includes:

✅ **Code Planning**: Mandatory planning steps before writing code  
✅ **Code Standards**: Naming conventions, structure, and type safety  
✅ **Architecture**: Separation of concerns, state management, file organization  
✅ **React/Next.js**: Component guidelines, performance optimization  
✅ **API Handling**: Error handling, data validation  
✅ **Code Quality**: Comments, imports, formatting  
✅ **Optimization**: When and what to optimize  
✅ **Testing**: Test coverage and code review checklist  

## Example Workflows

### 1. Creating a New Component

When you ask Cursor to create a new React component, it will:
- Use functional components with TypeScript
- Apply proper naming conventions (PascalCase)
- Keep the component focused and presentational
- Use `"use client"` only if needed
- Follow the project's file structure

### 2. Refactoring Code

When refactoring, Cursor will:
- Plan the changes before implementing
- Maintain existing functionality
- Simplify without adding complexity
- Remove dead code and duplication
- Keep functions small and focused

### 3. Adding New Features

When adding features, Cursor will:
- Start with requirements analysis
- Identify the minimal change needed
- Follow architectural patterns
- Handle edge cases and errors
- Write self-documenting code

## Tips for Effective Use

1. **Be specific in your requests**: Instead of "make this better," say "extract this logic into a reusable hook"
2. **Reference the rules**: You can say "following the .cursorrules, create a new form component"
3. **Iterate**: Use the AI to refine code incrementally rather than rewriting everything
4. **Review AI output**: Always review generated code for correctness and adherence to your standards

## Additional Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [Cursor Rules Examples](https://github.com/PatrickJS/awesome-cursorrules)
- [Best Practices for AI-Assisted Coding](https://cursor.sh/blog)

## Contributing

If you find improvements or have suggestions for the `.cursorrules` file, please:
1. Test the changes in your project
2. Document the reasoning behind the change
3. Submit a pull request with clear description
