# Claude Code Toolkit

A centralized engineering monorepo organizing and managing 14 production-grade open-source Claude Code toolkits, agent harness systems, Model Context Protocol (MCP) servers, and community skill suites.

---

## 1. What It Solves

* **Eliminates Environment Fragmentation**: Instead of cloning and tracking dozens of disconnected repositories across your machine, all toolkits, harnesses, and MCP servers are organized into a single version-controlled Git submodule repository.
* **Per-Project Isolation**: Prevents global runtime pollution. Instead of enforcing heavy global hooks across all projects, you selectively copy or link only the skills a specific project actually needs into its local `.agents/skills` or `.claude/skills`.
* **Safe Custom Skills**: The [`my-custom-skills/`](./my-custom-skills) directory provides an isolated personal workspace that will never be modified or overwritten when pulling upstream updates.
* **Single-Command Synchronization**: Pull the latest releases across all 14 upstream repositories with a single command (`npm run update`).

---

## 2. Installation & Setup

### Clone with all submodules
```bash
git clone --recursive https://github.com/maniadav/claude-code-toolkit.git
cd claude-code-toolkit
```

### If already cloned without submodules
```bash
npm run update
# or: git submodule update --init --recursive --remote --merge
```

---

## 3. Managed Submodule Catalog

| Submodule | Category | What Problem It Solves | Key Assets |
|---|---|---|---|
| **[`Ay-Skills`](./Ay-Skills)** | Skill Library | Automation skills for modern web dev | Remotion video gen, Puppeteer browser agent, UI/UX tokens, SEO auditing |
| **[`ECC`](./ECC)** | Harness OS | Everything Claude Code agent operating system | Terminal shims (`ecc-agentshield`), multi-agent task spawning, AST hooks, 900+ skills |
| **[`awesome-claude-code`](./awesome-claude-code)** | Curation Index | Discovery of tools, workflows, and plugins | Curated index of plugins, agent rules, and community guides |
| **[`awesome-claude-code-toolkit`](./awesome-claude-code-toolkit)** | Preset Registry | Quick setup of configs, presets, and MCP servers | Ready-to-use `.mcp.json` configs, workflow templates, `.claude-plugin` presets |
| **[`awesome-claude-skills`](./awesome-claude-skills)** | Skill Library | Instant access to 860+ specialized skills | Research writing, API connectors, diagramming, code conversion, theme factory |
| **[`claude-code-action`](./claude-code-action)** | CI/CD Runner | Automated code review and security audits in CI | Official Anthropic GitHub Action runner for PR analysis and approval gates |
| **[`claude-code-best-practice`](./claude-code-best-practice)** | Best Practices | Engineering guidelines preventing code rot | Ready-made `CLAUDE.md` guidelines, senior standards, and agent orchestration patterns |
| **[`claude-code-mcp`](./claude-code-mcp)** | MCP Server Bridge | Cross-IDE access to Claude Code tools | Exposes Claude Code CLI capabilities over stdio/SSE for Cursor, Codex, and Antigravity |
| **[`claude-code-ultimate-guide`](./claude-code-ultimate-guide)** | Reference & Skills | Deep technical mastery of Claude Code | Architectural whitepapers, quiz suites, CLI reference specs, structural skills |
| **[`claude-context`](./claude-context)** | AST Indexer | Token limit bottlenecks in large repositories | Compresses codebases up to 70% by extracting structural AST signatures into markdown |
| **[`claude-skills`](./claude-skills)** | Enterprise Suite | Enterprise workflows across dev and management | 380+ multi-agent skills for engineering leads, product managers, and architects |
| **[`github-mcp-server`](./github-mcp-server)** | Official MCP Server | Direct agent interaction with GitHub API | Official Go MCP server for issue tracking, PR management, and branch actions |
| **[`superpowers`](./superpowers)** | TDD Workflow Engine | Loose, unverified agent development | Enforces strict Test-Driven Development (TDD), subagent brainstorming, and planning |
| **[`Gravitas`](./Gravitas)** | Reliability Runtime | Hallucinations and unverified completion | Evidence-backed verification, task contracts, anti-rationalization, and scoped mutations |
| **[`my-custom-skills`](./my-custom-skills)** | Custom Skills | Personal skill workspace | Isolated directory for personal skills untouched by upstream submodule pulls |

