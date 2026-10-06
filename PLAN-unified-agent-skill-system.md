# Final Implementation Plan: Scoped Agent & Skill Orchestration System (`claude-code-toolkit`)

> **Status:** Proposal / Planning Phase (Implementation Pending Approval)  
> **Target Repository:** `claude-code-toolkit`  
> **Author:** Senior AI Engineering Team  
> **Date:** October 2026  

---

## 1. Executive Summary

This document defines the **final, authoritative implementation plan** for building a **globally accessible, agent-agnostic, scoped discovery and invocation layer** (`ctk`) on top of the `claude-code-toolkit` monorepo.

### Core Mission
The `claude-code-toolkit` monorepo aggregates 13 external Git submodules, custom skills (`my-custom-skills`), and workspace reference patterns (`maniadav-agent-workspace`). These repositories are highly heterogeneous, spanning skill libraries, multi-agent harness operating systems, MCP server bridges, AST indexers, and CI/CD runners. 

Our goal is **NOT** to flatten or merge these systems into a single universal skill format.  
Our goal is to build a **thin, globally accessible orchestration and discovery layer** that enables explicit, scoped selection of submodules and exact artifacts from any directory on the host machine (`cd ~/any-project`), while preserving 100% of each submodule's native installation, discovery, execution, and runtime methodology.

---

## 2. System Requirements & Constraints

### A. Hard Requirements
1. **Unify Addressing and Access, Not Methodologies**: The system must preserve each source repository's native installation, discovery, execution, and runtime methodology.
2. **NO GLOBAL SEMANTIC DISCOVERY**: If the user provides a prompt without an explicit source (e.g. *"Implement feature X"*), the toolkit system MUST NOT search submodules, rank skills across repositories, or load prompt context. The AI agent operates normally without CTK interference.
3. **Explicit Scoped Discovery**: When a source is identified (e.g., `@ECC`, `@superpowers`, `@custom`), **only** that source is activated, delegating to that source's native discovery mechanics.
4. **Deterministic Exact Resolution**: Exact artifact addressing (e.g., `@source/artifact`) must resolve deterministically. **Unsafe fuzzy matching is strictly prohibited**. 
   - 0 matches $\rightarrow$ Clear error.
   - 1 match $\rightarrow$ Resolve.
   - $>1$ matches $\rightarrow$ Ambiguity error displaying candidate canonical paths.
5. **Type-Aware Routing**: Do NOT extract/inject everything as raw Markdown. Skills load via skill loaders; MCP servers register via `mcp_config.json`; CLI tools invoke via terminal commands; CI actions generate workflow files.
6. **Agent-Agnostic Core (`ctk` CLI)**: The underlying system must be a standalone CLI utility (`ctk`), independent of any specific coding agent. Agent-specific integration layers (adapters) call this core.
7. **Global System Access**: Setup occurs once inside `claude-code-toolkit` (`./install.sh`). The system is immediately usable from any directory on the user's machine (`cd ~/Projects/app`) without copying toolkit files.

### B. Desirable Features
- Fast, static/generated capability registry (`~/.config/ctk/registry.json`).
- Re-indexing integration during submodule updates (`npm run update`).
- Clean user-space teardown script (`./uninstall.sh`).

### C. Explicitly Rejected Behavior
- ❌ **No Global Semantic Search**: No automatic scanning of all `SKILL.md` files across submodules when no source is specified.
- ❌ **No Schema Flattening**: No converting complex multi-agent harnesses (`ECC`, `superpowers`) into static `SKILL.md` prompts.
- ❌ **No Unsafe Fuzzy Matching**: No silently guessing between `category-a/foo` and `category-b/foo`.
- ❌ **No Implicit Multi-Source Merging**: No automatic mixing of competing methodologies (e.g. blending `superpowers` TDD with un-tested prototyping skills).
- ❌ **No Destructive Submodule Edits**: No modifying third-party submodule files directly.

---

## 3. Detailed Repository & Submodule Analysis

An empirical inspection of all 15 sources in `claude-code-toolkit` establishes their exact composition and runtime characteristics:

