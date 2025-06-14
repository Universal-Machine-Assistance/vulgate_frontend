import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import './App.css';
import BookInfoPanel from './components/BookInfoPanel';
import WordVerseRelationships from './components/WordVerseRelationships';
import NameOccurrencesComponent from './components/NameOccurrencesComponent';
import AnalysisHistoryComponent from './components/AnalysisHistoryComponent';
import QueueComponent from './components/QueueComponent';
import WordInfoComponent from './components/WordInfoComponent';
import LanguageDropdown from './components/LanguageDropdown';
import BookDropdown from './components/BookDropdown';
import VerseDropdown from './components/VerseDropdown';
import ChapterDropdown from './components/ChapterDropdown';
import GlobalEditComponent from './components/GlobalEditComponent';
import InterpretationLayersComponent from './components/InterpretationLayersComponent';
import AnimatedWrapper from './components/AnimatedWrapper';
import VerseDisplayComponent from './components/VerseDisplayComponent';
import GrammarBreakdownComponent from './components/GrammarBreakdownComponent';
import AnalysisColumnComponent from './components/AnalysisColumnComponent';
import EditingColumnComponent from './components/EditingColumnComponent';
import SourceDropdown from './components/SourceDropdown';
import AppStyles from './components/AppStyles';
import { 
  NameOccurrence, 
  QueueItem, 
  WordInfo, 
  GrammarColorKey, 
  GRAMMAR_COLORS, 
  Language, 
  LANGUAGES, 
  Book, 
  BOOK_ICONS, 
  getBookCategoryColor, 
  Verse,
  NotificationType,
  EditState,
  VerseAnalysisState,
  VerseAnalysis,
  GrammarItem
} from './types';
import { 
  getIconForWordType, 
  getColorForWordType, 
  getColorsFromGrammarClass, 
  normalizeLatin, 
  getHighlightBgForWordType, 
  getHighlightTextForWordType 
} from './utils/grammarUtils';
import { createAudioRecordingUtils } from './utils/audioUtils';
import { createNavigationUtils } from './utils/navigationUtils';
import { createAnalysisUtils } from './utils/analysisUtils';
import { createCacheUtils } from './utils/cacheUtils';
import { createEventHandlerUtils } from './utils/eventHandlerUtils';
import { createKeyboardUtils } from './utils/keyboardUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL, BOOK_NAMES, BOOK_ABBREVIATIONS, TEXT_SOURCES } from './constants/index';
import { DataServiceFactory } from './utils/dataService';
import successNotificationSound from './assets/sounds/success_notification.mp3';

// Import Greb logo
const GrebLogo = require('./GREB LOGO_ with White.png');

// Types for verse relationships








// Custom Dropdown for Verse Selector


// Custom scrollbar hide utility and verse animations









