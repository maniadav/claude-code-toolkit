# Architectural Plan: Scoped Agent & Skill Orchestration System

> **Status:** Proposal / Planning Phase (Implementation Pending Approval)  
> **Repository:** `claude-code-toolkit`  
> **Author:** Antigravity AI Engineering Team  
> **Target Date:** October 2026  

---

## 1. Executive Summary

This document defines the architecture and implementation plan for a **thin, globally accessible orchestration and resolution layer** built on top of the `claude-code-toolkit` monorepo.

### The Problem
The `claude-code-toolkit` repository aggregates 13 external Git submodules, custom skills (`my-custom-skills`), and workspace reference patterns (`maniadav-agent-workspace`). These repositories vary drastically in purpose, execution model, discovery mechanism, and agent target. Indiscriminately exposing all submodules as skills to an AI agent causes:
- **Token bloat & context pollution**: Thousands of `SKILL.md` instructions loaded simultaneously.
- **Cross-repository instruction bleed & collisions**: Conflicting guidelines for similar tasks (e.g., TDD vs rapid prototyping).
- **Execution model confusion**: Treating an MCP launcher (`claude-code-mcp`), an AST parser (`claude-context`), or a CI action (`claude-code-action`) as a prompt skill breaks agent tools.

### The Solution
We propose a **Scoped Discovery System**. The root layer will **NOT** merge submodule formats into a single universal schema, nor will it execute unguided AI semantic search across all submodules. Instead, it provides:
1. **Type-Aware Scoped Discovery**: Routing prompt skills, MCP bridges, CLI binaries, and CI actions according to their native type.
2. **Explicit Source Selection**: Activating only the user-specified namespace (e.g., `@ECC`, `@superpowers`, `@custom/ui-ux`).
3. **Exact Artifact Resolution**: Directly resolving targeted skills/agents across single or multi-level nested directories (e.g., `@awesome-claude-skills/theme-factory` or `@ECC/git-commit`).
4. **Native Methodology Preservation**: When a namespace is selected, its native installation, discovery, and execution mechanics govern runtime behavior.
5. **Global System Access**: Enabling any coding repository on the machine (`cd ~/any-project`) to invoke scoped skills without duplicating files into every local workspace.

---

## 2. Current Repository Analysis

An empirical inspection of all 13 submodules, custom space, and reference workspaces in `claude-code-toolkit` reveals that the submodules are **not homogeneous skill collections**. They span 7 distinct operational categories with different directory depth patterns.

### Verified Inventory & Directory Depth Analysis

| Repository | Primary Content | `SKILL.md` Count | Directory Structure Pattern | Build Artifacts / Role |
|---|---|---|---|---|
| **`Ay-Skills`** | Browser & UI/UX Skill Library | 6 | Flat: `skills/<name>/SKILL.md` | Pure Markdown |
| **`ECC`** | Full Harness OS, CLI & Safety Shims | 934 | Mixed: `skills/`, `plugins/`, `scaffolds/` | `install.sh`, `package.json`, `pyproject.toml`, `agent.yaml` |
| **`awesome-claude-code`** | Resource Curation Index | 0 | Flat Markdown Index | `Makefile`, `generate_readme.py`, `config.yaml` |
| **`awesome-claude-code-toolkit`** | Agent & Skill Registry | 40 | Flat: `skills/<name>/SKILL.md` | Manifests, plugins, commands, rules, MCP configs |
| **`awesome-claude-skills`** | Composio Skill Collection | 864 | **2-Level Nested**: `<category>/<skill>/SKILL.md` | Pure Markdown |
| **`claude-code-action`** | GitHub Action CI/CD Runner | 0 | Action codebase | Bun runtime, `package.json`, TypeScript action code |
| **`claude-code-best-practice`** | Guidelines & Rules Templates | 0 | Guidelines & Tutorials | Tutorials, workflows, `CLAUDE.md` templates |
| **`claude-code-mcp`** | Claude CLI MCP Server Bridge | 0 | Node.js MCP Server | Node.js MCP server exposing `claude_code` CLI tool |
| **`claude-code-ultimate-guide`** | Reference Docs & Skill Hybrid | 83 | Nested: `tools/<skill>/SKILL.md` | Claudedocs, quizzes, whitepapers, `SKILL.md` files |
| **`claude-context`** | AST Codebase Indexing Engine | 0 | Node/Python Package | Node.js + Python package (`pnpm-workspace.yaml`, CLI) |
| **`claude-skills`** | Enterprise Multi-Agent Suite | 388 | **2-Level Nested**: `<domain>/<skill>/SKILL.md` | `pyproject.toml`, `tessl.json`, agent launcher scripts |
| **`github-mcp-server`** | Official GitHub MCP Server | 0 | Go Server Codebase | Go runtime (`go.mod`, `cmd/`, Dockerfile) |
| **`superpowers`** | TDD Agentic Workflow Engine | 15 | Flat: `skills/<name>/SKILL.md` | Node.js runtime (`package.json`, hooks, multi-agent plugins) |
| **`my-custom-skills/`** | Personal Skill Directory | Variable | Flat: `skills/<name>/SKILL.md` | User-owned custom skills |
| **`maniadav-agent-workspace`**| Cross-Agent Rule Reference | 1 | Multi-Agent rules (`antigravity`, `cursor`, `copilot`) | Antigravity, Cursor, Copilot rule guidelines |

