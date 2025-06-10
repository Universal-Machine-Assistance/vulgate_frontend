import { API_BASE_URL } from '../constants/index';
import { VerseAnalysis, GrammarItem, VerseAnalysisState } from '../types';
import { normalizeLatin } from './grammarUtils';

export interface AnalysisUtils {
  loadOpenAIAnalysis: () => Promise<void>;
  analyzeVerse: () => Promise<void>;
  ensureAllTranslationsAvailable: () => Promise<void>;
  translateVerse: (language: string) => Promise<void>;
  handleGrebAIDefinition: (word: string) => Promise<void>;
  loadCompleteAnalysis: () => Promise<void>;
}

export const createAnalysisUtils = (
  selectedBookAbbr: string,
  currentChapter: number,
  selectedVerse: { verse_number: number; text: string; macronized_text?: string } | null,
  setVerseAnalysisState: (updater: (prev: VerseAnalysisState) => VerseAnalysisState) => void,
  setTheologicalInterpretation: (interpretation: string) => void,
  setIsOpenAIAnalyzing: (analyzing: boolean) => void,
  setIsTranslating: (translating: boolean) => void,
  setAvailableTranslations: (translations: { [key: string]: string }) => void,
  setIsGeneratingTranslations: (generating: boolean) => void,
  checkAudioAvailability: () => Promise<void>
): AnalysisUtils => {

  const loadOpenAIAnalysis = async (): Promise<void> => {
    if (!selectedVerse) {
      return;
    }

    setIsOpenAIAnalyzing(true);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/openai-analysis/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const analysisResult = await response.json();
        
        // Process the analysis result
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
              source: 'openai',
              confidence: item.confidence || 0.9,
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

        setVerseAnalysisState(prev => ({
          ...prev,
          analysis: newAnalysis,
          grammarBreakdown: newGrammarBreakdown,
          isAnalysisDone: true,
          theological_layer: analysisResult.theological_layer || [],
          symbolic_layer: analysisResult.symbolic_layer || [],
          cosmological_layer: analysisResult.cosmological_layer || []
        }));

        // Update theological interpretation display
        let interpretation = '';
        if (analysisResult.theological_layer && Array.isArray(analysisResult.theological_layer)) {
          interpretation += '🕊️ Theological Layer:\n' + analysisResult.theological_layer.join('\n') + '\n\n';
        }
        if (analysisResult.symbolic_layer && Array.isArray(analysisResult.symbolic_layer)) {
          interpretation += '🧠 Symbolic Layer (Jungian & Campbell):\n' + analysisResult.symbolic_layer.join('\n') + '\n\n';
        }
        if (analysisResult.cosmological_layer && Array.isArray(analysisResult.cosmological_layer)) {
          interpretation += '🌌 Cosmological Layer:\n' + analysisResult.cosmological_layer.join('\n');
        }
        
        setTheologicalInterpretation(interpretation || 'Analysis complete.');

        // Cache the result
        const verseRef = `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`;
        const cacheKey = `verse_analysis_${verseRef}`;
        localStorage.setItem(cacheKey, JSON.stringify(analysisResult));
        
      } else {
        console.error('OpenAI analysis failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during OpenAI analysis:', error);
    } finally {
      setIsOpenAIAnalyzing(false);
    }
  };

  const analyzeVerse = async (): Promise<void> => {
    if (!selectedVerse) return;

    const verseRef = `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`;
    console.log(`Starting analysis for ${verseRef}`);

    setVerseAnalysisState(prev => ({
      ...prev,
      isLoading: true,
      loadingMessage: 'Starting verse analysis...'
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-verse/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book: selectedBookAbbr,
          chapter: currentChapter,
          verse: selectedVerse.verse_number,
          text: selectedVerse.macronized_text || selectedVerse.text
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const analysisResult = await response.json();
      console.log(`Analysis complete for ${verseRef}:`, analysisResult);

      // Process analysis result
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
            source: 'analysis',
            confidence: item.confidence || 0.8,
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

      setVerseAnalysisState(prev => ({
        ...prev,
        analysis: newAnalysis,
        grammarBreakdown: newGrammarBreakdown,
        isAnalysisDone: true,
        translations: analysisResult.translations || {},
        theological_layer: analysisResult.theological_layer || [],
        symbolic_layer: analysisResult.symbolic_layer || [],
        cosmological_layer: analysisResult.cosmological_layer || [],
        isLoading: false,
        loadingMessage: ''
      }));

      // Cache the result
      const cacheKey = `verse_analysis_${verseRef}`;
      localStorage.setItem(cacheKey, JSON.stringify(analysisResult));

    } catch (error) {
      console.error('Error analyzing verse:', error);
      setVerseAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        loadingMessage: 'Analysis failed'
      }));
    }
  };

  const ensureAllTranslationsAvailable = async (): Promise<void> => {
    if (!selectedVerse) return;

    const requiredLanguages = ['en', 'fr', 'es', 'pt', 'it'];
    const missingLanguages = requiredLanguages.filter(lang => 
      Object.keys({}).length === 0
    );

    if (missingLanguages.length === 0) return;

    setIsGeneratingTranslations(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/translate-verse/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book: selectedBookAbbr,
          chapter: currentChapter,
          verse: selectedVerse.verse_number,
          text: selectedVerse.macronized_text || selectedVerse.text,
          languages: missingLanguages
        }),
      });

      if (response.ok) {
        const translations = await response.json();
        setAvailableTranslations(translations);
        await checkAudioAvailability();
      }
    } catch (error) {
      console.error('Error generating translations:', error);
    } finally {
      setIsGeneratingTranslations(false);
    }
  };

  const translateVerse = async (language: string): Promise<void> => {
    if (!selectedVerse) return;

    setIsTranslating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/translate-verse/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book: selectedBookAbbr,
          chapter: currentChapter,
          verse: selectedVerse.verse_number,
          text: selectedVerse.macronized_text || selectedVerse.text,
          target_language: language
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setVerseAnalysisState(prev => ({
          ...prev,
          translations: {
            ...prev.translations,
            [language]: result.translation
          }
        }));
      }
    } catch (error) {
      console.error('Error translating verse:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGrebAIDefinition = async (word: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/greb-ai-definition/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Greb AI Definition:', result);
      }
    } catch (error) {
      console.error('Error getting Greb AI definition:', error);
    }
  };

  const loadCompleteAnalysis = async (): Promise<void> => {
    await analyzeVerse();
    await ensureAllTranslationsAvailable();
    await checkAudioAvailability();
  };

  return {
    loadOpenAIAnalysis,
    analyzeVerse,
    ensureAllTranslationsAvailable,
    translateVerse,
    handleGrebAIDefinition,
    loadCompleteAnalysis
  };
}; 