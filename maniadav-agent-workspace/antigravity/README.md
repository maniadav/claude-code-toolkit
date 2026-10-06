# Antigravity AI Configuration

This directory contains configuration files for Antigravity, Google's AI-powered coding assistant.

## Structure

```
antigravity/
├── .agent/
│   ├── rules/              # Coding standards and guidelines
│   ├── workflows/          # Step-by-step workflow guides
│   └── skills/             # Reusable skills for common tasks
└── README.md
```

## Files and Directories

### `.agent/rules/`

Project-specific rules that define coding standards, best practices, and conventions.

**Files:**
- `senior-engineering.md` - Core engineering principles and standards

### `.agent/workflows/`

Step-by-step workflows for common development tasks.

**Files:**
- `build-component.md` - Guide for creating React components
- `create-api-route.md` - Guide for creating Next.js API routes
- `debug-issue.md` - Systematic debugging workflow

### `.agent/skills/`

Reusable skills that Antigravity can use for specialized tasks.

**Files:**
- `code-review/SKILL.md` - Comprehensive code review checklist

## Usage

### Setup

1. **Copy to your project**:
   ```bash
   # Copy entire .agent directory
   cp -r antigravity/.agent /path/to/your/project/
   ```

2. **Antigravity automatically detects** the `.agent` directory and uses:
   - Rules when generating or reviewing code
   - Workflows when you reference them (e.g., "follow the build-component workflow")
   - Skills when relevant to the task

### Using Rules

Rules are automatically applied when Antigravity generates code. You can also reference them explicitly:

```
"Following the senior-engineering rules, create a new user service"
```

### Using Workflows

Reference workflows by name when you need step-by-step guidance:

```
"Use the build-component workflow to create a ProductCard component"
"Follow the create-api-route workflow for a new /api/products endpoint"
"Use debug-issue workflow to fix the login error"
```

Workflows marked with `// turbo` allow automatic command execution for safe operations.

### Using Skills

Skills are automatically applied when relevant, or you can invoke them:

```
"Use the code-review skill to review my changes"
"Apply code-review checklist to UserService.ts"
```

## Customization

### Adding Custom Rules

Create new `.md` files in `.agent/rules/`:

```markdown
# My Custom Rule

## Context
Explain when this rule applies

## Guidelines
- Specific guideline 1
- Specific guideline 2

## Examples
\`\`\`typescript
// Good example
\`\`\`

\`\`\`typescript
// Bad example
\`\`\`
```

### Adding Custom Workflows

Create new `.md` files in `.agent/workflows/` with YAML frontmatter:

```markdown
---
description: Short description of the workflow
---

# Workflow Name

## Prerequisites
- What's needed before starting

## Steps

### 1. First Step
Instructions...

### 2. Second Step
// turbo (optional - allows auto-execution)
\`\`\`bash
command-to-run
\`\`\`

## Checklist
- [ ] Verification item 1
- [ ] Verification item 2
```

### Adding Custom Skills

Create new directories in `.agent/skills/` with a `SKILL.md` file:

```markdown
---
name: Skill Name
description: What this skill does
---

# Skill Name

## Purpose
What problem this skill solves

## When to Use
- Scenario 1
- Scenario 2

## How to Use
Step-by-step instructions...
```

## Features Covered

### Rules
✅ **Code Planning**: Structured approach before coding  
✅ **Code Standards**: Naming, structure, type safety  
✅ **Architecture**: Separation of concerns, state management  
✅ **React/Next.js**: Component and API guidelines  
✅ **Code Quality**: Comments, imports, optimization  
✅ **Human-in-the-Loop**: Critical decision points  

### Workflows
✅ **Component Creation**: React component best practices  
✅ **API Development**: Next.js API routes with validation  
✅ **Debugging**: Systematic issue resolution  

### Skills
✅ **Code Review**: Comprehensive review checklist  

## Best Practices