---

## 3. Submodule Classification & Type Routing

Based on empirical inspection, submodules are categorized into 7 functional types:

```text
                                +---------------------------------------+
                                |      claude-code-toolkit Monorepo     |
                                +-------------------+-------------------+
                                                    |
         +------------------+-----------------------+-----------------------+------------------+
         |                  |                       |                       |                  |
         v                  v                       v                       v                  v
+------------------+ +--------------+       +---------------+       +--------------+   +---------------+
|  Skill Libraries | | Harness OS & |       | Reference &   |       | CLI Tools &  |   | MCP Servers & |
|                  | | Workflow     |       | Documentation |       | Infrastructure|  | Action Runners|
| • Ay-Skills      | | • ECC        |       | • awesome-c-c |       | • claude-    |   | • github-mcp  |
| • awesome-skills | | • superpowers|       | • c-best-prac |       |   context    |   | • c-code-mcp  |
| • claude-skills  | +--------------+       | • c-ultimate  |       +--------------+   | • c-code-     |
| • my-custom      |                        +---------------+                          |   action      |
+------------------+                                                                   +---------------+
```

1. **Executable Skill Libraries**: Pure Markdown skill collections loaded on-demand (`Ay-Skills`, `awesome-claude-skills`, `claude-skills`, `my-custom-skills`).
2. **Harness & Workflow Engines**: Systems enforcing stateful multi-agent workflows, TDD discipline, or terminal hooks (`ECC`, `superpowers`).
3. **Reference & Rules Registries**: Static knowledge, curations, and prompt standards (`awesome-claude-code`, `claude-code-best-practice`, `maniadav-agent-workspace`).
4. **Hybrid Reference & Skill Suites**: Combined technical guides and executable skills (`claude-code-ultimate-guide`, `awesome-claude-code-toolkit`).
5. **CLI Infrastructure Tools**: Executable binaries for context packing and AST processing (`claude-context`).
6. **MCP Server Bridges & Tooling**: Model Context Protocol servers exposing tool execution capability to non-Claude agents (`github-mcp-server`, `claude-code-mcp`).
7. **CI/CD Action Runners**: Automation components for continuous integration (`claude-code-action`).

---

## 4. Native Installation / Discovery / Invocation Matrix

