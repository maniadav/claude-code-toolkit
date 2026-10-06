const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.config', 'ctk');
const REGISTRY_PATH = path.join(CONFIG_DIR, 'registry.json');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const SOURCE_METADATA = {
  'Ay-Skills': {
    category: 'skill-library',
    capabilities: ['skill-library'],
    supports_exact_resolution: true,
    search_depth: 1
  },
  'ECC': {
    category: 'harness-os',
    capabilities: ['harness-os', 'skill-library', 'cli-tool'],
    entry_point: 'ECC/install.sh',
    native_cli: 'ecc-universal',
    supports_exact_resolution: true,
    search_depth: 3
  },
  'awesome-claude-code': {
    category: 'reference-rules',
    capabilities: ['reference-rules'],
    supports_exact_resolution: false
  },
  'awesome-claude-code-toolkit': {
    category: 'hybrid',
    capabilities: ['skill-library', 'reference-rules', 'mcp-server'],
    supports_exact_resolution: true,
    search_depth: 1
  },
  'awesome-claude-skills': {
    category: 'skill-library',
    capabilities: ['skill-library'],
    supports_exact_resolution: true,
    search_depth: 2
  },
  'claude-code-action': {
    category: 'ci-runner',
    capabilities: ['ci-runner'],
    supports_exact_resolution: false
  },
  'claude-code-best-practice': {
    category: 'reference-rules',
    capabilities: ['reference-rules'],
    supports_exact_resolution: false
  },
  'claude-code-mcp': {
    category: 'mcp-server',
    capabilities: ['mcp-server'],
    mcp_command: 'node',
    mcp_rel_path: 'claude-code-mcp/build/index.js',
    supports_exact_resolution: false
  },
  'claude-code-ultimate-guide': {
    category: 'hybrid',
    capabilities: ['skill-library', 'reference-rules'],
    supports_exact_resolution: true,
    search_depth: 3
  },
  'claude-context': {
    category: 'cli-tool',
    capabilities: ['cli-tool'],
    exec_command: 'npx claude-context',
    supports_exact_resolution: false
  },
  'claude-skills': {
    category: 'skill-library',
    capabilities: ['skill-library'],
    supports_exact_resolution: true,
    search_depth: 3
  },
  'github-mcp-server': {
    category: 'mcp-server',
    capabilities: ['mcp-server'],
    mcp_command: 'node',
    mcp_rel_path: 'github-mcp-server/dist/index.js',
    supports_exact_resolution: false
  },
  'superpowers': {
    category: 'workflow-engine',
    capabilities: ['workflow-engine', 'skill-library'],
    entry_point: 'superpowers/index.js',
    supports_exact_resolution: true,
    search_depth: 1
  },
  'custom': {
    rel_path: 'my-custom-skills',
    category: 'skill-library',
    capabilities: ['skill-library'],
    supports_exact_resolution: true,
    search_depth: 2
  },
  'workspace-rules': {
    rel_path: 'maniadav-agent-workspace',
    category: 'reference-rules',
    capabilities: ['reference-rules'],
    supports_exact_resolution: true
  }
};

function indexSkills(sourceDir, maxDepth = 2, currentDepth = 0) {
  let skills = [];
  if (!fs.existsSync(sourceDir) || currentDepth > maxDepth) return skills;

  try {
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const fullPath = path.join(sourceDir, entry.name);
      if (entry.isDirectory()) {
        const skillFile = path.join(fullPath, 'SKILL.md');
        if (fs.existsSync(skillFile)) {
          const basename = entry.name;
          skills.push({
            name: basename,
            path: fullPath,
            skill_file: skillFile
          });
        }
        skills = skills.concat(indexSkills(fullPath, maxDepth, currentDepth + 1));
      }
    }
  } catch (err) {
    // Ignore read errors
  }
  return skills;
}

function generateRegistry(toolkitRoot) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  const registry = {
    version: '1.0.0',
    updated_at: new Date().toISOString(),
    toolkit_root: toolkitRoot,
    sources: {}
  };

  for (const [alias, meta] of Object.entries(SOURCE_METADATA)) {
    const folderName = meta.rel_path || alias;
    const absPath = path.join(toolkitRoot, folderName);
    const isPresent = fs.existsSync(absPath);

    let skillIndex = [];
    if (isPresent && meta.supports_exact_resolution && meta.capabilities.includes('skill-library')) {
      const searchDepth = meta.search_depth || 2;
      skillIndex = indexSkills(absPath, searchDepth);
    }

    registry.sources[alias] = {
      alias: alias,
      path: absPath,
      exists: isPresent,
      category: meta.category,
      capabilities: meta.capabilities,
      supports_exact_resolution: meta.supports_exact_resolution,
      entry_point: meta.entry_point ? path.join(toolkitRoot, meta.entry_point) : null,
      mcp_command: meta.mcp_command || null,
      mcp_path: meta.mcp_rel_path ? path.join(toolkitRoot, meta.mcp_rel_path) : null,
      exec_command: meta.exec_command || null,
      skills: skillIndex
    };
  }

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf8');
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ toolkit_root: toolkitRoot, last_updated: new Date().toISOString() }, null, 2), 'utf8');
  return registry;
}

function loadRegistry() {
  if (fs.existsSync(REGISTRY_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    } catch (e) {
      return null;
    }
  }
  return null;
}

module.exports = {
  CONFIG_DIR,
  REGISTRY_PATH,
  CONFIG_FILE,
  generateRegistry,
  loadRegistry
};