| Source Repository | Executable Type | `SKILL.md` Count | Directory Depth Pattern | Build / Runtime Dependencies | Primary Role & Capabilities |
|---|---|---|---|---|---|
| **`Ay-Skills`** | Skill Library | 6 | Flat: `skills/<skill>/SKILL.md` | Pure Markdown | Remotion video generation, Puppeteer browser automation, UI/UX tokens, SEO auditing. |
| **`ECC`** | Harness OS | 934 | Mixed: `skills/`, `plugins/`, `scaffolds/` | `install.sh`, Node.js, Python, `agent.yaml` | Full harness operating system with terminal shims (`ecc-agentshield`), multi-agent task spawning, AST hooks. |
| **`awesome-claude-code`** | Curation Index | 0 | Flat Markdown Curation Index | Python (`generate_readme.py`), `Makefile` | Curation index of external Claude Code plugins, workflows, and resources. Passive reference. |
| **`awesome-claude-code-toolkit`** | Preset Registry | 40 | Flat: `skills/<skill>/SKILL.md` | Manifests, `.claude-plugin`, `.mcp.json` | Pre-configured MCP server configs, agent rules, workflow presets. |
| **`awesome-claude-skills`** | Skill Library | 864 | **2-Level Nested**: `<category>/<skill>/SKILL.md` | Pure Markdown | Composio skill collection covering 800+ API integrations, document processing (XLSX, PDF, PPTX, DOCX), resume generation. |
| **`claude-code-action`** | CI/CD Runner | 0 | Action Codebase (`base-action/`) | Bun runtime, `package.json`, TypeScript | Official Anthropic GitHub Action runner for headless PR code review automation in CI pipelines. |
| **`claude-code-best-practice`** | Rules / Reference | 0 | Markdown Guidelines & Decks | `CLAUDE.md` templates, tutorials | Engineering guidelines, agent team orchestration standards, code quality rules templates. |
| **`claude-code-mcp`** | MCP Server Bridge | 0 | Node.js MCP Server | Node.js (>= 20), `package.json`, Claude CLI | Exposes `claude_code:claude_code` tool endpoint over stdio/SSE, allowing non-Claude IDEs (Cursor/Codex/Antigravity) to run Claude CLI. |
| **`claude-code-ultimate-guide`**| Hybrid Reference | 83 | Nested: `tools/<skill>/SKILL.md` | Markdown docs, quiz runners, Claudedocs | Master technical guide, architecture whitepapers, quiz suites, and 83 structural skill templates. |
| **`claude-context`** | AST CLI Tool | 0 | Node.js + Python Monorepo | Node.js, `pnpm`, Python, `package.json` | Codebase AST parser and context packing engine providing 70% LLM context compression via `npx claude-context`. |
| **`claude-skills`** | Enterprise Suite | 388 | **2-Level Nested**: `<domain>/<skill>/SKILL.md` | `pyproject.toml`, `tessl.json`, Python | Enterprise organizational skill suite (C-level advisor, business growth, engineering management). |
| **`github-mcp-server`** | MCP Server | 0 | Go Server Codebase | Go (>= 1.21), `go.mod`, Dockerfile | Official GitHub Model Context Protocol server exposing native GitHub API tools (`create_issue`, `get_file`, `create_pull_request`). |
| **`superpowers`** | Workflow Engine | 15 | Flat: `skills/<skill>/SKILL.md` | Node.js, `package.json`, multi-agent manifests | Agentic workflow engine enforcing strict Test-Driven Development (TDD), spec creation (`/brainstorm`, `/plan`), and subagent delegation. |
| **`my-custom-skills`** | Custom Skill Space | Variable | Flat: `skills/<skill>/SKILL.md` | User Markdown & Scripts | User-owned custom skills directory tracked in monorepo, 100% protected from submodule git resets. |
| **`maniadav-agent-workspace`**| Rules Workspace | 1 | Multi-Agent Rules Folders | Markdown (`antigravity/`, `cursor/`, `copilot/`) | Local reference rules implementation standardizing engineering principles across Antigravity (`AGENTS.md`), Cursor (`.cursorrules`), Copilot. |

