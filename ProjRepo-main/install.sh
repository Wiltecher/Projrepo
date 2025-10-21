#!/bin/bash

echo "🚀 Installing MyStock AI Mobile App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if React Native CLI is installed
if ! command -v react-native &> /dev/null; then
    echo "📱 Installing React Native CLI..."
    npm install -g react-native-cli
fi

echo "✅ React Native CLI ready"

# Create necessary directories
mkdir -p android/app/src/main/res/values
mkdir -p ios

echo "📁 Project structure created"

echo ""
echo "🎉 Installation complete!"
echo ""
echo "To run the app:"
echo "  npm start          # Start Metro bundler"
echo "  npm run android    # Run on Android"
echo "  npm run ios        # Run on iOS (macOS only)"
echo ""
echo "Note: This is a frontend-only implementation with demo data."
echo "Backend integration is required for full functionality."

