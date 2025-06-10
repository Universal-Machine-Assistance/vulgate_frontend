import { useEffect, useCallback } from 'react';

interface KeyboardNavigationProps {
  selectedVerse: any;
  isTransitioning: boolean;
  audioAvailable: boolean;
  isPlaying: boolean;
  audioSource: AudioBufferSourceNode | null;
  selectedTranslationLang: string;
  availableTranslations: {[key: string]: string};
  selectedWordIndex: number | null;
  grammarBreakdown: any[];
  onRecordClick: () => void;
  onPlayAudio: () => void;
  onStopAudio: () => void;
  onEnhanceClick: (event: React.MouseEvent) => void;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  onSetTranslationLang: (lang: string) => void;
  onWordClick: (index: number) => void;
}

export const useKeyboardNavigation = ({
  selectedVerse,
  isTransitioning,
  audioAvailable,
  isPlaying,
  audioSource,
  selectedTranslationLang,
  availableTranslations,
  selectedWordIndex,
  grammarBreakdown,
  onRecordClick,
  onPlayAudio,
  onStopAudio,
  onEnhanceClick,
  onNavigatePrevious,
  onNavigateNext,
  onSetTranslationLang,
  onWordClick
}: KeyboardNavigationProps) => {

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Only handle keys if no input/textarea is focused and not during transitions
    const activeElement = document.activeElement;
    const isInputFocused = activeElement?.tagName === 'INPUT' || 
                           activeElement?.tagName === 'TEXTAREA' || 
                           activeElement?.getAttribute('contenteditable') === 'true';
    
    if (isInputFocused || isTransitioning || !selectedVerse) return;
    
    console.log('Key pressed:', event.key, 'Shift:', event.shiftKey);
    
    // Audio controls
    if (event.key.toLowerCase() === 'r' && event.metaKey && event.shiftKey) {
      event.preventDefault();
      onRecordClick();
    } else if (event.key.toLowerCase() === 'p') {
      event.preventDefault();
      if (audioAvailable) {
        if (isPlaying) {
          if (audioSource) audioSource.stop();
          onStopAudio();
        } else {
          onPlayAudio();
        }
      }
    } else if (event.key.toLowerCase() === 'g') {
      event.preventDefault();
      const fakeEvent = { altKey: false, preventDefault: () => {} } as React.MouseEvent;
      onEnhanceClick(fakeEvent);
    }
    // Navigation controls
    else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (event.shiftKey) {
        // Shift + Left: Change language (previous)
        const availableLanguages = Object.keys(availableTranslations);
        if (availableLanguages.length > 0) {
          const currentIndex = availableLanguages.indexOf(selectedTranslationLang);
          const prevIndex = currentIndex <= 0 ? availableLanguages.length - 1 : currentIndex - 1;
          onSetTranslationLang(availableLanguages[prevIndex]);
        }
      } else if (event.altKey) {
        // Alt + Left: Navigate to previous verse
        onNavigatePrevious();
      }
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (event.shiftKey) {
        // Shift + Right: Change language (next)
        const availableLanguages = Object.keys(availableTranslations);
        if (availableLanguages.length > 0) {
          const currentIndex = availableLanguages.indexOf(selectedTranslationLang);
          const nextIndex = (currentIndex + 1) % availableLanguages.length;
          onSetTranslationLang(availableLanguages[nextIndex]);
        }
      } else if (event.altKey) {
        // Alt + Right: Navigate to next verse
        onNavigateNext();
      }
    }
    // Word navigation with < and > keys
    else if (event.key === ',' && event.shiftKey) { // Shift + , = <
      event.preventDefault();
      if (grammarBreakdown && grammarBreakdown.length > 0) {
        const currentIndex = selectedWordIndex ?? 0;
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : grammarBreakdown.length - 1;
        onWordClick(prevIndex);
      }
    } else if (event.key === '.' && event.shiftKey) { // Shift + . = >
      event.preventDefault();
      if (grammarBreakdown && grammarBreakdown.length > 0) {
        const currentIndex = selectedWordIndex ?? -1;
        const nextIndex = (currentIndex + 1) % grammarBreakdown.length;
        onWordClick(nextIndex);
      }
    }
  }, [
    selectedVerse,
    isTransitioning,
    audioAvailable,
    isPlaying,
    audioSource,
    selectedTranslationLang,
    availableTranslations,
    selectedWordIndex,
    grammarBreakdown,
    onRecordClick,
    onPlayAudio,
    onStopAudio,
    onEnhanceClick,
    onNavigatePrevious,
    onNavigateNext,
    onSetTranslationLang,
    onWordClick
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return null; // This hook doesn't return any state, just handles side effects
}; 