---

## 4. Native Installation / Discovery / Invocation Matrix

```text
+-------------------------------------------------------------------------------------------------------------------------+
| Submodule                      | Install Method           | Discovery Method          | Invocation Method            |
+--------------------------------+--------------------------+---------------------------+------------------------------+
| Ay-Skills                      | None (Markdown)          | Filesystem scan           | Prompt intent match          |
| ECC                            | install.sh / npm / pip   | agent.yaml / CLI          | /ecc, CLI ecc-universal      |
| awesome-claude-code            | None                     | Manual README inspection  | Passive reading              |
| awesome-claude-code-toolkit    | Copy / Symlink           | Directory manifests       | Prompt intent / MCP configs  |
| awesome-claude-skills          | None                     | Category directory scan   | Prompt intent match          |
| claude-code-action             | GitHub Actions / Bun     | .github/workflows/ runner | GitHub Actions PR trigger    |
| claude-code-best-practice      | Copy CLAUDE.md           | System prompt load        | System prompt enforcement    |
| claude-code-mcp                | npm install & build      | mcp_config.json entry     | MCP tool call claude_code    |
| claude-code-ultimate-guide     | Manual view              | Directory scan & quizzes  | Prompt intent & CLI tools    |
| claude-context                 | npm install -g / pnpm    | CLI argument parsing      | npx claude-context <path>    |
| claude-skills                  | pyproject.toml / copy    | tessl.json / frontmatter  | Prompt intent / agent launch |
| github-mcp-server              | Go build / Docker        | mcp_config.json entry     | MCP tool call create_issue   |
| superpowers                    | npm install / plugins    | Plugin manifests (.agents)| /brainstorm, /plan, TDD      |
| my-custom-skills               | File creation            | Filesystem scan           | Prompt intent / @custom      |
| maniadav-agent-workspace       | Symlink rules            | Agent rules load          | System prompt enforcement    |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 5. Source Capability Model

Every registered source exhibits one or more explicit operational capabilities:

```yaml
capabilities:
  - skill-library        # Contains SKILL.md prompt instructions
  - harness-os           # Complete operating environment & subagent spawner
  - workflow-engine      # Enforces stateful workflows (e.g. TDD, specs)
  - mcp-server           # Exposes MCP tools over Stdio/SSE
  - cli-tool             # Executable binary invoked via shell
  - ci-runner            # GitHub Actions container runner
  - reference-rules      # Engineering standards and system prompts
