import { VerseAnalysisState } from '../types';
import { normalizeLatin } from './grammarUtils';

export interface EventHandlerUtils {
  handleGrammarWordClick: (word: string) => void;
  handleWordHover: (word: string | null) => void;
  handleWordClick: (index: number) => void;
  handleVerseChangeWithAnimation: (verseNumber: number, animation: 'slide-down' | 'slide-up') => void;
  handleVerseChange: (verseNumber: number) => void;
  handleEnhanceClick: (event: React.MouseEvent) => Promise<void>;
}

export const createEventHandlerUtils = (
  verseAnalysisState: VerseAnalysisState,
  setVerseAnalysisState: (updater: (prev: VerseAnalysisState) => VerseAnalysisState) => void,
  verses: Array<{ verse_number: number; text: string }>,
  setSelectedVerse: (verse: { verse_number: number; text: string } | null) => void,
  setCurrentlyPlayingWordIndex: (index: number | null) => void,
  loadOpenAIAnalysis: () => Promise<void>
): EventHandlerUtils => {

  const handleGrammarWordClick = (word: string): void => {
    const normalizedWord = normalizeLatin(word);
    const wordInfo = verseAnalysisState.analysis[normalizedWord];
    
    setVerseAnalysisState(prev => ({
      ...prev,
      selectedWord: normalizedWord,
      wordInfo: wordInfo || null
    }));
  };

  const handleWordHover = (word: string | null): void => {
    setVerseAnalysisState(prev => ({
      ...prev,
      hoveredWord: word ? normalizeLatin(word) : null
    }));
  };

  const handleWordClick = (index: number): void => {
    const words = verseAnalysisState.grammarBreakdown;
    if (index >= 0 && index < words.length) {
      const word = words[index];
      const normalizedWord = normalizeLatin(word.word);
      const wordInfo = verseAnalysisState.analysis[normalizedWord];
      
      setVerseAnalysisState(prev => ({
        ...prev,
        selectedWordIndex: index,
        wordInfo: wordInfo || null,
        selectedWord: normalizedWord
      }));
      
      setCurrentlyPlayingWordIndex(index);
    }
  };

  const handleVerseChangeWithAnimation = (verseNumber: number, animation: 'slide-down' | 'slide-up'): void => {
    const targetVerse = verses.find(v => v.verse_number === verseNumber);
    if (targetVerse) {
      // Add animation class
      const verseContent = document.querySelector('.verse-content');
      if (verseContent) {
        verseContent.classList.add(animation);
        
        // Remove animation class after animation completes
        setTimeout(() => {
          verseContent.classList.remove(animation);
        }, 500); // Match animation duration
      }
      
      setSelectedVerse(targetVerse);
    }
  };

  const handleVerseChange = (verseNumber: number): void => {
    const targetVerse = verses.find(v => v.verse_number === verseNumber);
    if (targetVerse) {
      setSelectedVerse(targetVerse);
    }
  };

  const handleEnhanceClick = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    await loadOpenAIAnalysis();
  };

  return {
    handleGrammarWordClick,
    handleWordHover,
    handleWordClick,
    handleVerseChangeWithAnimation,
    handleVerseChange,
    handleEnhanceClick
  };
}; 