---

## 4. How to Use

### A. Adding Skills to an Individual Project (Recommended)

Keep your global environment clean by adding skills directly to the target project that needs them.

#### Example 1: Add Gravitas Reliability Skills to a Target Project
```bash
# For Antigravity / Gemini IDE (.agents/skills)
mkdir -p /path/to/target-project/.agents/skills
cp -r /Users/manishyadav/Documents/code/maniadav/claude-code-toolkit/Gravitas/skills/gravitas /path/to/target-project/.agents/skills/
cp -r /Users/manishyadav/Documents/code/maniadav/claude-code-toolkit/Gravitas/skills/gravitas-highstakes /path/to/target-project/.agents/skills/

# For Claude Code CLI (.claude/skills)
mkdir -p /path/to/target-project/.claude/skills
cp -r /Users/manishyadav/Documents/code/maniadav/claude-code-toolkit/Gravitas/skills/gravitas /path/to/target-project/.claude/skills/
```

#### Example 2: Add Any Community Skill to a Target Project
```bash
# Example: Adding a web automation skill from Ay-Skills
cp -r /Users/manishyadav/Documents/code/maniadav/claude-code-toolkit/Ay-Skills/skills/browser-agent /path/to/target-project/.agents/skills/

# Example: Adding a skill from awesome-claude-skills
cp -r /Users/manishyadav/Documents/code/maniadav/claude-code-toolkit/awesome-claude-skills/theme-factory /path/to/target-project/.claude/skills/
```

---

### B. Adding a New Repository as a Submodule

To attach any new open-source Claude Code toolkit or library to this monorepo:

```bash
cd /Users/manishyadav/Documents/code/maniadav/claude-code-toolkit

# Add the repository as a Git submodule
git submodule add <REPOSITORY_GIT_URL> <DIRECTORY_NAME>

# Commit the submodule addition
git commit -m "feat: add <DIRECTORY_NAME> submodule"
```

---

### C. Creating a Custom Skill

Add your custom, proprietary, or personal skills inside [`my-custom-skills/`](./my-custom-skills). This directory is tracked separately from external submodules, ensuring your custom skills are never affected by submodule updates.

```bash
# 1. Create your skill directory
mkdir -p /Users/manishyadav/Documents/code/maniadav/claude-code-toolkit/my-custom-skills/skills/my-feature-skill

# 2. Add SKILL.md with standard YAML frontmatter
cat << 'EOF' > /Users/manishyadav/Documents/code/maniadav/claude-code-toolkit/my-custom-skills/skills/my-feature-skill/SKILL.md
---
name: my-feature-skill
description: Brief description explaining what the skill accomplishes and when the agent should trigger it.
---

# Instructions
1. Perform reconnaissance...
2. Execute workflow...
3. Verify output...
EOF
```

---

### D. Updating All Submodules

To pull the latest updates across all 14 upstream submodules in one step:

```bash
cd /Users/manishyadav/Documents/code/maniadav/claude-code-toolkit
npm run update
```

Or using the shell script:
```bash
bash scripts/update-all.sh
```

---

## 5. Architectural Principles

1. **Submodules are Read-Only**: Never edit files inside submodule directories directly (`ECC/`, `Gravitas/`, etc.). Treat them as external dependencies to keep `git submodule update` clean.
2. **Favor Per-Repo Scoping**: Use project-level `.agents/skills` or `.claude/skills` instead of machine-wide global hooks that can create friction or block unrelated tasks.
3. **Ground Before Mutating**: Follow senior engineering standards—read the target files, dependencies, and existing tests before applying edits.