// Route component for handling URL parameters
const VersePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract source from URL - default to 'bible' for backward compatibility
  const urlSource = location.pathname.split('/').filter(Boolean)[0];
  const [currentSource, setCurrentSource] = useState<string>(
    urlSource && TEXT_SOURCES[urlSource] ? urlSource : 'bible'
  );
  
  const [books, setBooks] = useState<Book[]>([]); // Initialize with empty array
  const [selectedBookAbbr, setSelectedBookAbbr] = useState<string>("Gn");
  const [chapters, setChapters] = useState<number[]>([]);
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
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

  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const [currentWord, setCurrentWord] = useState<string>('');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [playedIndices, setPlayedIndices] = useState<number[]>([]);
  const [lastVerseTime, setLastVerseTime] = useState<number>(0);
  const [dictionaryStats, setDictionaryStats] = useState<{main_dictionary_entries: number, cached_entries: number, total_available: number, openai_enabled: boolean} | null>(null);
  const [dictionaryLoading, setDictionaryLoading] = useState<boolean>(true);
  const [theologicalInterpretation, setTheologicalInterpretation] = useState<string | null>(null);
  const [visitedVerses, setVisitedVerses] = useState<{[key: string]: boolean}>({});
  const [requestQueue, setRequestQueue] = useState<Set<string>>(new Set());
  // Removed unused variables: lastRequestTime, setLastRequestTime, isVerseLoading, setIsVerseLoading
  const [currentlyPlayingWordIndex, setCurrentlyPlayingWordIndex] = useState<number | null>(null);
  const [selectedTranslationLang, setSelectedTranslationLang] = useState<string>('en'); // Default to English
  const [isOpenAIAvailable, setIsOpenAIAvailable] = useState<boolean>(false);
  const [isOpenAIAnalyzing, setIsOpenAIAnalyzing] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [availableTranslations, setAvailableTranslations] = useState<{[key:string]:string}>({});
  const [isGeneratingTranslations, setIsGeneratingTranslations] = useState(false);
  
  // Queue and editing state
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const [editState, setEditState] = useState<EditState>({
    isEditing: false,
    editingWord: null,
    editMeaning: '',
    editGrammarDescription: '',
    editPartOfSpeech: '',
    editMorphology: ''
  });
  
  // Global edit mode state
  const [isGlobalEditMode, setIsGlobalEditMode] = useState(false);

  // Navigation and animation state
  const [isNavigating, setIsNavigating] = useState(false);
  const [verseAnimation, setVerseAnimation] = useState<'slide-down' | 'slide-up' | 'none'>('none');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Book info panel state
  const [isBookInfoOpen, setIsBookInfoOpen] = useState<boolean>(false);

  // Initialize AudioContext
  useEffect(() => {
    setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)());
  }, []);

  // Recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecording(blob);
        setUploadStatus('Recording completed successfully!');
        
        // Automatically upload the recording
        uploadRecording(blob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setUploadStatus('Recording...');
    } catch (error) {
      console.error('Error starting recording:', error);
      setUploadStatus('Error: Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Upload recording to server
  const uploadRecording = async (audioBlob: Blob) => {
    if (!selectedVerse || !audioBlob) return;

    setIsUploading(true);
    setUploadStatus('Uploading recording...');

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, `${selectedBookAbbr}_${currentChapter}_${selectedVerse.verse_number}.wav`);

      const response = await fetch(
        `${API_BASE_URL}/audio/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        setUploadSuccess(true);
        setUploadStatus('Recording uploaded successfully!');
        
        // Check audio availability after upload
        setTimeout(() => {
          checkAudioAvailability();
        }, 1000);
        
        // Clear status after 3 seconds
        setTimeout(() => {
          setUploadStatus('');
          setUploadSuccess(false);
        }, 3000);
      } else {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error uploading recording:', error);
      setUploadStatus('Error uploading recording');
      setTimeout(() => {
        setUploadStatus('');
      }, 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Handle word click from grammar breakdown
  const handleGrammarWordClick = (word: string) => {
    const normalizedWord = normalizeLatin(word);
    const wordInfo = verseAnalysisState.analysis[normalizedWord];
    
    setVerseAnalysisState(prev => ({
      ...prev,
      selectedWord: normalizedWord,
      wordInfo: wordInfo || null
    }));
  };

  // Handle word hover
  const handleWordHover = (word: string | null) => {
    setVerseAnalysisState(prev => ({
      ...prev,
      hoveredWord: word ? normalizeLatin(word) : null
    }));
  };

  // Handle book info navigation to verse
  const handleBookInfoNavigateToVerse = (reference: string) => {
    // Safety check for undefined reference
    if (!reference || typeof reference !== 'string') {
      console.warn('Invalid reference passed to handleBookInfoNavigateToVerse:', reference);
      return;
    }

    // Parse reference like "Gn 1:1-31", "Ex 3:1-15", or "Gn 1:1"
    const parts = reference.trim().split(' ');
    if (parts.length < 2) return;
    
    const bookPart = parts[0];
    const chapterVerse = parts[1];
    
    // Handle ranges like "1:1-31" - just take the first verse
    const [chapterVerseStart] = chapterVerse.split('-');
    const [chapterStr, verseStr] = chapterVerseStart.split(':');
    
    const chapter = parseInt(chapterStr, 10);
    const verse = parseInt(verseStr, 10);
    
    if (isNaN(chapter) || isNaN(verse)) {
      console.warn('Invalid chapter/verse format in reference:', reference);
      return;
    }
    
    // The bookPart should already be the abbreviation (like "Gn", "Ex")
    // but let's also check if it's a full name and convert it
    let bookAbbr = bookPart;
    if (!BOOK_NAMES[bookPart]) {
      // Try to find by full name
      bookAbbr = Object.keys(BOOK_NAMES).find(
        abbr => BOOK_NAMES[abbr].toLowerCase() === bookPart.toLowerCase()
      ) || bookPart;
    }
    
    if (!BOOK_NAMES[bookAbbr]) {
      console.warn('Unknown book abbreviation:', bookAbbr);
      return;
    }
    
    // Navigate to the verse
    navigate(`/${bookAbbr}/${chapter}/${verse}`);
    setIsBookInfoOpen(false);
  };

  // Set selected verse when verses load
  useEffect(() => {
    if (verses.length > 0 && !selectedVerse) {
      setSelectedVerse(verses[0]);
    }
  }, [verses, selectedVerse]);

  // Handle verse changes
  useEffect(() => {
    if (selectedVerse) {
      // First check if we have cached data before clearing state
      const verseRef = `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`;
      const cacheKey = `verse_analysis_${verseRef}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        // We have cached data, load it directly without clearing state first
        try {
          const analysisResult = JSON.parse(cachedData);
          // Throttle cache loading logs to reduce console noise
          const now = Date.now();
          const lastLogTime = sessionStorage.getItem('lastCacheLogTime');
          if (!lastLogTime || now - parseInt(lastLogTime) > 1000) {
            console.log(`Quick loading ${verseRef} from localStorage cache`);
            sessionStorage.setItem('lastCacheLogTime', now.toString());
          }
          
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
                part_of_speech: item.part_of_speech
              });
            });
          }
          
          // Set state directly with cached data
          setVerseAnalysisState({
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
          });

          // Update theological interpretation
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
          
          setTheologicalInterpretation((interpretation || 'Analysis complete.') + ' ✅ Loaded from cache');
          
          // Clear recording state
          setRecording(null);
          setUploadStatus('');
          setUploadSuccess(false);
          setIsUploading(false);
          
          // Check audio availability for this verse
          checkAudioAvailability();
          
          return; // Exit early since we loaded from cache
        } catch (error) {
          console.warn('Failed to load from localStorage cache, proceeding with fresh analysis:', error);
          localStorage.removeItem(cacheKey); // Remove corrupted cache
        }
      }
      
      // If no cache or cache failed, clear state and load fresh analysis
              setVerseAnalysisState({
        analysis: {},
        grammarBreakdown: [],
        selectedWordIndex: null,
        wordInfo: null,
        isAnalysisDone: false,
        translations: {},
        theological_layer: [],
        symbolic_layer: [],
        cosmological_layer: [],
        isLoading: false,
        loadingMessage: ''
      });
      
      // Clear recording state
      setRecording(null);
      setUploadStatus('');
      setUploadSuccess(false);
      setIsUploading(false);
      
      // Check audio availability for this verse
      checkAudioAvailability();
      
      // Fetch new analysis with proper queuing
      loadCompleteAnalysis();
    }
  }, [selectedVerse, selectedBookAbbr, currentChapter]);

  // Check audio availability for current verse
  const checkAudioAvailability = useCallback(async () => {
    if (!selectedVerse) {
      setAudioAvailable(false);
      return;
    }
    
    // Skip audio check for Gita content - Gita doesn't have audio files
    if (currentSource === 'gita') {
      setAudioAvailable(false);
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/audio/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}`;
      const response = await fetch(url, { method: 'HEAD' }); // HEAD request to just check existence
      setAudioAvailable(response.ok);
      
      // Only log unexpected errors, not 404s which are normal for missing audio
      if (!response.ok && response.status !== 404) {
        console.warn(`Unexpected error checking audio availability: ${response.status}`);
      }
    } catch (error) {
      // Suppress network errors for audio checks since backend may not be running
      setAudioAvailable(false);
    }
  }, [selectedVerse, selectedBookAbbr, currentChapter, currentSource]);

  // Consolidated URL handling - parse URL and set initial state
  useEffect(() => {
    const path = location.pathname;
    const pathParts = path.split('/').filter(part => part);
    
    if (pathParts.length >= 3) {
      // Check if first part is a source
      const isSourceBased = TEXT_SOURCES[pathParts[0]];
      
      if (isSourceBased) {
        // URL format: /source/book/chapter/verse
        const [sourceParam, bookParam, chapterParam, verseParam] = pathParts;
        const newSource = sourceParam;
        const newBook = bookParam;
        const newChapter = parseInt(chapterParam) || 1;
        const newVerseNumber = parseInt(verseParam) || 1;
        
        // Validate book identifier for the source
        if (newSource === 'gita' && newBook !== 'a') {
          console.warn(`Invalid Gita URL: book should be "a", got "${newBook}". Redirecting...`);
          navigate(`/gita/a/${newChapter}/${newVerseNumber}`, { replace: true });
          return;
        }
        if (newSource === 'bible' && newBook === 'a') {
          console.warn(`Invalid Bible URL: book should not be "a", got "${newBook}". Redirecting to Genesis...`);
          navigate(`/bible/Gn/${newChapter}/${newVerseNumber}`, { replace: true });
          return;
        }
        
        // Update all state together to prevent race conditions
        const needsSourceUpdate = currentSource !== newSource;
        const needsBookUpdate = selectedBookAbbr !== newBook;
        const needsChapterUpdate = currentChapter !== newChapter;
        
        if (needsSourceUpdate || needsBookUpdate || needsChapterUpdate) {
          // Use React 18's automatic batching by updating all state together
          if (needsSourceUpdate) setCurrentSource(newSource);
          if (needsBookUpdate) setSelectedBookAbbr(newBook);
          if (needsChapterUpdate) setCurrentChapter(newChapter);
        }
      } else {
        // Legacy URL format: /book/chapter/verse (default to bible)
        const [bookParam, chapterParam, verseParam] = pathParts;
        const newBook = bookParam;
        const newChapter = parseInt(chapterParam) || 1;
        const newVerseNumber = parseInt(verseParam) || 1;
        
        // Default to bible source for legacy URLs
        if (currentSource !== 'bible') {
          setCurrentSource('bible');
        }
        
        // Only update if different to prevent unnecessary re-renders
        if (selectedBookAbbr !== newBook) {
          setSelectedBookAbbr(newBook);
        }
        if (currentChapter !== newChapter) {
          setCurrentChapter(newChapter);
        }
      }
      
      // If verses are already loaded, select the verse immediately
      if (verses.length > 0) {
        const targetVerseNumber = isSourceBased && pathParts[3] ? parseInt(pathParts[3]) : parseInt(pathParts[2]) || 1;
        const targetVerse = verses.find(v => v.verse_number === targetVerseNumber);
        if (targetVerse && (!selectedVerse || selectedVerse.verse_number !== targetVerseNumber)) {
          setSelectedVerse(targetVerse);
        }
      }
    } else if (pathParts.length === 0) {
      // Root path - default to Bible Genesis 1:1
      navigate('/bible/Gn/1/1', { replace: true });
      return;
    }
  }, [location.pathname, navigate, selectedBookAbbr, currentChapter, currentSource, verses, selectedVerse]);

  // Update URL when navigation changes (only when user manually changes selection)
  const updateURL = useCallback((book: string, chapter: number, verse: number) => {
    const newPath = `/${currentSource}/${book}/${chapter}/${verse}`;
    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  }, [navigate, location.pathname, currentSource]);

  // Fetch books on initial load - using DataService
  useEffect(() => {
    const dataService = DataServiceFactory.create(currentSource);
    
    dataService.getBooks()
      .then((data) => {
        setBooks(data);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setBooks([]);
      });
  }, [currentSource]);

  // Fetch chapters when book changes - using DataService
  useEffect(() => {
    // Don't make the request until we have a valid book abbreviation
    if (!selectedBookAbbr) return;

    const dataService = DataServiceFactory.create(currentSource);
    
    dataService.getChapters(selectedBookAbbr)
       .then((chapters) => {
         setChapters(chapters);
       })
       .catch((err) => console.error("Error fetching chapters:", err));
  }, [selectedBookAbbr, currentSource]);

  // Fetch verses when chapter changes - using DataService
  useEffect(() => {
    // Ensure we have both a book abbreviation and a valid chapter before fetching verses
    if (!selectedBookAbbr || currentChapter < 1) return;

    // Validate that the book abbreviation matches the current source
    // If there's a mismatch, it likely means state is still synchronizing, so skip this render
    if (currentSource === 'gita' && selectedBookAbbr !== 'a') {
      console.warn(`Invalid Gita book identifier: ${selectedBookAbbr} (should be "a") - state may be synchronizing`);
      return;
    }
    if (currentSource === 'bible' && selectedBookAbbr === 'a') {
      console.warn(`Invalid Bible book identifier: ${selectedBookAbbr} (should not be "a") - state may be synchronizing`);
      return;
    }

    const dataService = DataServiceFactory.create(currentSource);
    
    dataService.getVerses(selectedBookAbbr, currentChapter)
       .then((data) => {
         setVerses(data);
         
         // After fetching verses, check if we need to select a specific verse from URL
         const path = location.pathname;
         const pathParts = path.split('/').filter(part => part);
         // Handle both source-based and legacy URLs
         const verseParam = pathParts.length >= 4 ? pathParts[3] : pathParts[2];
         if (verseParam) {
           const targetVerseNumber = parseInt(verseParam) || 1;
           const targetVerse = data.find(v => v.verse_number === targetVerseNumber);
           
           if (targetVerse) {
             setSelectedVerse(targetVerse);
           } else if (data.length > 0) {
             // Fallback to first verse if target verse not found
             setSelectedVerse(data[0]);
           }
         } else if (data.length > 0 && !selectedVerse) {
           // No URL verse specified, default to first verse
           setSelectedVerse(data[0]);
         }
       })
       .catch((err) => {
         console.error("Error fetching verses:", err);
         setVerses([]);
       });
  }, [currentChapter, selectedBookAbbr, currentSource, location.pathname]);

  // Save edited grammar breakdown
  const saveEdit = async () => {
    if (!editState.editingWord || !selectedVerse || !selectedBookAbbr) return;

    try {
      const response = await fetch(`${API_BASE_URL}/analysis/grammar/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book: selectedBookAbbr,
          chapter: currentChapter,
          verse: selectedVerse.verse_number,
          word: editState.editingWord,
          meaning: editState.editMeaning,
          grammar_description: editState.editGrammarDescription,
          part_of_speech: editState.editPartOfSpeech,
          morphology: editState.editMorphology
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setNotification({
          message: `Grammar for "${editState.editingWord}" updated successfully!`,
          type: 'success'
        });
        
        // Update local state
        setVerseAnalysisState(prev => ({
          ...prev,
          grammarBreakdown: prev.grammarBreakdown.map(item => 
            item.word === editState.editingWord 
              ? {
                  ...item,
                  meaning: editState.editMeaning,
                  grammar_description: editState.editGrammarDescription,
                  part_of_speech: editState.editPartOfSpeech
                }
              : item
          )
        }));
        
        cancelEditing();
        loadQueue(); // Refresh queue
      } else {
        throw new Error(result.detail || 'Failed to save edit');
      }
    } catch (error) {
      console.error('Error saving edit:', error);
      setNotification({
        message: "Failed to save edit",
        type: 'error'
      });
    }
  };

  // Navigate to verse from queue
  const handleQueueNavigate = (book: string, chapter: number, verse: number) => {
    // Update state first to prevent flickering
    if (book !== selectedBookAbbr) {
      setSelectedBookAbbr(book);
    }
    if (chapter !== currentChapter) {
      setCurrentChapter(chapter);
    }
    navigate(`/${currentSource}/${book}/${chapter}/${verse}`);
  };

  // Load queue on component mount
  useEffect(() => {
    loadQueue();
    // Check if OpenAI is available
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

  // Check if OpenAI is available
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

  // Load queue on component mount
  useEffect(() => {
    loadQueue();
    // Check if OpenAI is available
    checkOpenAIAvailability();
  }, []);



  // Navigation state to prevent rapid clicks and race conditions
  const [navigationInProgress, setNavigationInProgress] = useState(false);
  
  // Floating translation icon state
  const [showFloatingTranslation, setShowFloatingTranslation] = useState(false);
  const [brainButtonHovered, setBrainButtonHovered] = useState(false);
  const [hoverTimeoutId, setHoverTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Hide floating translation icon when clicking outside (only for explicit show, not hover)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFloatingTranslation && !brainButtonHovered) {
        const target = event.target as HTMLElement;
        if (!target.closest('.floating-translation-container')) {
          setShowFloatingTranslation(false);
        }
      }
    };

    if (showFloatingTranslation) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFloatingTranslation, brainButtonHovered]);

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutId) {
        clearTimeout(hoverTimeoutId);
      }
    };
  }, [hoverTimeoutId]);

  // Enhanced navigation functions for cross-chapter support with proper synchronization
  const navigateToPreviousVerse = async () => {
    if (!selectedVerse || navigationInProgress || isTransitioning) return;
    
    setNavigationInProgress(true);
    
    try {
      if (selectedVerse.verse_number > 1) {
        // Navigate within current chapter
        handleVerseChangeWithAnimation(selectedVerse.verse_number - 1, 'slide-up');
      } else if (currentChapter > 1) {
        // Navigate to last verse of previous chapter
        const previousChapter = currentChapter - 1;
        
        try {
          // Fetch the verses for the previous chapter first using new unified endpoint
          const response = await fetch(`${API_BASE_URL}/texts/${currentSource}/${selectedBookAbbr}/${previousChapter}`);
          if (!response.ok) throw new Error('Failed to fetch verses');
          
          const previousChapterVerses = await response.json();
          const lastVerseNumber = previousChapterVerses.length > 0 ? previousChapterVerses[previousChapterVerses.length - 1].verse_number : 1;
          
          console.log(`Cross-chapter navigation: Going to ${selectedBookAbbr} ${previousChapter}:${lastVerseNumber}`);
          
          // Update chapter first, then URL - this will trigger verse loading
          setCurrentChapter(previousChapter);
          
          // Small delay to let chapter change take effect
          setTimeout(() => {
            updateURL(selectedBookAbbr, previousChapter, lastVerseNumber);
          }, 50);
          
        } catch (error) {
          console.error('Error navigating to previous chapter:', error);
          // Fallback: just go to verse 1 of previous chapter
          setCurrentChapter(currentChapter - 1);
          setTimeout(() => {
            updateURL(selectedBookAbbr, currentChapter - 1, 1);
          }, 50);
        }
      }
    } finally {
      // Reset navigation lock after a delay
      setTimeout(() => {
        setNavigationInProgress(false);
      }, 300);
    }
  };

  const navigateToNextVerse = async () => {
    if (!selectedVerse || navigationInProgress || isTransitioning) return;
    
    setNavigationInProgress(true);
    
    try {
      if (selectedVerse.verse_number < verses.length) {
        // Navigate within current chapter
        handleVerseChangeWithAnimation(selectedVerse.verse_number + 1, 'slide-down');
      } else if (currentChapter < chapters.length) {
        // Navigate to verse 1 of next chapter
        const nextChapter = currentChapter + 1;
        
        console.log(`Cross-chapter navigation: Going to ${selectedBookAbbr} ${nextChapter}:1`);
        
        // Update chapter first, then URL
        setCurrentChapter(nextChapter);
        
        // Small delay to let chapter change take effect
        setTimeout(() => {
          updateURL(selectedBookAbbr, nextChapter, 1);
        }, 50);
      }
    } finally {
      // Reset navigation lock after a delay
      setTimeout(() => {
        setNavigationInProgress(false);
      }, 300);
    }
  };

  // Enhanced keyboard navigation with audio controls and language/book switching
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keys if no input/textarea is focused and not during transitions
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                             activeElement?.tagName === 'TEXTAREA' || 
                             activeElement?.getAttribute('contenteditable') === 'true';
      
      if (isInputFocused || isTransitioning || !selectedVerse) return;
      
      console.log('Key pressed:', event.key, 'Shift:', event.shiftKey); // Debug log
      
      // Audio controls
      if (event.key.toLowerCase() === 'r' && event.metaKey && event.shiftKey) {
        event.preventDefault();
        console.log('Cmd+Shift+R - triggering record'); // Debug log
        handleRecordClick();
      } else if (event.key.toLowerCase() === 'p') {
        event.preventDefault();
        console.log('P key - triggering play'); // Debug log
        if (audioAvailable) {
          if (isPlaying) {
            if (audioSource) audioSource.stop();
            setIsPlaying(false);
            setAudioSource(null);
            setCurrentlyPlayingWordIndex(null);
          } else {
            playAudioWithWordHighlighting();
          }
        }
      } else if (event.key.toLowerCase() === 'g') {
        event.preventDefault();
        console.log('G key - triggering analysis'); // Debug log
        const fakeEvent = { altKey: false, preventDefault: () => {} } as React.MouseEvent;
        handleEnhanceClick(fakeEvent);
      }
      // Navigation controls with Shift key enhancements
      else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (event.shiftKey) {
          // Shift + Left: Change language (previous)
          const availableLanguages = Object.keys(verseAnalysisState.translations || {});
          if (availableLanguages.length > 0) {
            const currentIndex = availableLanguages.indexOf(selectedTranslationLang);
            const prevIndex = currentIndex <= 0 ? availableLanguages.length - 1 : currentIndex - 1;
            setSelectedTranslationLang(availableLanguages[prevIndex]);
            console.log('Language changed to:', availableLanguages[prevIndex]);
          }
        } else {
          navigateToPreviousVerse();
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (event.shiftKey) {
          // Shift + Right: Change language (next)
          const availableLanguages = Object.keys(verseAnalysisState.translations || {});
          if (availableLanguages.length > 0) {
            const currentIndex = availableLanguages.indexOf(selectedTranslationLang);
            const nextIndex = currentIndex >= availableLanguages.length - 1 ? 0 : currentIndex + 1;
            setSelectedTranslationLang(availableLanguages[nextIndex]);
            console.log('Language changed to:', availableLanguages[nextIndex]);
          }
        } else {
          navigateToNextVerse();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (event.shiftKey) {
          // Shift + Up: Change book (previous)
          const currentBookIndex = books.findIndex(b => b.latin_name === selectedBookAbbr);
          if (currentBookIndex > 0) {
            const previousBook = books[currentBookIndex - 1];
            setSelectedBookAbbr(previousBook.latin_name);
            updateURL(previousBook.latin_name, 1, 1);
            console.log('Book changed to:', previousBook.latin_name);
          }
        } else {
          if (currentChapter > 1) {
            setCurrentChapter(currentChapter - 1);
            updateURL(selectedBookAbbr, currentChapter - 1, 1);
          }
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (event.shiftKey) {
          // Shift + Down: Change book (next)
          const currentBookIndex = books.findIndex(b => b.latin_name === selectedBookAbbr);
          if (currentBookIndex >= 0 && currentBookIndex < books.length - 1) {
            const nextBook = books[currentBookIndex + 1];
            setSelectedBookAbbr(nextBook.latin_name);
            updateURL(nextBook.latin_name, 1, 1);
            console.log('Book changed to:', nextBook.latin_name);
          }
        } else {
          if (currentChapter < chapters.length) {
            setCurrentChapter(currentChapter + 1);
            updateURL(selectedBookAbbr, currentChapter + 1, 1);
          }
        }
      }
      // Word navigation with , and . keys
      else if (event.key === ',') { // , = previous word
        event.preventDefault();
        if (selectedVerse) {
          const words = (selectedVerse.macronized_text || selectedVerse.text).split(' ');
          if (words.length > 0) {
            const currentIndex = verseAnalysisState.selectedWordIndex;
            console.log('Current selectedWordIndex:', currentIndex);
            
            let prevIndex;
            if (currentIndex === null || currentIndex === undefined) {
              // First time pressing comma - go to last word
              prevIndex = words.length - 1;
            } else {
              // Normal navigation - go to previous word (with wraparound)
              prevIndex = currentIndex > 0 ? currentIndex - 1 : words.length - 1;
            }
            
            handleWordClick(prevIndex);
            console.log('Navigate to previous word:', prevIndex, 'of', words.length, 'from index:', currentIndex);
          }
        }
      } else if (event.key === '.') { // . = next word
        event.preventDefault();
        if (selectedVerse) {
          const words = (selectedVerse.macronized_text || selectedVerse.text).split(' ');
          if (words.length > 0) {
            const currentIndex = verseAnalysisState.selectedWordIndex;
            console.log('Current selectedWordIndex:', currentIndex);
            
            let nextIndex;
            if (currentIndex === null || currentIndex === undefined) {
              // First time pressing period - go to first word
              nextIndex = 0;
            } else {
              // Normal navigation - go to next word (with wraparound)
              nextIndex = (currentIndex + 1) % words.length;
            }
            
            handleWordClick(nextIndex);
            console.log('Navigate to next word:', nextIndex, 'of', words.length, 'from index:', currentIndex);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedVerse, verses.length, isTransitioning, currentChapter, chapters.length, selectedBookAbbr, updateURL, navigationInProgress, audioAvailable, isPlaying, audioSource, verseAnalysisState.translations, verseAnalysisState.selectedWordIndex, selectedTranslationLang, setSelectedTranslationLang, books]);

  // Ensure all supported translations are available
  const ensureAllTranslationsAvailable = async () => {
    if (!selectedVerse) return;

    const supportedLanguages = LANGUAGES.map(lang => lang.code);
    const currentTranslations = verseAnalysisState.translations || {};
    const missingLanguages = supportedLanguages.filter(lang => !currentTranslations[lang]);

    if (missingLanguages.length === 0) {
      console.log('All translations already available');
      return;
    }

    console.log(`Fetching missing translations for: ${missingLanguages.join(', ')}`);
    setIsGeneratingTranslations(true);

    // Fetch missing translations in parallel
    const translationPromises = missingLanguages.map(async (language) => {
      try {
        const response = await fetch(`${API_BASE_URL}/dictionary/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            verse: selectedVerse.macronized_text || selectedVerse.text, 
            language: language,
            include_both_types: true
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Format the translation with both types if available
            let formattedTranslation = '';
            if (result.literal && result.dynamic) {
              formattedTranslation = `Literal: ${result.literal}\n\nDynamic: ${result.dynamic}`;
            } else if (result.literal) {
              formattedTranslation = `Literal: ${result.literal}`;
            } else if (result.dynamic) {
              formattedTranslation = `Dynamic: ${result.dynamic}`;
            } else {
              // Fallback to single translation
              formattedTranslation = result.translation || '';
            }
            return { language, translation: formattedTranslation };
          }
        }
        console.warn(`Failed to fetch translation for ${language}`);
        return null;
      } catch (error) {
        console.error(`Error fetching translation for ${language}:`, error);
        return null;
      }
    });

    const results = await Promise.all(translationPromises);
    const newTranslations: { [key: string]: string } = {};

    results.forEach(result => {
      if (result) {
        newTranslations[result.language] = result.translation;
      }
    });

    if (Object.keys(newTranslations).length > 0) {
              // Update verse analysis state with new translations
        setVerseAnalysisState(prev => ({
          ...prev,
          translations: {
            ...prev.translations,
            ...newTranslations
          }
        }));

        // Update available translations
        setAvailableTranslations(prev => ({
          ...prev,
          ...newTranslations
        }));

        // Cache the updated translations to localStorage
        const verseRef = `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`;
        const cacheKey = `verse_analysis_${verseRef}`;
        try {
          const existingCache = localStorage.getItem(cacheKey);
          if (existingCache) {
            const cachedData = JSON.parse(existingCache);
            cachedData.translations = {
              ...cachedData.translations,
              ...newTranslations
            };
            localStorage.setItem(cacheKey, JSON.stringify(cachedData));
            console.log(`Updated cached translations for ${verseRef}`);
          }
        } catch (error) {
          console.warn('Failed to update cached translations:', error);
        }

        console.log(`Successfully fetched ${Object.keys(newTranslations).length} translations`);
    }

    setIsGeneratingTranslations(false);
  };

  const loadOpenAIAnalysis = async () => {
    if (!selectedVerse) return;
    
    const verseRef = `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`;
    console.log(`Loading OpenAI analysis for: ${verseRef}`);
    
    setIsOpenAIAnalyzing(true);
    setTheologicalInterpretation('🤖 Analyzing with AI and fetching translations...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/dictionary/analyze/verse/openai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          verse: selectedVerse.macronized_text || selectedVerse.text, 
          reference: verseRef,
          include_translations: true // Request translations with analysis
        })
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          setTheologicalInterpretation(`❌ ${errorData.detail}`);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const analysisResult = await response.json();

      if (analysisResult.success) {
        const newAnalysis: VerseAnalysis = {};
        const newGrammarBreakdown: GrammarItem[] = [];

        // Process word analysis
        if (analysisResult.word_analysis && Array.isArray(analysisResult.word_analysis)) {
          analysisResult.word_analysis.forEach((item: any) => {
            newAnalysis[normalizeLatin(item.latin)] = {
              latin: item.latin,
              definition: item.definition,
              etymology: item.etymology,
              partOfSpeech: item.part_of_speech,
              morphology: item.morphology,
              pronunciation: item.pronunciation,
              source: 'openai_enhanced',
              confidence: 1.0,
              found: true
            };

            newGrammarBreakdown.push({
              word: item.latin,
              meaning: item.definition,
              part_of_speech: item.part_of_speech
            });
          });
        }
        
        // Update verse analysis state with OpenAI data including translations
        setVerseAnalysisState((prev: VerseAnalysisState) => ({
          ...prev,
          analysis: newAnalysis,
          grammarBreakdown: newGrammarBreakdown,
          isAnalysisDone: true,
          theological_layer: analysisResult.theological_layer || [],
          symbolic_layer: analysisResult.symbolic_layer || [],
          cosmological_layer: analysisResult.cosmological_layer || [],
          translations: {
            ...prev.translations,
            ...(analysisResult.translations || {})
          },
          isLoading: false,
          loadingMessage: ''
        }));

        // Update available translations state
        if (analysisResult.translations) {
          setAvailableTranslations(prev => ({
            ...prev,
            ...analysisResult.translations
          }));
        }

        // Update theological interpretation
        let interpretation = '';
        
        if (analysisResult.theological_layer && Array.isArray(analysisResult.theological_layer)) {
          interpretation += '🕊️ Theological Layer (AI Enhanced):\n' + analysisResult.theological_layer.join('\n') + '\n\n';
        }
        if (analysisResult.symbolic_layer && Array.isArray(analysisResult.symbolic_layer)) {
          interpretation += '🧠 Symbolic Layer (Jungian & Campbell):\n' + analysisResult.symbolic_layer.join('\n') + '\n\n';
        }
        if (analysisResult.cosmological_layer && Array.isArray(analysisResult.cosmological_layer)) {
          interpretation += '🌌 Cosmological Layer:\n' + analysisResult.cosmological_layer.join('\n');
        }
        
        setTheologicalInterpretation((interpretation || 'AI analysis complete.') + ' 🤖 Enhanced with Greb AI + Translations');
        
        // Cache the OpenAI results with enhanced translation data
        try {
          const cacheKey = `verse_analysis_${verseRef}`;
          const cacheData = {
            ...analysisResult,
            cached_at: new Date().toISOString(),
            cache_type: 'openai_enhanced'
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
          console.log(`Cached OpenAI analysis with translations for ${verseRef}`);
        } catch (error) {
          console.warn('Failed to cache OpenAI analysis:', error);
        }

        // Check if we need to fetch missing translations
        await ensureAllTranslationsAvailable();
        
      } else {
        setTheologicalInterpretation('❌ Greb AI analysis failed');
      }
    } catch (error) {
      console.error("Error in OpenAI analysis:", error);
      setTheologicalInterpretation('❌ Greb AI analysis error - using basic analysis');
    } finally {
      setIsOpenAIAnalyzing(false);
    }
  };

  const translateVerse = async (language: string) => {
    if (!selectedVerse) return;
    
    setIsTranslating(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/dictionary/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          verse: selectedVerse.macronized_text || selectedVerse.text, 
          language: language,
          include_both_types: true // Request both literal and dynamic translations
        })
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          console.error(`Translation error: ${errorData.detail}`);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const translationResult = await response.json();

      if (translationResult.success) {
        // Format the translation with both types if available
        let formattedTranslation = '';
        if (translationResult.literal && translationResult.dynamic) {
          formattedTranslation = `Literal: ${translationResult.literal}\n\nDynamic: ${translationResult.dynamic}`;
        } else if (translationResult.literal) {
          formattedTranslation = `Literal: ${translationResult.literal}`;
        } else if (translationResult.dynamic) {
          formattedTranslation = `Dynamic: ${translationResult.dynamic}`;
        } else {
          // Fallback to single translation
          formattedTranslation = translationResult.translation || '';
        }
        
        // Update available translations
        setAvailableTranslations(prev => ({
          ...prev,
          [language]: formattedTranslation
        }));
        
        // Update verse analysis state
        setVerseAnalysisState(prev => ({
          ...prev,
          translations: {
            ...prev.translations,
            [language]: formattedTranslation
          }
        }));
        
        // Cache the individual translation to localStorage
        const verseRef = `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`;
        const cacheKey = `verse_analysis_${verseRef}`;
        try {
          const existingCache = localStorage.getItem(cacheKey);
          if (existingCache) {
            const cachedData = JSON.parse(existingCache);
            if (!cachedData.translations) {
              cachedData.translations = {};
            }
            cachedData.translations[language] = formattedTranslation;
            localStorage.setItem(cacheKey, JSON.stringify(cachedData));
            console.log(`Cached individual translation for ${language} in ${verseRef}`);
          }
        } catch (error) {
          console.warn(`Failed to cache translation for ${language}:`, error);
        }
        
        console.log(`Translation to ${language} completed`);
      }
    } catch (error) {
      console.error(`Error translating to ${language}:`, error);
    } finally {
      setIsTranslating(false);
    }
  };
  
  // Enhanced Greb AI click handler
  const handleEnhanceClick = async (event: React.MouseEvent) => {
    if (!selectedVerse || isOpenAIAnalyzing) return;
    
    // Run Greb AI enhancement
    await loadOpenAIAnalysis();
  };
  
  // Force generate all translations
  const handleForceTranslations = async () => {
    if (!selectedVerse) return;
    
    setIsGeneratingTranslations(true);
    setShowFloatingTranslation(false); // Hide the floating icon
    
    try {
      // Force fetch all supported languages
      const allLanguages = LANGUAGES.map(lang => lang.code);
      
      const translationPromises = allLanguages.map(async (language) => {
        try {
          const response = await fetch(`${API_BASE_URL}/dictionary/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              verse: selectedVerse.text, 
              language: language,
              force: true, // Force regeneration
              include_both_types: true
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              // Format the translation with both types if available
              let formattedTranslation = '';
              if (result.literal && result.dynamic) {
                formattedTranslation = `Literal: ${result.literal}\n\nDynamic: ${result.dynamic}`;
              } else if (result.literal) {
                formattedTranslation = `Literal: ${result.literal}`;
              } else if (result.dynamic) {
                formattedTranslation = `Dynamic: ${result.dynamic}`;
              } else {
                // Fallback to single translation
                formattedTranslation = result.translation || '';
              }
              return { language, translation: formattedTranslation };
            }
          }
          console.warn(`Failed to force generate translation for ${language}`);
          return null;
        } catch (error) {
          console.error(`Error force generating translation for ${language}:`, error);
          return null;
        }
      });

      const results = await Promise.all(translationPromises);
      const newTranslations: { [key: string]: string } = {};

      results.forEach(result => {
        if (result) {
          newTranslations[result.language] = result.translation;
        }
      });

      if (Object.keys(newTranslations).length > 0) {
        // Update verse analysis state with new translations
        setVerseAnalysisState(prev => ({
          ...prev,
          translations: {
            ...prev.translations,
            ...newTranslations
          }
        }));

        // Cache the force-generated translations to localStorage
        const verseRef = `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`;
        const cacheKey = `verse_analysis_${verseRef}`;
        try {
          const existingCache = localStorage.getItem(cacheKey);
          if (existingCache) {
            const cachedData = JSON.parse(existingCache);
            cachedData.translations = {
              ...cachedData.translations,
              ...newTranslations
            };
            localStorage.setItem(cacheKey, JSON.stringify(cachedData));
            console.log(`Force-cached translations for ${verseRef}`);
          } else {
            // Create new cache entry with translations
            const newCacheData = {
              translations: newTranslations,
              cached_at: new Date().toISOString()
            };
            localStorage.setItem(cacheKey, JSON.stringify(newCacheData));
            console.log(`Created new translation cache for ${verseRef}`);
          }
        } catch (error) {
          console.warn('Failed to cache force-generated translations:', error);
        }

        console.log(`Force generated ${Object.keys(newTranslations).length} translations`);
      }
    } catch (error) {
      console.error('Error force generating translations:', error);
    } finally {
      setIsGeneratingTranslations(false);
    }
  };

  const handleVerseChangeWithAnimation = (verseNumber: number, animation: 'slide-down' | 'slide-up') => {
    if (verseNumber >= 1 && verseNumber <= verses.length && !isTransitioning) {
      const newVerse = verses.find(v => v.verse_number === verseNumber);
      if (newVerse) {
        setIsTransitioning(true);
        setVerseAnimation(animation);
        
        // Start the animation
        setTimeout(() => {
          setIsNavigating(true);
          setSelectedVerse(newVerse);
          updateURL(selectedBookAbbr, currentChapter, verseNumber);
          
          // Reset animation and navigation flags
          setTimeout(() => {
            setVerseAnimation('none');
            setIsNavigating(false);
            setIsTransitioning(false);
          }, 500); // Animation duration
        }, 50); // Small delay to ensure animation starts
      }
    }
  };

  const handleVerseChange = (verseNumber: number) => {
    if (verseNumber >= 1 && verseNumber <= verses.length) {
      const newVerse = verses.find(v => v.verse_number === verseNumber);
      if (newVerse) {
        setIsNavigating(true);
        setSelectedVerse(newVerse);
        updateURL(selectedBookAbbr, currentChapter, verseNumber);
        // Reset navigation flag after a short delay
        setTimeout(() => setIsNavigating(false), 100);
      }
    }
  };

  const handleNavigateToOccurrence = (book: string, chapter: number, verse: number) => {
    // Update state first to prevent flickering
    if (book !== selectedBookAbbr) {
      setSelectedBookAbbr(book);
    }
    if (chapter !== currentChapter) {
      setCurrentChapter(chapter);
    }
    // URL will be updated by the URL parsing effect
    navigate(`/${currentSource}/${book}/${chapter}/${verse}`);
  };

  // Handle source change
  const handleSourceChange = (newSource: string) => {
    setCurrentSource(newSource);
    // Reset to first book and chapter when switching sources
    const defaultBook = newSource === 'gita' ? 'a' : 'Gn';
    setSelectedBookAbbr(defaultBook);
    setCurrentChapter(1);
    setSelectedVerse(null); // Clear current verse
    navigate(`/${newSource}/${defaultBook}/1/1`, { replace: true });
  };
  
  const loadQueue = async () => {
    try {
      setIsLoadingQueue(true);
      const response = await fetch(`${API_BASE_URL}/analysis/queue`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQueueItems(data);
    } catch (error) {
      console.error('Error loading queue:', error);
    } finally {
      setIsLoadingQueue(false);
    }
  };
  
  const loadCompleteAnalysis = async () => {
    if (!selectedVerse) return;
    await analyzeVerse();
  };

  const cancelEditing = () => {
    setEditState({
      isEditing: false,
      editingWord: null,
      editMeaning: '',
      editGrammarDescription: '',
      editPartOfSpeech: '',
      editMorphology: ''
    });
  };

  const handleWordClick = (index: number) => {
    if (!selectedVerse) return;
    const words = (selectedVerse.macronized_text || selectedVerse.text).split(' ');
    const word = words[index];
    const cleanWord = word.replace(/[.,:;?!]$/, '');
    const normalized = normalizeLatin(cleanWord);
    
    console.log('handleWordClick called with index:', index, 'word:', word, 'normalized:', normalized);
    
    setVerseAnalysisState(prev => {
      console.log('Previous selectedWordIndex:', prev.selectedWordIndex, 'Setting to:', index);
      return {
        ...prev,
        selectedWord: normalized,
        selectedWordIndex: index,
        wordInfo: prev.analysis[normalized] || null
      };
    });
  };

  const playAudio = async (startIndex: number, autoPlay: boolean) => {
    if (!selectedVerse || !audioContext) return;

    try {
      const response = await fetch(`${API_BASE_URL}/audio/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}`);
      if (!response.ok) throw new Error('Audio not available');
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      if (audioSource) {
        audioSource.stop();
        audioSource.disconnect();
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      setAudioSource(source);
      source.start(0);
      setIsPlaying(true);
      
      source.onended = () => {
        setIsPlaying(false);
        setAudioSource(null);
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      setAudioSource(null);
    }
  };

  // Enhanced audio playback with word-by-word highlighting
  const playAudioWithWordHighlighting = async () => {
    if (!selectedVerse || !audioContext) return;

    try {
      const response = await fetch(`${API_BASE_URL}/audio/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}`);
      if (!response.ok) throw new Error('Audio not available');
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      if (audioSource) {
        audioSource.stop();
        audioSource.disconnect();
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      setAudioSource(source);
      source.start(0);
      setIsPlaying(true);
      
      // Word highlighting logic
      const words = (selectedVerse.macronized_text || selectedVerse.text).split(' ');
      const totalDuration = audioBuffer.duration;
      const wordDuration = totalDuration / words.length;
      
      // Start word highlighting sequence
      words.forEach((_, index) => {
        setTimeout(() => {
          setCurrentlyPlayingWordIndex(index);
        }, index * wordDuration * 1000);
      });
      
      // Clear highlighting when audio ends
      setTimeout(() => {
        setCurrentlyPlayingWordIndex(null);
      }, totalDuration * 1000);
      
      source.onended = () => {
        setIsPlaying(false);
        setAudioSource(null);
        setCurrentlyPlayingWordIndex(null);
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      setAudioSource(null);
      setCurrentlyPlayingWordIndex(null);
    }
  };

  const handleGrebAIDefinition = async (word: string) => {
    if (!word) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/dictionary/lookup/${encodeURIComponent(word)}?regenerate=true`);
      if (!response.ok) throw new Error('Failed to get definition');
      
      const data = await response.json();
      setVerseAnalysisState(prev => ({
        ...prev,
        wordInfo: data
      }));
    } catch (error) {
      console.error('Error getting Greb AI definition:', error);
    }
  };

  const analyzeVerse = async () => {
    if (!selectedVerse) return;

    setVerseAnalysisState(prev => ({
      ...prev,
      isLoading: true,
      loadingMessage: 'Analyzing verse...'
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/dictionary/analyze/verse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verse: selectedVerse.macronized_text || selectedVerse.text,
          reference: `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`,
          include_translations: true,
          include_theological: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Determine first word info for auto-select
      const firstWordRaw = data.full_analysis?.word_analysis?.[0]?.latin || '';
      const firstWordNorm = normalizeLatin(firstWordRaw);

      setVerseAnalysisState(prev => ({
        ...prev,
        analysis: data.analysis || {},
        grammarBreakdown: data.full_analysis?.word_analysis || [],
        translations: data.full_analysis?.translations || {},
        theological_layer: data.full_analysis?.theological_layer || [],
        symbolic_layer: data.full_analysis?.symbolic_layer || [],
        cosmological_layer: data.full_analysis?.cosmological_layer || [],
        isAnalysisDone: true,
        isLoading: false,
        loadingMessage: '',
        selectedWord: firstWordNorm,
        selectedWordIndex: 0,
        wordInfo: (data.analysis || {})[firstWordNorm] || null
      }));

      // Cache the analysis result with enhanced data
      const verseRef = `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`;
      const cacheKey = `verse_analysis_${verseRef}`;
      const cacheData = {
        ...data,
        cached_at: new Date().toISOString(),
        cache_type: 'standard_analysis'
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log(`Cached standard analysis with translations for ${verseRef}`);

      // Ensure all translations are available after analysis
      await ensureAllTranslationsAvailable();

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
  };



  return (
    <div className="min-h-screen bg-[#fefaf0] text-black p-8">
      {/* Inject custom CSS */}
              <AppStyles />
      
      {/* Header with source selector and title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Dynamic Icon based on source */}
          <div className="w-16 h-16 flex items-center justify-center text-4xl opacity-90 hover:opacity-100 transition-opacity duration-200">
            {TEXT_SOURCES[currentSource]?.icon || '📖'}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">
              {TEXT_SOURCES[currentSource]?.name.toUpperCase() || 'TEXT READER'}
            </h1>
            <p className="text-gray-600 italic text-sm">
              {TEXT_SOURCES[currentSource]?.displayName}
            </p>
          </div>
        </div>
        
        {/* Source Selector */}
        <SourceDropdown 
          currentSource={currentSource}
          onSourceChange={handleSourceChange}
        />
      </div>

      {/* Main layout - single column for verse, then 2 columns for analysis */}
      <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto">
        {/* Verse section - full width at top */}
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
          navigationInProgress={navigationInProgress}
          isTransitioning={isTransitioning}
          
          // Verse analysis state
          verseAnalysisState={verseAnalysisState}
          
          // Translation props
          selectedTranslationLang={selectedTranslationLang}
          setSelectedTranslationLang={setSelectedTranslationLang}
          
          // Audio props
          audioAvailable={audioAvailable}
          isPlaying={isPlaying}
          audioSource={audioSource}
          setIsPlaying={setIsPlaying}
          setAudioSource={setAudioSource}
          currentlyPlayingWordIndex={currentlyPlayingWordIndex}
          
          // Recording props
          isRecording={isRecording}
          recording={recording}
          isUploading={isUploading}
          uploadSuccess={uploadSuccess}
          uploadStatus={uploadStatus}
          
          // AI Analysis props
          isOpenAIAnalyzing={isOpenAIAnalyzing}
          brainButtonHovered={brainButtonHovered}
          setBrainButtonHovered={setBrainButtonHovered}
          hoverTimeoutId={hoverTimeoutId}
          setHoverTimeoutId={setHoverTimeoutId}
          showFloatingTranslation={showFloatingTranslation}
          isGeneratingTranslations={isGeneratingTranslations}
          
          // Animation props
          verseAnimation={verseAnimation}
          
          // Event handlers
          navigateToPreviousVerse={navigateToPreviousVerse}
          navigateToNextVerse={navigateToNextVerse}
          updateURL={updateURL}
          handleVerseChange={handleVerseChange}
          setIsBookInfoOpen={setIsBookInfoOpen}
          handleWordClick={handleWordClick}
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
        <div className="flex gap-8 flex-wrap">
          {/* Analysis column */}
                      <AnalysisColumnComponent
              verseAnalysisState={verseAnalysisState}
              theologicalInterpretation={theologicalInterpretation}
              onNavigateToOccurrence={handleNavigateToOccurrence}
              analysisResultHasLayers={analysisResultHasLayers}
            />

          {/* Editing column */}
                      <EditingColumnComponent
              grammarBreakdown={verseAnalysisState.grammarBreakdown}
              onWordClick={handleWordClick}
              onGrammarWordClick={handleGrammarWordClick}
            />
        </div>
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

// Main App component with routing
const App: React.FC = () => {
  return (
    <Routes>
      {/* New source-based routes */}
      <Route path="/:source/:book/:chapter/:verse" element={<VersePage />} />
      {/* Backward compatibility - default to bible source */}
      <Route path="/:book/:chapter/:verse" element={<VersePage />} />
      <Route path="/" element={<VersePage />} />
    </Routes>
  );
};

export default App;

// Helper: check if OpenAI layers exist
function analysisResultHasLayers(state: VerseAnalysisState) {
  return (
    (state.theological_layer && Array.isArray(state.theological_layer) && state.theological_layer.length > 0) ||
    (state.symbolic_layer && Array.isArray(state.symbolic_layer) && state.symbolic_layer.length > 0) ||
    (state.cosmological_layer && Array.isArray(state.cosmological_layer) && state.cosmological_layer.length > 0)
  );
}

// Helper: get all interpretation layers in legacy format
function getInterpretationLayers(state: VerseAnalysisState) {
  const layers = [];
  if (state.theological_layer && Array.isArray(state.theological_layer) && state.theological_layer.length > 0) {
    layers.push({ layer_type: 'theological', points: state.theological_layer });
  }
  if (state.symbolic_layer && Array.isArray(state.symbolic_layer) && state.symbolic_layer.length > 0) {
    layers.push({ layer_type: 'symbolic', points: state.symbolic_layer });
  }
  if (state.cosmological_layer && Array.isArray(state.cosmological_layer) && state.cosmological_layer.length > 0) {
    layers.push({ layer_type: 'cosmological', points: state.cosmological_layer });
  }
  return layers;
}




