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
import { NameOccurrence, QueueItem, WordInfo, GrammarColorKey, GRAMMAR_COLORS, Language, LANGUAGES, Book, BOOK_ICONS, getBookCategoryColor, Verse } from './types';
import { 
  getIconForWordType, 
  getColorForWordType, 
  getColorsFromGrammarClass, 
  normalizeLatin, 
  getHighlightBgForWordType, 
  getHighlightTextForWordType 
} from './utils/grammarUtils';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLanguage, 
  faPenNib, 
  faUser, 
  faFillDrip, 
  faGlobe, 
  faLayerGroup, 
  faPlus, 
  faTint, 
  faFeatherAlt, 
  faWater, 
  faCheckCircle, 
  faCross, 
  faBrain, 
  faMicrophone, 
  faCircleNotch,
  faPlay,
  faPause,
  faStop,
  faBook,
  faScroll,
  faCrown,
  faGavel,
  faHeart,
  faDove,
  faFire,
  faEye,
  faMountain,
  faShield,
  faStar,
  faSun,
  faTree,
  faLeaf,
  faRing,
  faBalanceScale,
  faFeather,
  faFish,
  faGlassCheers,
  faChurch,
  faUserFriends,
  faHandHoldingHeart,
  faUserTie,
  faEnvelope,
  faUsers,
  faHeartbeat,
  faHandsHelping,
  faLightbulb,
  faGift,
  faShieldAlt,
  faHome,
  faPray,
  faMusic,
  faArrowLeft,
  faArrowRight,
  faQuestionCircle,
  faChevronDown,
  faUpload,
  faEdit,
  faSave,
  faTimes,
  faClipboardList,
  faSpinner,
  faCheckSquare,
  faSquare,
  faFont,
  faExchangeAlt,
  faQuoteLeft,
  faRobot,
  faBookOpen,
  faGem,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import successNotificationSound from './assets/sounds/success_notification.mp3';

// Import Greb logo
const GrebLogo = require('./GREB LOGO_ with White.png');



// Constants
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Book constants
const BOOK_ABBREVIATIONS: { [key: string]: number } = {
  "Gn": 1,    // Genesis
  "Ex": 2,    // Exodus
  "Lev": 3,   // Leviticus
  "Num": 4,   // Numbers
  "Dt": 5,    // Deuteronomy
  "Jos": 6,   // Joshua
  "Jdc": 7,   // Judges
  "Ru": 8,    // Ruth
  "Esd": 9,   // Ezra
  "Neh": 10,  // Nehemiah
  "Tb": 11,   // Tobit
  "Jdt": 12,  // Judith
  "Est": 13,  // Esther
  "Jb": 14,   // Job
  "Ps": 15,   // Psalms
  "Pr": 16,   // Proverbs
  "Qo": 17,   // Ecclesiastes
  "Ct": 18,   // Song of Songs
  "Sap": 19,  // Wisdom
  "Si": 20,   // Sirach
  "Is": 21,   // Isaiah
  "Jer": 22,  // Jeremiah
  "Lam": 23,  // Lamentations
  "Ba": 24,   // Baruch
  "Ez": 25,   // Ezekiel
  "Dn": 26,   // Daniel
  "Os": 27,   // Hosea
  "Jl": 28,   // Joel
  "Am": 29,   // Amos
  "Ab": 30,   // Obadiah
  "Jon": 31,  // Jonah
  "Mi": 32,   // Micah
  "Na": 33,   // Nahum
  "Ha": 34,   // Habakkuk
  "So": 35,   // Zephaniah
  "Ag": 36,   // Haggai
  "Za": 37,   // Zechariah
  "Mal": 38,  // Malachi
  "Mt": 39,   // Matthew
  "Mc": 40,   // Mark
  "Lc": 41,   // Luke
  "Jo": 42,   // John
  "Ac": 43,   // Acts
  "Rm": 44,   // Romans
  "Ga": 45,   // Galatians
  "Ep": 46,   // Ephesians
  "Ph": 47,   // Philippians
  "Col": 48,  // Colossians
  "Tit": 49,  // Titus
  "Phm": 50,  // Philemon
  "He": 51,   // Hebrews
  "Jc": 52,   // James
  "Judæ": 53, // Jude
  "Ap": 54,   // Revelation
};

