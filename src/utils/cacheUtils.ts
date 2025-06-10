import { VerseAnalysis, GrammarItem, VerseAnalysisState } from '../types';
import { normalizeLatin } from './grammarUtils';

export interface CacheUtils {
  loadFromCache: (verseRef: string) => VerseAnalysisState | null;
  saveToCache: (verseRef: string, analysisResult: any) => void;
  clearCache: (verseRef?: string) => void;
}

export const createCacheUtils = (): CacheUtils => {

  const loadFromCache = (verseRef: string): VerseAnalysisState | null => {
    const cacheKey = `verse_analysis_${verseRef}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) return null;
    
    try {
      const analysisResult = JSON.parse(cachedData);
      console.log(`Loading ${verseRef} from localStorage cache`);
      
      // Process cached data
      const newAnalysis: VerseAnalysis = {};
      const newGrammarBreakdown: GrammarItem[] = [];

      if (analysisResult.word_analysis && Array.isArray(analysisResult.word_analysis)) {
        analysisResult.word_analysis.forEach((item: any) => {
          newAnalysis[normalizeLatin(item.latin)] = {
            latin: item.latin,
            definition: item.definition,
            etymology: item.etymology,
            partOfSpeech: item.part_of_speech,
            morphology: item.morphology,
            pronunciation: item.pronunciation,
            source: 'localStorage_cache',
            confidence: 1.0,
            found: true
          };

          newGrammarBreakdown.push({
            word: item.latin,
            meaning: item.definition,
            part_of_speech: item.part_of_speech,
            grammar_description: item.grammar_description,
            morphology: item.morphology
          });
        });
      }
      
      // Return state object
      return {
        analysis: newAnalysis,
        grammarBreakdown: newGrammarBreakdown,
        selectedWordIndex: null,
        wordInfo: null,
        isAnalysisDone: true,
        translations: analysisResult.translations || {},
        theological_layer: analysisResult.theological_layer || [],
        symbolic_layer: analysisResult.symbolic_layer || [],
        cosmological_layer: analysisResult.cosmological_layer || [],
        isLoading: false,
        loadingMessage: ''
      };
      
    } catch (error) {
      console.warn('Failed to load from localStorage cache, removing corrupted data:', error);
      localStorage.removeItem(cacheKey);
      return null;
    }
  };

  const saveToCache = (verseRef: string, analysisResult: any): void => {
    const cacheKey = `verse_analysis_${verseRef}`;
    try {
      localStorage.setItem(cacheKey, JSON.stringify(analysisResult));
      console.log(`Cached analysis for ${verseRef}`);
    } catch (error) {
      console.warn('Failed to save to cache:', error);
    }
  };

  const clearCache = (verseRef?: string): void => {
    if (verseRef) {
      const cacheKey = `verse_analysis_${verseRef}`;
      localStorage.removeItem(cacheKey);
      console.log(`Cleared cache for ${verseRef}`);
    } else {
      // Clear all verse analysis cache
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('verse_analysis_')) {
          localStorage.removeItem(key);
        }
      });
      console.log('Cleared all verse analysis cache');
    }
  };

  const buildTheologicalInterpretation = (analysisResult: any): string => {
    let interpretation = '';
    if (analysisResult.theological_layer && Array.isArray(analysisResult.theological_layer)) {
      interpretation += '🕊️ Theological Layer (cached):\n' + analysisResult.theological_layer.join('\n') + '\n\n';
    }
    if (analysisResult.symbolic_layer && Array.isArray(analysisResult.symbolic_layer)) {
      interpretation += '🧠 Symbolic Layer (Jungian & Campbell):\n' + analysisResult.symbolic_layer.join('\n') + '\n\n';
    }
    if (analysisResult.cosmological_layer && Array.isArray(analysisResult.cosmological_layer)) {
      interpretation += '🌌 Cosmological Layer:\n' + analysisResult.cosmological_layer.join('\n');
    }
    
    return (interpretation || 'Analysis complete.') + ' ✅ Loaded from cache';
  };

  return {
    loadFromCache,
    saveToCache,
    clearCache
  };
}; 