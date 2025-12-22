#!/bin/bash
set -e

echo ""
echo "🏋️  ProjectAthlete Deployment"
echo "=============================="
echo ""

# Navigate to project directory (works from anywhere)
cd "$(dirname "$0")"

# Load environment variables for Docker build args
if [ -f .env.local ]; then
    echo "📋 Loading environment from .env.local..."
    set -a
    source .env.local
    set +a
else
    echo "⚠️  Warning: .env.local not found. Build may fail."
    echo "   Create it with: cp .env.example .env.local"
fi

echo ""
echo "🧹 Cleaning up untracked files that may conflict..."
# Remove untracked files in public/ that are now tracked in git
git clean -fd public/ 2>/dev/null || true

echo ""
echo "📥 Pulling latest code from GitHub..."
git pull origin main

echo ""
echo "🔨 Building and starting containers..."
docker compose up -d --build

echo ""
echo "🧹 Cleaning up old images..."
docker image prune -f

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔍 Container status:"
docker compose ps
echo ""

