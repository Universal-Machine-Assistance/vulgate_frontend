# Vulgate Frontend Changelog

## [Latest] - Image Interface Improvements

### ✨ Enhanced User Experience
- **Auto-open image upload**: When clicking the image button for verses with no images, the file picker now opens automatically instead of showing an empty interface first
- **Clean image display**: Images now show descriptive names or clean filenames instead of long UUID-prefixed names
- **Metadata toggle**: Added info icon (ℹ️) to show/hide detailed image metadata on demand
- **Passive upload interface**: Drag & drop text now appears more subtly and only emphasizes on hover
- **Drag & Drop Support**: Full drag and drop functionality for image uploads with visual feedback
- **Smart navigation**: Auto-upload only triggers on initial component load, not during verse navigation

### 🎨 Visual Improvements
- Image names are now truncated intelligently, preferring descriptions over filenames
- Metadata (file size, upload date, full filename) is hidden by default
- Upload area has improved hover states and less prominent instructional text
- Info toggle button provides easy access to full image details when needed

### 🔧 Technical Changes
- Added `showMetadata` state for controlling metadata visibility
- Added `autoOpenedUpload` flag to track auto-triggered upload dialogs
- Implemented `getImageDisplayName()` function for smart name formatting
- Enhanced upload area with better CSS transitions and hover effects
- Added file input ref for programmatic file picker triggering
- **Drag & Drop System**: Implemented comprehensive drag and drop with `isDragOver` state, drag event handlers, and visual feedback animations
- **Navigation fix**: Added `isInitialMount` flag to prevent auto-popup during verse switching

### 🚀 Backend API Status
- Backend server running successfully on port 8001
- Image upload/retrieval working correctly
- Full CRUD operations implemented for verse images
- Image serving and caching functioning properly

---

## Previous Features
- Full-width image display with 16:10 aspect ratio
- Navigation with previous/next arrows and thumbnail strip
- Enhanced full-screen modal with pan & zoom functionality
- Mobile-responsive design with touch gestures
- Complete image management (upload, delete, edit descriptions) 