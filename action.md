# Automated Action Plan: `claude-code-toolkit` Setup & Submodule Management

This document defines the exact step-by-step execution protocol for initializing and managing the **`claude-code-toolkit`** monorepo in a new repository or new chat session.

---

## Plan Overview

When executed in a new directory/chat, this plan performs four automated tasks:
1. **Repository Setup**: Renames/initializes the root repository as `claude-code-toolkit`.
2. **Submodule Clones**: Downloads and registers all 13 verified open-source Claude Code repos as Git submodules.
3. **Single-Command Update Setup**: Sets up a single command (`npm run update` or `bash scripts/update-all.sh`) to fetch and update all submodules at once.
4. **Personal Custom Folder**: Creates `my-custom-skills/` to store your personal skills and custom scripts independently.

---

## Verified Sub-Repository URLs

| Local Directory | Upstream GitHub Repository URL | Description |
|---|---|---|
| `Ay-Skills` | `https://github.com/walidboulanouar/Ay-Skills.git` | AY Automate skills (Remotion, Browser Agent, UI/UX, SEO) |
| `ECC` | `https://github.com/affaan-m/ECC.git` | Everything Claude Code agent harness OS & CLI tools |
| `awesome-claude-code` | `https://github.com/hesreallyhim/awesome-claude-code.git` | Curated index of Claude Code plugins, skills, & resources |
| `awesome-claude-code-toolkit` | `https://github.com/rohitg00/awesome-claude-code-toolkit.git` | CLI utilities, workflows, and presets for Claude Code |
| `awesome-claude-skills` | `https://github.com/ComposioHQ/awesome-claude-skills.git` | Production-grade community skill library |
| `claude-code-action` | `https://github.com/anthropics/claude-code-action.git` | Official Anthropic GitHub Action runner for CI/CD |
| `claude-code-best-practice` | `https://github.com/shanraisshan/claude-code-best-practice.git` | Engineering standards, rules, and CLAUDE.md guidelines |
| `claude-code-mcp` | `https://github.com/steipete/claude-code-mcp.git` | MCP server launcher configurations and setups |
| `claude-code-ultimate-guide` | `https://github.com/FlorianBruniaux/claude-code-ultimate-guide.git` | Master technical guide, quiz suites, and reference specs |
| `claude-context` | `https://github.com/zilliztech/claude-context.git` | Codebase AST indexer and context packing engine |
| `claude-skills` | `https://github.com/alirezarezvani/claude-skills.git` | Enterprise multi-agent skill suite |
| `github-mcp-server` | `https://github.com/github/github-mcp-server.git` | Official GitHub Model Context Protocol server |
| `superpowers` | `https://github.com/obra/superpowers.git` | Agentic workflow engine enforcing TDD & subagents |

---

## Step-by-Step Execution Commands

### Step 1: Initialize Root Repository as `claude-code-toolkit`

Run in your terminal or via agent execution:

```bash
# Ensure current working directory is named claude-code-toolkit
if [ "$(basename "$PWD")" != "claude-code-toolkit" ]; then
  cd ..
  mv "claude skills" "claude-code-toolkit" 2>/dev/null || true
  cd "claude-code-toolkit"
fi

# Initialize Git repository if not already initialized
git init -b main
```

---

### Step 2: Add All 13 Repositories as Git Submodules

Execute bulk submodule registration:

```bash
git submodule add https://github.com/walidboulanouar/Ay-Skills.git Ay-Skills
git submodule add https://github.com/affaan-m/ECC.git ECC
git submodule add https://github.com/hesreallyhim/awesome-claude-code.git awesome-claude-code
git submodule add https://github.com/rohitg00/awesome-claude-code-toolkit.git awesome-claude-code-toolkit
git submodule add https://github.com/ComposioHQ/awesome-claude-skills.git awesome-claude-skills
git submodule add https://github.com/anthropics/claude-code-action.git claude-code-action
git submodule add https://github.com/shanraisshan/claude-code-best-practice.git claude-code-best-practice
git submodule add https://github.com/steipete/claude-code-mcp.git claude-code-mcp
git submodule add https://github.com/FlorianBruniaux/claude-code-ultimate-guide.git claude-code-ultimate-guide
git submodule add https://github.com/zilliztech/claude-context.git claude-context
git submodule add https://github.com/alirezarezvani/claude-skills.git claude-skills
git submodule add https://github.com/github/github-mcp-server.git github-mcp-server
git submodule add https://github.com/obra/superpowers.git superpowers
```

---

### Step 3: Setup Single-Command Bulk Submodule Update

Create a helper script `scripts/update-all.sh`:

```bash
mkdir -p scripts

cat << 'EOF' > scripts/update-all.sh
#!/usr/bin/env bash
set -e

echo "🔄 Updating all submodules from upstream remotes..."
git submodule update --init --recursive --remote --merge
echo "✅ All 13 repositories updated successfully!"
EOF

chmod +x scripts/update-all.sh
```

Create `package.json` to allow single-command updating via `npm run update`:

```json
{
  "name": "claude-code-toolkit",
  "version": "1.0.0",
  "description": "Comprehensive Claude Code toolkit, skills monorepo, MCP servers, and agent workflows.",
  "scripts": {
    "update": "git submodule update --init --recursive --remote --merge",
    "update:all": "bash scripts/update-all.sh"
  }
}
```

Now, updating all 13 repositories in the future requires only **one command**:

```bash
npm run update
# OR
git submodule update --remote --merge
# OR
bash scripts/update-all.sh
```

---

### Step 4: Create Personal Custom Folder

Create your personal workspace directory for custom skills and scripts:

```bash
mkdir -p my-custom-skills/skills
mkdir -p my-custom-skills/scripts

cat << 'EOF' > my-custom-skills/README.md
# Personal Custom Skills & Scripts

Add your personal skills here in `skills/<skill-name>/SKILL.md`.
These files belong strictly to your repository and will never be overwritten when updating external submodules.
EOF
```

---

### Step 5: Commit Initial Setup

```bash
git add .
git commit -m "feat: initialize claude-code-toolkit monorepo with 13 submodules, custom skills dir, and update scripts"
```

---

## Instructions for Agent in a New Chat Session

When starting in a new chat/repository, instruct the agent:

> *"Read `action.md` and execute the step-by-step commands to initialize `claude-code-toolkit`, attach all submodules, set up the single-command update script, and create the custom skills directory."*
