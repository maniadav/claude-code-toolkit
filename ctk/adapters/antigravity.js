const fs = require('fs');
const path = require('path');
const os = require('os');

function setupAntigravityAdapter(registry) {
  const geminiSkillsDir = path.join(os.homedir(), '.gemini', 'config', 'skills');
  if (!fs.existsSync(geminiSkillsDir)) {
    fs.mkdirSync(geminiSkillsDir, { recursive: true });
  }
  const ctkMeta = path.join(geminiSkillsDir, 'ctk-registry.json');
  fs.writeFileSync(ctkMeta, JSON.stringify({ note: 'CTK Global Antigravity Adapter Active', root: registry.toolkit_root }, null, 2), 'utf8');
  return geminiSkillsDir;
}

module.exports = {
  setupAntigravityAdapter
};
