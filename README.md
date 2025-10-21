# MyStock AI - Invoice Scanner & Inventory Manager

A React Native mobile application for AI-powered invoice scanning and inventory management with duplicate detection.

## 🎯 Project Overview

**MyStock AI** is a mobile app that allows users to:
- 📷 **Scan invoices** using camera with AI-powered duplicate detection
- 📝 **Review and validate** invoice details with smart field confirmation
- 📦 **Manage inventory** with real-time stock tracking and low-stock alerts
- 🔍 **Search products** by name or SKU with intelligent filtering

## 🚀 Quick Start (For Team Members)

### **Option 1: Web Demo (Recommended for Testing)**
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd MyStockAIApp

# 2. Start the web demo (no npm install needed!)
python3 -m http.server 3001

# 3. Open in browser
# Go to: http://localhost:3001/demo.html
```

### **Option 2: React Native Development**
```bash
# 1. Install dependencies
npm install

# 2. Start Metro bundler
npm start

# 3. Run on device (in separate terminal)
npm run android    # For Android
npm run ios        # For iOS (Mac only)
```

## 📱 Demo Features

The web demo (`demo.html`) shows the complete app functionality:

### **Screens:**
1. **Home Screen** - Main dashboard with scan and inventory buttons
2. **Camera Screen** - File upload interface with visual scan area
3. **Review Screen** - Form with duplicate detection alerts
4. **Inventory Screen** - Product list with search functionality

### **Key Features:**
- ✅ **Navigation** between all 4 screens
- ✅ **Duplicate Detection** (30% chance demo)
- ✅ **Form Validation** with field confirmation
- ✅ **File Upload** simulation
- ✅ **Search Functionality** in inventory
- ✅ **Responsive Design** for mobile/desktop

## 🛠 Development Setup

### **Prerequisites:**
- Node.js 18+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)

### **Installation:**
```bash
# Install dependencies
npm install

# For iOS (Mac only)
cd ios && pod install && cd ..
```

### **Running the App:**
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

## 📁 Project Structure

```
MyStockAIApp/
├── src/
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── ReviewScreen.tsx
│   │   └── InventoryScreen.tsx
│   ├── services/          # API services
│   │   └── api.ts
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── imageUtils.ts
│   └── App.tsx            # Main app component
├── demo.html              # Web demo (for testing)
├── package.json           # Dependencies
└── README.md             # This file
```

## 🎨 UI/UX Features

### **Design System:**
- **Primary Color:** #007AFF (Blue)
- **Success Color:** #34C759 (Green)
- **Warning Color:** #FF3B30 (Red)
- **Background:** #F5F5F5 (Light Gray)

### **Components:**
- Modern, clean interface
- Touch-friendly buttons
- Loading states and animations
- Error handling with user feedback
- Responsive design for all screen sizes

## 🔧 API Integration

The app expects a backend API with these endpoints:

```typescript
POST /invoices/upload     // Upload image + duplicate check
POST /invoices/validate   // Validate invoice fields
POST /invoices/save       // Save invoice + update inventory
GET  /inventory          // Get inventory list
GET  /invoices/recent    // Get recent invoices
```

## 🚀 Deployment

### **For Web Demo:**
```bash
# Just run the HTTP server
python3 -m http.server 3001
# Access at: http://localhost:3001/demo.html
```

### **For Mobile:**
```bash
# Build for Android
npm run android

# Build for iOS (Mac only)
npm run ios
```

## 👥 Team Collaboration

### **For Frontend Developers:**
- Use `demo.html` to test UI/UX changes
- Modify React Native components in `src/screens/`
- Test navigation and user flows

### **For Backend Developers:**
- Implement API endpoints listed above
- Test with demo data initially
- Integrate with NVIDIA NIM for AI features

### **For Full-Stack Developers:**
- Use `demo.html` as reference for frontend
- Implement backend API endpoints
- Test end-to-end functionality

## 📋 Next Steps

1. **Test the demo** - Use `demo.html` to understand the app flow
2. **Plan backend API** - Design endpoints for invoice processing
3. **Set up AI integration** - NVIDIA NIM for duplicate detection
4. **Mobile development** - Fix React Native dependencies when ready

## 🐛 Troubleshooting

### **React Native Issues:**
If `npm start` fails with dependency errors:
- Use the web demo instead: `python3 -m http.server 3001`
- Access demo at: http://localhost:3001/demo.html

### **Web Demo Issues:**
If demo doesn't load:
- Check if port 3001 is available
- Try a different port: `python3 -m http.server 3002`

## 📞 Support

For questions or issues:
1. Check this README first
2. Test with the web demo
3. Review the project structure
4. Contact the development team

---

**Happy coding! 🚀**