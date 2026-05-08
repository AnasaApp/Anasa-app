#!/bin/bash

# Android 15 (16KB Page Size) Migration Setup Script
# This script automates the dependency cleaning and build process

set -e

echo "================================"
echo "Android 15 Migration Setup"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean dependencies
echo "${YELLOW}[Step 1/5] Cleaning node_modules and package locks...${NC}"
rm -rf node_modules package-lock.json yarn.lock
echo "${GREEN}✓ Dependencies cleaned${NC}"
echo ""

# Step 2: Install fresh dependencies
echo "${YELLOW}[Step 2/5] Installing fresh dependencies...${NC}"
if command -v yarn &> /dev/null; then
    echo "Using Yarn..."
    yarn install
else
    echo "Using npm..."
    npm install
fi
echo "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Clean Android build
echo "${YELLOW}[Step 3/5] Cleaning Android build...${NC}"
cd android
./gradlew clean
cd ..
echo "${GREEN}✓ Android build cleaned${NC}"
echo ""

# Step 4: Update iOS pods (if applicable)
if [ -d "ios" ]; then
    echo "${YELLOW}[Step 4/5] Updating iOS pods...${NC}"
    cd ios
    rm -rf Pods Podfile.lock
    pod install
    cd ..
    echo "${GREEN}✓ iOS pods updated${NC}"
else
    echo "${YELLOW}[Step 4/5] Skipping iOS (not detected)${NC}"
fi
echo ""

# Step 5: Clear Metro cache
echo "${YELLOW}[Step 5/5] Clearing Metro cache...${NC}"
npx react-native start --reset-cache &
METRO_PID=$!
sleep 5
kill $METRO_PID 2>/dev/null || true
echo "${GREEN}✓ Metro cache cleared${NC}"
echo ""

echo "${GREEN}================================${NC}"
echo "${GREEN}✓ Migration setup complete!${NC}"
echo "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Run: npx react-native start --reset-cache"
echo "  2. Run: npx react-native run-android"
echo ""
echo "For more details, see ANDROID_15_MIGRATION.md"
