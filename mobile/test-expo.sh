#!/bin/bash
echo "🚀 Testing Expo Mobile App Setup..."
echo ""

cd /home/runner/workspace/mobile

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Dependencies not found - run ./install-deps.sh first"
    exit 1
fi

# Check if Expo CLI is available
if command -v npx &> /dev/null; then
    echo "✅ npx available for Expo commands"
else
    echo "❌ npx not found"
fi

# Check if expo command works
npx expo --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Expo CLI working correctly"
    echo "   Version: $(npx expo --version)"
else
    echo "❌ Expo CLI not working"
fi

echo ""
echo "🎯 Ready to start mobile app!"
echo ""
echo "Run these commands to test:"
echo "  cd mobile"  
echo "  npm start"
echo ""
echo "Then scan the QR code with Expo Go on your phone"