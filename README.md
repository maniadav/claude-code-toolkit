# Claude Skills & Agent Harness Workspace

A production-grade monorepo and ecosystem hub containing modular Claude Code skills, Model Context Protocol (MCP) servers, agent harnesses, workflow engines, context optimization utilities, and CI/CD GitHub Action runners. Built for software engineers and AI system maintainers, this repository provides battle-tested tools to automate development workflows, manage context windows efficiently, enforce security boundaries, and orchestrate subagent pipelines.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Architecture / System Design](#architecture--system-design)
- [Repository Structure](#repository-structure)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Usage Examples](#usage-examples)
- [Development Workflow](#development-workflow)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)
- [Performance Notes](#performance-notes)
- [Security Considerations](#security-considerations)
- [Limitations](#limitations)
- [License](#license)

---

## Project Overview

### Purpose
The Claude Skills & Agent Harness Workspace serves as an integrated developer platform for configuring, extending, and operating autonomous coding agents powered by Claude Code and the Model Context Protocol (MCP). It consolidates disparate skills, harness runtimes, context management tools, and GitHub workflows into a unified, version-controlled environment.

### Main Capabilities
- **Modular Skill Execution**: Inject pre-built instructions and runbooks into agent sessions for specialized tasks such as UI/UX design, SEO auditing, video synthesis, and diagram generation.
- **Agent Harness Runtime (`ECC`)**: Operating-system-level harness controls for managing agent lifecycles, hook profiles, workspace safety, and command execution limits.
- **Agentic Workflow Engine (`superpowers`)**: Structured development pipelines enforcing iterative phases (Brainstorming → Spec Creation → Execution Plan → Subagent Execution → TDD & Code Review).
- **Context Packing & AST Generation (`claude-context`)**: Tools to compress codebases into token-efficient context prompts, dependency maps, and structural summaries.
- **Model Context Protocol (MCP) Integration**: Production-ready MCP client interfaces and official GitHub server implementations to connect agents to external services.
- **CI/CD Action Automation (`claude-code-action`)**: Native GitHub Actions workflows for automated PR reviews, security auditing, and issue triaging.

### Intended Users
- Senior software engineers and AI platform developers building autonomous workflow agents.
- Open-source maintainers seeking standardized PR review and issue management pipelines.
- Engineering teams incorporating AI-driven test-driven development (TDD) and architectural planning into daily software development.

### Typical Use Cases
- Auto-generating production code through multi-agent delegation with mandatory unit test verification.
- Auditing repository security, technical SEO, and code quality directly inside CLI agent sessions.
- Exposing GitHub APIs, web browsers, and database engines to Claude Code via strict MCP interface boundaries.
- Automating repository triage and continuous integration code reviews using headless runner workflows.

---

## Key Features

- **Progressive Skill Loading**: Automatically exposes skill capabilities without cluttering context windows until explicitly activated.
- **Autonomous Subagent Orchestration**: Spawns isolated, task-focused subagents to execute complex engineering tasks concurrently.
- **Test-Driven Development (TDD) Enforcement**: Mandates failing test creation prior to feature implementation and verifies clean passing runs before completion.
- **Security & Safety Shielding (`ecc-agentshield`)**: Validates terminal commands, inspects parameter boundaries, and blocks dangerous system mutations.
- **High-Density Context Packing**: Generates token-optimized repository structural maps and AST abstractions for LLM ingestion.
- **Cross-Platform CLI Interfaces**: Provides unified CLI binaries (`ecc-universal`, `agent-browser`, `claude-context`) compatible with macOS, Linux, and Windows.

---

## Architecture / System Design

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Developer / CI Runner                             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Claude Code CLI Runtime (Agent Host)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────┐  │
│  │     Agent Harness     │ │    Workflow Engine    │ │  Context Packer   │  │
│  │   (`ECC-main` / CLI)   │ │  (`superpowers-main`) │ │ (`claude-context`)│  │
│  └───────────┬───────────┘ └───────────┬───────────┘ └─────────┬─────────┘  │
└──────────────┼─────────────────────────┼───────────────────────┼────────────┘
               │                         │                       │
               ▼                         ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Skill & Rule Resolution Layer                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Ay-Skills-main              • awesome-claude-skills-master               │
│  • claude-skills-main          • claude-code-best-practice-main             │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Model Context Protocol (MCP)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  • `github-mcp-server-main`    • `claude-code-mcp-main`                     │
│  • Browser / Database Tools    • Custom API Connectors                      │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Target Workspace & Infrastructure                      │
│                  (Source Code, Git Repositories, APIs)                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Flow Description

1. **Invocation**: The user or continuous integration workflow invokes `claude` or an harness entry point like `ecc-universal`.
2. **Context & Environment Resolution**: The runtime loads local `CLAUDE.md`, `.agents/skills/`, and `GEMINI.md` rules. `claude-context` constructs a compressed AST index of the working tree.
3. **Workflow & Harness Orchestration**: The harness (`ECC`) registers event lifecycle hooks and security filters (`ecc-agentshield`). `superpowers` guides the agent through structured brainstorming, specification, and execution phases.
4. **Subagent & Tool Execution**: Task-specific skills (from `Ay-Skills-main`, `awesome-claude-skills-master`, or `claude-skills-main`) are dynamically loaded. External operations pass through MCP servers (`github-mcp-server-main`, browser runtimes) subject to authorization rules.
5. **Verification & Delivery**: Subagent edits are checked against unit test suites (TDD) before final changes are accepted and committed.

---

## Repository Structure

```text
.
├── Ay-Skills-main/                 # Modular Claude Code skills built by AY Automate
├── ECC-main/                       # Everything Claude Code (ECC) agent harness OS & CLI tools
├── awesome-claude-code-main/       # Curated index of Claude Code plugins, skills, and tools
├── awesome-claude-code-toolkit-main/ # CLI utilities, presets, and workflow scripts
├── awesome-claude-skills-master/   # Community library of production-grade domain skills
├── claude-code-action-main/        # GitHub Action runner for automated PR and issue workflows
├── claude-code-best-practice-main/ # Engineering rules, prompt templates, and architecture guides
├── claude-code-mcp-main/           # MCP server configurations and connection launchers
├── claude-code-ultimate-guide-main/# Master technical documentation, quiz suites, and reference specs
├── claude-context-master/          # Codebase context packing and repository mapping utility
├── claude-skills-main/             # Enterprise multi-agent skills (Engineering, Compliance, C-Level)
├── github-mcp-server-main/         # Official Node.js/TypeScript GitHub Model Context Protocol server
└── superpowers-main/               # Agentic workflow engine enforcing TDD and subagent planning
```

### Module Summaries

- **`Ay-Skills-main`**: Contains plug-and-play skills for UI generation (`ui-ux-pro-max`), Excalidraw diagramming, Remotion video composition, web scraping (`agent-browser`), and NotebookLM integration.
- **`ECC-main`**: Provides `ecc-universal` and `ecc-agentshield` Node.js packages to manage agent security, setup hook lifecycles, and enforce strict execution policies.
- **`awesome-claude-code-main`**: Serves as a reference directory cataloging skills, commands, MCP servers, and hooks across the ecosystem.
- **`awesome-claude-code-toolkit-main`**: Implements helper CLI scripts and preset configurations to streamline agent workspace initialization.
- **`awesome-claude-skills-master`**: Offers over 30 specialized skill modules covering design systems, SEO audit pipelines, document parsers, and web testing.
- **`claude-code-action-main`**: Contains GitHub Actions workflow definitions and container configurations to execute Claude Code in headless CI environments.
- **`claude-code-best-practice-main`**: Documents operational standards, memory optimization guidelines, and `CLAUDE.md` rule files.
- **`claude-code-mcp-main`**: Manages MCP server registry configurations and environment boilerplate for database, browser, and API servers.
- **`claude-code-ultimate-guide-main`**: Includes comprehensive architectural whitepapers, slash command references, interactive quiz suites, and context engineering examples.
- **`claude-context-master`**: Command-line tool for scanning source repositories, building AST representations, and outputting token-efficient prompt context.
- **`claude-skills-main`**: Multi-domain enterprise skill framework featuring standard validation pipelines (`SKILL_PIPELINE.md`), compliance tools, and engineering team agents.
- **`github-mcp-server-main`**: Production MCP server implementation exposing GitHub APIs (repos, issues, pull requests, workflows) as typed agent tools.
- **`superpowers-main`**: Core workflow framework driving structured development steps from feature specification to subagent implementation and TDD verification.

---

## Technology Stack

- **Languages**: TypeScript, JavaScript (ESNext), Python 3.10+, Shell (Bash / Zsh), Go, Markdown.
- **Runtimes & Frameworks**: Node.js (v18+ / v20+), Claude Code CLI (v2.1+), Express.js, Next.js.
- **Protocol Specifications**: Model Context Protocol (MCP) Specification.
- **Tooling & Integrations**: Git, GitHub REST & GraphQL APIs, Docker, npm / npx, PyPI.

---

## Prerequisites

Ensure the following tools and environment variables are installed and configured prior to running components in this repository:

- **Node.js**: Version 18.0.0 or higher (`node -v`).
- **Python**: Version 3.10 or higher (`python3 --version`).
- **Git**: Version 2.30.0 or higher (`git --version`).
- **Claude Code CLI**: Installed globally (`npm install -g @anthropic-ai/claude-code`).
- **Environment Variables**:
  - `ANTHROPIC_API_KEY`: Required for agent LLM inference calls.
  - `GITHUB_TOKEN`: Required for `github-mcp-server-main` and GitHub Action runners (with `repo`, `workflow`, and `read:org` scopes).

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/claude-skills-workspace.git
cd claude-skills-workspace
```

### 2. Install Core CLI Runtimes

Install the `ecc-universal` harness tooling and context engine dependencies:

```bash
# Install ECC Universal CLI globally or via npx
npx ecc-universal setup

# Install dependencies for GitHub MCP server
cd github-mcp-server-main
npm install
npm run build
cd ..
```

### 3. Register Workspace Skills

Copy desired skills into your active project's `.claude/skills/` or `.agents/skills/` directory:

```bash
# Example: Deploying superpowers and ui-ux-pro-max skills to a target project
mkdir -p /path/to/target-project/.claude/skills
cp -r Ay-Skills-main/skills/ui-ux-pro-max /path/to/target-project/.claude/skills/
cp -r superpowers-main /path/to/target-project/.claude/skills/superpowers
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | API access key for Anthropic Claude models. |
| `GITHUB_TOKEN` | Yes (for GitHub tools) | Personal Access Token or GitHub App token with repo scopes. |
| `LOG_LEVEL` | No | Logging verbosity (`debug`, `info`, `warn`, `error`). Default is `info`. |
| `MCP_PORT` | No | Port for HTTP/SSE MCP server instances. Default varies by server. |

### Configuration Files

- **`~/.gemini/config/mcp_config.json` / `.mcp.json`**: Defines available MCP servers.
  ```json
  {
    "mcpServers": {
      "github": {
        "command": "node",
        "args": ["/absolute/path/to/github-mcp-server-main/dist/index.js"],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
        }
      }
    }
  }
  ```
- **`CLAUDE.md` / `AGENTS.md` / `GEMINI.md`**: Project-level agent rules and style standards.

---

## Running the Project

### Running Claude Code with Harness & Skills

Launch a session within any configured project directory:

```bash
claude
```

Upon startup, Claude Code auto-detects `.claude/skills/` and `.agents/skills/` modules.

### Launching the GitHub MCP Server Manually

```bash
cd github-mcp-server-main
GITHUB_PERSONAL_ACCESS_TOKEN="your_token" npm start
```

### Packing Codebase Context

Generate a compressed context file for LLM ingestion:

```bash
cd claude-context-master
# Generate context summary for the current directory
npx claude-context . --output context-summary.md
```

---

## Usage Examples

### Executing a Superpowers Development Phase

In an active Claude Code session, invoke structured agent workflows:

```text
/brainstorm Implement a rate-limiting middleware for the REST API
```

The agent will systematically execute:
1. Architectural concept generation and requirement verification.
2. Creation of a detailed specification artifact.
3. Generation of a step-by-step implementation plan.
4. Delegation of coding tasks to isolated subagents using mandatory TDD.

### Running a UI Design System Generation

```text
Use the ui-ux-pro-max skill to construct a modern dark-mode landing page component library in React.
```

---

## Development Workflow

### Testing

Run test suites within individual sub-modules:

```bash
# Test GitHub MCP server
cd github-mcp-server-main
npm test

# Test ECC Harness components
cd ECC-main
npm test
```

### Linting & Formatting

```bash
# Lint TypeScript files
cd github-mcp-server-main
npm run lint

# Format codebase
npm run format
```

### Building

```bash
# Build TypeScript artifacts across sub-repositories
cd github-mcp-server-main && npm run build
```

---

## Docker

Docker container images are provided for running isolated MCP servers and CI action environments.

### Building the GitHub MCP Server Container

```bash
cd github-mcp-server-main
docker build -t github-mcp-server:latest .
```

### Running the Container

```bash
docker run -d \
  -e GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token" \
  -p 3000:3000 \
  --name github-mcp \
  github-mcp-server:latest
```

---

## CI/CD

Continuous integration workflows are located in `.github/workflows/` within individual sub-repositories and through `claude-code-action-main`.

### Automated Pull Request Code Review Workflow

Example workflow setup for automated code review (`.github/workflows/claude-review.yml`):

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
      - uses: ./claude-code-action-main
        with:
          anthropic_key: ${{ secrets.ANTHROPIC_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          command: "review-pr"
```

---

## Troubleshooting

| Symptom | Likely Cause | Resolution |
|---|---|---|
| `Command not found: claude` | Claude Code CLI is not installed globally | Run `npm install -g @anthropic-ai/claude-code` |
| `MCP connection refused / timeout` | Invalid server path or missing environment variable | Verify executable path and check `GITHUB_PERSONAL_ACCESS_TOKEN` in `.mcp.json` |
| `Context window limit exceeded` | Unfiltered file inclusion or large dependency tree | Run `claude-context` to summarize files or add large assets to `.gitignore` / `.claudeignore` |
| `Permission denied on script execution` | Shell scripts missing execute permissions | Run `chmod +x scripts/*.sh` inside the relevant skill folder |
| `ecc-universal setup error` | Node.js version prior to 18.0.0 | Upgrade local runtime using `nvm use 18` or higher |

---

## Performance Notes

- **Token Economy**: Skills rely on progressive disclosure. Only frontmatter metadata (`name` and `description`) is kept in memory until the skill is triggered, preventing token exhaustion.
- **Subagent Context Isolation**: Subagents spawned by `superpowers` run in isolated context windows, preventing main-session prompt bloat during deep refactoring tasks.
- **AST Summarization**: `claude-context` reduces raw code file sizes by up to 70% by extracting structural signatures and AST headers before injection.

---

## Security Considerations

- **Credential Safeguards**: Secrets and tokens must never be hardcoded into skill files or committed to Git. Use environment variables or local `.mcp.json` configs ignored by VCS.
- **Terminal Execution Boundaries**: `ECC-main` incorporates `ecc-agentshield` to inspect shell commands prior to execution, preventing destructive filesystem operations (`rm -rf /`, unauthorized network exports).
- **Least-Privilege API Access**: Limit `GITHUB_TOKEN` scopes to only required repository access when operating GitHub MCP servers or CI workflows.

---

## Limitations

- **API Key Requirement**: Operating Claude Code and subagent runtimes requires an active Anthropic API key or subscription plan with sufficient quota.
- **Local Environment Access**: Native shell commands executed by skills require local operating system execution permissions (macOS, Linux, or WSL2 on Windows).
- **Model Rate Limits**: High-frequency multi-subagent workflows may hit Anthropic tier rate limits during concurrent execution.

---

## License

Components within this repository are released under their respective open-source licenses:
- `ECC-main`, `github-mcp-server-main`, `superpowers-main`, `Ay-Skills-main`: Released under the **MIT License**.
- For third-party skills and sub-modules without an explicit license header, default repository terms apply.
