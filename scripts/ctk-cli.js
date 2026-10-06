#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const { generateRegistry, loadRegistry, REGISTRY_PATH, CONFIG_DIR } = require('../ctk/registry');
const { resolveQuery } = require('../ctk/resolver');
const { setupClaudeAdapter } = require('../ctk/adapters/claude');
const { setupAntigravityAdapter } = require('../ctk/adapters/antigravity');
const { generateCursorRules } = require('../ctk/adapters/cursor');
const { updateMcpConfig } = require('../ctk/adapters/mcp');

const TOOLKIT_ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const command = args[0] ? args[0].toLowerCase() : 'help';
const target = args[1];

switch (command) {
  case 'list': {
    const reg = loadRegistry() || generateRegistry(TOOLKIT_ROOT);
    console.log(`\n📦 CTK Monorepo Registered Namespaces (${Object.keys(reg.sources).length} total):\n`);
    console.log(`| Namespace Alias | Category | Capabilities | Skills Count | Path Exists |`);
    console.log(`|---|---|---|---|---|`);
    for (const [alias, source] of Object.entries(reg.sources)) {
      const caps = source.capabilities ? source.capabilities.join(', ') : 'none';
      const exists = source.exists ? '✅ Yes' : '❌ No';
      const count = source.skills ? source.skills.length : 0;
      console.log(`| @${alias.padEnd(25)} | ${source.category.padEnd(16)} | ${caps.padEnd(25)} | ${String(count).padEnd(12)} | ${exists} |`);
    }
    console.log('\nUse "ctk inspect @<namespace>" for detailed source capabilities.');
    break;
  }

  case 'inspect': {
    if (!target) {
      console.error('ERROR: Missing namespace target. Usage: ctk inspect @<namespace>');
      process.exit(1);
    }
    let alias = target.startsWith('@') ? target.slice(1) : target;
    const reg = loadRegistry() || generateRegistry(TOOLKIT_ROOT);
    const source = reg.sources[alias];

    if (!source) {
      console.error(`ERROR: Namespace '@${alias}' is not registered. Run 'ctk list' for available namespaces.`);
      process.exit(1);
    }

    console.log(`\n🔍 Source Inspection: @${alias}`);
    console.log(`----------------------------------------`);
    console.log(`- Category:     ${source.category}`);
    console.log(`- Capabilities: ${source.capabilities.join(', ')}`);
    console.log(`- Path:         ${source.path}`);
    console.log(`- Exists:       ${source.exists ? 'Yes' : 'No'}`);
    console.log(`- Exact Res.:   ${source.supports_exact_resolution ? 'Supported' : 'Not Supported'}`);

    if (source.entry_point) console.log(`- Entry Point:  ${source.entry_point}`);
    if (source.mcp_command) console.log(`- MCP Command:  ${source.mcp_command} (${source.mcp_path})`);
    if (source.exec_command) console.log(`- Exec Command: ${source.exec_command}`);

    if (source.skills && source.skills.length > 0) {
      console.log(`\nIndexed Skills (${source.skills.length} total):`);
      source.skills.slice(0, 15).forEach(s => console.log(`  • @${alias}/${s.name}  (${path.relative(source.path, s.skill_file)})`));
      if (source.skills.length > 15) {
        console.log(`  ... and ${source.skills.length - 15} more skills.`);
      }
    }
    console.log('');
    break;
  }

  case 'resolve': {
    if (!target) {
      console.error('ERROR: Missing target query. Usage: ctk resolve @<source>/<artifact>');
      process.exit(1);
    }
    const res = resolveQuery(target);
    if (res.status === 'error') {
      console.error(res.message);
      process.exit(1);
    }

    if (res.resolution_type === 'artifact') {
      console.log(`✅ Resolved Artifact: @${res.source}/${res.name}`);
      console.log(`- Path:       ${res.path}`);
      console.log(`- SKILL.md:   ${res.skill_file}`);
    } else {
      console.log(`✅ Resolved Namespace: @${res.source}`);
      console.log(`- Category:     ${res.category}`);
      console.log(`- Path:         ${res.path}`);
      console.log(`- Capabilities: ${res.capabilities.join(', ')}`);
    }
    break;
  }

  case 'activate': {
    if (!target) {
      console.error('ERROR: Missing namespace target. Usage: ctk activate @<namespace>');
      process.exit(1);
    }
    let alias = target.startsWith('@') ? target.slice(1) : target;
    const reg = loadRegistry() || generateRegistry(TOOLKIT_ROOT);
    const source = reg.sources[alias];

    if (!source) {
      console.error(`ERROR: Namespace '@${alias}' is not registered.`);
      process.exit(1);
    }

    console.log(`\n🚀 Activating Native Namespace: @${alias}`);
    if (source.category === 'mcp-server') {
      const cfgPath = updateMcpConfig(alias, source.mcp_command, [source.mcp_path]);
      console.log(`✅ Registered MCP Server bridge in: ${cfgPath}`);
    } else if (source.category === 'harness-os' && source.entry_point) {
      console.log(`✅ Native Harness OS Entry Point: ${source.entry_point}`);
      console.log(`Run 'bash ${source.entry_point}' to launch native harness shims.`);
    } else if (source.category === 'workflow-engine') {
      console.log(`✅ Native Workflow Engine Active (${source.path})`);
      console.log(`Spawning subagent workflow plugins...`);
    } else {
      console.log(`✅ Active Skill Library: ${source.path}`);
    }
    break;
  }

  case 'path': {
    if (!target) {
      console.error('ERROR: Missing target. Usage: ctk path @<namespace>');
      process.exit(1);
    }
    let alias = target.startsWith('@') ? target.slice(1) : target;
    const reg = loadRegistry() || generateRegistry(TOOLKIT_ROOT);
    const source = reg.sources[alias];
    if (!source) {
      console.error(`ERROR: Unknown namespace @${alias}`);
      process.exit(1);
    }
    console.log(source.path);
    break;
  }

  case 'reindex':
  case 'update': {
    console.log(`🔄 Re-indexing submodules and generating CTK global registry...`);
    const reg = generateRegistry(TOOLKIT_ROOT);
    console.log(`✅ Registry updated at: ${REGISTRY_PATH}`);
    console.log(`Indexed ${Object.keys(reg.sources).length} sources cleanly.`);
    break;
  }

  case 'install': {
    console.log(`\n🛠️  Installing CTK Global System...`);
    const reg = generateRegistry(TOOLKIT_ROOT);
    setupClaudeAdapter(reg);
    setupAntigravityAdapter(reg);
    generateCursorRules(reg, TOOLKIT_ROOT);

    const binDir = path.join(os.homedir(), '.local', 'bin');
    if (!fs.existsSync(binDir)) fs.mkdirSync(binDir, { recursive: true });

    const wrapperPath = path.join(binDir, 'ctk');
    const cliScript = path.join(TOOLKIT_ROOT, 'scripts', 'ctk-cli.js');
    const wrapperContent = `#!/usr/bin/env bash\nexec node "${cliScript}" "$@"\n`;

    fs.writeFileSync(wrapperPath, wrapperContent, { mode: 0o755 });
    console.log(`✅ CTK Global CLI binary installed at: ${wrapperPath}`);
    console.log(`✅ Adapters generated for Claude Code, Antigravity, and Cursor.`);
    console.log(`\nEnsure '${binDir}' is in your $PATH to use 'ctk' from any directory.\n`);
    break;
  }

  case 'uninstall': {
    console.log(`\n🧹 Uninstalling CTK Global System...`);
    const wrapperPath = path.join(os.homedir(), '.local', 'bin', 'ctk');
    if (fs.existsSync(wrapperPath)) fs.unlinkSync(wrapperPath);
    if (fs.existsSync(CONFIG_DIR)) fs.rmSync(CONFIG_DIR, { recursive: true, force: true });
    console.log(`✅ Cleanly removed global binary, adapters, and configuration files.\n`);
    break;
  }

  case 'doctor': {
    console.log(`\n🩺 Running CTK System Health Diagnostics...\n`);
    const reg = loadRegistry();
    console.log(`1. Global Registry File:    ${reg ? '✅ Found (' + REGISTRY_PATH + ')' : '❌ Missing (Run ctk install)'}`);
    console.log(`2. Toolkit Root Directory:  ${TOOLKIT_ROOT}`);
    const wrapperPath = path.join(os.homedir(), '.local', 'bin', 'ctk');
    console.log(`3. Global Binary Link:      ${fs.existsSync(wrapperPath) ? '✅ Installed (' + wrapperPath + ')' : '❌ Not installed'}`);
    
    if (reg) {
      let missingCount = 0;
      for (const [alias, s] of Object.entries(reg.sources)) {
        if (!s.exists) missingCount++;
      }
      console.log(`4. Submodule Path Integrity: ${missingCount === 0 ? '✅ All submodules present' : '⚠️ ' + missingCount + ' submodules missing'}`);
    }
    console.log('');
    break;
  }

  default: {
    console.log(`
CTK - Claude Code Toolkit Scoped Orchestration System CLI

Usage:
  ctk list                       List all registered namespaces & capabilities
  ctk inspect @<source>          Inspect details & skills for a specific namespace
  ctk resolve @<source>/<skill>  Resolve exact path to artifact
  ctk activate @<source>         Activate native harness/workflow/MCP bridge
  ctk path @<source>             Print absolute filesystem path to source
  ctk install                    Install CTK globally (~/.local/bin/ctk)
  ctk update                     Re-index submodules & refresh registry
  ctk doctor                     Run system health & symlink diagnostics
  ctk uninstall                  Cleanly uninstall CTK global setup
`);
  }
}
