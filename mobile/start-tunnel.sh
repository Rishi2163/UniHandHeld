#!/bin/bash
echo "Starting Expo development server with tunneling..."
echo "This will create a public tunnel URL for testing on mobile devices"
echo ""

# Install @expo/ngrok if not present
npm list @expo/ngrok || npm install -g @expo/ngrok

# Start with tunnel
npx expo start --tunnel --clear