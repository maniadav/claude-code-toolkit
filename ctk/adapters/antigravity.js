const fs = require('fs');
const path = require('path');
const os = require('os');

function ensureSymlink(targetPath, linkPath) {
  try {
    if (fs.existsSync(linkPath) || fs.lstatSync(linkPath).isSymbolicLink()) {
      fs.rmSync(linkPath, { recursive: true, force: true });
    }
  } catch (err) {
    // Ignore error if link does not exist
  }
  fs.symlinkSync(targetPath, linkPath, 'dir');
}

function setupAntigravityAdapter(registry) {
  const geminiConfigDir = path.join(os.homedir(), '.gemini', 'config');
  const geminiSkillsDir = path.join(geminiConfigDir, 'skills');
  const geminiPluginsDir = path.join(geminiConfigDir, 'plugins');

  if (!fs.existsSync(geminiSkillsDir)) {
    fs.mkdirSync(geminiSkillsDir, { recursive: true });
  }
  if (!fs.existsSync(geminiPluginsDir)) {
    fs.mkdirSync(geminiPluginsDir, { recursive: true });
  }

  // 1. Link Gravitas skills
  const gravitasSkillsDir = path.join(registry.toolkit_root, 'Gravitas', 'skills');
  const linkedSkills = [];
  if (fs.existsSync(gravitasSkillsDir)) {
    const entries = fs.readdirSync(gravitasSkillsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const srcSkill = path.join(gravitasSkillsDir, entry.name);
        if (fs.existsSync(path.join(srcSkill, 'SKILL.md'))) {
          const destLink = path.join(geminiSkillsDir, entry.name);
          ensureSymlink(srcSkill, destLink);
          linkedSkills.push(entry.name);
        }
      }
    }
  }

  // 2. Link Gravitas native plugin
  const gravitasPluginDist = path.join(registry.toolkit_root, 'Gravitas', 'dist', 'gravitas-antigravity');
  let hasPlugin = false;
  if (fs.existsSync(gravitasPluginDist)) {
    const destPlugin = path.join(geminiPluginsDir, 'gravitas-native');
    ensureSymlink(gravitasPluginDist, destPlugin);
    hasPlugin = true;
  }

  // 3. Register CTK skill for Antigravity/Gemini
  const ctkSkillDir = path.join(geminiSkillsDir, 'ctk');
  if (!fs.existsSync(ctkSkillDir)) {
    fs.mkdirSync(ctkSkillDir, { recursive: true });
  }
  const ctkSkillMd = path.join(ctkSkillDir, 'SKILL.md');
  const ctkContent = `---
name: ctk
description: Claude Code Toolkit (CTK) CLI and Scoped Skill Orchestration System. Use to inspect, resolve, and activate skills across all toolkit submodules.
---

# CTK Orchestrator

Use the \`ctk\` CLI to inspect, resolve, and activate skills across all toolkits:

- \`ctk list\` - List all registered sources and skills
- \`ctk inspect @<source>\` - Inspect metadata and available skills
- \`ctk resolve @<source>/<skill>\` - Deterministically resolve an artifact path
- \`ctk activate @<source>\` - Activate native harness or workflow engine
`;
  fs.writeFileSync(ctkSkillMd, ctkContent, 'utf8');

  // 4. Update CTK metadata
  const ctkMeta = path.join(geminiSkillsDir, 'ctk-registry.json');
  fs.writeFileSync(ctkMeta, JSON.stringify({
    note: 'CTK Global Antigravity Adapter Active',
    root: registry.toolkit_root,
    linked_skills: linkedSkills,
    has_native_plugin: hasPlugin,
    updated_at: new Date().toISOString()
  }, null, 2), 'utf8');

  return { geminiSkillsDir, geminiPluginsDir, linkedSkills, hasPlugin };
}

function removeAntigravityAdapter() {
  const geminiConfigDir = path.join(os.homedir(), '.gemini', 'config');
  const geminiSkillsDir = path.join(geminiConfigDir, 'skills');
  const geminiPluginsDir = path.join(geminiConfigDir, 'plugins');

  const skillsToRemove = ['gravitas', 'gravitas-highstakes', 'gravitas-python', 'gravitas-typescript', 'ctk'];
  for (const s of skillsToRemove) {
    const p = path.join(geminiSkillsDir, s);
    try {
      if (fs.existsSync(p) || fs.lstatSync(p).isSymbolicLink()) {
        fs.rmSync(p, { recursive: true, force: true });
      }
    } catch (e) {}
  }

  const pluginPath = path.join(geminiPluginsDir, 'gravitas-native');
  try {
    if (fs.existsSync(pluginPath) || fs.lstatSync(pluginPath).isSymbolicLink()) {
      fs.rmSync(pluginPath, { recursive: true, force: true });
    }
  } catch (e) {}

  const ctkMeta = path.join(geminiSkillsDir, 'ctk-registry.json');
  if (fs.existsSync(ctkMeta)) fs.unlinkSync(ctkMeta);
}

module.exports = {
  setupAntigravityAdapter,
  removeAntigravityAdapter
};
