const fs = require('fs');
const path = require('path');
const os = require('os');

function updateMcpConfig(serverName, command, args, envVars = {}) {
  const mcpConfigPath = path.join(os.homedir(), '.gemini', 'config', 'mcp_config.json');
  let config = { mcpServers: {} };

  if (fs.existsSync(mcpConfigPath)) {
    try {
      config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      if (!config.mcpServers) config.mcpServers = {};
    } catch (e) {
      config = { mcpServers: {} };
    }
  }

  config.mcpServers[serverName] = {
    command: command,
    args: args,
    env: envVars
  };

  const dir = path.dirname(mcpConfigPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(mcpConfigPath, JSON.stringify(config, null, 2), 'utf8');
  return mcpConfigPath;
}

module.exports = {
  updateMcpConfig
};
