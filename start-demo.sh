#!/bin/bash

echo "🚀 Starting MyStock AI Demo..."
echo ""

# Check if we're in the right directory
if [ ! -f "demo.html" ]; then
    echo "❌ Error: demo.html not found"
    echo "Please run this script from the MyStockAIApp directory"
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python3 not found"
    echo "Please install Python3 to run the demo"
    exit 1
fi

# Find an available port
PORT=3001
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; do
    PORT=$((PORT + 1))
done

echo "✅ Starting web server on port $PORT..."
echo ""
echo "🌐 Demo will be available at:"
echo "   http://localhost:$PORT/demo.html"
echo ""
echo "📱 Features to test:"
echo "   • Click 'Scan Invoice' → Camera screen"
echo "   • Click 'Select Image' → Review screen"
echo "   • Fill in the form → Validate and save"
echo "   • Click 'View Inventory' → Inventory screen"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
python3 -m http.server $PORT
