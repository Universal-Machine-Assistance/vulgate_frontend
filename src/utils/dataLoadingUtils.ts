import { API_BASE_URL } from '../constants/index';
import { Book, Verse, QueueItem } from '../types';

export interface DataLoadingUtils {
  loadBooks: () => Promise<Book[]>;
  loadChapters: (bookId: number) => Promise<number[]>;
  loadVerses: (bookAbbr: string, chapter: number) => Promise<Verse[]>;
  loadQueue: () => Promise<QueueItem[]>;
  checkOpenAIAvailability: () => Promise<boolean>;
  checkAudioAvailability: (bookAbbr: string, chapter: number, verse: number) => Promise<boolean>;
}

export const createDataLoadingUtils = (): DataLoadingUtils => {

  const loadBooks = async (): Promise<Book[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/`);
      if (response.ok) {
        const books: Book[] = await response.json();
        return books;
      } else {
        console.error('Failed to load books');
        return [];
      }
    } catch (error) {
      console.error('Error loading books:', error);
      return [];
    }
  };

  const loadChapters = async (bookId: number): Promise<number[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/chapters/`);
      if (response.ok) {
        const chaptersData = await response.json();
        return chaptersData.chapters || [];
      } else {
        console.error('Failed to load chapters');
        return [];
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
      return [];
    }
  };

  const loadVerses = async (bookAbbr: string, chapter: number): Promise<Verse[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/verses/${bookAbbr}/${chapter}/`);
      if (response.ok) {
        const versesData = await response.json();
        return versesData.verses || [];
      } else {
        console.error('Failed to load verses');
        return [];
      }
    } catch (error) {
      console.error('Error loading verses:', error);
      return [];
    }
  };

  const loadQueue = async (): Promise<QueueItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/queue/`);
      if (response.ok) {
        const queueData = await response.json();
        return queueData.queue || [];
      } else {
        console.error('Failed to load queue');
        return [];
      }
    } catch (error) {
      console.error('Error loading queue:', error);
      return [];
    }
  };

  const checkOpenAIAvailability = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/openai-status/`);
      if (response.ok) {
        const data = await response.json();
        return data.available || false;
      } else {
        console.warn('OpenAI status check failed');
        return false;
      }
    } catch (error) {
      console.warn('Error checking OpenAI availability:', error);
      return false;
    }
  };

  const checkAudioAvailability = async (bookAbbr: string, chapter: number, verse: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/audio-check/${bookAbbr}/${chapter}/${verse}`);
      if (response.ok) {
        const data = await response.json();
        return data.available || false;
      } else {
        return false;
      }
    } catch (error) {
      console.warn('Error checking audio availability:', error);
      return false;
    }
  };

  return {
    loadBooks,
    loadChapters,
    loadVerses,
    loadQueue,
    checkOpenAIAvailability,
    checkAudioAvailability
  };
}; 