const BOOK_NAMES: { [key: string]: string } = {
  "Gn": "Genesis",
  "Ex": "Exodus", 
  "Lev": "Leviticus",
  "Num": "Numbers",
  "Dt": "Deuteronomy",
  "Jos": "Joshua",
  "Jdc": "Judges",
  "Ru": "Ruth",
  "Esd": "Ezra",
  "Neh": "Nehemiah",
  "Tb": "Tobit",
  "Jdt": "Judith",
  "Est": "Esther",
  "Jb": "Job",
  "Ps": "Psalms",
  "Pr": "Proverbs",
  "Qo": "Ecclesiastes",
  "Ct": "Song of Songs",
  "Sap": "Wisdom",
  "Si": "Sirach",
  "Is": "Isaiah",
  "Jer": "Jeremiah",
  "Lam": "Lamentations",
  "Ba": "Baruch",
  "Ez": "Ezekiel",
  "Dn": "Daniel",
  "Os": "Hosea",
  "Jl": "Joel",
  "Am": "Amos",
  "Ab": "Obadiah",
  "Jon": "Jonah",
  "Mi": "Micah",
  "Na": "Nahum",
  "Ha": "Habakkuk",
  "So": "Zephaniah",
  "Ag": "Haggai",
  "Za": "Zechariah",
  "Mal": "Malachi",
  "Mt": "Matthew",
  "Mc": "Mark",
  "Lc": "Luke",
  "Jo": "John",
  "Ac": "Acts",
  "Rm": "Romans",
  "Ga": "Galatians",
  "Ep": "Ephesians",
  "Ph": "Philippians",
  "Col": "Colossians",
  "Tit": "Titus",
  "Phm": "Philemon",
  "He": "Hebrews",
  "Jc": "James",
  "Judæ": "Jude",
  "Ap": "Revelation",
};

// Add icons to the library
library.add(
  faLanguage, 
  faPenNib, 
  faUser, 
  faFillDrip, 
  faGlobe, 
  faLayerGroup, 
  faPlus, 
  faTint, 
  faFeatherAlt, 
  faWater, 
  faCheckCircle, 
  faCross, 
  faBrain, 
  faMicrophone, 
  faCircleNotch,
  faStop,
  faPlay,
  faPause,
  faBook,
  faScroll,
  faCrown,
  faGavel,
  faHeart,
  faDove,
  faFire,
  faEye,
  faMountain,
  faShield,
  faStar,
  faSun,
  faTree,
  faLeaf,
  faRing,
  faBalanceScale,
  faFeather,
  faFish,
  faGlassCheers,
  faChurch,
  faUserFriends,
  faHandHoldingHeart,
  faUserTie,
  faEnvelope,
  faUsers,
  faHeartbeat,
  faHandsHelping,
  faLightbulb,
  faGift,
  faShieldAlt,
  faHome,
  faPray,
  faMusic,
  faArrowLeft,
  faArrowRight,
  faQuestionCircle,
  faChevronDown,
  faUpload,
  faEdit,
  faSave,
  faTimes,
  faClipboardList,
  faSpinner,
  faCheckSquare,
  faSquare,
  faFont,
  faExchangeAlt,
  faQuoteLeft,
  faRobot,
  faBookOpen,
  faGem
);





interface VerseAnalysis {
  [key: string]: WordInfo;
}

interface GrammarItem {
  word: string;
  meaning: string;
  part_of_speech: string;
  grammar_description?: string;
  morphology?: string;
}



interface NotificationType {
  message: string;
  type: 'success' | 'error' | 'info';
}





