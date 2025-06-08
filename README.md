# Vulgate Frontend

A modern, interactive Latin Bible reader built with React and TypeScript, featuring advanced word analysis, grammatical breakdowns, and theological interpretations.

## 🌟 Features

### ✅ Currently Implemented
- **Interactive Verse Reading**: Click on any Latin word for detailed analysis
- **Keyboard Navigation**: Use left/right arrow keys to navigate between verses with smooth animations
- **Smooth Transitions**: Top-down sliding animations create a roller deck effect when changing verses
- **Word Analysis**: Comprehensive Latin word definitions, etymology, and grammatical information
- **Grammar Breakdown**: Color-coded parts of speech with interactive highlighting
- **AI-Enhanced Definitions**: Integration with Greb AI for enhanced word analysis
- **Multiple Translations**: Support for translations in various languages
- **Theological Layers**: AI-generated theological, symbolic, and cosmological interpretations
- **Audio Recording**: Record and upload verse pronunciations
- **Audio Playback**: Play recorded audio for verses
- **Verse Relationships**: Find other occurrences of words across the Bible
- **Book Navigation**: Easy navigation between books, chapters, and verses
- **Caching System**: Local storage caching for improved performance
- **Neubrutalist UI**: Bold, modern design with high contrast and clear typography

### 🎮 Navigation
- **Arrow Keys**: Left (←) and Right (→) for previous/next verse navigation
- **Dropdown Menus**: Select specific books, chapters, and verses
- **Navigation Buttons**: Click previous/next buttons with animated transitions
- **Smart Input Detection**: Keyboard shortcuts disabled when typing in inputs

### 🎨 Visual Features
- **Color-Coded Grammar**: Different parts of speech have distinct colors
- **Hover Effects**: Interactive word highlighting and information previews
- **Animation States**: Smooth transitions prevent flickering during navigation
- **Responsive Design**: Works across different screen sizes
- **Loading States**: Clear feedback during analysis and data loading

## ❌ Missing Features / TODO

### Backend Integration Issues
- **Queue Management**: Analysis queue component exists but isn't fully integrated
- **Edit Mode**: Global editing functionality is implemented but not connected to UI
- **History Tracking**: Analysis history component exists but isn't displayed
- **User Authentication**: No user login or session management
- **Persistent Settings**: User preferences aren't saved between sessions

### Advanced Features Not Yet Implemented
- **Search Functionality**: No full-text search across verses or books
- **Bookmarks/Favorites**: Can't save favorite verses or passages
- **Notes System**: No ability to add personal notes to verses
- **Export Features**: Can't export analysis or verses to PDF/other formats
- **Offline Mode**: No service worker or offline capability
- **Cross-References**: No automatic biblical cross-reference system
- **Commentary Integration**: No integration with traditional biblical commentaries
- **Study Tools**: No concordance, lexicon, or other study aids
- **Sharing Features**: Can't share specific verses or analyses
- **Print Optimization**: No print-friendly styling

### UI/UX Improvements Needed
- **Mobile Optimization**: Touch gestures for navigation on mobile devices
- **Dark Mode**: No dark theme option
- **Font Size Controls**: No ability to adjust text size
- **Accessibility**: Missing ARIA labels and screen reader support
- **Progress Tracking**: No indication of reading progress through books
- **Recently Viewed**: No history of recently accessed verses

### Technical Debt
- **Error Handling**: Incomplete error boundaries and user-friendly error messages
- **Performance**: Some unused state variables and components
- **Testing**: No unit tests or integration tests
- **Documentation**: Code comments and API documentation incomplete
- **Bundle Optimization**: Build warnings about unused variables

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: FontAwesome
- **Audio**: Web Audio API
- **State Management**: React Hooks
- **Build Tool**: Create React App
- **Styling**: Tailwind CSS with custom animations

## 📝 Notes

This is a frontend-only application that requires a compatible backend API for full functionality. The app assumes the API is running on `http://127.0.0.1:8000/api/v1`.

---

*"In principio erat Verbum"* - Building tools to explore the sacred texts with modern technology. 