```

### Registry Capabilities Schema (`registry.yaml` / `registry.json`)

```json
{
  "version": "1.0.0",
  "updated_at": "2026-10-06T15:38:00Z",
  "sources": {
    "ECC": {
      "path": "ECC",
      "category": "harness-os",
      "capabilities": ["harness-os", "skill-library", "cli-tool"],
      "entry_point": "ECC/install.sh",
      "native_cli": "ecc-universal",
      "supports_exact_resolution": true
    },
    "superpowers": {
      "path": "superpowers",
      "category": "workflow-engine",
      "capabilities": ["workflow-engine", "skill-library"],
      "entry_point": "superpowers/index.js",
      "supports_exact_resolution": true
    },
    "awesome-claude-skills": {
      "path": "awesome-claude-skills",
      "category": "skill-library",
      "capabilities": ["skill-library"],
      "search_depth": 2,
      "supports_exact_resolution": true
    },
    "claude-code-mcp": {
      "path": "claude-code-mcp",
      "category": "mcp-server",
      "capabilities": ["mcp-server"],
      "mcp_command": "node",
      "mcp_args": ["claude-code-mcp/build/index.js"],
      "supports_exact_resolution": false
    },
    "claude-context": {
      "path": "claude-context",
      "category": "cli-tool",
      "capabilities": ["cli-tool"],
      "exec_command": "npx claude-context",
      "supports_exact_resolution": false
    },
    "github-mcp-server": {
      "path": "github-mcp-server",
      "category": "mcp-server",
      "capabilities": ["mcp-server"],
      "mcp_command": "github-mcp-server",
      "supports_exact_resolution": false
    },
    "custom": {
      "path": "my-custom-skills",
      "category": "skill-library",
      "capabilities": ["skill-library"],
      "supports_exact_resolution": true
    },
    "workspace-rules": {
      "path": "maniadav-agent-workspace",
      "category": "reference-rules",
      "capabilities": ["reference-rules"],
      "supports_exact_resolution": true
    }
  }
}
```

---

## 6. Namespace Model & Canonical Addressing

The canonical CTK namespace maps directly to source aliases:

```text
@ECC                           -> Activates ECC native harness OS
@ECC/<artifact>                -> Resolves exact ECC skill/agent
@superpowers                   -> Activates superpowers TDD workflow engine
@superpowers/<skill>           -> Resolves exact superpower skill
@awesome-claude-skills/<skill> -> Resolves exact Composio skill across 2-level categories
@claude-skills/<skill>         -> Resolves exact enterprise skill
@custom/<skill>                -> Resolves user custom skill from my-custom-skills/skills/
@mcp/github                    -> Registers/invokes GitHub MCP server
@mcp/claude-code               -> Registers/invokes Claude CLI MCP bridge
@tool/claude-context           -> Invokes AST context parser CLI
@workspace-rules               -> Injects maniadav-agent-workspace engineering standards
```

---

## 7. Exact Artifact Resolution Semantics

When resolving `@source/artifact`:

```text
                                  User inputs `@source/artifact`
                                                │
                                                ▼
                                    Source registered in CTK?
                                      /                   \
                                    NO                     YES
                                    /                       \
                          Return ERROR:                  Type-Aware
                         Unknown Source              Capability Check
                                                            │
                                                            ▼
                                                Supports Exact Resolution?
                                                  /                    \
                                                NO                      YES
                                                /                        \
                                     Return ERROR:                     Index Search
                                    Type does not support           for target artifact
                                    artifact extraction                      │
                                                                             ▼
                                                                  Match Count Evaluated
                                                                /          |          \
                                                               0           1          >1
                                                              /            |            \
                                                      Return ERROR:     SUCCESS:    Return ERROR:
                                                     Artifact Not Found  Resolve    Ambiguity Error
                                                                        Artifact    List Candidates
```

### Exact Resolution Code Logic Specification
1. **0 Matches**: Returns `ERROR: Artifact '<artifact>' not found in namespace '@<source>'`.
2. **1 Match**: Resolves canonical file path deterministically.
3. **>1 Matches**: Returns `ERROR: Ambiguous artifact reference '@<source>/<artifact>'`. Lists all candidate matching paths (e.g. `awesome-claude-skills/document-skills/pdf/SKILL.md` vs `awesome-claude-skills/other-skills/pdf/SKILL.md`) and demands explicit category specifying.

---

## 8. Type-Aware Native Delegation Model

When a user invokes a namespace, CTK delegates execution to the source's native mechanism based on its type:

```text
+-------------------+--------------------------------------------------------------------------------+
| Executable Type   | Native Delegation Action                                                      |
+-------------------+--------------------------------------------------------------------------------+
| skill-library     | Formats SKILL.md payload for agent loader (.claude/skills/ or .agents/skills/) |
| harness-os        | Executes entry_point script (ECC install.sh/ecc-universal) and attaches shims   |
| workflow-engine   | Activates workflow framework (superpowers index.js) and loads spec plugins     |
| mcp-server        | Updates ~/.gemini/config/mcp_config.json or .mcp.json server entry             |
| cli-tool          | Outputs shell invocation command (npx claude-context .)                        |
| ci-runner         | Generates .github/workflows/ template for CI pipeline                          |
| reference-rules   | Symlinks system rules (AGENTS.md / .cursorrules / copilot-instructions.md)     |
+-------------------+--------------------------------------------------------------------------------+
```

---

## 9. Global Installation Architecture

Global access from any folder (`cd ~/Projects/my-app`) is achieved without root privileges via user-space binaries and configuration paths:

```text
Host System Environment ($HOME)
├── .local/
│   └── bin/
│       └── ctk                        <-- Global CLI wrapper script (added to $PATH)
├── .config/
│   └── ctk/
│       ├── registry.json              <-- Generated host registry index
│       └── config.json                <-- Global CTK user settings (pointing to monorepo root)
├── .claude/
│   └── skills/
│       └── ctk -> ~/.config/ctk/links <-- Symlinked skill adapter for Claude Code CLI
└── .gemini/
    └── config/
        └── skills/
            └── ctk -> ~/.config/ctk/  <-- Symlinked skill adapter for Antigravity IDE / AGY