| Submodule | Category | Installation Mechanism | Native Discovery Mechanism | Native Invocation Mechanism | Runtime Behavior | Agent Specificity | Scope Target |
|---|---|---|---|---|---|---|---|
| **`Ay-Skills`** | Skill Library | None (Markdown) | Filesystem directory scan | Prompt intent match | Loads `SKILL.md` instructions | Agnostic | Project / Global |
| **`ECC`** | Harness OS | `install.sh`, `npm`/`pip` | `agent.yaml`, custom CLI, AST hooks | `/ecc`, CLI `ecc-universal`, bash shims | Spawns harness shell & agent sub-tasks | Claude & Cursor tuned | Global CLI / Project |
| **`awesome-claude-code`** | Reference Index | None | Manual README inspection | N/A (Documentation only) | Passive reading | Claude Code focused | Reference only |
| **`awesome-claude-code-toolkit`** | Hybrid | Symlinks / Plugins | Directory manifests, `.claude-plugin` | Prompt intent / MCP tools | Injects prompts & MCP rules | Claude & Cursor | Project / Global |
| **`awesome-claude-skills`** | Skill Library | None | Category directory scan | Prompt intent match | Loads `SKILL.md` instructions | Agnostic | Project / Global |
| **`claude-code-action`** | CI/CD Runner | GitHub Actions / Bun | `.github/workflows/` runner | GitHub event trigger | Runs headlessly in CI container | Claude Code Action | Remote CI/CD |
| **`claude-code-best-practice`** | Reference / Rules | Copy `CLAUDE.md` | Agent system prompt load | Passive prompt enforcement | Sets agent system constraints | Claude & Codex | Project / Global |
| **`claude-code-mcp`** | MCP Server Bridge | `npm install` | `mcp_config.json` entry | MCP tool call `claude_code` | Wraps Claude CLI as MCP tool for Cursor/Codex | Non-Claude Agents | User-Global Config |
| **`claude-code-ultimate-guide`**| Hybrid | Manual copy / view | Directory scan & quiz runners | Prompt intent & CLI tools | Injects guide specs & skills | Claude Code focused | Reference / Project |
| **`claude-context`** | CLI Tool | `npm install -g` / `pnpm` | CLI argument parsing | `npx claude-context <path>` | Scans AST, outputs markdown context | Agnostic CLI | Host System |
| **`claude-skills`** | Enterprise Multi-Agent | `pyproject.toml` / copy | `tessl.json`, YAML frontmatter | Prompt intent / agent launcher | Loads domain-specific skills | Claude & Gemini | Project / Global |
| **`github-mcp-server`** | MCP Server | Go build / Docker | `mcp_config.json` entry | MCP tool call (e.g. `create_issue`) | Runs Go stdio server | Any MCP Agent | User-Global Config |
| **`superpowers`** | Workflow Engine | `npm install`, plugin setup | Multi-agent plugin manifests (`.agents`, `.cursor-plugin`) | `/brainstorm`, `/plan`, TDD prompts | Enforces TDD, spawns subagents | Multi-agent (Claude/Cursor/Codex/AGY) | Project / Global |
| **`my-custom-skills`** | Custom Skills | File addition | Directory scan | Prompt intent / `@custom/` | Loads custom instructions | Agnostic | User Monorepo |
| **`maniadav-agent-workspace`**| Rules Workspace| Symlink rules | Agent rules load (`AGENTS.md`) | System prompt enforcement | Enforces engineering standards | Antigravity / Cursor / Copilot | User-Global / Project |

---

## 5. Module-Level Refinements & Problems Identified

Our deep inspection revealed 4 critical module-level details that require specialized handling in the orchestration layer:

1. **Handling 2-Level Nested Skill Paths**:
   - `awesome-claude-skills` structures skills as `awesome-claude-skills/<category>/<skill-name>/SKILL.md` (e.g. `awesome-claude-skills/document-skills/pdf-analyzer/SKILL.md`).
   - `claude-skills` structures skills as `claude-skills/<domain>/<skill-name>/SKILL.md` (e.g. `claude-skills/engineering-team/code-review/SKILL.md`).
   - *Refinement*: The artifact resolver MUST support fuzzy-depth matching so `@awesome-claude-skills/pdf-analyzer` or `@claude-skills/code-review` automatically resolves across subdirectories.

2. **Non-Skill Submodule Resolution**:
   - Typing `@claude-code-mcp` or `@github-mcp-server` should **NOT** inject markdown prompts. It triggers MCP server registration in `mcp_config.json`.
   - Typing `@claude-context` resolves to a CLI command invocation contract (`npx claude-context . --output context.md`).
   - Typing `@claude-code-action` resolves to a GitHub Actions YAML workflow generator.

3. **Rule Reference Scoping (`maniadav-agent-workspace`)**:
   - Mapped to `@workspace-rules` or `@maniadav`. Automatically resolves cross-agent rules (`AGENTS.md`, `.cursorrules`, `copilot-instructions.md`) based on the active IDE.

