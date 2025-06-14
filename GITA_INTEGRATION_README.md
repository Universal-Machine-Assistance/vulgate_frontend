# Bhagavad Gita Integration for Vulgate Bible Application

## Overview

This document outlines the integration of the Bhagavad Gita from RapidAPI into the existing Vulgate Bible application while maintaining the same database structure and user interface.

## Architecture Decision

We implemented **Source-Based Routing** as the primary solution:

### URL Structure
- **Bible**: `/bible/gn/1/1` (Genesis 1:1)
- **Bhagavad Gita**: `/gita/1/1` (Chapter 1, Verse 1)
- **Backward Compatibility**: Legacy URLs like `/Gn/1/1` still work (defaults to Bible)

### Key Components

#### 1. Source Configuration (`src/constants.ts`)
```typescript
export const TEXT_SOURCES = {
  bible: {
    id: 'bible',
    name: 'Bible',
    displayName: 'Vulgata Clementina',
    apiBaseUrl: 'http://127.0.0.1:8000/api/v1',
    bookStructure: 'traditional',
    icon: '✝️'
  },
  gita: {
    id: 'gita',
    name: 'Bhagavad Gita',
    displayName: 'भगवद्‌गीता',
    apiBaseUrl: 'https://bhagavad-gita3.p.rapidapi.com',
    bookStructure: 'chapters_as_books',
    icon: '🕉️'
  }
};
```

#### 2. Data Service Abstraction (`src/utils/dataService.ts`)
- **BibleDataService**: Handles traditional Bible API calls
- **GitaDataService**: Transforms RapidAPI responses to match Bible interface
- **DataServiceFactory**: Creates appropriate service based on source

#### 3. Source Dropdown Component (`src/components/SourceDropdown.tsx`)
- Allows users to switch between Bible and Gita
- Maintains visual consistency with existing UI

## Setup Instructions

### 1. Backend Environment Configuration

Add your RapidAPI key to your **backend** environment (not frontend):

```bash
# In your backend .env file or environment variables
RAPIDAPI_KEY=your_rapidapi_key_here
```

No frontend configuration needed - the backend handles all API calls.

### 2. RapidAPI Setup

1. Sign up for RapidAPI at https://rapidapi.com/
2. Subscribe to the "Bhagavad Gita" API by Vamsi Krishna
3. Add your API key to backend environment: `RAPIDAPI_KEY=your_key_here`

### 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 4. Start Both Services

```bash
# Backend (Terminal 1)
python main.py

# Frontend (Terminal 2)  
npm start
```

## How It Works

### Data Flow
1. **URL Parsing**: App determines source from URL (bible/gita)
2. **Service Selection**: DataServiceFactory creates appropriate service
3. **API Calls**: Service handles API requests (local backend or RapidAPI)
4. **Data Transformation**: Gita data is transformed to match Bible interface
5. **UI Rendering**: Same components render both Bible and Gita content

### Database Schema Compatibility

The integration maintains the same database structure:

- **Books**: Gita chapters treated as "books" (1-18)
- **Chapters**: Each Gita "book" has one chapter
- **Verses**: Gita verses mapped to verse numbers

### Gita Chapter Mapping

```
Chapter 1: "Arjuna Vishada Yoga" (The Yoga of Arjuna's Dejection)
Chapter 2: "Sankhya Yoga" (The Yoga of Knowledge)
Chapter 3: "Karma Yoga" (The Yoga of Action)
...
Chapter 18: "Moksha Sanyasa Yoga" (The Yoga of Liberation)
```

## User Interface

### Source Selector
- Appears in the header
- Shows current source icon and name
- Allows switching between Bible and Gita
- Maintains visual consistency

### Navigation
- Same dropdowns and controls
- Book dropdown shows appropriate content (Bible books vs Gita chapters)
- Chapter/verse navigation works identically

### Features Preserved
- Audio recording
- Analysis tools
- Image management
- Keyboard shortcuts
- Translation features

## Benefits of This Approach

1. **Maintainability**: Single codebase for multiple sources
2. **Extensibility**: Easy to add more texts (Quran, Torah, etc.)
3. **User Experience**: Familiar interface for both texts
4. **SEO**: Clear, descriptive URLs
5. **Backward Compatibility**: Existing links still work

## Future Enhancements

### Additional Text Sources
The architecture supports adding more sacred texts:

```typescript
// Example: Adding Quran
quran: {
  id: 'quran',
  name: 'Quran',
  displayName: 'القرآن الكريم',
  apiBaseUrl: 'https://quran-api.com',
  bookStructure: 'chapters_as_books',
  icon: '☪️'
}
```

### Enhanced Features
- Parallel reading (Bible + Gita side by side)
- Cross-reference linking
- Comparative analysis tools
- Multi-language support for Gita

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure REACT_APP_RAPIDAPI_KEY is set correctly
2. **CORS Issues**: RapidAPI should handle CORS automatically
3. **Rate Limiting**: Be mindful of RapidAPI rate limits
4. **Network Timeouts**: Implement retry logic for API calls

### Development Tips

1. Use browser dev tools to inspect network requests
2. Check console for any TypeScript errors
3. Verify environment variables are loaded correctly
4. Test both sources thoroughly

## Support

For questions or issues:
1. Check the browser console for error messages
2. Verify API key and network connectivity
3. Ensure all dependencies are installed correctly
4. Test with different browsers if needed

---

*This integration maintains the integrity of the original Vulgate application while seamlessly adding Bhagavad Gita support.* 