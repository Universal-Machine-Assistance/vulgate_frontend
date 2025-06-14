# Source Switching Test Guide

## Testing the Clementine Bible ↔ Bhagavad Gita Interface

### ✅ Visual Interface Check

1. **Open your application**: http://localhost:3000
2. **Check the header**: Should display:
   - Icon: ✝️ (for Clementine Bible) or 🕉️ (for Bhagavad Gita)
   - Title: "CLEMENTINE BIBLE" or "BHAGAVAD GITA"
   - Subtitle: "Vulgata Clementina" or "भगवद्‌गीता"
   - **Source Dropdown**: On the right side with both options

### ✅ URL Pattern Tests

#### Test 1: Default/Legacy URLs (should work)
- Navigate to: `/Gn/1/1`
- **Expected**: Should show Genesis 1:1 from Clementine Bible
- **Verify**: URL should redirect to `/bible/Gn/1/1`

#### Test 2: Explicit Bible URLs
- Navigate to: `/bible/Gn/1/1`
- **Expected**: Should show Genesis 1:1 from Clementine Bible
- **Verify**: Header shows "CLEMENTINE BIBLE" and "Vulgata Clementina"

#### Test 3: Bhagavad Gita URLs
- Navigate to: `/gita/1/1`
- **Expected**: Should show Bhagavad Gita Chapter 1, Verse 1
- **Verify**: Header shows "BHAGAVAD GITA" and "भगवद्‌गीता"

### ✅ Source Switching Tests

#### Test 4: Switch from Bible to Gita
1. Start at `/bible/Gn/1/1`
2. Click the source dropdown
3. Select "🕉️ भगवद्‌गीता"
4. **Expected**: 
   - URL changes to `/gita/1/1/1`
   - Header updates to Gita
   - Book dropdown shows Gita chapters (1-18)
   - Verse content changes to Gita text

#### Test 5: Switch from Gita to Bible
1. Start at `/gita/1/1`
2. Click the source dropdown  
3. Select "✝️ Vulgata Clementina"
4. **Expected**:
   - URL changes to `/bible/Gn/1/1`
   - Header updates to Clementine Bible
   - Book dropdown shows Bible books
   - Verse content changes to Latin text

### ✅ Data Loading Tests

#### Test 6: Bible Data (Your Clementine Bible)
- Navigate to `/bible/Gn/1/1`
- **Verify**: Latin text loads correctly
- **Check**: All existing features work (audio, analysis, etc.)

#### Test 7: Gita Data (RapidAPI)
- Navigate to `/gita/1/1`
- **Verify**: Sanskrit/English text loads
- **Note**: Requires RapidAPI key in `.env` file

### 🚨 Common Issues to Check

1. **Missing API Key**: If Gita doesn't load, check `.env` file
2. **CORS Errors**: RapidAPI should handle CORS automatically
3. **Dropdown Width**: Should be wide enough for both options
4. **Source Colors**: Bible (blue), Gita (orange)
5. **Icon Display**: Both emojis should render correctly

### 🔧 Debugging Steps

If something doesn't work:

1. **Check Browser Console**: Look for error messages
2. **Check Network Tab**: Verify API calls are made correctly
3. **Verify Environment**: Make sure `.env` file exists with RapidAPI key
4. **Test API Key**: Try the RapidAPI endpoint directly in browser

### 📱 Mobile/Responsive Test

- Test on different screen sizes
- Verify dropdown is accessible on mobile
- Check that text remains readable

---

## Expected Behavior Summary

✅ **Clementine Bible** (your existing data):
- Uses your local backend API
- Shows Latin text (Vulgata Clementina)
- All existing features preserved
- Traditional book structure (Genesis, Exodus, etc.)

✅ **Bhagavad Gita** (RapidAPI):
- Uses external RapidAPI service
- Shows Sanskrit/transliterated text
- Same UI but different data source
- 18 chapters as "books"

✅ **Source Switching**:
- Seamless transition between sources
- URL updates correctly
- UI adapts to show appropriate content
- All features work with both sources 