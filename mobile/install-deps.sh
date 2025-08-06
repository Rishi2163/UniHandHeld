#!/bin/bash
echo "Installing mobile app dependencies..."
cd /home/runner/workspace/mobile

# Install dependencies with legacy peer deps flag
export NODE_OPTIONS="--max-old-space-size=4096"
npm install --legacy-peer-deps --no-audit --no-fund

echo "Installation complete!"