```

### Setup Execution Flow (`./install.sh`)
1. Detects absolute path of `claude-code-toolkit`.
2. Verifies Node.js (>= 18), Python (>= 3.10), Git (>= 2.30).
3. Scans all submodules and generates `~/.config/ctk/registry.json`.
4. Creates executable wrapper script `~/.local/bin/ctk`.
5. Prompts user to append `export PATH="$HOME/.local/bin:$PATH"` if not present.
6. Establishes native symlink adapters for Claude Code, Antigravity, and Cursor.

---

## 10. Canonical CTK Interface (CLI / API)

The core `ctk` utility provides a clean, agent-agnostic CLI interface:

```bash
# General Information & Diagnostics
ctk list                             # Lists all registered sources, categories, and capabilities
ctk inspect @ECC                     # Displays metadata, path, and capabilities for @ECC
ctk doctor                          # Validates submodule states, symlinks, and PATH setup

# Artifact Resolution & Path Querying
ctk resolve @ECC/git-commit          # Resolves exact path to ECC's git-commit skill
ctk resolve @custom/db-migration     # Resolves exact path to user custom skill
ctk path @superpowers                # Prints absolute filesystem path to superpowers submodule

# Activation & Delegation
ctk activate @ECC                    # Activates ECC native harness environment
ctk activate @superpowers            # Activates superpowers TDD workflow engine

# System Maintenance
ctk update                           # Pulls git submodules and refreshes registry index
ctk install                          # Performs global host setup
ctk uninstall                        # Cleanly removes global binaries, symlinks, and registries
```

---

## 11. Agent Integration Architecture & Compatibility Matrix

Different coding agents possess different native mechanisms for rule discovery and tool execution:

```text
                       Canonical CTK Core (`ctk`)
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
Claude Code Adapter       Antigravity Adapter         Cursor Adapter
 (~/.claude/skills/)      (~/.gemini/config/)        (.cursor/rules/)
         │                         │                         │
         ▼                         ▼                         ▼
Claude Code CLI           Antigravity IDE / AGY         Cursor IDE
 Native Invocation         Native Invocation         Native Invocation
