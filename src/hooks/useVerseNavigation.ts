import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants/index';
import { Verse } from '../types';

export const useVerseNavigation = () => {
  const navigate = useNavigate();
  const [navigationInProgress, setNavigationInProgress] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [verseAnimation, setVerseAnimation] = useState<'slide-down' | 'slide-up' | 'none'>('none');

  const updateURL = useCallback((source: string, bookAbbr: string, chapter: number, verse: number) => {
    const newPath = `/${source}/${bookAbbr}/${chapter}/${verse}`;
    navigate(newPath, { replace: true });
  }, [navigate]);

  const handleVerseChangeWithAnimation = useCallback((
    verseNumber: number, 
    animation: 'slide-down' | 'slide-up',
    source: string,
    selectedBookAbbr: string,
    currentChapter: number
  ) => {
    setVerseAnimation(animation);
    setIsTransitioning(true);
    
    setTimeout(() => {
      updateURL(source, selectedBookAbbr, currentChapter, verseNumber);
      setIsTransitioning(false);
      setVerseAnimation('none');
    }, 150);
  }, [updateURL]);

  const navigateToPreviousVerse = useCallback(async (
    selectedVerse: Verse | null,
    source: string,
    selectedBookAbbr: string,
    currentChapter: number,
    setCurrentChapter: (chapter: number) => void
  ) => {
    if (!selectedVerse || navigationInProgress || isTransitioning) return;
    
    setNavigationInProgress(true);
    
    try {
      if (selectedVerse.verse_number > 1) {
        handleVerseChangeWithAnimation(selectedVerse.verse_number - 1, 'slide-up', source, selectedBookAbbr, currentChapter);
      } else if (currentChapter > 1) {
        const previousChapter = currentChapter - 1;
        
        try {
          // Use new unified endpoint structure: /api/v1/texts/{source}/{book}/{chapter}
          const response = await fetch(`${API_BASE_URL}/texts/${source}/${selectedBookAbbr}/${previousChapter}`);
          if (!response.ok) throw new Error('Failed to fetch verses');
          
          const previousChapterVerses = await response.json();
          const lastVerseNumber = previousChapterVerses.length > 0 ? previousChapterVerses[previousChapterVerses.length - 1].verse_number : 1;
          
          setCurrentChapter(previousChapter);
          
          setTimeout(() => {
            updateURL(source, selectedBookAbbr, previousChapter, lastVerseNumber);
          }, 50);
          
        } catch (error) {
          console.error('Error navigating to previous chapter:', error);
          setCurrentChapter(currentChapter - 1);
          setTimeout(() => {
            updateURL(source, selectedBookAbbr, currentChapter - 1, 1);
          }, 50);
        }
      }
    } finally {
      setTimeout(() => {
        setNavigationInProgress(false);
      }, 300);
    }
  }, [navigationInProgress, isTransitioning, handleVerseChangeWithAnimation, updateURL]);

  const navigateToNextVerse = useCallback(async (
    selectedVerse: Verse | null,
    source: string,
    selectedBookAbbr: string,
    currentChapter: number,
    verses: Verse[],
    chapters: number[],
    setCurrentChapter: (chapter: number) => void
  ) => {
    if (!selectedVerse || navigationInProgress || isTransitioning) return;
    
    setNavigationInProgress(true);
    
    try {
      if (selectedVerse.verse_number < verses.length) {
        handleVerseChangeWithAnimation(selectedVerse.verse_number + 1, 'slide-down', source, selectedBookAbbr, currentChapter);
      } else if (currentChapter < chapters.length) {
        const nextChapter = currentChapter + 1;
        
        setCurrentChapter(nextChapter);
        
        setTimeout(() => {
          updateURL(source, selectedBookAbbr, nextChapter, 1);
        }, 50);
      }
    } finally {
      setTimeout(() => {
        setNavigationInProgress(false);
      }, 300);
    }
  }, [navigationInProgress, isTransitioning, handleVerseChangeWithAnimation, updateURL]);

  const handleVerseChange = useCallback((verseNumber: number, source: string, selectedBookAbbr: string, currentChapter: number) => {
    updateURL(source, selectedBookAbbr, currentChapter, verseNumber);
  }, [updateURL]);

  return {
    navigationInProgress,
    isTransitioning,
    verseAnimation,
    setIsTransitioning,
    updateURL,
    handleVerseChangeWithAnimation,
    navigateToPreviousVerse,
    navigateToNextVerse,
    handleVerseChange
  };
}; 