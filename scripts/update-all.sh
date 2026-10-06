#!/usr/bin/env bash
set -e

echo "🔄 Updating all submodules from upstream remotes..."
git submodule update --init --recursive --remote --merge
echo "✅ All 13 repositories updated successfully!"
