const { loadRegistry } = require('./registry');

function resolveQuery(queryStr, registryOverride = null) {
  const registry = registryOverride || loadRegistry();
  if (!registry) {
    return {
      status: 'error',
      message: 'Registry not found. Run "ctk install" or "ctk reindex" first.'
    };
  }

  let raw = queryStr.trim();
  if (raw.startsWith('@')) raw = raw.slice(1);

  const parts = raw.split('/');
  const sourceAlias = parts[0];
  const artifactName = parts.slice(1).join('/');

  const source = registry.sources[sourceAlias];
  if (!source) {
    return {
      status: 'error',
      code: 'UNKNOWN_NAMESPACE',
      message: `ERROR: Namespace '@${sourceAlias}' is not registered.\nRun 'ctk list' to view available namespaces.`
    };
  }

  if (!source.exists) {
    return {
      status: 'error',
      code: 'SOURCE_NOT_FOUND',
      message: `ERROR: Submodule path for '@${sourceAlias}' does not exist on disk at: ${source.path}`
    };
  }

  // 1. Source-only resolution (@ECC, @superpowers, @custom)
  if (!artifactName) {
    return {
      status: 'success',
      resolution_type: 'namespace',
      source: sourceAlias,
      category: source.category,
      capabilities: source.capabilities,
      path: source.path,
      entry_point: source.entry_point,
      exec_command: source.exec_command,
      mcp_command: source.mcp_command,
      mcp_path: source.mcp_path,
      skills_count: source.skills ? source.skills.length : 0
    };
  }

  // 2. Exact artifact resolution (@source/artifact)
  if (!source.supports_exact_resolution) {
    return {
      status: 'error',
      code: 'CAPABILITY_UNSUPPORTED',
      message: `ERROR: Namespace '@${sourceAlias}' is categorized as '${source.category}' and does not support individual skill artifact resolution.`
    };
  }

  const targetName = artifactName.toLowerCase();
  const matches = (source.skills || []).filter(s => {
    const sName = s.name.toLowerCase();
    const sRelPath = s.path.toLowerCase();
    return sName === targetName || sRelPath.endsWith('/' + targetName) || sRelPath.endsWith('/' + targetName + '/skill.md');
  });

  if (matches.length === 0) {
    return {
      status: 'error',
      code: 'ARTIFACT_NOT_FOUND',
      message: `ERROR: Artifact '${artifactName}' not found in namespace '@${sourceAlias}'.\nRun 'ctk inspect @${sourceAlias}' to view available artifacts.`
    };
  }

  if (matches.length > 1) {
    const candidates = matches.map((m, idx) => `  ${idx + 1}. ${m.skill_file}`).join('\n');
    return {
      status: 'error',
      code: 'AMBIGUOUS_ARTIFACT',
      message: `ERROR: Ambiguous artifact reference '@${sourceAlias}/${artifactName}'.\nMultiple candidate matches found:\n${candidates}\n\nPlease specify the full category relative path.`
    };
  }

  const match = matches[0];
  return {
    status: 'success',
    resolution_type: 'artifact',
    source: sourceAlias,
    artifact: artifactName,
    name: match.name,
    path: match.path,
    skill_file: match.skill_file
  };
}

module.exports = {
  resolveQuery
};
