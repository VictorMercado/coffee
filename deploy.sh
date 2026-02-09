#!/bin/bash

# Orbit Coffee Deploy Script
# Usage: ./deploy.sh [--no-cache]

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Orbit Coffee deployment...${NC}"

# Navigate to project directory (script location)
cd "$(dirname "$0")"

# Step 1: Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes from git...${NC}"
git pull --rebase origin main

# Step 2: Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose down

# Step 3: Clear Docker cache if --no-cache flag is passed, or by default
if [[ "$1" == "--no-cache" ]] || [[ -z "$1" ]]; then
    echo -e "${YELLOW}🧹 Clearing Docker build cache...${NC}"
    docker builder prune -f
fi

# Step 4: Build and start containers
echo -e "${YELLOW}🔨 Building and starting containers...${NC}"
if [[ "$1" == "--no-cache" ]]; then
    docker compose up -d --build --no-cache
else
    docker compose up -d --build
fi

# Step 5: Show container status
echo -e "${YELLOW}📊 Container status:${NC}"
docker compose ps

# Step 6: Show recent logs
echo -e "${YELLOW}📋 Recent logs:${NC}"
docker compose logs --tail=20

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "View full logs with: ${YELLOW}docker compose logs -f${NC}"
