# Claude Code Toolkit

A centralized monorepo curating 14 production-grade open-source Claude Code toolkits, agent harness operating systems, Model Context Protocol (MCP) servers, and community skill suites.

Instead of managing dozens of disconnected repositories across your machine, this repository aggregates them as version-controlled Git submodules while isolating personal skills in `my-custom-skills/`.

---

## Table of Contents

- [Core Principles](#core-principles)
- [Repository Setup](#repository-setup)
- [Managed Submodule Catalog](#managed-submodule-catalog)
- [Guided Submodule Usage & Installation Flows](#guided-submodule-usage--installation-flows)
  - [1. Skill Libraries](#1-skill-libraries-ay-skills-awesome-claude-skills-claude-skills)
  - [2. Reliability Runtimes & TDD Engines](#2-reliability-runtimes--tdd-engines-gravitas-superpowers)
  - [3. Agent Harnesses & CLI Shims](#3-agent-harnesses--cli-shims-ecc)
  - [4. AST Indexers & Context Compression](#4-ast-indexers--context-compression-claude-context)
  - [5. Model Context Protocol (MCP) Servers](#5-model-context-protocol-mcp-servers-github-mcp-server-claude-code-mcp)
  - [6. CI/CD Runners & Automated Reviews](#6-cicd-runners--automated-reviews-claude-code-action)
  - [7. Best Practice Templates & Curation Guides](#7-best-practice-templates--curation-guides-claude-code-best-practice-awesome-claude-code-claude-code-ultimate-guide-awesome-claude-code-toolkit)
- [Personal Custom Skills (`my-custom-skills`)](#personal-custom-skills-my-custom-skills)
- [Adding New Submodules](#adding-new-submodules)
- [Updating Submodules](#updating-submodules)

---

## Core Principles

1. **Submodules are Read-Only**: Never edit files inside submodule directories (`ECC/`, `Gravitas/`, etc.) directly. Treat them as external dependencies to keep upstream updates clean.
2. **Per-Project Isolation**: Avoid global, machine-wide hooks that block or disrupt unrelated projects. Copy or link only the specific skills each project actually requires into its local `.agents/skills` or `.claude/skills`.
3. **Safe Custom Extensions**: Personal skills belong in [`my-custom-skills/`](./my-custom-skills), completely isolated from external upstream submodule synchronization.

---

## Repository Setup

### Clone with all submodules
```bash
git clone --recursive https://github.com/maniadav/claude-code-toolkit.git
cd claude-code-toolkit
```

### If already cloned without submodules
```bash
git submodule update --init --recursive --remote --merge
# or: npm run update
```

---

## Managed Submodule Catalog

| Submodule | Category | What Problem It Solves | Key Assets |
|---|---|---|---|
| **[`Ay-Skills`](./Ay-Skills)** | Skill Library | Web automation, video generation, design tokens | Remotion, Puppeteer browser agent, UI/UX tokens, SEO auditing |
| **[`awesome-claude-skills`](./awesome-claude-skills)** | Skill Library | Instant access to 860+ specialized skills | Research, API connectors, diagramming, code conversion, theme factory |
| **[`claude-skills`](./claude-skills)** | Enterprise Suite | Enterprise multi-agent workflows across dev & management | 380+ skills for engineering leads, product managers, and architects |
| **[`Gravitas`](./Gravitas)** | Reliability Runtime | Agent hallucination, rationalization, and unverified work | Evidence-backed verification, task contracts, 4 core skills |
| **[`superpowers`](./superpowers)** | TDD Workflow Engine | Unstructured coding and missing tests | Enforces strict Test-Driven Development (TDD), brainstorm & plan workflows |
| **[`ECC`](./ECC)** | Harness OS | Unsafe terminal commands and missing agent infrastructure | Terminal shims (`ecc-agentshield`), multi-agent task spawning, 900+ skills |
| **[`claude-context`](./claude-context)** | AST Indexer | LLM context window limits in large codebases | Compresses codebases up to 70% by extracting structural AST signatures |
| **[`github-mcp-server`](./github-mcp-server)** | MCP Server | Manual GitHub interactions | Official GitHub Go MCP server for issues, PRs, and branch operations |
| **[`claude-code-mcp`](./claude-code-mcp)** | MCP Bridge | IDE isolation from Claude CLI tools | Bridges Claude Code CLI over stdio/SSE for non-Claude IDEs |
| **[`claude-code-action`](./claude-code-action)** | CI/CD Runner | Manual code review bottlenecks | Anthropic GitHub Action runner for automated PR review gates |
| **[`claude-code-best-practice`](./claude-code-best-practice)** | Best Practices | Code degradation and architecture decay | Ready-made `CLAUDE.md` guidelines, senior engineering standards |
| **[`awesome-claude-code`](./awesome-claude-code)** | Curation Index | Tool and plugin discoverability | Curated directory of plugins, templates, and agent tools |
| **[`claude-code-ultimate-guide`](./claude-code-ultimate-guide)** | Reference Specs | Lack of technical depth on Claude CLI | Architectural whitepapers, quiz suites, CLI flags reference |
| **[`awesome-claude-code-toolkit`](./awesome-claude-code-toolkit)** | Preset Registry | Manual configuration overhead | Pre-built `.mcp.json` configs, workflow templates, preset manifests |
| **[`my-custom-skills`](./my-custom-skills)** | Custom Workspace | Overwriting personal skills during git pulls | Private, isolated folder for custom user-created skills |

---

## Guided Submodule Usage & Installation Flows

### 1. Skill Libraries (`Ay-Skills`, `awesome-claude-skills`, `claude-skills`)

Skill libraries contain ready-to-use `SKILL.md` bundles. To use a skill, copy or symlink it into your target project:

```bash
# Antigravity / Gemini IDE target project:
mkdir -p /path/to/target-project/.agents/skills
cp -r Ay-Skills/skills/browser-agent /path/to/target-project/.agents/skills/
cp -r awesome-claude-skills/theme-factory /path/to/target-project/.agents/skills/

# Claude Code CLI target project:
mkdir -p /path/to/target-project/.claude/skills
cp -r claude-skills/engineering-team/architecture-review /path/to/target-project/.claude/skills/
```

---

### 2. Reliability Runtimes & TDD Engines (`Gravitas`, `superpowers`)

#### Gravitas (Reliability Runtime & Proof-Based Completion)
Gravitas provides 4 core skills enforcing evidence-backed verification:
* `gravitas`: Core reliability runtime, planning-policy, and invariants.
* `gravitas-highstakes`: Mandatory checkpoints for migrations and destructive actions.
* `gravitas-python`: Python type-check (mypy/pyright), lint, and pytest patterns.
* `gravitas-typescript`: Strict TypeScript patterns and Vitest/Jest verification.

**How to Add Gravitas to a Project:**
```bash
# Add to Antigravity / Gemini IDE (.agents/skills)
mkdir -p /path/to/target-project/.agents/skills
cp -r Gravitas/skills/gravitas /path/to/target-project/.agents/skills/
cp -r Gravitas/skills/gravitas-highstakes /path/to/target-project/.agents/skills/

# Add to Claude Code CLI (.claude/skills)
mkdir -p /path/to/target-project/.claude/skills
cp -r Gravitas/skills/gravitas /path/to/target-project/.claude/skills/
```

#### Superpowers (Test-Driven Development Engine)
Superpowers enforces strict TDD and subagent workflows (`/brainstorm`, `/plan`, `/execute`).
```bash
# Copy superpowers into target project
mkdir -p /path/to/target-project/.agents/skills
cp -r superpowers /path/to/target-project/.agents/skills/
```

---

### 3. Agent Harnesses & CLI Shims (`ECC`)

Everything Claude Code (`ECC`) provides terminal safety shims (`ecc-agentshield`), multi-agent harness configurations, and AST hooks.

**How to Install ECC Shims:**
```bash
cd ECC
bash install.sh
# or: npx ecc-universal setup
```
To use individual skills from ECC without installing the full harness, copy from `ECC/skills/<skill-name>` into your project's `.agents/skills/`.

---

### 4. AST Indexers & Context Compression (`claude-context`)

`claude-context` extracts structural AST signatures to reduce LLM token usage by up to 70%.

**How to Run on Any Target Project:**
```bash
# Run directly against your project directory
npx claude-context /path/to/target-project --output /path/to/target-project/codebase-summary.md
```
Then instruct the AI agent to read `codebase-summary.md` before performing broad architectural work.

---

### 5. Model Context Protocol (MCP) Servers (`github-mcp-server`, `claude-code-mcp`)

#### GitHub Official MCP Server (Go)
Direct AI agent interaction with GitHub API (PRs, issues, commits, repo files).
```bash
# 1. Build the binary
cd github-mcp-server
go build -o github-mcp-server ./cmd/github-mcp-server

# 2. Register in your project's or IDE's mcp_config.json:
{
  "mcpServers": {
    "github": {
      "command": "/absolute/path/to/claude-code-toolkit/github-mcp-server/github-mcp-server",
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

#### Claude Code MCP Bridge (Node.js)
Exposes Claude Code CLI tools to other IDEs (Antigravity, Cursor, Codex).
```bash
cd claude-code-mcp
npm install && npm run build
```
Register the built script in `mcp_config.json`.

---

### 6. CI/CD Runners & Automated Reviews (`claude-code-action`)

Official Anthropic GitHub Action runner for continuous integration.

**How to Use in GitHub Actions:**
Create `.github/workflows/claude-code-review.yml` in your target repository:
```yaml
name: Claude Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

---

### 7. Best Practice Templates & Curation Guides

* **[`claude-code-best-practice`](./claude-code-best-practice)**: Copy template `CLAUDE.md` or `AGENTS.md` directly into the root of any new repository to enforce senior software engineering standards.
* **[`awesome-claude-code-toolkit`](./awesome-claude-code-toolkit)**: Contains ready-made `.mcp.json` templates and `.claude-plugin` manifests to quickly bootstrap new agent setups.
* **[`awesome-claude-code`](./awesome-claude-code)** & **[`claude-code-ultimate-guide`](./claude-code-ultimate-guide)**: Passive reference catalogs for advanced prompt patterns, CLI flags, and technical whitepapers.

---

## Personal Custom Skills (`my-custom-skills`)

Create and maintain private, custom, or client-specific skills without risk of upstream submodule conflicts:

```bash
# 1. Create skill folder
mkdir -p my-custom-skills/skills/my-custom-workflow

# 2. Add SKILL.md
cat << 'EOF' > my-custom-skills/skills/my-custom-workflow/SKILL.md
---
name: my-custom-workflow
description: When to trigger this skill and what it accomplishes.
---

# Instructions
1. Step 1...
2. Step 2...
EOF

# 3. Use in any project
cp -r my-custom-skills/skills/my-custom-workflow /path/to/target-project/.agents/skills/
```

---

## Adding New Submodules

To attach a new open-source Claude Code repository:

```bash
cd /Users/manishyadav/Documents/code/maniadav/claude-code-toolkit
git submodule add <REPOSITORY_GIT_URL> <FOLDER_NAME>
git commit -m "feat: add <FOLDER_NAME> submodule"
```

---

## Updating Submodules

To fetch and merge upstream releases across all 14 submodules simultaneously:

```bash
git submodule update --init --recursive --remote --merge
# or: npm run update
# or: bash scripts/update-all.sh
```