// Enhanced markdown renderer with translation type styling
const renderMarkdown = (text: string): JSX.Element => {
  if (!text) return <span>{text}</span>;
  
  // Check if text contains Literal: and Dynamic: patterns
  if (text.includes('Literal:') && text.includes('Dynamic:')) {
    // Split the text by the patterns
    const literalMatch = text.match(/Literal:\s*([\s\S]+?)(?=\s*Dynamic:|$)/);
    const dynamicMatch = text.match(/Dynamic:\s*([\s\S]+?)$/);
    
    return (
      <div className="space-y-4">
        {literalMatch && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faBookOpen} className="text-blue-700" />
              <span className="font-black text-blue-700 uppercase tracking-wide">Literal:</span>
            </div>
            <div className="text-gray-800 pl-6">
              {processBasicMarkdown(literalMatch[1].trim())}
            </div>
          </div>
        )}
        {dynamicMatch && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faRobot} className="text-green-700" />
              <span className="font-black text-green-700 uppercase tracking-wide">Dynamic:</span>
            </div>
            <div className="text-gray-800 pl-6">
              {processBasicMarkdown(dynamicMatch[1].trim())}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Fallback to basic markdown processing
  return <span>{processBasicMarkdown(text)}</span>;
};

// Helper function for basic markdown processing
const processBasicMarkdown = (text: string): JSX.Element => {
  // Split by bold markers and process
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Bold text with metallic effect
          const boldText = part.slice(2, -2);
          return (
            <strong 
              key={index} 
              className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 drop-shadow-sm"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                fontWeight: '900'
              }}
            >
              {boldText}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

// Language cycle indicator component for translation working state
const LanguageCycleIndicator: React.FC = () => {
  const [currentFlag, setCurrentFlag] = React.useState(0);
  const flags = ['🇺🇸', '🇫🇷', '🇪🇸', '🇵🇹', '🇮🇹'];
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFlag(prev => (prev + 1) % flags.length);
    }, 400); // Change flag every 400ms
    
    return () => clearInterval(interval);
  }, [flags.length]);
  
  return (
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center translation-working-indicator">
      <span className="text-xs" style={{ fontSize: '8px' }}>
        {flags[currentFlag]}
      </span>
    </div>
  );
};

// Enhanced translation type detection with distinct visual styling
const getTranslationTypeIcon = (language: string, translationText: string) => {
  // Simple heuristics to determine translation type
  const hasWordForWord = translationText.includes('*') || translationText.includes('[') || translationText.includes('(');
  const isLiteral = hasWordForWord || translationText.split(' ').length <= 15;
  
  if (isLiteral) {
    return { 
      icon: faBookOpen, 
      type: 'Literal', 
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
      description: 'Word-for-word',
      emoji: '📖'
    };
  } else {
    return { 
      icon: faRobot, 
      type: 'Dynamic', 
      color: 'text-green-700',
      bgColor: 'bg-green-100', 
      borderColor: 'border-green-300',
      description: 'Thought-for-thought',
      emoji: '🤖'
    };
  }
};



// Get book category colors based on book type with more vibrant colors


// Utility functions