### 1. Keep Rules Focused

Don't create one giant rule file. Instead, create focused rules:
- `typescript-standards.md` - TypeScript-specific guidelines
- `react-patterns.md` - React component patterns
- `api-design.md` - API design principles

### 2. Make Workflows Actionable

Good workflows:
- Have clear prerequisites
- Provide specific commands
- Include verification steps
- Use `// turbo` for safe commands

### 3. Create Reusable Skills

Skills should:
- Solve a specific problem
- Be reusable across projects
- Include clear examples
- Have structured checklists

### 4. Version Control

Commit `.agent` directory to your repository:
```bash
git add .agent
git commit -m "Add Antigravity configuration"
```

This ensures the entire team benefits from the same standards.

## Example Workflows

### Creating a New Feature

```
USER: Create a user profile component with avatar, name, and bio

ANTIGRAVITY: I'll follow the build-component workflow:
1. Plan: Profile component with UserProfileProps interface
2. Create: components/UserProfile.tsx
3. Implement: With proper TypeScript types
4. Verify: Type check and build
```

### Debugging an Issue

```
USER: The form submission is failing silently

ANTIGRAVITY: Let me use the debug-issue workflow:
1. Reproduce: Can you provide steps?
2. Gather info: Checking console and network logs
3. Isolate: Testing form validation
4. Fix: Add proper error handling
5. Verify: Test submission with various inputs
```

### Code Review

```
USER: Review my changes to the authentication system

ANTIGRAVITY: Using code-review skill checklist:

Critical Issues:
- Password is logged (security risk)
- No validation on email input

Important:
- Error messages could be more specific
- Consider adding rate limiting

Suggestions:
- Extract validation to separate function
- Add JSDoc comments for public API
```

## Integration Tips

### 1. Reference in Commits

```bash
git commit -m "Add user service following senior-engineering rules"
```

### 2. Use in Pull Requests

```markdown
## Changes
- Created UserService following API design workflow
- Applied code-review skill checklist

## Verification
- [x] Tests pass
- [x] Type check passes
- [x] Follows senior-engineering rules
```

### 3. Team Onboarding

New team members can:
1. Review rules to understand standards
2. Follow workflows for common tasks
3. Use skills for quality assurance

## Troubleshooting

### Rules Not Applied

1. Verify `.agent/rules/` exists in project root
2. Check file format (must be `.md`)
3. Restart Antigravity session

### Workflows Not Found

1. Confirm `.agent/workflows/` directory exists
2. Check YAML frontmatter format
3. Use exact workflow name when referencing

### Skills Not Activating

1. Ensure `SKILL.md` file exists in skill directory
2. Verify YAML frontmatter
3. Explicitly invoke skill by name

## Additional Resources

- [Antigravity Documentation](https://deepmind.google/technologies/antigravity/)
- Project-specific guidelines (see rules directory)
- Team knowledge base

## Contributing

To improve these configurations:

1. **Test changes** in your project first
2. **Document reasoning** for new rules/workflows/skills
3. **Share with team** for feedback
4. **Commit to repository** with clear description

## File Formats

### Rules Format

```markdown
# Rule Title

Clear, concise guidelines with examples.
Use code blocks to show good vs bad practices.
```

### Workflow Format

```markdown
---
description: Brief description
---

# Workflow Title

## Steps
Numbered steps with commands and verification
```

### Skill Format

```markdown
---
name: Skill Name
description: What it does
---

# Skill Title

Detailed instructions with checklists and examples
```

## Benefits

**Consistency**: Entire team follows same standards  
**Efficiency**: Reusable workflows save time  
**Quality**: Built-in best practices and reviews  
**Onboarding**: New members learn patterns quickly  
**Knowledge**: Organizational knowledge preserved  

---

**Note**: This configuration is designed for TypeScript/React/Next.js projects but can be adapted for other stacks by modifying the rules, workflows, and skills.
