# Claude Code Toolkit

Comprehensive monorepo bringing together 13 production-grade open-source Claude Code toolkits, agent harnesses, Model Context Protocol (MCP) servers, workflow engines, and enterprise skill suites. Designed for developers and AI engineers operating Claude Code CLI, Antigravity IDE, Cursor, and AGY agents.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Submodule Catalog &amp; Capability Matrix](#submodule-catalog--capability-matrix)
- [System Architecture](#system-architecture)
- [Repository Structure](#repository-structure)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Skill Activation Protocol](#skill-activation-protocol)
- [Operational Rules &amp; What NOT to Do](#operational-rules--what-not-to-do)
- [Usage Examples](#usage-examples)
- [Submodule Maintenance &amp; Updates](#submodule-maintenance--updates)
- [Docker &amp; MCP Deployment](#docker--mcp-deployment)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Performance &amp; Token Economy](#performance--token-economy)
- [Security Considerations](#security-considerations)
- [Limitations](#limitations)
- [License](#license)

---

## Project Overview

The **Claude Code Toolkit** is a centralized engineering workspace created to organize, manage, and execute top-tier Claude Code agent resources. Instead of managing fragmented repositories, this monorepo attaches 13 open-source toolkits as version-controlled Git submodules while maintaining an isolated workspace for personal custom skills.

---

## Key Features

- **Auto-Discovery Compatible**: Follows native standard skill directory conventions (`.claude/skills/`, `.agents/skills/`, and `~/.gemini/config/skills/`).
- **13 Managed Submodules**: Includes industry-standard skill registries, harness engines (`ECC`), context indexers (`claude-context`), TDD frameworks (`superpowers`), and official MCP servers.
- **Single-Command Upgrades**: Includes automated update tooling (`npm run update` or `bash scripts/update-all.sh`) to synchronize all submodules recursively.
- **Isolated Custom Skill Space**: Dedicated `my-custom-skills/` folder untouched by external git submodule pulls.
- **MCP Server Launchers**: Ready-to-use configurations for running GitHub and general MCP servers.

---

## Submodule Catalog & Capability Matrix

Below is a detailed breakdown of all submodules, their classification, what problem they solve, their key capabilities, and quick setup instructions:

| Submodule                                 | Classification / Type                      | What Problem It Solves                                              | Key Capabilities                                                                       | Quick Usage / Installation                                                             |
| ----------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **`Ay-Skills`**                   | Skill Library                              | Provides specialized web dev & automation skills                    | Remotion video gen, Puppeteer browser agent, UI/UX tokens, SEO auditing                | Copy/symlink`Ay-Skills/skills/<name>` to `.claude/skills/`                         |
| **`ECC`**                         | Harness OS & Multi-Agent Framework         | Adds terminal safety shims, AST hooks, and 900+ harness skills      | Command shimming (`ecc-agentshield`), multi-agent task spawning, AST hooks           | `bash ECC/install.sh` or `npx ecc-universal setup`                                 |
| **`awesome-claude-code`**         | Curation Index                             | Solves discovery of Claude Code tools and plugins                   | Curated directory of plugins, templates, and tools                                     | Passive reference (`cat awesome-claude-code/README.md`)                              |
| **`awesome-claude-code-toolkit`** | Hybrid Preset Registry                     | Standardizes agent prompts, rules, hooks, and MCP configs           | Pre-built`.mcp.json` configs, agent rules, workflow templates                        | Copy`.claude-plugin` or `.mcp.json` entries to workspace                           |
| **`awesome-claude-skills`**       | Production Skill Library (860+ Skills)     | Delivers instant domain-specific agent skills                       | Resume generation, research writing, image enhancement, API connectors                 | Copy skill folder (e.g.`awesome-claude-skills/theme-factory`) to `.claude/skills/` |
| **`claude-code-action`**          | CI/CD Action Runner                        | Automates code reviews and security scans in GitHub Actions         | Headless Claude Code execution in CI, PR commenting, approval checks                   | Use`uses: ./claude-code-action` in `.github/workflows/`                            |
| **`claude-code-best-practice`**   | Rules & Guidelines                         | Prevents code degradation by enforcing senior standards             | Ready-made`CLAUDE.md` rules, agent team orchestration guides                         | Copy`CLAUDE.md` or guidelines to project root                                        |
| **`claude-code-mcp`**             | MCP Server Bridge                          | Allows non-Claude IDEs (Cursor/Codex/Antigravity) to run Claude CLI | Exposes`claude_code:claude_code` tool endpoint over stdio/SSE                        | `npm install && npm run build` in directory, add to `mcp_config.json`              |
| **`claude-code-ultimate-guide`**  | Hybrid Reference & Skills (83 Skills)      | Master technical documentation and 83 skills                        | Claudedocs, quiz suites, whitepapers, structural skill templates                       | Inspect docs or copy skills from`tools/`                                             |
| **`claude-context`**              | AST Codebase Indexing CLI                  | Prevents LLM context limits by packing code AST signatures          | 70% context compression, structural AST extraction to markdown                         | Run`npx claude-context /path/to/project --output summary.md`                         |
| **`claude-skills`**               | Enterprise Multi-Agent Suite (380+ Skills) | Enterprise workflow automation (C-level, PM, dev teams)             | Tessl & Gemini compatible skills across management/engineering                         | Copy skills from domain dirs (`c-level-advisor`, `engineering-team`)               |
| **`github-mcp-server`**           | Official GitHub MCP Server (Go)            | Direct AI agent interaction with GitHub API                         | Native GitHub tools (`create_issue`, `get_file`, `create_pull_request`)          | Build Go binary (`go build ./cmd/...`), add to `mcp_config.json`                   |
| **`superpowers`**                 | TDD Workflow Engine                        | Enforces strict Test-Driven Development (TDD) & subagents           | Commands`/brainstorm`, `/plan`, `/execute`, multi-agent plugin manifests         | Copy`superpowers` into `.claude/skills/` or `.agents/skills/`                    |
| **`my-custom-skills`**            | Personal Custom Skill Space                | Protects custom skills from submodule git update resets             | Personal user-owned skill and script repository                                        | Add skills in`my-custom-skills/skills/<name>/SKILL.md`                               |
| **`maniadav-agent-workspace`**    | Cross-Agent Rules Reference                | Standardizes principles across Antigravity, Cursor, Copilot         | Ready-to-copy rule sets (`AGENTS.md`, `.cursorrules`, `copilot-instructions.md`) | Copy desired rules to target project configuration paths                               |

---

## System Architecture

```text
+-----------------------------------------------------------------------------------+
|                               User Workspaces & IDEs                              |
|             (Claude Code CLI / Antigravity IDE / Cursor / AGY Runtimes)           |
+-----------------------------------------+-----------------------------------------+
                                          |
                       Auto-Discovery & Skill Resolution
                                          |
       +----------------------------------+----------------------------------+
       |                                  |                                  |
       v                                  v                                  v
+--------------+                   +--------------+                   +--------------+
| Target Local |                   | User Global  |                   | My Custom    |
| Project      |                   | Config       |                   | Skills       |
| .claude/     |                   | ~/.gemini/   |                   | my-custom-   |
| .agents/     |                   | ~/.claude/   |                   | skills/      |
+-------+------+                   +-------+------+                   +-------+------+
        ^                                  ^                                  ^
        |                                  |                                  |
        +----------------------------------+----------------------------------+
                                           |
                            Copy / Symlink Skill Modules
                                           |
+------------------------------------------+------------------------------------------+
|                        13 Git Submodule Toolkits                                   |
|  +--------------------+  +-------------------+  +--------------------------------+  |
|  |  Ay-Skills         |  |  ECC              |  |  awesome-claude-code           |  |
|  +--------------------+  +-------------------+  +--------------------------------+  |
|  |  awesome-toolkit   |  |  awesome-skills   |  |  claude-code-action            |  |
|  +--------------------+  +-------------------+  +--------------------------------+  |
|  |  claude-best-prac  |  |  claude-code-mcp  |  |  claude-code-ultimate-guide    |  |
|  +--------------------+  +-------------------+  +--------------------------------+  |
|  |  claude-context    |  |  claude-skills    |  |  github-mcp-server             |  |
|  +--------------------+  +-------------------+  +--------------------------------+  |
|  |  superpowers       |                                                          |  |
|  +--------------------+                                                          |  |
+-------------------------------------------------------------------------------------+
```

---

## Repository Structure

```text
claude-code-toolkit/
├── .gitmodules                      # Version-controlled Git submodule mappings for 13 repositories
├── package.json                     # Monorepo update script entry points
├── scripts/
│   └── update-all.sh                # Executable shell script to update all submodules recursively
├── my-custom-skills/                # Isolated directory for user custom skills and scripts
│   ├── README.md                    # Guidelines for personal skill additions
│   ├── scripts/                     # User helper scripts
│   └── skills/                      # Custom user skill packages (e.g., skills/<name>/SKILL.md)
├── maniadav-agent-workspace/        # Cross-agent rule references (Antigravity, Cursor, Copilot)
├── Ay-Skills/                       # Submodule: Remotion, Browser Agent, UI/UX, SEO skills
├── ECC/                             # Submodule: Everything Claude Code agent harness OS & CLI tools
├── awesome-claude-code/             # Submodule: Curated index of plugins, skills, & resources
├── awesome-claude-code-toolkit/     # Submodule: CLI utilities, workflows, and presets
├── awesome-claude-skills/           # Submodule: ComposioHQ production community skill library
├── claude-code-action/              # Submodule: Official Anthropic GitHub Action runner for CI/CD
├── claude-code-best-practice/       # Submodule: Engineering standards, rules, and CLAUDE.md guidelines
├── claude-code-mcp/                 # Submodule: MCP Server Bridge (wraps Claude CLI for Cursor/Codex)
├── claude-code-ultimate-guide/      # Submodule: Master technical guide, quiz suites, and specs
├── claude-context/                  # Submodule: Codebase AST indexer and context packing engine
├── claude-skills/                   # Submodule: Enterprise multi-agent skill suite
├── github-mcp-server/               # Submodule: Official GitHub Model Context Protocol server
└── superpowers/                     # Submodule: Agentic workflow engine enforcing TDD & subagents
```

---

## Technology Stack

- **Languages**: TypeScript, JavaScript, Go, Python, Bash
- **Frameworks & Runtimes**: Node.js (>= 18), Go (>= 1.21), Python (>= 3.10), Git (>= 2.30)
- **Agent Engines**: Claude Code CLI, Antigravity IDE, Cursor, AGY, Codex, Copilot
- **Protocols**: Model Context Protocol (MCP) over Stdio/SSE

---

## Prerequisites

Ensure the following tools are installed on your host system:

- **Node.js**: Version 18.0.0 or higher (`node -v`)
- **Python**: Version 3.10 or higher (`python3 --version`)
- **Git**: Version 2.30.0 or higher (`git --version`)
- **Claude Code CLI**: Installed globally (`npm install -g @anthropic-ai/claude-code`)

---

## Installation

### 1. Clone the Monorepo with Submodules

```bash
git clone --recursive https://github.com/your-org/claude-code-toolkit.git
cd claude-code-toolkit
```

If already cloned without `--recursive`, initialize all 13 submodules:

```bash
git submodule update --init --recursive
```

---

## Configuration

### Environment Variables

Configure required API keys in your active shell or `.env` file (never commit `.env` files to Git):

| Variable              | Required | Description                                                                             |
| --------------------- | -------- | --------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | Yes      | Anthropic Claude API key for model inference calls.                                     |
| `GITHUB_TOKEN`      | Optional | GitHub Personal Access Token for`github-mcp-server` (scopes: `repo`, `read:org`). |
| `LOG_LEVEL`         | Optional | Verbosity level (`debug`, `info`, `warn`, `error`). Default: `info`.          |

### Registering MCP Servers

To enable the GitHub MCP server in your AI editor or Claude Code, add the following to `~/.gemini/config/mcp_config.json` or `.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/absolute/path/to/claude-code-toolkit/github-mcp-server/dist/index.js"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

---

## Skill Activation Protocol

### How Agent Skill Auto-Discovery Works

AI agents (Claude Code, Antigravity, AGY) discover skills by scanning specific folders for `SKILL.md` files:

1. **Local Project Level**: `.claude/skills/<skill-name>/SKILL.md` or `.agents/skills/<skill-name>/SKILL.md`
2. **Global System Level**: `~/.gemini/config/skills/<skill-name>/SKILL.md` or `~/.claude/skills/<skill-name>/SKILL.md`

### Activating a Skill in a Target Project

To activate any skill from the submodules in a target repository:

```bash
# Example 1: Copying UI/UX Pro Max skill from Ay-Skills to your project
mkdir -p /path/to/your-project/.claude/skills
cp -r /path/to/claude-code-toolkit/Ay-Skills/skills/ui-ux-pro-max /path/to/your-project/.claude/skills/

# Example 2: Activating superpowers TDD workflow engine in your project
cp -r /path/to/claude-code-toolkit/superpowers /path/to/your-project/.claude/skills/superpowers

# Example 3: Symlinking a skill for live updates
ln -s /path/to/claude-code-toolkit/Ay-Skills/skills/browser-agent /path/to/your-project/.claude/skills/
```

### Creating & Activating Custom Personal Skills

Place your custom skills in `my-custom-skills/skills/`:

```text
my-custom-skills/
└── skills/
    └── my-custom-skill/
        └── SKILL.md
```

Structure your `SKILL.md` with standard YAML frontmatter:

```markdown
---
name: my-custom-skill
description: Concise description explaining when the agent should trigger this skill.
---

# Skill Title

Instructions for the agent go here...
```



## Usage Examples

### 1. Running a Superpowers TDD Workflow

In an active Claude Code session in your project:

```text
/brainstorm Design a rate-limiter middleware for our API endpoints
```

The agent triggers `superpowers` to produce spec artifacts, test suites, and subagent implementations.

### 2. Indexing Codebase Context with `claude-context`

Compress codebase AST for LLM consumption:

```bash
cd claude-context
npx claude-context /path/to/your-project --output project-summary.md
```

### 3. Launching GitHub MCP Server

```bash
cd github-mcp-server
go build -o github-mcp cmd/github-mcp-server/main.go
GITHUB_PERSONAL_ACCESS_TOKEN="your_token" ./github-mcp
```

---

## Submodule Maintenance & Updates

Update all 13 submodules from their respective upstream GitHub remotes with a single command:

```bash
npm run update
```

Alternatively, run the underlying bash script:

```bash
bash scripts/update-all.sh
```

Or run standard Git commands:

```bash
git submodule update --init --recursive --remote --merge
```

---

## Docker & MCP Deployment

Build and run isolated containerized MCP servers:

```bash
cd github-mcp-server
docker build -t github-mcp-server:latest .
docker run -d \
  -e GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token" \
  -p 3000:3000 \
  --name github-mcp \
  github-mcp-server:latest
```

---

## CI/CD Integration

Use `claude-code-action` to automate PR code reviews in GitHub Actions (`.github/workflows/claude-review.yml`):

```yaml
name: Claude Code Auto Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./claude-code-action
        with:
          anthropic_key: ${{ secrets.ANTHROPIC_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          command: "review-pr"
```

---

## Troubleshooting

| Symptom                                              | Likely Cause                                       | Resolution                                                                                        |
| ---------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Submodule directory is empty**               | Submodules were not initialized during clone       | Run`git submodule update --init --recursive`                                                    |
| **Local changes inside submodule overwritten** | Edited code directly inside submodule path         | Keep custom edits in`my-custom-skills/` instead                                                 |
| **Skill not detected by agent**                | Missing YAML frontmatter or wrong folder path      | Ensure file is at`.claude/skills/<name>/SKILL.md` with `name` and `description` frontmatter |
| **`MCP connection refused`**                 | Invalid executable path or missing`GITHUB_TOKEN` | Check path in`mcp_config.json` and verify environment variables                                 |
| **`Permission denied: update-all.sh`**       | Executable flag missing                            | Run`chmod +x scripts/update-all.sh`                                                             |

---

## Performance & Token Economy

- **Progressive Disclosure**: Skills inject only lightweight YAML frontmatter metadata into prompt memory until explicitly invoked.
- **AST Context Compression**: `claude-context` reduces raw codebase size by up to 70% by extracting structural signatures and AST headers.
- **Subagent Context Isolation**: Workflow engines (`superpowers`, `ECC`) execute heavy refactoring in isolated subagent context windows, preventing main-session context window degradation.

---

## Security Considerations

- **Credential Safeguards**: Never hardcode tokens in skill instructions or commit `.env` files.
- **Sandboxed Tooling**: Terminal execution in harnesses (`ECC`) incorporates safety checks to inspect shell commands before execution.
- **Least-Privilege API Tokens**: Scope `GITHUB_TOKEN` permissions strictly to required resources.

---

## Limitations

- **API Quota**: Running subagent workflows requires an active Anthropic API key with sufficient quota.
- **Local OS Execution**: Native shell tools require execution permissions on macOS, Linux, or WSL2.

---

## License

Components within this repository are released under their respective open-source licenses (primarily **MIT License**). Refer to individual submodule directories for specific third-party license terms.
