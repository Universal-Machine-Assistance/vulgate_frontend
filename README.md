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
- **Audio Playbook**: Play recorded audio for verses
- **Verse Relationships**: Find other occurrences of words across the Bible
- **Book Navigation**: Easy navigation between books, chapters, and verses
- **Caching System**: Local storage caching for improved performance
- **Neubrutalist UI**: Bold, modern design with high contrast and clear typography

### 🎮 Navigation
- **Arrow Keys**: Left (←) and Right (→) for previous/next verse navigation
- **Up/Down Arrow Keys**: Navigate between chapters within the current book
- **Shift + Left/Right**: Cycle through available translation languages
- **Shift + Up/Down**: Navigate between books (previous/next book)
- **Audio Controls**: R to record, P to play/pause, G to analyze with AI
- **Dropdown Menus**: Select specific books, chapters, and verses
- **Navigation Buttons**: Click previous/next buttons with animated transitions
- **Smart Input Detection**: Keyboard shortcuts disabled when typing in inputs

### 🎨 Visual Features
- **Color-Coded Grammar**: Different parts of speech have distinct colors
- **Hover Effects**: Interactive word highlighting and information previews
- **Animation States**: Smooth transitions prevent flickering during navigation
- **Responsive Design**: Works across different screen sizes
- **Loading States**: Clear feedback during analysis and data loading

## 📦 Dependency Management

This project uses a specialized dependency management system for core Latin/Vulgate-related libraries. These dependencies are critical for theological accuracy and Latin text processing.

### Core Latin Dependencies

We track these separately from standard npm packages because they:
- Require careful validation for theological accuracy
- May not follow standard semver versioning
- Need manual testing for Latin text correctness
- Are critical to core functionality

#### Current Core Dependencies
- `universal-machine-assistance-vulgate`: Specialized Vulgate text processing and analysis

### Managing Dependencies

```bash
# Check for updates to core Latin dependencies
npm run check-latin-updates

# Update all core Latin dependencies
npm run update-latin-deps

# Install a specific version
npm install git+https://github.com/universal-machine-assistance/vulgate.git#v1.2.0
```

### Automated Monitoring

- **GitHub Actions**: Weekly automated checks for dependency updates
- **Issue Creation**: Automatic GitHub issues created when updates are available
- **Release Tracking**: Monitoring of releases and commits for each core dependency

📖 **[Full Dependency Management Documentation](docs/DEPENDENCY_MANAGEMENT.md)**

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

# Check dependency health
npm run check-latin-updates
```

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: FontAwesome
- **Audio**: Web Audio API
- **State Management**: React Hooks
- **Build Tool**: Create React App
- **Styling**: Tailwind CSS with custom animations
- **Dependency Management**: Custom tracking for Latin/theological libraries

## 📁 Project Structure

```
vulgate_frontend/
├── src/
│   ├── App.tsx              # Main application component
│   ├── components/          # React components (if separated)
│   └── assets/             # Audio files and static assets
├── docs/
│   └── DEPENDENCY_MANAGEMENT.md  # Dependency management documentation
├── .github/
│   └── workflows/
│       └── check-dependencies.yml  # Automated dependency checking
├── package.json            # Dependencies and core Latin dependencies
└── README.md
```

## 🔧 Development Workflow

### Working with Dependencies
1. **Before Updates**: Always check `docs/DEPENDENCY_MANAGEMENT.md`
2. **Testing**: Verify Latin text accuracy after dependency updates
3. **Documentation**: Update tracking table when dependencies change
4. **Monitoring**: GitHub Actions will alert you to new updates weekly

### Key Commands
- `npm start` - Development server
- `npm run check-latin-updates` - Check for core dependency updates
- `npm run update-latin-deps` - Update all core Latin dependencies

## 📝 Notes

This is a frontend-only application that requires a compatible backend API for full functionality. The app assumes the API is running on `http://127.0.0.1:8000/api/v1`.

### Critical Dependencies
Our core Latin dependencies are essential for:
- Accurate Latin text processing
- Theological interpretation accuracy  
- Proper Vulgate formatting and display
- Integration with specialized Latin dictionaries

---

*"In principio erat Verbum"* - Building tools to explore the sacred texts with modern technology. 