```

| Coding Agent | Integration Level | `@` Syntax Support | Native Skill Loading | MCP Support | CTK Adapter Strategy |
|---|---|---|---|---|---|
| **Claude Code CLI** | Verified Native | Native via prompt / `/` | `.claude/skills/` | Native stdio/SSE | Symlink `~/.claude/skills/ctk` to `~/.config/ctk/links` |
| **Antigravity IDE / AGY**| Verified Native | Native via prompt / `@` | `.agents/skills/` | Native stdio/SSE | Symlink `~/.gemini/config/skills/ctk` to registry |
| **Cursor IDE** | Adapter Required | Native via `@` file attach | `.cursor/rules/*.mdc` | Native stdio/SSE | Generate `.cursor/rules/ctk-namespaces.mdc` |
| **Codex** | Adapter Required | System prompt reference | `.codex/skills/` | Adapter required | Generate `.codex/skills/` proxy links |
| **OpenCode / Vibe** | Adapter Required | Plugin manifest link | `.agents/skills/` | Native stdio/SSE | Shared `.agents/` adapter link |
| **GitHub Copilot** | Wrapper Required | Workspace prompt ref | Passive instructions | Unsupported | Generate `.github/copilot-instructions.md` links |

---

## 12. Custom Skills Integration (`my-custom-skills/`)

- Directory: `my-custom-skills/skills/<skill-name>/SKILL.md`.
- Namespace: `@custom/<skill-name>`.
- Ownership: **100% User-Owned**.
- Version Control: Tracked directly in `claude-code-toolkit` git repository.
- Protection: Explicitly excluded from `git submodule clean` or `git submodule update` operations. Updating external submodules will **never** alter or overwrite custom skills.

---

## 13. `maniadav-agent-workspace` Integration

- Directory: `maniadav-agent-workspace/`.
- Namespace: `@workspace-rules` or `@maniadav`.
- Primary Role: Reference implementation for cross-agent engineering standards.
- Adapter Action:
  - Antigravity IDE $\rightarrow$ Symlinks `maniadav-agent-workspace/antigravity/` rules to `.agents/rules/`.
  - Cursor IDE $\rightarrow$ Symlinks `maniadav-agent-workspace/cursor/` rules to `.cursor/rules/`.
  - GitHub Copilot $\rightarrow$ Symlinks `maniadav-agent-workspace/copilot/` instructions to `.github/copilot-instructions.md`.

---

## 14. Security and Isolation Guarantees

1. **Zero Implicit Context Pollution**: Without explicit `@source` invocation, 0 submodules are loaded.
2. **Deterministic Resolution**: Ambiguous matches throw explicit errors rather than guessing.
3. **Credential Safeguards**: Secrets are never written to `registry.json`. All MCP servers read runtime environment variables (`ANTHROPIC_API_KEY`, `GITHUB_TOKEN`).
4. **Execution Boundaries**: Harness commands (`ECC`) execute under host OS permissions or IDE sandbox restrictions.
5. **Read-Only Submodule Safety**: Third-party submodules are treated as read-only Git dependencies.

---

## 15. Maintenance, Install, and Uninstall Strategy

### Submodule Updates (`ctk update`)
Running `ctk update` (or `npm run update`):
1. Executes `git submodule update --init --recursive --remote --merge`.
2. Triggers `ctk reindex` to re-scan submodule paths and update `~/.config/ctk/registry.json`.
3. Preserves `my-custom-skills/` without modification.

### Clean Uninstallation (`./uninstall.sh` or `ctk uninstall`)
1. Removes wrapper binary `~/.local/bin/ctk`.
2. Removes global config directory `~/.config/ctk/`.
3. Removes global symlink adapters from `~/.claude/skills/ctk` and `~/.gemini/config/skills/ctk`.
4. Leaves host system completely clean without broken symlinks.

---

## 16. Failure Semantics & Error Messages

```text
+-------------------------------+-----------------------------------------------------------------------------------+
| Failure Scenario              | Explicit Error Output                                                             |
+-------------------------------+-----------------------------------------------------------------------------------+
| Unknown Namespace             | ERROR: Namespace '@unknown' is not registered.                                    |
|                               | Run 'ctk list' to view available namespaces.                                      |
+-------------------------------+-----------------------------------------------------------------------------------+
| Missing Artifact              | ERROR: Artifact 'foo' not found in namespace '@ECC'.                              |
|                               | Run 'ctk inspect @ECC' to view available artifacts.                               |
+-------------------------------+-----------------------------------------------------------------------------------+
| Ambiguous Artifact Match      | ERROR: Ambiguous artifact reference '@awesome-claude-skills/pdf'.                 |
|                               | Multiple candidates found:                                                        |
|                               |   1. awesome-claude-skills/document-skills/pdf/SKILL.md                            |
|                               |   2. awesome-claude-skills/other-skills/pdf/SKILL.md                               |
|                               | Specify exact category path: @awesome-claude-skills/document-skills/pdf           |
+-------------------------------+-----------------------------------------------------------------------------------+
| Capability Unsupported        | ERROR: Namespace '@github-mcp-server' is an MCP Server, not a skill library.      |
|                               | Run 'ctk activate @github-mcp-server' to register it in mcp_config.json.          |
+-------------------------------+-----------------------------------------------------------------------------------+
```

---

## 17. Proposed Directory Structure

```text
claude-code-toolkit/
├── .gitmodules                      # Submodule configurations
├── package.json                     # Monorepo update scripts
├── README.md                        # Primary documentation & capability matrix
├── PLAN-unified-agent-skill-system.md     # THIS FINAL PLAN DOCUMENT
├── install.sh                       # Global user-space installer script
├── uninstall.sh                     # Global clean teardown script
├── scripts/
│   ├── update-all.sh                # Submodule updater script
│   └── ctk-cli.js                   # Executable entry point for ctk CLI
├── ctk/                             # Core CTK Engine (Future Implementation Phase)
│   ├── registry.js                  # Registry generator & validator
│   ├── resolver.js                  # Scoped namespace & exact artifact resolver
│   ├── adapters/
│   │   ├── claude.js                # Claude Code CLI adapter
│   │   ├── antigravity.js           # Antigravity IDE / AGY adapter
│   │   ├── cursor.js                # Cursor MDC rules adapter
│   │   └── mcp.js                   # MCP server config generator
│   └── templates/
│       ├── registry.json.template
│       └── ctk-wrapper.sh
├── my-custom-skills/                # Personal Custom Skills
│   ├── README.md
│   ├── scripts/
│   └── skills/
│       └── example-skill/
│           └── SKILL.md
├── Ay-Skills/                       # Submodule 1
├── ECC/                             # Submodule 2
├── awesome-claude-code/             # Submodule 3
├── awesome-claude-code-toolkit/     # Submodule 4
├── awesome-claude-skills/           # Submodule 5
├── claude-code-action/              # Submodule 6
├── claude-code-best-practice/       # Submodule 7
├── claude-code-mcp/                 # Submodule 8
├── claude-code-ultimate-guide/      # Submodule 9
├── claude-context/                  # Submodule 10
├── claude-skills/                   # Submodule 11
├── github-mcp-server/               # Submodule 12
├── superpowers/                     # Submodule 13
└── maniadav-agent-workspace/        # Reference Workspace
```

---

## 18. Architectural Self-Assessment & Challenge

Before proposing implementation, we critically evaluated the architecture against 10 core questions:

1. **Is a centralized resolver actually necessary?**  
   *Yes*. Without a resolver, deep 2-level skill folders in `awesome-claude-skills` and non-prompt submodules like `claude-code-mcp` fail or inject raw binary/config data into model prompts.
2. **Can the requirement be achieved more simply with global symlinks alone?**  
   *No*. Global symlinks flatly dump all 2,000+ `SKILL.md` files into agent memory simultaneously, violating the **No Global Semantic Discovery** rule and causing massive token bloat and skill collisions.
3. **Which parts genuinely require code?**  
   Only the lightweight CLI resolver (`ctk-cli.js`) and path index generator (`registry.js`).
4. **Which parts should remain native to each submodule?**  
   All execution, subagent spawning, TDD workflow logic, and shims remain 100% inside their respective submodules.
5. **Is a registry necessary?**  
   *Yes*, a lightweight generated capability manifest (`registry.json`) is required to map aliases (`@ECC`, `@superpowers`, `@custom`) to absolute paths.
6. **Should the registry be static or generated?**  
   *Generated on setup/update*. Static registries break when submodule paths change or new skills are added upstream.
7. **Should exact artifact indexing exist?**  
   *Yes*, a lightweight lookup map of unique skill basenames avoids runtime filesystem searching.
8. **Can `@` namespace actually be supported across target agents?**  
   *Yes*. Claude Code, Antigravity, and Cursor natively support `@` file/folder references. For agents without native `@` interception, `ctk resolve @source/artifact` provides the fallback.
9. **What is the smallest architecture that satisfies the requirements?**  
   A single Node.js script (`ctk-cli.js`) operating on `~/.config/ctk/registry.json` without external npm runtime dependencies.
10. **What functionality should explicitly NOT be built?**  
    We explicitly reject building AI skill recommendation engines, automatic prompt merging, or custom skill schema parsers.

---

## 19. System Architecture Flowchart

```text
                        ANY WORKING DIRECTORY (`~/Projects/app`)
                                           │
                                           ▼
                                 User Prompt Injected
                                           │
                        Contains Explicit Scoped Source?
                         /                            \
                       NO                              YES
                       /                                \
             No Action Taken                     CTK Resolver Invoked
            (0 Submodules Loaded)                (`ctk resolve @source`)
            Normal Agent Behavior                        │
                                                         ▼
                                             Registry Capability Check
                                             (`~/.config/ctk/registry.json`)
                                                         │
         ┌─────────────────────────┬─────────────────────┴───────────────────┬─────────────────────────┐
         ▼                         ▼                                         ▼                         ▼
   `skill-library`           `harness-os`                             `mcp-server`               `cli-tool`
         │                         │                                         │                         │
         ▼                         ▼                                         ▼                         ▼
Format SKILL.md for       Execute native entry                   Register server in         Output shell command
Target Agent Loader       script (install.sh)                    mcp_config.json            (npx claude-context .)
```

---

## 20. Phased Implementation Roadmap

Once approved, implementation will proceed in 5 isolated, testable phases:

- **Phase 1: Foundation**: Create `ctk/registry.js` generator and initial `~/.config/ctk/registry.json` schema.
- **Phase 2: CLI Core**: Implement `ctk-cli.js` with `list`, `inspect`, `resolve`, and `path` commands.
- **Phase 3: Type Adapters**: Implement skill loaders, MCP config generators, and workspace rules symlinkers.
- **Phase 4: Installer & Teardown**: Build `./install.sh` and `./uninstall.sh`.
- **Phase 5: E2E Verification**: Execute complete empirical verification test suite across Claude Code, Antigravity, and Cursor.

---

## 21. Decision Table

| Decision Item | Recommendation | Empirical Evidence | Approval Required |
|---|---|---|---|
| **Global Installation Model** | User-space binaries (`~/.local/bin/ctk`) and global config (`~/.config/ctk/`) | Avoids `/usr/local/bin` root privileges, fully compatible with macOS zsh | Required |
| **Namespace Syntax** | `@<source>` and `@<source>/<artifact>` (e.g. `@ECC`, `@superpowers`, `@custom/db-migration`) | Matches native UI auto-complete in Cursor, Antigravity, and Claude Code | Required |
| **Canonical CLI Core** | Lightweight Node.js CLI script (`scripts/ctk-cli.js`) | Node.js (>= 18) is a verified prerequisite; avoids extra compilation steps | Required |
| **Registry Schema** | Generated JSON capability manifest (`~/.config/ctk/registry.json`) | Re-indexed on `ctk update`; handles 2-level nested skills in `awesome-claude-skills` | Required |
| **Exact Resolution Model** | Deterministic matching with explicit error on ambiguity (>1 matches) | Eliminates unsafe fuzzy matching and instruction bleed | Required |
| **Agent Adapters Target** | **Claude Code CLI**, **Antigravity IDE / AGY**, **Cursor IDE** | Verified native support for `@` file references and custom skill loaders | Required |
| **MCP Handling** | Route `@mcp/<server>` to `mcp_config.json` / `.mcp.json` registration | Prevents injecting raw MCP binary code into LLM context windows | Required |
| **Multi-Source Composition** | Single active source default in v1 (no implicit `@source1 + @source2`) | Prevents conflicting workflow philosophies (e.g. TDD vs non-TDD) | Required |

---

## 22. Approval Required

> [!IMPORTANT]
> **Implementation has NOT been performed.**
>
> The following decision items require your explicit confirmation before implementation begins:
>
> 1. **User-Space Global Installation**: Approve installing global CLI to `~/.local/bin/ctk` and global config to `~/.config/ctk/registry.json`.
> 2. **Namespace & Exact Addressing Syntax**: Approve `@<source>` and `@<source>/<artifact>` addressing conventions.
> 3. **Single Active Source Policy (v1)**: Approve strictly enforcing one active source at a time to prevent workflow collisions.
> 4. **Initial Agent Adapter Scope**: Approve initial target adapters for **Claude Code CLI**, **Antigravity IDE / AGY**, and **Cursor IDE**.
>
> Once approved, implementation will execute according to the 5-phase roadmap.