4. **Skill Name Collisions & Competing Philosophies**:
   - `superpowers` mandates strict TDD before writing code.
   - Other skill modules permit immediate implementation without pre-existing failing tests.
   - *Rule*: Explicit source namespace selection isolates these workflows completely.

---

## 6. Proposed Architecture

We propose a **Locator + Namespace + Adapter Architecture** operating as a thin orchestration layer.

```text
+-----------------------------------------------------------------------------------------------+
|                                    User Workspace (`~/any-project`)                           |
|                      (Claude Code CLI / Antigravity IDE / Cursor / AGY / Codex)               |
+-----------------------------------------------+-----------------------------------------------+
                                                |
                             Explicit Scoped Input (e.g., `@ECC/git-commit`)
                                                |
                                                v
+-----------------------------------------------------------------------------------------------+
|                                    Global Orchestration Layer                                 |
|                                    (`~/.claude-toolkit-resolver`)                             |
|                                                                                               |
|   +--------------------------+   +--------------------------+   +-------------------------+   |
|   |    Namespace Registry    |   |     Artifact Resolver    |   |      Agent Adapters     |   |
|   |  Maps `@ECC`,            |   |  Type-aware & deep-path  |   |  Formats output for     |   |
|   |  `@superpowers`, etc.    |   |  nested SKILL.md lookup  |   |  Claude/Cursor/AGY/etc. |   |
|   +------------+-------------+   +------------+-------------+   +------------+------------+   |
+----------------|------------------------------|------------------------------|----------------+
                 |                              |                              |
                 +------------------------------+------------------------------+
                                                |
                                 Delegates to Native Submodule
                                                |
                                                v
+-----------------------------------------------------------------------------------------------+
|                              `claude-code-toolkit` Monorepo Root                              |
|                                                                                               |
|  +--------------------+  +--------------------+  +--------------------+  +------------------+ |
|  | ECC (Native)       |  | superpowers (Nat.) |  | Ay-Skills (Native) |  | my-custom-skills | |
|  +--------------------+  +--------------------+  +--------------------+  +------------------+ |
+-----------------------------------------------------------------------------------------------+
```

---

## 7. Resolution Semantics

To eliminate ambiguity and cross-contamination, the system enforces strict resolution rules:

### A. No Namespace (`"Implement feature X"`)
- **Behavior**: The resolver is **NOT** invoked. Zero submodules are loaded.
- **Rationale**: Prevents accidental context pollution and hallucinated skill mixing.

### B. Submodule Namespace (`@ECC` or `@superpowers`)
- **Behavior**: Activates **only** the specified submodule. Loads its primary entry point / manifest and activates its native discovery system.

### C. Exact Source Artifact (`@ECC/git-commit` or `@awesome-claude-skills/pdf-analyzer`)
- **Behavior**: Resolves the single, exact `SKILL.md` or agent manifest within that namespace, searching through nested directories if required.

### D. Custom Skill (`@custom/my-skill` or `@custom/db-migration`)
- **Behavior**: Resolves exclusively from `my-custom-skills/skills/my-skill/SKILL.md`.

### E. MCP & Tooling Namespaces (`@mcp/github`, `@mcp/claude-code`, `@tool/claude-context`)
- **Behavior**: Routes to MCP configuration updates or CLI helper tool invocation.

---

## 8. Global Installation Architecture

To enable access from **any directory** (`cd ~/projects/app`) without copying files into every repository:

```text
Host System Environment
├── ~/.claude-toolkit/               <-- Symlink or config pointing to monorepo location
│   ├── registry.json                <-- Generated namespace manifest with nested skill index
│   └── bin/ctk-resolve              <-- Lightweight CLI resolver binary
├── ~/.gemini/config/skills/         <-- Global discovery symlinks for Gemini/Antigravity
│   └── ctk/                         <-- Managed namespace links
├── ~/.claude/skills/                <-- Global discovery symlinks for Claude Code CLI
└── /usr/local/bin/ctk               <-- Global CLI wrapper (optional)
```

---

## 9. Coding Agent Integration & Portability

