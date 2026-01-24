#!/bin/bash
# BlackRoad OS Git Hooks Setup Script
# Configures Git to use hooks from .githooks/ directory

set -e

echo "🔧 Setting up BlackRoad OS Git Hooks..."
echo ""

# Get repository root
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"

if [ -z "$REPO_ROOT" ]; then
    echo "❌ Error: Not in a Git repository"
    exit 1
fi

cd "$REPO_ROOT"

# Configure Git to use .githooks directory
echo "📝 Configuring Git to use .githooks/ directory..."
git config core.hooksPath .githooks

echo "✅ Git hooks configured!"
echo ""

# Make all hooks executable
echo "🔒 Making hooks executable..."
chmod +x .githooks/pre-commit

echo "✅ Hooks are executable!"
echo ""

# Test validation script
echo "🧪 Testing validation script..."
if python3 scripts/validate_deployment_config.py > /dev/null 2>&1; then
    echo "✅ Validation script works!"
else
    echo "⚠️  Validation script has warnings (this is OK)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Git hooks setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Active hooks:"
echo "  • pre-commit: Validates deployment configuration"
echo ""
echo "To bypass a hook (use sparingly):"
echo "  git commit --no-verify"
echo ""
echo "To disable hooks:"
echo "  git config --unset core.hooksPath"
echo ""