const lookupWord = async (word: string): Promise<WordInfo> => {
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





// New interfaces for global edit mode





interface EditState {
  isEditing: boolean;
  editingWord: string | null;
  editMeaning: string;
  editGrammarDescription: string;
  editPartOfSpeech: string;
  editMorphology: string;
}

interface VerseAnalysisState {
  analysis: VerseAnalysis;
  grammarBreakdown: GrammarItem[];
  selectedWordIndex: number | null;
  wordInfo: WordInfo | null;
  isAnalysisDone: boolean;
  translations: { [key: string]: string };
  theological_layer?: string[];
  symbolic_layer?: string[];
  cosmological_layer?: string[];
  nameOccurrences?: NameOccurrence[];
  hoveredWord?: string | null;
  selectedWord?: string | null;
  isLoading?: boolean;
  loadingMessage?: string;
}

// Types for verse relationships








// Custom Dropdown for Verse Selector


// Custom scrollbar hide utility and verse animations
const customScrollbarStyle = `
  .custom-scrollbar::-webkit-scrollbar { display: none; }
  .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  /* Verse transition animations */
  .verse-container {
    position: relative;
    overflow: hidden;
  }
  
  .verse-content {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    transform: translateX(0);
    opacity: 1;
  }
  
  .verse-content.slide-down {
    animation: slideOutUp 0.25s ease-in forwards, slideInDown 0.25s 0.25s ease-out forwards;
  }
  
  .verse-content.slide-up {
    animation: slideOutDown 0.25s ease-in forwards, slideInUp 0.25s 0.25s ease-out forwards;
  }
  
  @keyframes slideOutUp {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-100%); opacity: 0; }
  }
  
  @keyframes slideInDown {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideOutDown {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(100%); opacity: 0; }
  }
  
  @keyframes slideInUp {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  /* Smooth highlight animations for completed analysis */
  .analysis-complete {
    animation: analysisGlow 0.8s ease-in-out;
  }
  
  @keyframes analysisGlow {
    0% { box-shadow: none; }
    50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    100% { box-shadow: none; }
  }
  
  /* Floating translation icon popup animation */
  @keyframes floatingTranslationPop {
    0% { 
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% { 
      transform: scale(1.2) rotate(180deg);
      opacity: 0.8;
    }
    100% { 
      transform: scale(1) rotate(360deg);
      opacity: 1;
    }
  }
  
  /* Translation working animation */
  .translation-working-indicator {
    animation: translationWorking 1.5s ease-in-out infinite;
  }
  
  @keyframes translationWorking {
    0%, 100% { 
      transform: scale(1);
      opacity: 1;
    }
    25% { 
      transform: scale(1.2);
      opacity: 0.8;
    }
    50% { 
      transform: scale(0.8);
      opacity: 1;
    }
    75% { 
      transform: scale(1.1);
      opacity: 0.9;
    }
  }
  
  /* Enhanced working state with language cycling animation */
  .translation-languages-cycling {
    animation: languagesCycling 2s ease-in-out infinite;
  }
  
  @keyframes languagesCycling {
    0% { content: '🇺🇸'; }
    20% { content: '🇫🇷'; }
    40% { content: '🇪🇸'; }
    60% { content: '🇵🇹'; }
    80% { content: '🇮🇹'; }
    100% { content: '🌐'; }
  }
  
  /* Custom scale classes for better control */
  .hover\\:scale-130:hover {
    transform: scale(1.3);
  }
`;









// Route component for handling URL parameters
const VersePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
  const [lastRequestTime, setLastRequestTime] = useState<{ [key: string]: number }>({});
  const [isVerseLoading, setIsVerseLoading] = useState<boolean>(false);
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
    // Parse reference like "Genesis 1:1" or "Gn 1:1"
    const parts = reference.split(' ');
    if (parts.length < 2) return;
    
    const bookPart = parts[0];
    const chapterVerse = parts[1];
    const [chapterStr, verseStr] = chapterVerse.split(':');
    
    const chapter = parseInt(chapterStr, 10);
    const verse = parseInt(verseStr, 10);
    
    if (isNaN(chapter) || isNaN(verse)) return;
    
    // Find the book abbreviation
    const bookAbbr = Object.keys(BOOK_NAMES).find(
      abbr => BOOK_NAMES[abbr].toLowerCase() === bookPart.toLowerCase() || abbr === bookPart
    );
    
    if (!bookAbbr) return;
    
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
          console.log(`Quick loading ${verseRef} from localStorage cache`);
          
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

  // Check if audio is available for current verse
  const checkAudioAvailability = useCallback(async () => {
    if (!selectedVerse) {
      setAudioAvailable(false);
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/audio/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}`;
      const response = await fetch(url, { method: 'HEAD' }); // HEAD request to just check existence
      setAudioAvailable(response.ok);
      
      // Don't log 404 errors to console since they're expected when audio doesn't exist
      if (!response.ok && response.status !== 404) {
        console.warn(`Unexpected error checking audio availability: ${response.status}`);
      }
    } catch (error) {
      // Only log unexpected network errors, not 404s
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('Network error checking audio availability:', error);
      }
      setAudioAvailable(false);
    }
  }, [selectedVerse, selectedBookAbbr, currentChapter]);

  // Consolidated URL handling - parse URL and set initial state
  useEffect(() => {
    const path = location.pathname;
    const pathParts = path.split('/').filter(part => part);
    
    if (pathParts.length >= 3) {
      // URL format: /book/chapter/verse
      const [bookParam, chapterParam, verseParam] = pathParts;
      const newBook = bookParam;
      const newChapter = parseInt(chapterParam) || 1;
      const newVerseNumber = parseInt(verseParam) || 1;
      
      // Only update if different to prevent unnecessary re-renders
      if (selectedBookAbbr !== newBook) {
        setSelectedBookAbbr(newBook);
      }
      if (currentChapter !== newChapter) {
        setCurrentChapter(newChapter);
      }
      
      // If verses are already loaded, select the verse immediately
      if (verses.length > 0) {
        const targetVerse = verses.find(v => v.verse_number === newVerseNumber);
        if (targetVerse && (!selectedVerse || selectedVerse.verse_number !== newVerseNumber)) {
          setSelectedVerse(targetVerse);
        }
      }
    } else if (pathParts.length === 0) {
      // Root path - default to Genesis 1:1
      navigate('/Gn/1/1', { replace: true });
      return;
    }
  }, [location.pathname, navigate, selectedBookAbbr, currentChapter, verses, selectedVerse]);

  // Update URL when navigation changes (only when user manually changes selection)
  const updateURL = useCallback((book: string, chapter: number, verse: number) => {
    const newPath = `/${book}/${chapter}/${verse}`;
    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  }, [navigate, location.pathname]);

  // Fetch books on initial load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/books/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Expected array of books but got:", data);
          setBooks([]);
          return;
        }
        setBooks(data);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setBooks([]);
      });
  }, []);

  // Fetch chapters when book changes
  useEffect(() => {
    // Don't make the request until we have a valid book abbreviation
    if (!selectedBookAbbr) return;

    fetch(`http://127.0.0.1:8000/api/v1/books/abbr/${selectedBookAbbr}`)
       .then((res) => res.json())
       .then((data) => {
         const chaps = Array.from({ length: data.chapter_count }, (_, i) => i + 1);
         setChapters(chaps);
       })
       .catch((err) => console.error("Error fetching chapters:", err));
  }, [selectedBookAbbr]);

  // Fetch verses when chapter changes
  useEffect(() => {
    // Ensure we have both a book abbreviation and a valid chapter before fetching verses
    if (!selectedBookAbbr || currentChapter < 1) return;

    fetch(`http://127.0.0.1:8000/api/v1/verses/by-reference/${selectedBookAbbr}/${currentChapter}`)
       .then((res) => {
         if (!res.ok) {
           throw new Error(`HTTP error! status: ${res.status}`);
         }
         return res.json();
       })
       .then((data) => {
         // Ensure data is an array before proceeding
         if (!Array.isArray(data)) {
           console.warn("Expected array of verses but got:", data);
           setVerses([]);
           return;
         }
         
         setVerses(data);
         
         // After fetching verses, check if we need to select a specific verse from URL
         const path = location.pathname;
         const pathParts = path.split('/').filter(part => part);
         if (pathParts.length >= 3) {
           const [, , verseParam] = pathParts;
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
  }, [currentChapter, selectedBookAbbr, location.pathname]);

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
    navigate(`/${book}/${chapter}/${verse}`);
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
          // Fetch the verses for the previous chapter first
          const response = await fetch(`${API_BASE_URL}/verses/by-reference/${selectedBookAbbr}/${previousChapter}`);
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
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedVerse, verses.length, isTransitioning, currentChapter, chapters.length, selectedBookAbbr, updateURL, navigationInProgress, audioAvailable, isPlaying, audioSource, verseAnalysisState.translations, selectedTranslationLang, setSelectedTranslationLang, books]);

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
            verse: selectedVerse.text, 
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
          verse: selectedVerse.text, 
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
          verse: selectedVerse.text, 
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
    navigate(`/${book}/${chapter}/${verse}`);
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
    const words = selectedVerse.text.split(' ');
    const word = words[index];
    const cleanWord = word.replace(/[.,:;?!]$/, '');
    const normalized = normalizeLatin(cleanWord);
    
    setVerseAnalysisState(prev => ({
      ...prev,
      selectedWord: normalized,
      selectedWordIndex: index,
      wordInfo: prev.analysis[normalized] || null
    }));
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
      const words = selectedVerse.text.split(' ');
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
          verse: selectedVerse.text,
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
      <style dangerouslySetInnerHTML={{ __html: customScrollbarStyle }} />
      
      {/* Header with centered Vulgate icon and text */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Vulgate Icon - centered with text */}
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
          <div className="flex-[3] min-w-[280px]">
            <div className="bg-white border-4 border-black rounded-2xl shadow-lg shadow-gray-200/40 p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                <FontAwesomeIcon icon={faBrain} className="mr-2" />
                Analysis
              </h3>
              <div className="space-y-4">
                {/* Word Definition Card */}
                <AnimatedWrapper 
                  show={!!verseAnalysisState.wordInfo}
                  enterClass="smooth-entrance"
                  exitClass="smooth-exit"
                >
                  <WordInfoComponent 
                    wordInfo={verseAnalysisState.wordInfo}
                    onNavigateToVerse={(reference: string) => {
                      const parts = reference.split(' ');
                      if (parts.length >= 2) {
                        const [book, chapterVerse] = parts;
                        const [chapter, verse] = chapterVerse.split(':');
                        handleNavigateToOccurrence(book, parseInt(chapter), parseInt(verse));
                      }
                    }}
                  />
                </AnimatedWrapper>
                
                {/* Theological interpretation */}
                {analysisResultHasLayers(verseAnalysisState) ? (
                  <InterpretationLayersComponent 
                    theological_layer={verseAnalysisState.theological_layer}
                    symbolic_layer={verseAnalysisState.symbolic_layer}
                    cosmological_layer={verseAnalysisState.cosmological_layer}
                  />
                ) : (
                  <div className="bg-gray-50 border-4 border-gray-300 rounded-lg shadow-md p-4">
                    <h4 className="text-md font-bold mb-2 text-gray-700">
                      <FontAwesomeIcon icon={faSun} className="mr-2" />
                      Theological Interpretation
                    </h4>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {theologicalInterpretation}
                    </div>
                  </div>
                )}
                {/* Name occurrences */}
                <NameOccurrencesComponent 
                  occurrences={verseAnalysisState.nameOccurrences || []} 
                  onNavigate={handleNavigateToOccurrence}
                />
              </div>
            </div>
          </div>

          {/* Editing column */}
          <div className="flex-[2] min-w-[260px]">
            <div className="bg-white border-4 border-black rounded-2xl shadow-lg shadow-gray-200/40 p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit
              </h3>
              <div className="space-y-4">
                {/* Grammar breakdown display */}
                <GrammarBreakdownComponent
                  grammarBreakdown={verseAnalysisState.grammarBreakdown}
                  onWordClick={handleWordClick}
                  onGrammarWordClick={handleGrammarWordClick}
                />
              </div>
            </div>
          </div>
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




