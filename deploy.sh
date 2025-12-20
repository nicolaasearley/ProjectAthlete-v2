#!/bin/bash
set -e

echo ""
echo "🏋️  ProjectAthlete Deployment"
echo "=============================="
echo ""

# Navigate to project directory (works from anywhere)
cd "$(dirname "$0")"

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

