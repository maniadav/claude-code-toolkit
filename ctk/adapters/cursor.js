const fs = require('fs');
const path = require('path');

function generateCursorRules(registry, targetDir) {
  const cursorRulesDir = path.join(targetDir, '.cursor', 'rules');
  if (!fs.existsSync(cursorRulesDir)) {
    fs.mkdirSync(cursorRulesDir, { recursive: true });
  }

  const mdcPath = path.join(cursorRulesDir, 'ctk-namespaces.mdc');
  let content = `---\ndescription: CTK Namespaces & Scoped Agent Rules\nglobs: "*"\n---\n\n# CTK Namespace Reference\n\n`;

  for (const [alias, source] of Object.entries(registry.sources)) {
    content += `- **@${alias}**: ${source.category} (${source.path})\n`;
  }

  fs.writeFileSync(mdcPath, content, 'utf8');
  return mdcPath;
}

module.exports = {
  generateCursorRules
};
