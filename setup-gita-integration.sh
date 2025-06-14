#!/bin/bash

echo "🕉️ Setting up Bhagavad Gita Integration for Vulgate Frontend"
echo "============================================================"

echo "📝 Backend Integration Architecture:"
echo "   Frontend → Your Backend → RapidAPI"
echo "   (API key stays secure on backend)"
echo ""

echo "⚠️  Configure RapidAPI key in your BACKEND environment:"
echo "   1. Go to https://rapidapi.com/"
echo "   2. Subscribe to 'Bhagavad Gita' API"
echo "   3. Add to backend: RAPIDAPI_KEY=your_key_here"
echo "   4. Restart your backend server"

# Check dependencies
echo ""
echo "📦 Checking dependencies..."
if npm list react-router-dom > /dev/null 2>&1; then
    echo "✅ React Router installed"
else
    echo "❌ React Router missing - installing..."
    npm install react-router-dom@^6.0.0
fi

echo ""
echo "🚀 Setup Complete!"
echo ""
echo "To test the integration:"
echo "1. npm start"
echo "2. Open http://localhost:3000"
echo "3. Try these URLs:"
echo "   - /bible/Gn/1/1 (Clementine Bible)"
echo "   - /gita/1/1 (Bhagavad Gita)"
echo ""
echo "Use the source dropdown in the header to switch between texts."
echo ""
echo "For troubleshooting, see TEST_SOURCE_SWITCHING.md" 