import { API_BASE_URL } from '../constants/index';
import { WordInfo } from '../types';

export const lookupWord = async (word: string): Promise<WordInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dictionary/lookup/${encodeURIComponent(word)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error looking up word:', error);
    return {
      latin: word,
      definition: 'Error looking up word',
      etymology: '',
      partOfSpeech: '',
      found: false
    };
  }
}; 