| Coding Agent | Integration Level | Resolution Method | Adapter Mechanism |
|---|---|---|---|
| **Claude Code CLI** | Native / Direct | Prompt `@` reference or global skill path | `~/.claude/skills/` symlink & CLI pipe |
| **Antigravity IDE / AGY** | Native / Direct | Prompt `@` reference or `.agents/` | `~/.gemini/config/skills/` & `.agents/` resolver |
| **Cursor IDE** | Adapter Required | `@` symbol reference or `.cursor/rules/` | Generated `.cursor/rules/ctk-namespaces.mdc` |
| **Codex** | Adapter Required | System prompt injection | Generated `.codex/` workspace rules |
| **OpenCode / Vibe** | Adapter Required | Plugin manifest link | Shared `.agents/` discovery adapter |
| **GitHub Copilot** | Wrapper Required | Workspace instruction reference | Generated `.github/copilot-instructions.md` link |

---

## 10. Security and Isolation

1. **Zero Implicit Execution**: No code or prompt is evaluated without explicit user `@namespace` invocation.
2. **Credential Safety**: No secrets or API keys are stored in registry files. All MCP servers consume environment variables (`ANTHROPIC_API_KEY`, `GITHUB_TOKEN`).
3. **Execution Sandboxing**: Harness shell commands (`ECC`) operate under host execution permissions or standard IDE sandbox boundaries.
4. **Upstream Isolation**: Submodules remain untouched read-only Git references.

---

## 11. Submodule Update Strategy

Submodule updating remains independent and non-destructive:

1. User runs `npm run update` or `bash scripts/update-all.sh`.
2. Git pulls upstream updates for all 13 submodules.
3. Post-update hook runs `ctk-reindex` to refresh `~/.claude-toolkit/registry.json` and deep skill indexes.
4. `my-custom-skills/` and local configurations remain 100% untouched.

---

## 12. Custom Skills Integration (`my-custom-skills/`)

- Located at `my-custom-skills/skills/<skill-name>/SKILL.md`.
- Mapped to `@custom/<skill-name>`.
- Fully owned by the user, tracked in `claude-code-toolkit` git history, and excluded from submodule clean/reset operations.

---

## 13. Proposed Directory Structure

```text
claude-code-toolkit/
├── .gitmodules
├── package.json
├── README.md
├── PLAN-unified-agent-skill-system.md     <-- THIS DOCUMENT
├── scripts/
│   ├── update-all.sh
│   └── install-global.sh                   <-- Proposed Global Installer
├── resolver/                                <-- Proposed Resolver Core (Future Phase)
│   ├── registry.json.template
│   ├── ctk-resolver.js
│   └── adapters/
│       ├── claude-adapter.js
│       ├── cursor-adapter.js
│       └── antigravity-adapter.js
├── my-custom-skills/                        <-- Personal Custom Skills
│   ├── README.md
│   ├── scripts/
│   └── skills/
│       └── example-custom-skill/
│           └── SKILL.md
├── Ay-Skills/                               <-- Submodule 1
├── ECC/                                     <-- Submodule 2
├── awesome-claude-code/                     <-- Submodule 3
├── awesome-claude-code-toolkit/             <-- Submodule 4
├── awesome-claude-skills/                   <-- Submodule 5
├── claude-code-action/                      <-- Submodule 6
├── claude-code-best-practice/               <-- Submodule 7
├── claude-code-mcp/                         <-- Submodule 8 (MCP Bridge)
├── claude-code-ultimate-guide/              <-- Submodule 9
├── claude-context/                          <-- Submodule 10 (AST CLI)
├── claude-skills/                           <-- Submodule 11
├── github-mcp-server/                       <-- Submodule 12 (Go MCP Server)
├── superpowers/                             <-- Submodule 13
└── maniadav-agent-workspace/                <-- Reference Workspace
```

---

## 14. Installation UX

