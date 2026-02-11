#!/bin/bash
# Orbit Coffee Deploy Script
# Usage: ./deploy.sh [--no-cache]

set -e

# Ensure we have the full path for binaries (helps with Webhook environments)
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Get the absolute path to the directory where this script lives
PARENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
cd "$PARENT_PATH"

# 2. Export the variables from .env manually just in case
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo -e "${GREEN}🚀 Starting Orbit Coffee deployment in $PARENT_PATH...${NC}"

echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
git pull --rebase origin main

echo -e "${YELLOW}🔨 Building and starting containers...${NC}"
# Removed 'down' to prevent downtime during build
if [[ "$1" == "--no-cache" ]]; then
    docker compose up -d --build --no-cache --remove-orphans
else
    docker compose up -d --build --remove-orphans
fi

# Step 5: Cleanup - This is crucial for your disk space
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -f

# Log deployment timestamp
echo "$(date)" >> /etc/webhook_timestamp.log

echo -e "${GREEN}✅ Deployment complete!${NC}"
docker compose ps

# Step 6: Show recent logs
echo -e "${YELLOW}📋 Recent logs:${NC}"
docker compose logs --tail=20

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "View full logs with: ${YELLOW}docker compose logs -f${NC}"
