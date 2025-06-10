import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants/index';
import { Verse } from '../types';

export const useVerseNavigation = () => {
  const navigate = useNavigate();
  const [navigationInProgress, setNavigationInProgress] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [verseAnimation, setVerseAnimation] = useState<'slide-down' | 'slide-up' | 'none'>('none');

  const updateURL = useCallback((bookAbbr: string, chapter: number, verse: number) => {
    const newPath = `/${bookAbbr}/${chapter}/${verse}`;
    navigate(newPath, { replace: true });
  }, [navigate]);

  const handleVerseChangeWithAnimation = useCallback((
    verseNumber: number, 
    animation: 'slide-down' | 'slide-up',
    selectedBookAbbr: string,
    currentChapter: number
  ) => {
    setVerseAnimation(animation);
    setIsTransitioning(true);
    
    setTimeout(() => {
      updateURL(selectedBookAbbr, currentChapter, verseNumber);
      setIsTransitioning(false);
      setVerseAnimation('none');
    }, 150);
  }, [updateURL]);

  const navigateToPreviousVerse = useCallback(async (
    selectedVerse: Verse | null,
    selectedBookAbbr: string,
    currentChapter: number,
    setCurrentChapter: (chapter: number) => void
  ) => {
    if (!selectedVerse || navigationInProgress || isTransitioning) return;
    
    setNavigationInProgress(true);
    
    try {
             if (selectedVerse.verse_number > 1) {
         handleVerseChangeWithAnimation(selectedVerse.verse_number - 1, 'slide-up', selectedBookAbbr, currentChapter);
       } else if (currentChapter > 1) {
        const previousChapter = currentChapter - 1;
        
        try {
          const response = await fetch(`${API_BASE_URL}/verses/by-reference/${selectedBookAbbr}/${previousChapter}`);
          if (!response.ok) throw new Error('Failed to fetch verses');
          
          const previousChapterVerses = await response.json();
          const lastVerseNumber = previousChapterVerses.length > 0 ? previousChapterVerses[previousChapterVerses.length - 1].verse_number : 1;
          
          setCurrentChapter(previousChapter);
          
          setTimeout(() => {
            updateURL(selectedBookAbbr, previousChapter, lastVerseNumber);
          }, 50);
          
        } catch (error) {
          console.error('Error navigating to previous chapter:', error);
          setCurrentChapter(currentChapter - 1);
          setTimeout(() => {
            updateURL(selectedBookAbbr, currentChapter - 1, 1);
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
         handleVerseChangeWithAnimation(selectedVerse.verse_number + 1, 'slide-down', selectedBookAbbr, currentChapter);
       } else if (currentChapter < chapters.length) {
        const nextChapter = currentChapter + 1;
        
        setCurrentChapter(nextChapter);
        
        setTimeout(() => {
          updateURL(selectedBookAbbr, nextChapter, 1);
        }, 50);
      }
    } finally {
      setTimeout(() => {
        setNavigationInProgress(false);
      }, 300);
    }
  }, [navigationInProgress, isTransitioning, handleVerseChangeWithAnimation, updateURL]);

  const handleVerseChange = useCallback((verseNumber: number, selectedBookAbbr: string, currentChapter: number) => {
    updateURL(selectedBookAbbr, currentChapter, verseNumber);
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