```bash
# Step 1: Navigate to toolkit directory
cd /Users/manishyadav/Documents/code/maniadav/claude-code-toolkit

# Step 2: Run global installation (Planning phase - NOT executed yet)
./scripts/install-global.sh

# Output:
# [CTK] Registering 13 submodules...
# [CTK] Indexing deep nested skills (awesome-claude-skills, claude-skills)...
# [CTK] Categorizing skill libraries, harness engines, MCP bridges, and AST tools...
# [CTK] Registering custom namespace (@custom) and rules (@workspace-rules)...
# [CTK] Generating global registry at ~/.claude-toolkit/registry.json...
# [CTK] Setting up adapters for Claude Code, Antigravity, and Cursor...
# ✅ Installation complete! You can now use @ECC, @superpowers, @custom in any project.
```

---

## 15. Example User Flows

### Scenario 1: Executing TDD Workflow in any arbitrary project
```bash
cd ~/Projects/ecommerce-api
# Inside Cursor, Claude Code, or Antigravity prompt:
"Use @superpowers to design and implement the payment gateway with strict TDD."
```
-> *Resolver activates `superpowers` namespace and loads its TDD workflow spec.*

### Scenario 2: Invoking exact custom skill
```bash
cd ~/Projects/mobile-app
# Inside prompt:
"Use @custom/db-migration to generate a new Prisma schema migration."
```
-> *Resolver resolves `my-custom-skills/skills/db-migration/SKILL.md` directly.*

### Scenario 3: Targeted nested submodule artifact resolution
```bash
cd ~/Projects/web-frontend
# Inside prompt:
"Use @awesome-claude-skills/pdf-analyzer to extract text from user upload."
```
-> *Resolver searches 2-level nested paths and extracts `awesome-claude-skills/document-skills/pdf-analyzer/SKILL.md` directly.*

### Scenario 4: Using Claude Code via MCP Server Bridge in Cursor/Codex
```text
Inside Cursor or Codex:
"Use @mcp/claude-code to run a complex refactoring job using Claude Code CLI."
```
-> *Resolver configures `claude-code-mcp` Node.js server to expose the `claude_code` tool.*

---

## 16. Implementation Phases (Proposed for Execution After Approval)

- **Phase 1 (Current)**: Architecture & Submodule Investigation (`PLAN-unified-agent-skill-system.md`).
- **Phase 2**: Resolver Core Implementation (`resolver/ctk-resolver.js` & `registry.json`).
- **Phase 3**: Agent Adapters (Claude Code, Antigravity, Cursor rule generators).
- **Phase 4**: Global Installer Script (`scripts/install-global.sh`).
- **Phase 5**: Verification & Cross-Agent Testing.

---

## 17. Verification & Test Plan

Before declaring implementation complete (in future phase), we will verify:
1. **Zero-Discovery Isolation Test**: Running `"Implement feature X"` loads 0 submodules and 0 skills.
2. **Explicit Namespace Resolution Test**: `@ECC` loads ECC native discovery; `@superpowers` loads superpowers TDD engine.
3. **Exact Artifact Resolution Test**: `@ECC/git-commit` resolves only that skill.
4. **Nested Skill Path Resolution Test**: `@awesome-claude-skills/pdf-analyzer` finds skill inside 2-level directory structure.
5. **Custom Skill Isolation Test**: `@custom/my-skill` loads from `my-custom-skills/` without touching submodules.
6. **MCP Server Route Test**: `@mcp/claude-code` and `@mcp/github` route to MCP configurations, not prompt injection.
7. **Cross-Project Test**: `cd ~/test-project` and invoking `@superpowers` works seamlessly without copying files.
8. **Submodule Update Integrity Test**: Running `npm run update` updates all submodules without breaking namespace registry mappings.

---

## 18. Approval Required

> [!IMPORTANT]
> **Implementation has NOT been performed.**
>
> The following design decisions require explicit user confirmation before code implementation begins:
>
> 1. **Namespace Prefix Syntax**: Confirm preference for `@<namespace>` and `@<namespace>/<artifact>` notation (e.g., `@ECC`, `@superpowers`, `@custom/my-skill`, `@mcp/claude-code`).
> 2. **Global Registry Location**: Confirm storing host global registry config at `~/.claude-toolkit/registry.json`.
> 3. **Supported Coding Agents**: Confirm initial adapter targets: **Claude Code CLI**, **Antigravity IDE / AGY**, and **Cursor IDE**.
>
> Once approved, implementation can proceed according to the phases outlined above.
