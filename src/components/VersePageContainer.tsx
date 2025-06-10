import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Book, Verse } from '../types';
import { useVerseNavigation } from '../hooks/useVerseNavigation';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { useVerseAnalysis } from '../hooks/useVerseAnalysis';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { API_BASE_URL } from '../constants/index';
import { createDataLoadingUtils } from '../utils/dataLoadingUtils';
import VerseDisplayComponent from './VerseDisplayComponent';
import AnalysisColumnComponent from './AnalysisColumnComponent';
import EditingColumnComponent from './EditingColumnComponent';
import BookInfoPanel from './BookInfoPanel';
import AppStyles from './AppStyles';

export const VersePageContainer: React.FC = () => {
  const location = useLocation();
  const { book: bookParam, chapter: chapterParam, verse: verseParam } = useParams<{
    book: string;
    chapter: string;
    verse: string;
  }>();

  // Core navigation and verse data state
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookAbbr, setSelectedBookAbbr] = useState<string>(bookParam || "Gn");
  const [chapters, setChapters] = useState<number[]>([]);
  const [currentChapter, setCurrentChapter] = useState<number>(parseInt(chapterParam || "1"));
  const [verses, setVerses] = useState<Verse[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);

  // UI state
  const [isBookInfoOpen, setIsBookInfoOpen] = useState<boolean>(false);
  const [isOpenAIAvailable, setIsOpenAIAvailable] = useState<boolean>(false);
  
  // Floating translation icon state
  const [brainButtonHovered, setBrainButtonHovered] = useState(false);
  const [hoverTimeoutId, setHoverTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Custom hooks
  const navigation = useVerseNavigation();
  const audioPlayer = useAudioPlayer();
  const audioRecording = useAudioRecording();
  const verseAnalysis = useVerseAnalysis();
  
  // Data loading utilities - memoized to prevent infinite loops
  const dataLoader = useMemo(() => createDataLoadingUtils(), []);

  // Initialize component with URL parameters
  useEffect(() => {
    if (bookParam && chapterParam && verseParam) {
      console.log('URL parameters changed:', { bookParam, chapterParam, verseParam });
      if (bookParam !== selectedBookAbbr) {
        setSelectedBookAbbr(bookParam);
      }
      const newChapter = parseInt(chapterParam);
      if (newChapter !== currentChapter) {
        setCurrentChapter(newChapter);
      }
      // selectedVerse will be set when verses are loaded
    }
  }, [bookParam, chapterParam, verseParam, selectedBookAbbr, currentChapter]);

  // Load books on mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const books = await dataLoader.loadBooks();
        setBooks(books);
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };
    loadBooks();
  }, [dataLoader]);

  // Load chapters when book changes
  useEffect(() => {
    const loadChapters = async () => {
      try {
        // Find the book ID based on the selected book abbreviation
        const book = books.find(b => b.latin_name === selectedBookAbbr);
        if (!book) {
          console.error('Book not found:', selectedBookAbbr);
          setChapters([]);
          return;
        }

        const chaptersArray = await dataLoader.loadChapters(book.id);
        setChapters(chaptersArray);
      } catch (error) {
        console.error('Error loading chapters:', error);
        setChapters([]); // Ensure chapters is always an array
      }
    };
    if (selectedBookAbbr && books.length > 0) {
      loadChapters();
    }
  }, [selectedBookAbbr, books, dataLoader]);

        // Load verses when book or chapter changes
  useEffect(() => {
    const loadVerses = async () => {
      try {
        const versesArray = await dataLoader.loadVerses(selectedBookAbbr, currentChapter);
        setVerses(versesArray);
        
        // Set selected verse based on URL parameter or default to first verse
        if (verseParam) {
          const verseNumber = parseInt(verseParam);
          const verse = versesArray.find((v: Verse) => v.verse_number === verseNumber);
          if (verse) {
            setSelectedVerse(verse);
          }
        } else if (versesArray.length > 0) {
          // Default to first verse if no URL parameter
          setSelectedVerse(versesArray[0]);
        }
      } catch (error) {
        console.error('Error loading verses:', error);
        setVerses([]); // Ensure verses is always an array
      }
    };
    if (selectedBookAbbr && currentChapter) {
      loadVerses();
    }
  }, [selectedBookAbbr, currentChapter, verseParam, dataLoader]);

  // Check OpenAI availability
  useEffect(() => {
    const checkOpenAIAvailability = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dictionary/stats`);
        const stats = await response.json();
        setIsOpenAIAvailable(stats.openai_enabled || false);
      } catch (error) {
        console.error('Error checking OpenAI availability:', error);
        setIsOpenAIAvailable(false);
      }
    };
    checkOpenAIAvailability();
  }, []);

  // Load analysis when verse changes (with debouncing to prevent excessive requests)
  useEffect(() => {
    if (!selectedVerse) return;
    
    const timeoutId = setTimeout(() => {
      verseAnalysis.loadCompleteAnalysis(selectedVerse, selectedBookAbbr, currentChapter);
      audioPlayer.checkAudioAvailability(selectedVerse, selectedBookAbbr, currentChapter);
    }, 100); // 100ms debounce to prevent rapid-fire requests
    
    return () => clearTimeout(timeoutId);
  }, [selectedVerse, selectedBookAbbr, currentChapter, verseAnalysis.loadCompleteAnalysis, audioPlayer.checkAudioAvailability]);

  // Navigation handlers that use custom hooks
  const navigateToPreviousVerse = useCallback(() => {
    navigation.navigateToPreviousVerse(selectedVerse, selectedBookAbbr, currentChapter, setCurrentChapter);
  }, [navigation.navigateToPreviousVerse, selectedVerse, selectedBookAbbr, currentChapter]);

  const navigateToNextVerse = useCallback(() => {
    navigation.navigateToNextVerse(selectedVerse, selectedBookAbbr, currentChapter, verses, chapters, setCurrentChapter);
  }, [navigation.navigateToNextVerse, selectedVerse, selectedBookAbbr, currentChapter, verses, chapters]);

  const handleVerseChange = useCallback((verseNumber: number) => {
    navigation.handleVerseChange(verseNumber, selectedBookAbbr, currentChapter);
  }, [navigation.handleVerseChange, selectedBookAbbr, currentChapter]);

  // Enhanced functions that combine multiple hooks
  const handleEnhanceClick = useCallback(async (event: React.MouseEvent) => {
    if (!selectedVerse) return;
    
    if (event.altKey) {
      // Alt+click for forced analysis
      await verseAnalysis.analyzeVerse(selectedVerse, selectedBookAbbr, currentChapter);
    } else {
      // Regular enhance - load existing analysis
      await verseAnalysis.loadCompleteAnalysis(selectedVerse, selectedBookAbbr, currentChapter);
    }
  }, [selectedVerse, selectedBookAbbr, currentChapter, verseAnalysis.analyzeVerse, verseAnalysis.loadCompleteAnalysis]);

  const handleForceTranslations = useCallback(async () => {
    if (!selectedVerse) return;

    verseAnalysis.setIsGeneratingTranslations(true);
    
    try {
      const requiredLanguages = ['en', 'fr', 'es', 'pt', 'it'];
      const currentTranslations = verseAnalysis.verseAnalysisState.translations || {};
      const missingLanguages = requiredLanguages.filter(lang => 
        !currentTranslations[lang]
      );

      if (missingLanguages.length === 0) {
        console.log('All translations already available');
        verseAnalysis.setIsGeneratingTranslations(false);
        return;
      }

      console.log('Generating translations for languages:', missingLanguages);

      // Try each language individually using the dictionary translate endpoint
      const newTranslations: { [key: string]: string } = { ...currentTranslations };
      
      for (const lang of missingLanguages) {
        try {
          const response = await fetch(`${API_BASE_URL}/dictionary/translate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              verse_text: selectedVerse.macronized_text || selectedVerse.text,
              target_language: lang
            }),
          });

          if (response.ok) {
            const result = await response.json();
            newTranslations[lang] = result.translation || result.translated_text || `Translation to ${lang} not available`;
          } else {
            console.warn(`Translation failed for ${lang}:`, response.status);
            // Provide fallback translation
            newTranslations[lang] = `Translation to ${lang} not available`;
          }
        } catch (error) {
          console.error(`Error translating to ${lang}:`, error);
          // Provide fallback translation
          newTranslations[lang] = `Translation to ${lang} not available`;
        }
      }

      console.log('Generated translations:', newTranslations);
      
      verseAnalysis.setVerseAnalysisState(prev => ({
        ...prev,
        translations: newTranslations
      }));

    } catch (error) {
      console.error('Error generating translations:', error);
    } finally {
      verseAnalysis.setIsGeneratingTranslations(false);
    }
  }, [selectedVerse, selectedBookAbbr, currentChapter, verseAnalysis.setIsGeneratingTranslations, verseAnalysis.verseAnalysisState.translations, verseAnalysis.setVerseAnalysisState]);

  const handleRecordClick = useCallback(() => {
    audioRecording.handleRecordClick();
  }, [audioRecording.handleRecordClick]);

  const uploadRecording = useCallback((audioBlob: Blob) => {
    audioRecording.uploadRecording(audioBlob, selectedVerse, selectedBookAbbr, currentChapter);
  }, [audioRecording.uploadRecording, selectedVerse, selectedBookAbbr, currentChapter]);

  const playAudioWithWordHighlighting = useCallback(() => {
    audioPlayer.playAudioWithWordHighlighting(
      selectedVerse, 
      selectedBookAbbr, 
      currentChapter, 
      verseAnalysis.verseAnalysisState.grammarBreakdown
    );
  }, [audioPlayer.playAudioWithWordHighlighting, selectedVerse, selectedBookAbbr, currentChapter, verseAnalysis.verseAnalysisState.grammarBreakdown]);

  const stopAudio = useCallback(() => {
    audioPlayer.setIsPlaying(false);
    audioPlayer.setAudioSource(null);
    audioPlayer.setCurrentlyPlayingWordIndex(null);
  }, [audioPlayer.setIsPlaying, audioPlayer.setAudioSource, audioPlayer.setCurrentlyPlayingWordIndex]);

  // Event handlers
  const handleBookInfoNavigateToVerse = useCallback((reference: string) => {
    // Parse reference like "Gn 1:1"
    const parts = reference.split(' ');
    if (parts.length === 2) {
      const book = parts[0];
      const [chapter, verse] = parts[1].split(':');
      navigation.updateURL(book, parseInt(chapter), parseInt(verse));
    }
  }, [navigation.updateURL]);

  const handleGrammarWordClick = useCallback((word: string) => {
    // Handle grammar word click logic
    console.log('Grammar word clicked:', word);
  }, []);

  const handleNavigateToOccurrence = useCallback((book: string, chapter: number, verse: number) => {
    navigation.updateURL(book, chapter, verse);
  }, [navigation.updateURL]);

  // Helper function for analysis layers
  const analysisResultHasLayers = useCallback((state: typeof verseAnalysis.verseAnalysisState) => {
    return (
      (state.theological_layer && Array.isArray(state.theological_layer) && state.theological_layer.length > 0) ||
      (state.symbolic_layer && Array.isArray(state.symbolic_layer) && state.symbolic_layer.length > 0) ||
      (state.cosmological_layer && Array.isArray(state.cosmological_layer) && state.cosmological_layer.length > 0)
    );
  }, []);

  // Keyboard navigation
  useKeyboardNavigation({
    selectedVerse,
    isTransitioning: navigation.isTransitioning,
    audioAvailable: audioPlayer.audioAvailable,
    isPlaying: audioPlayer.isPlaying,
    audioSource: audioPlayer.audioSource,
    selectedTranslationLang: verseAnalysis.selectedTranslationLang,
    availableTranslations: verseAnalysis.availableTranslations,
    selectedWordIndex: verseAnalysis.verseAnalysisState.selectedWordIndex,
    grammarBreakdown: verseAnalysis.verseAnalysisState.grammarBreakdown,
    onRecordClick: handleRecordClick,
    onPlayAudio: playAudioWithWordHighlighting,
    onStopAudio: stopAudio,
    onEnhanceClick: handleEnhanceClick,
    onNavigatePrevious: navigateToPreviousVerse,
    onNavigateNext: navigateToNextVerse,
    onSetTranslationLang: verseAnalysis.setSelectedTranslationLang,
    onWordClick: verseAnalysis.handleWordClick
  });

  return (
    <div className="min-h-screen bg-[#fefaf0] text-black p-8">
      <AppStyles />
      
      {/* Header with centered Vulgate icon and text */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img 
            src="/vulgate_icon.png" 
            alt="Vulgate Icon" 
            className="w-16 h-16 opacity-90 hover:opacity-100 transition-opacity duration-200"
            title="Vulgate Clementina"
          />
          <div>
            <h1 className="text-3xl font-extrabold">VULGATE</h1>
            <p className="text-gray-600 italic text-sm">VULGATA CLEMENTINA</p>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto">
        {/* Verse section */}
        <VerseDisplayComponent
          // Navigation props
          selectedBookAbbr={selectedBookAbbr}
          setSelectedBookAbbr={setSelectedBookAbbr}
          currentChapter={currentChapter}
          setCurrentChapter={setCurrentChapter}
          selectedVerse={selectedVerse}
          books={books}
          chapters={chapters}
          verses={verses}
          navigationInProgress={navigation.navigationInProgress}
          isTransitioning={navigation.isTransitioning}
          
          // Verse analysis state
          verseAnalysisState={verseAnalysis.verseAnalysisState}
          
          // Translation props
          selectedTranslationLang={verseAnalysis.selectedTranslationLang}
          setSelectedTranslationLang={verseAnalysis.setSelectedTranslationLang}
          
          // Audio props
          audioAvailable={audioPlayer.audioAvailable}
          isPlaying={audioPlayer.isPlaying}
          audioSource={audioPlayer.audioSource}
          setIsPlaying={audioPlayer.setIsPlaying}
          setAudioSource={audioPlayer.setAudioSource}
          currentlyPlayingWordIndex={audioPlayer.currentlyPlayingWordIndex}
          
          // Recording props
          isRecording={audioRecording.isRecording}
          recording={audioRecording.recording}
          isUploading={audioRecording.isUploading}
          uploadSuccess={audioRecording.uploadSuccess}
          uploadStatus={audioRecording.uploadStatus}
          
          // AI Analysis props
          isOpenAIAnalyzing={verseAnalysis.isOpenAIAnalyzing}
          brainButtonHovered={brainButtonHovered}
          setBrainButtonHovered={setBrainButtonHovered}
          hoverTimeoutId={hoverTimeoutId}
          setHoverTimeoutId={setHoverTimeoutId}
          showFloatingTranslation={false}
          isGeneratingTranslations={verseAnalysis.isGeneratingTranslations}
          
          // Animation props
          verseAnimation={navigation.verseAnimation}
          
          // Event handlers
          navigateToPreviousVerse={navigateToPreviousVerse}
          navigateToNextVerse={navigateToNextVerse}
          updateURL={navigation.updateURL}
          handleVerseChange={handleVerseChange}
          setIsBookInfoOpen={setIsBookInfoOpen}
          handleWordClick={verseAnalysis.handleWordClick}
          handleGrammarWordClick={handleGrammarWordClick}
          playAudioWithWordHighlighting={playAudioWithWordHighlighting}
          handleRecordClick={handleRecordClick}
          uploadRecording={uploadRecording}
          handleEnhanceClick={handleEnhanceClick}
          handleForceTranslations={handleForceTranslations}
          
          // Location object
          location={location}
        />

        {/* Analysis and editing section */}
        {(verseAnalysis.verseAnalysisState.isAnalysisDone || 
          verseAnalysis.verseAnalysisState.grammarBreakdown?.length > 0 || 
          verseAnalysis.theologicalInterpretation || 
          verseAnalysis.verseAnalysisState.wordInfo) && (
          <div className="flex gap-8 flex-wrap">
            {/* Analysis column */}
            <AnalysisColumnComponent
              verseAnalysisState={verseAnalysis.verseAnalysisState}
              theologicalInterpretation={verseAnalysis.theologicalInterpretation}
              onNavigateToOccurrence={handleNavigateToOccurrence}
              analysisResultHasLayers={analysisResultHasLayers}
            />

            {/* Editing column */}
            {verseAnalysis.verseAnalysisState.grammarBreakdown?.length > 0 && (
              <EditingColumnComponent
                grammarBreakdown={verseAnalysis.verseAnalysisState.grammarBreakdown}
                onWordClick={verseAnalysis.handleWordClick}
                onGrammarWordClick={handleGrammarWordClick}
              />
            )}
          </div>
        )}
      </div>

      {/* Book Info Panel */}
      <BookInfoPanel
        bookAbbr={selectedBookAbbr}
        isOpen={isBookInfoOpen}
        onClose={() => setIsBookInfoOpen(false)}
        onNavigateToVerse={handleBookInfoNavigateToVerse}
      />
    </div>
  );
}; 