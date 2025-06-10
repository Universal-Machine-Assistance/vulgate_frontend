import { useState, useCallback } from 'react';
import { VerseAnalysisState, EditState, GrammarItem } from '../types';
import { API_BASE_URL } from '../constants/index';

// Helper function to map grammar breakdown words to macronized versions from verse text
const mapGrammarBreakdownToMacronizedText = (grammarBreakdown: GrammarItem[], verseText: string): GrammarItem[] => {
  const verseWords = verseText.split(' ');
  
  return grammarBreakdown.map((item, index) => {
    // Get corresponding word from verse text by index
    const macronizedWord = verseWords[index];
    if (macronizedWord) {
      return {
        ...item,
        word: macronizedWord
      };
    }
    return item;
  });
};

export const useVerseAnalysis = () => {
  const [verseAnalysisState, setVerseAnalysisState] = useState<VerseAnalysisState>({
    analysis: {},
    grammarBreakdown: [],
    selectedWordIndex: null,
    wordInfo: null,
    isAnalysisDone: false,
    translations: {},
    theological_layer: [],
    symbolic_layer: [],
    cosmological_layer: []
  });

  const [editState, setEditState] = useState<EditState>({
    isEditing: false,
    editingWord: null,
    editMeaning: '',
    editGrammarDescription: '',
    editPartOfSpeech: '',
    editMorphology: ''
  });

  const [theologicalInterpretation, setTheologicalInterpretation] = useState<string | null>(null);
  const [isOpenAIAnalyzing, setIsOpenAIAnalyzing] = useState<boolean>(false);
  const [selectedTranslationLang, setSelectedTranslationLang] = useState<string>('latin');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [availableTranslations, setAvailableTranslations] = useState<{[key:string]:string}>({});
  const [isGeneratingTranslations, setIsGeneratingTranslations] = useState(false);

  const loadCompleteAnalysis = useCallback(async (selectedVerse: any, selectedBookAbbr: string, currentChapter: number) => {
    if (!selectedVerse) return;

    const verseRef = `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`;
    console.log(`Loading complete analysis for ${verseRef}`);

    setVerseAnalysisState(prev => ({
      ...prev,
      isLoading: true,
      loadingMessage: 'Loading analysis...',
      saveStatus: '',
      saveMessage: ''
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/verses/analysis/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}`);
      
      if (!response.ok) {
        throw new Error(`Analysis not found: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Analysis data received:', data);

      // Transform interpretations from backend format to frontend format
      let theological_layer: string[] = [];
      let symbolic_layer: string[] = [];
      let cosmological_layer: string[] = [];
      
      if (data.interpretations && Array.isArray(data.interpretations)) {
        data.interpretations.forEach((interpretation: any) => {
          if (interpretation.layer_type === 'theological') {
            theological_layer = interpretation.points || [];
          } else if (interpretation.layer_type === 'symbolic') {
            symbolic_layer = interpretation.points || [];
          } else if (interpretation.layer_type === 'cosmological') {
            cosmological_layer = interpretation.points || [];
          }
        });
      }

      // Transform grammar_breakdown to analysis format for word highlighting
      const newAnalysis: { [key: string]: any } = {};
      if (data.grammar_breakdown && Array.isArray(data.grammar_breakdown)) {
        data.grammar_breakdown.forEach((item: any) => {
          const normalizedWord = item.word.toLowerCase().replace(/[.,;:!?]/g, '');
          newAnalysis[normalizedWord] = {
            latin: item.word,
            definition: item.meaning,
            etymology: item.etymology || 'Etymology not available',
            partOfSpeech: item.part_of_speech,
            morphology: item.morphology,
            pronunciation: item.pronunciation || '',
            source: 'backend',
            confidence: item.confidence || 0.9,
            found: true
          };
        });
      }

      // Map grammar breakdown words to macronized versions from the verse text
      const enhancedGrammarBreakdown = data.grammar_breakdown ? 
        mapGrammarBreakdownToMacronizedText(data.grammar_breakdown, selectedVerse.macronized_text || selectedVerse.text) 
        : [];

      const firstWordNorm = enhancedGrammarBreakdown[0]?.word?.toLowerCase().replace(/[.,;:!?]/g, '') || '';
      const firstWordInfo = newAnalysis[firstWordNorm] || null;
      
      setVerseAnalysisState(prev => ({
        ...prev,
        analysis: newAnalysis,
        grammarBreakdown: enhancedGrammarBreakdown,
        translations: {
          latin: selectedVerse.macronized_text || selectedVerse.text,
          ...(data.translations || {})
        },
        theological_layer: theological_layer,
        symbolic_layer: symbolic_layer,
        cosmological_layer: cosmological_layer,
        isAnalysisDone: true,
        isLoading: false,
        loadingMessage: '',
        selectedWord: firstWordNorm,
        selectedWordIndex: 0,
        wordInfo: firstWordInfo
      }));

    } catch (error) {
      console.error('Error loading analysis:', error);
      setVerseAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        loadingMessage: '',
        saveStatus: 'error',
        saveMessage: 'Failed to load analysis. Please try again later.'
      }));
    }
  }, []);

  const analyzeVerse = useCallback(async (selectedVerse: any, selectedBookAbbr: string, currentChapter: number) => {
    if (!selectedVerse) return;

    const verseRef = `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`;
    console.log(`Starting analysis for ${verseRef}`);

    setVerseAnalysisState(prev => ({
      ...prev,
      isLoading: true,
      loadingMessage: 'Analyzing verse...',
      saveStatus: '',
      saveMessage: ''
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/verses/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book: selectedBookAbbr,
          chapter: currentChapter,
          verse: selectedVerse.verse_number,
          text: selectedVerse.text
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Analysis completed:', data);

      // Transform interpretations from backend format to frontend format
      let theological_layer: string[] = [];
      let symbolic_layer: string[] = [];
      let cosmological_layer: string[] = [];
      
      if (data.interpretations && Array.isArray(data.interpretations)) {
        data.interpretations.forEach((interpretation: any) => {
          if (interpretation.layer_type === 'theological') {
            theological_layer = interpretation.points || [];
          } else if (interpretation.layer_type === 'symbolic') {
            symbolic_layer = interpretation.points || [];
          } else if (interpretation.layer_type === 'cosmological') {
            cosmological_layer = interpretation.points || [];
          }
        });
      }

      // Transform grammar_breakdown to analysis format for word highlighting
      const newAnalysis: { [key: string]: any } = {};
      if (data.grammar_breakdown && Array.isArray(data.grammar_breakdown)) {
        data.grammar_breakdown.forEach((item: any) => {
          const normalizedWord = item.word.toLowerCase().replace(/[.,;:!?]/g, '');
          newAnalysis[normalizedWord] = {
            latin: item.word,
            definition: item.meaning,
            etymology: item.etymology || 'Etymology not available',
            partOfSpeech: item.part_of_speech,
            morphology: item.morphology,
            pronunciation: item.pronunciation || '',
            source: 'backend',
            confidence: item.confidence || 0.9,
            found: true
          };
        });
      }

      // Map grammar breakdown words to macronized versions from the verse text
      const enhancedGrammarBreakdown = data.grammar_breakdown ? 
        mapGrammarBreakdownToMacronizedText(data.grammar_breakdown, selectedVerse.macronized_text || selectedVerse.text) 
        : [];

      const firstWordNorm = enhancedGrammarBreakdown[0]?.word?.toLowerCase().replace(/[.,;:!?]/g, '') || '';
      const firstWordInfo = newAnalysis[firstWordNorm] || null;
      
      setVerseAnalysisState(prev => ({
        ...prev,
        analysis: newAnalysis,
        grammarBreakdown: enhancedGrammarBreakdown,
        translations: {
          latin: selectedVerse.macronized_text || selectedVerse.text,
          ...(data.translations || {})
        },
        theological_layer: theological_layer,
        symbolic_layer: symbolic_layer,
        cosmological_layer: cosmological_layer,
        isAnalysisDone: true,
        isLoading: false,
        loadingMessage: '',
        selectedWord: firstWordNorm,
        selectedWordIndex: 0,
        wordInfo: firstWordInfo
      }));

      // Cache the analysis result
      const cacheKey = `verse_analysis_${verseRef}`;
      const cacheData = {
        ...data,
        cached_at: new Date().toISOString(),
        cache_type: 'standard_analysis'
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log(`Cached standard analysis for ${verseRef}`);

    } catch (error) {
      console.error('Error analyzing verse:', error);
      setVerseAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        loadingMessage: '',
        saveStatus: 'error',
        saveMessage: 'Failed to analyze verse. Please try again later.'
      }));
    }
  }, []);

  const handleWordClick = useCallback((index: number) => {
    if (verseAnalysisState.grammarBreakdown?.[index]) {
      const word = verseAnalysisState.grammarBreakdown[index];
      const normalizedForm = word.word.toLowerCase().replace(/[.,;:!?]/g, '');
      const wordInfo = verseAnalysisState.analysis[normalizedForm];
      
      setVerseAnalysisState(prev => ({
        ...prev,
        selectedWordIndex: index,
        selectedWord: normalizedForm,
        wordInfo: wordInfo || null
      }));
    }
  }, [verseAnalysisState.grammarBreakdown, verseAnalysisState.analysis]);

  const cancelEditing = useCallback(() => {
    setEditState({
      isEditing: false,
      editingWord: null,
      editMeaning: '',
      editGrammarDescription: '',
      editPartOfSpeech: '',
      editMorphology: ''
    });
  }, []);

  return {
    verseAnalysisState,
    setVerseAnalysisState,
    editState,
    setEditState,
    theologicalInterpretation,
    setTheologicalInterpretation,
    isOpenAIAnalyzing,
    setIsOpenAIAnalyzing,
    selectedTranslationLang,
    setSelectedTranslationLang,
    isTranslating,
    setIsTranslating,
    availableTranslations,
    setAvailableTranslations,
    isGeneratingTranslations,
    setIsGeneratingTranslations,
    loadCompleteAnalysis,
    analyzeVerse,
    handleWordClick,
    cancelEditing
  };
}; 