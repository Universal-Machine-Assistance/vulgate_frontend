import { Book, Verse } from '../types';
import { TEXT_SOURCES } from '../constants';

export interface DataService {
  getBooks(): Promise<Book[]>;
  getChapters(bookAbbr: string): Promise<number[]>;
  getVerses(bookAbbr: string, chapter: number): Promise<Verse[]>;
}

class BibleDataService implements DataService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = TEXT_SOURCES.bible.apiBaseUrl;
  }

  async getBooks(): Promise<Book[]> {
    const response = await fetch(`${this.baseUrl}/books/`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }

  async getChapters(bookAbbr: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/books/abbr/${bookAbbr}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return Array.from({ length: data.chapter_count }, (_, i) => i + 1);
  }

  async getVerses(bookAbbr: string, chapter: number): Promise<Verse[]> {
    // Use new unified endpoint structure: /api/v1/texts/bible/{book}/{chapter}
    // This gets all verses for the chapter
    const response = await fetch(`${this.baseUrl}/texts/bible/${bookAbbr}/${chapter}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }
}

class GitaDataService implements DataService {
  private baseUrl: string;

  constructor() {
    // Use the same backend as Bible - backend will handle RapidAPI calls
    this.baseUrl = TEXT_SOURCES.bible.apiBaseUrl; // Use backend URL, not RapidAPI directly
  }

  async getBooks(): Promise<Book[]> {
    // For Gita, we have one "book" with identifier "a" that contains all 18 chapters
    return [{
      id: 1,
      name: "Bhagavad Gita",
      latin_name: "a", // Use "a" as the book identifier
      chapter_count: 18, // 18 chapters total
      created_at: new Date().toISOString()
    }];
  }

  async getChapters(bookAbbr: string): Promise<number[]> {
    // For Gita, return all 18 chapters since bookAbbr is always "a"
    return Array.from({ length: 18 }, (_, i) => i + 1);
  }

  async getVerses(bookAbbr: string, chapter: number): Promise<Verse[]> {
    try {
      // For Gita, bookAbbr should always be "a", and chapter is the actual Gita chapter (1-18)
      if (bookAbbr !== "a") {
        console.error(`Invalid Gita book identifier: ${bookAbbr} (should be "a")`);
        return [];
      }
      
      // Validate that we have a valid chapter number (1-18)
      if (chapter < 1 || chapter > 18) {
        console.error(`Invalid Gita chapter: ${chapter} (should be 1-18)`);
        return [];
      }
      
      console.log(`Fetching Gita Chapter ${chapter} verses from backend...`);
      
      // Use new unified endpoint structure: /api/v1/texts/gita/a/{chapter}
      // This gets all verses for the chapter
      const response = await fetch(`${this.baseUrl}/texts/gita/a/${chapter}`);

      if (!response.ok) {
        throw new Error(`Backend error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Gita Backend Response:', data);

      // Handle both direct verse array and wrapped response
      const verses = Array.isArray(data) ? data : (data.verses || data.results || []);
      
      if (Array.isArray(verses)) {
        return verses.map((verse: any) => {
          // Get the Sanskrit text and transliteration from backend response
          const sanskritText = verse.text || 'Text not available';
          const transliteration = verse.translation || verse.transliteration || '';
          
          // Use Sanskrit text as primary, transliteration as macronized_text
          let displayText = sanskritText;
          let macronizedText = transliteration || sanskritText;
          
          // Clean up the Sanskrit text - remove extra newlines and normalize spacing
          displayText = displayText.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
          macronizedText = macronizedText.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
          
          // Ensure proper spacing after Sanskrit punctuation
          displayText = displayText.replace(/([।॥])/g, '$1 ').replace(/\s+/g, ' ').trim();
          macronizedText = macronizedText.replace(/([।॥])/g, '$1 ').replace(/\s+/g, ' ').trim();
          
          return {
            verse_number: verse.verse_number || verse.verseNumber || verse.verse_id,
            text: displayText,
            macronized_text: macronizedText
          };
        });
      } else {
        console.warn('Unexpected backend response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching Gita verses from backend:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      return [];
    }
  }
}

export class DataServiceFactory {
  static create(source: string): DataService {
    switch (source) {
      case 'bible':
        return new BibleDataService();
      case 'gita':
        return new GitaDataService();
      default:
        return new BibleDataService(); // Default fallback
    }
  }
} 