const fs = require('fs');
const path = require('path');
const os = require('os');

function setupClaudeAdapter(registry) {
  const claudeSkillsDir = path.join(os.homedir(), '.claude', 'skills');
  if (!fs.existsSync(claudeSkillsDir)) {
    fs.mkdirSync(claudeSkillsDir, { recursive: true });
  }
  const ctkLink = path.join(claudeSkillsDir, 'ctk-registry.json');
  fs.writeFileSync(ctkLink, JSON.stringify({ note: 'CTK Global Claude Adapter Active', root: registry.toolkit_root }, null, 2), 'utf8');
  return claudeSkillsDir;
}

module.exports = {
  setupClaudeAdapter
};
