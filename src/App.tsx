import React, { useState, useEffect } from 'react';
import './App.css';
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
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
// Import Greb logo
const GrebLogo = require('./greb_logo_white.png');

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
  faQuestionCircle
);

interface Book {
  id: number;
  name: string;
  latin_name: string;
  chapter_count: number;
  created_at: string;
}

interface Verse {
  verse_number: number;
  text: string;
}

interface VerseAnalysis {
  [key: string]: WordInfo;
}

interface GrammarItem {
  word: string;
  meaning: string;
  part_of_speech: string;
}

interface WordInfo {
  latin: string;
  definition: string;
  etymology: string;
  partOfSpeech: string;
  morphology?: string;
  pronunciation?: string;
  source?: string;
  confidence?: number;
  found?: boolean;
}

interface NotificationType {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "it", name: "Italian", flag: "🇮🇹" }
];

// Add grammar color mappings to match the backend
const GRAMMAR_COLORS = {
  'verb': 'bg-blue-100 text-blue-800 border-blue-300',
  'noun': 'bg-green-100 text-green-800 border-green-300',
  'adjective': 'bg-purple-100 text-purple-800 border-purple-300', 
  'adverb': 'bg-orange-100 text-orange-800 border-orange-300',
  'preposition': 'bg-gray-100 text-gray-800 border-gray-300',
  'conjunction': 'bg-pink-100 text-pink-800 border-pink-300',
  'pronoun': 'bg-red-100 text-red-800 border-red-300',
  'participle': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'default': 'bg-blue-100 text-blue-800 border-blue-300'
};

// Book icon mappings
const BOOK_ICONS: { [key: string]: any } = {
  "Gn": faTree,         // Genesis - Tree of Life
  "Ex": faMountain,     // Exodus - Mount Sinai
  "Lev": faFire,        // Leviticus - Sacrificial fire
  "Num": faUsers,       // Numbers - Census
  "Dt": faScroll,       // Deuteronomy - Law scroll
  "Jos": faShield,      // Joshua - Military conquest
  "Jdc": faGavel,       // Judges - Justice
  "Ru": faHeart,        // Ruth - Love story
  "Esd": faHome,        // Ezra - Rebuilding
  "Neh": faShieldAlt,   // Nehemiah - Defense
  "Tb": faHandsHelping, // Tobit - Help
  "Jdt": faCrown,       // Judith - Royalty/victory
  "Est": faStar,        // Esther - Star
  "Jb": faBalanceScale, // Job - Justice/suffering
  "Ps": faMusic,        // Psalms - Music (will need to import)
  "Pr": faLightbulb,    // Proverbs - Wisdom
  "Qo": faSun,          // Ecclesiastes - Under the sun
  "Ct": faRing,         // Song of Songs - Wedding
  "Sap": faEye,         // Wisdom - Insight
  "Si": faBook,         // Sirach - Teaching
  "Is": faDove,         // Isaiah - Holy Spirit
  "Jer": faHeartbeat,   // Jeremiah - Broken heart
  "Lam": faTint,        // Lamentations - Tears
  "Ba": faScroll,       // Baruch - Prophecy
  "Ez": faEye,          // Ezekiel - Visions
  "Dn": faFire,         // Daniel - Fiery furnace
  "Os": faHeart,        // Hosea - Faithful love
  "Jl": faLeaf,         // Joel - Locusts/vegetation
  "Am": faBalanceScale, // Amos - Justice
  "Ab": faMountain,     // Obadiah - Mountain
  "Jon": faFish,        // Jonah - Great fish
  "Mi": faGavel,        // Micah - Justice
  "Na": faShield,       // Nahum - Destruction
  "Ha": faEye,          // Habakkuk - Watchman
  "So": faFire,         // Zephaniah - Day of the Lord
  "Ag": faHome,         // Haggai - Temple building
  "Za": faEye,          // Zechariah - Visions
  "Mal": faEnvelope,    // Malachi - Messenger
  "Mt": faCrown,        // Matthew - King
  "Mc": faFeather,      // Mark - Quick/swift
  "Lc": faUserTie,      // Luke - Physician
  "Jo": faHeart,        // John - Love
  "Ac": faFire,         // Acts - Pentecost
  "Rm": faBalanceScale, // Romans - Justification
  "Ga": faGift,         // Galatians - Freedom
  "Ep": faUsers,        // Ephesians - Church unity
  "Ph": faHeart,        // Philippians - Joy
  "Col": faStar,        // Colossians - Christ supreme
  "Tit": faChurch,      // Titus - Church order
  "Phm": faHandHoldingHeart, // Philemon - Reconciliation
  "He": faShieldAlt,    // Hebrews - Faith
  "Jc": faBalanceScale, // James - Faith and works
  "Judæ": faShield,     // Jude - Contending for faith
  "Ap": faCrown,        // Revelation - Christ's victory
};

// Utility functions
const normalizeLatin = (word: string): string => {
  return word.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
};

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

const getIconForWordType = (partOfSpeech: string) => {
  const iconMap: { [key: string]: any } = {
    'noun': faBook,
    'verb': faPenNib,
    'adjective': faFillDrip,
    'adverb': faGlobe,
    'pronoun': faUser,
    'preposition': faLayerGroup,
    'conjunction': faPlus,
    'interjection': faTint
  };
  return iconMap[partOfSpeech.toLowerCase()] || faQuestionCircle;
};

const getColorForWordType = (partOfSpeech: string): string => {
  const colorMap: { [key: string]: string } = {
    'noun': 'text-blue-400',
    'verb': 'text-green-400',
    'adjective': 'text-yellow-400',
    'adverb': 'text-purple-400',
    'pronoun': 'text-pink-400',
    'preposition': 'text-red-400',
    'conjunction': 'text-indigo-400',
    'interjection': 'text-orange-400'
  };
  return colorMap[partOfSpeech.toLowerCase()] || 'text-gray-400';
};

interface VerseAnalysisState {
  analysis: VerseAnalysis;
  grammarBreakdown: GrammarItem[];
  selectedWordIndex: number | null;
  wordInfo: WordInfo | null;
  isAnalysisDone: boolean;
  translations: { [key: string]: string };
  theologicalLayer?: { title: string; points: string[] } | null;
}

// WordInfo Component
const WordInfoComponent: React.FC<{ 
  wordInfo: WordInfo | null; 
  className?: string;
  onClose?: () => void;
  isPopup?: boolean;
  onRegenerate?: (word: string) => void;
}> = ({ wordInfo, className = "", onClose, isPopup = false, onRegenerate }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [currentWordInfo, setCurrentWordInfo] = React.useState(wordInfo);

  // Smooth transition effect when wordInfo changes
  React.useEffect(() => {
    if (wordInfo !== currentWordInfo) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setCurrentWordInfo(wordInfo);
        setIsVisible(!!wordInfo); // Only show if wordInfo exists
      }, 150); // Half of the transition duration
      
      return () => clearTimeout(timer);
    } else if (wordInfo) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [wordInfo, currentWordInfo]);

  if (!currentWordInfo) return null;

  // Get source styling based on the source type
  const getSourceBadge = (source?: string, confidence?: number) => {
    switch (source) {
      case "dictionary":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium transition-all duration-300">📚 Dictionary</span>;
      case "morphological_analysis":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium transition-all duration-300">🔍 Morphological Analysis</span>;
      case "greb":
        return (
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium transition-all duration-300 flex items-center gap-1">
            <img src={GrebLogo} alt="Greb" className="w-3 h-3" />
            Greb Enhanced
          </span>
        );
      case "greb_verse":
        return (
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium transition-all duration-300 flex items-center gap-1">
            <img src={GrebLogo} alt="Greb" className="w-3 h-3" />
            Verse Analysis
          </span>
        );
      case "loading":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium transition-all duration-300 animate-pulse">⏳ Loading...</span>;
      case "error":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium transition-all duration-300">❌ Error</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium transition-all duration-300">❓ Unknown</span>;
    }
  };

  const handleRegenerate = async () => {
    if (onRegenerate && currentWordInfo.latin) {
      onRegenerate(currentWordInfo.latin);
    }
  };

  // Neubrutalist styling
  const containerClasses = isPopup 
    ? "bg-white border-4 border-black rounded-none p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-300 ease-in-out" 
    : "bg-white border-4 border-black rounded-none p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out transform";

  return (
    <div className={`${containerClasses} ${
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    } ${className}`}>
      {isPopup && onClose && (
        <button 
          onClick={onClose}
          className="float-right text-black hover:text-red-600 text-xl font-bold transition-colors duration-200 border-2 border-black w-8 h-8 flex items-center justify-center bg-red-200 hover:bg-red-300 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          ×
        </button>
      )}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-black flex items-center gap-2 transition-all duration-300 uppercase tracking-wide">
            <FontAwesomeIcon icon={faBook} className="text-black" />
            {currentWordInfo.latin}
          </h3>
          <div className="flex items-center gap-2">
            {getSourceBadge(currentWordInfo.source, currentWordInfo.confidence)}
            {onRegenerate && currentWordInfo.source !== 'loading' && (
              <button
                onClick={handleRegenerate}
                className="bg-yellow-200 hover:bg-yellow-300 text-black px-3 py-1 rounded-none text-xs font-black transition-all duration-200 hover:scale-105 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide"
                title="Regenerate analysis (clears cache)"
              >
                🔄 REFRESH
              </button>
            )}
          </div>
        </div>
        <div className="text-sm space-y-2">
          <p className="transition-all duration-300"><strong className="text-black font-black uppercase">Definition:</strong> <span className="font-medium">{currentWordInfo.definition}</span></p>
          <p className="transition-all duration-300"><strong className="text-black font-black uppercase">Part of Speech:</strong> <span className="font-medium">{currentWordInfo.partOfSpeech}</span></p>
          {currentWordInfo.morphology && (
            <p className="transition-all duration-300"><strong className="text-black font-black uppercase">Morphology:</strong> <span className="font-medium">{currentWordInfo.morphology}</span></p>
          )}
          {currentWordInfo.pronunciation && (
            <p className="transition-all duration-300"><strong className="text-black font-black uppercase">Pronunciation:</strong> <span className="font-mono">/{currentWordInfo.pronunciation}/</span></p>
          )}
          <p className="transition-all duration-300"><strong className="text-black font-black uppercase">Etymology:</strong> <span className="font-medium">{currentWordInfo.etymology}</span></p>
          {currentWordInfo.confidence && currentWordInfo.confidence < 1.0 && (
            <p className="text-xs text-gray-600 transition-all duration-300 font-medium">Confidence: {Math.round(currentWordInfo.confidence * 100)}%</p>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
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
    theologicalLayer: null
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [playedIndices, setPlayedIndices] = useState<number[]>([]);
  const [lastVerseTime, setLastVerseTime] = useState<number>(0);
  const [dictionaryStats, setDictionaryStats] = useState<{main_dictionary_entries: number, cached_entries: number, total_available: number, openai_enabled: boolean} | null>(null);
  const [dictionaryLoading, setDictionaryLoading] = useState<boolean>(true);

  // Initialize AudioContext
  useEffect(() => {
    setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)());
  }, []);

  // Set selected verse when verses load
  useEffect(() => {
    if (verses.length > 0 && !selectedVerse) {
      setSelectedVerse(verses[0]);
    }
  }, [verses, selectedVerse]);

  // Handle verse changes
  useEffect(() => {
    if (selectedVerse) {
      // Clear analysis state
      setVerseAnalysisState({
        analysis: {},
        grammarBreakdown: [],
        selectedWordIndex: null,
        wordInfo: null,
        isAnalysisDone: false,
        translations: {}
      });
      
      // Fetch new analysis
      loadGrammarBreakdown();
    }
  }, [selectedVerse]);

  // Fetch books on initial load
  useEffect(() => {
    fetch(`${API_BASE_URL}/books/`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // Fetch chapters when book changes
  useEffect(() => {
    fetch(`${API_BASE_URL}/books/abbr/${selectedBookAbbr}`)
      .then((res) => res.json())
      .then((data) => {
        const chaps = Array.from({ length: data.chapter_count }, (_, i) => i + 1);
        setChapters(chaps);
      })
      .catch((err) => console.error("Error fetching chapters:", err));
  }, [selectedBookAbbr]);

  // Fetch verses when chapter changes
  useEffect(() => {
    fetch(`${API_BASE_URL}/verses/by-reference/${selectedBookAbbr}/${currentChapter}?skip=0&limit=100`)
      .then((res) => res.json())
      .then((data) => setVerses(data))
      .catch((err) => console.error("Error fetching verses:", err));
  }, [currentChapter, selectedBookAbbr]);
  
  const loadGrammarBreakdown = async () => {
    if (!selectedVerse) return;
    const verseRef = `${selectedBookAbbr} ${selectedVerse.verse_number}`;
    
    try {
        const response = await fetch(`${API_BASE_URL}/dictionary/analyze/verse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verse: selectedVerse.text, reference: verseRef })
        });

        const analysisResult = await response.json();

        if (analysisResult.success && analysisResult.full_analysis) {
          const newAnalysis: VerseAnalysis = {};
          analysisResult.full_analysis.word_analysis.forEach((item: any) => {
            newAnalysis[normalizeLatin(item.latin)] = {
              latin: item.latin,
              definition: item.definition,
              etymology: item.etymology,
              partOfSpeech: item.part_of_speech,
              morphology: item.morphology,
              pronunciation: item.pronunciation,
              source: 'greb_verse',
              confidence: 1.0,
              found: true
            };
          });
          
          setVerseAnalysisState((prev: VerseAnalysisState) => ({
            ...prev,
            analysis: newAnalysis,
            translations: analysisResult.full_analysis.translations || {},
            theologicalLayer: analysisResult.full_analysis.theological_layer || null,
            isAnalysisDone: true
          }));
        } else {
            console.error("Verse analysis failed:", analysisResult.error);
            fallbackToBatchLookup();
        }
    } catch (error) {
        console.error("Error in verse analysis:", error);
        fallbackToBatchLookup();
    }
  };

  const fallbackToBatchLookup = async () => {
    if (!selectedVerse) return;
    const words = selectedVerse.text.split(" ").filter(w => w.length > 0);
    const uniqueWords = Array.from(new Set(words.map(w => normalizeLatin(w.replace(/[.,:;?!]$/, '')))));

    try {
      const response = await fetch(`${API_BASE_URL}/dictionary/lookup/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: uniqueWords })
      });
      const batchResult = await response.json();
      
      if (batchResult.results) {
        const analysis: VerseAnalysis = {};
        batchResult.results.forEach((item: WordInfo) => {
          analysis[normalizeLatin(item.latin)] = item;
        });
        
        setVerseAnalysisState((prev: VerseAnalysisState) => ({
          ...prev,
          analysis,
          theologicalLayer: null,
          isAnalysisDone: true
        }));
      }
    } catch (error) {
      console.error("Batch lookup fallback failed:", error);
    }
  };
  
  const handleWordClick = async (wordIndex: number) => {
    if (!selectedVerse) return;
    const words = selectedVerse.text.split(" ");
    const word = words[wordIndex].replace(/[.,:;?!]$/, '');
    const normalizedWord = normalizeLatin(word);

    // Set loading state
    setVerseAnalysisState(prev => ({
      ...prev,
      selectedWordIndex: wordIndex,
      wordInfo: {
        latin: word,
        definition: 'Loading...',
        etymology: '',
        partOfSpeech: '',
        source: 'loading',
        found: false
      }
    }));
    setIsPopupVisible(true);

    try {
      let wordInfo: WordInfo | null = null;
      if (verseAnalysisState.analysis[normalizedWord]) {
        wordInfo = verseAnalysisState.analysis[normalizedWord];
      } else {
        // Fallback to individual lookup if not in analysis
        wordInfo = await lookupWord(word);
      }
      
      setVerseAnalysisState(prev => ({
        ...prev,
        wordInfo
      }));
      
      // Play audio for the word
      playAudio(wordIndex, true);
    } catch (error) {
      console.error('Error looking up word:', error);
      setVerseAnalysisState(prev => ({
        ...prev,
        wordInfo: {
          latin: word,
          definition: 'Error looking up word',
          etymology: '',
          partOfSpeech: '',
          source: 'error',
          found: false
        }
      }));
    }
  };
  
  const getWordStyling = (wordIndex: number) => {
    if (!selectedVerse) return "";
    const words = selectedVerse.text.split(" ");
    const word = words[wordIndex].replace(/[.,:;?!]$/, '');
    const normalizedWord = normalizeLatin(word);
    
    let icon = null;
    let color = 'text-gray-200';

    if (verseAnalysisState.analysis[normalizedWord]) {
      const partOfSpeech = verseAnalysisState.analysis[normalizedWord].partOfSpeech || '';
      icon = getIconForWordType(partOfSpeech);
      color = getColorForWordType(partOfSpeech);
    }

    const baseStyle = "cursor-pointer transition-all duration-200 ease-in-out";
    // ... rest of the styling logic
    return baseStyle;
  };

  const handleVerseChange = (newVerseNumber: number) => {
    const newVerse = verses.find(v => v.verse_number === newVerseNumber);
    if (newVerse) {
      setSelectedVerse(newVerse);
    }
  };
  
  const playAudio = async (wordIndex: number, isWordOnly: boolean = false) => {
    if (!selectedVerse || !audioContext) return;
    
    try {
      const verseNumber = selectedVerse.verse_number;
      const url = `${API_BASE_URL}/audio/${selectedBookAbbr}/${currentChapter}/${verseNumber}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Audio not found');
        return;
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      if (audioSource) {
        audioSource.stop();
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      if (isWordOnly) {
        // Calculate word timing (this is a simplified version)
        const words = selectedVerse.text.split(' ');
        const wordDuration = audioBuffer.duration / words.length;
        const startTime = wordIndex * wordDuration;
        source.start(0, startTime, wordDuration);
      } else {
        source.start(0);
      }
      
      setAudioSource(source);
      setIsPlaying(true);
      
      source.onended = () => {
        setIsPlaying(false);
        setAudioSource(null);
      };
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Book and Chapter selection */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Select Book</h2>
              <select
                value={selectedBookAbbr}
                onChange={(e) => setSelectedBookAbbr(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {books.map((book) => (
                  <option key={book.id} value={book.latin_name}>
                    {book.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Select Chapter</h2>
              <select
                value={currentChapter}
                onChange={(e) => setCurrentChapter(Number(e.target.value))}
                className="w-full p-2 border rounded"
              >
                {chapters.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    Chapter {chapter}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right column - Verse display and analysis */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Verse</h2>
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => handleVerseChange(selectedVerse ? selectedVerse.verse_number - 1 : 1)}
                  disabled={!selectedVerse || selectedVerse.verse_number <= 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-lg">
                  Verse {selectedVerse?.verse_number || 1}
                </span>
                <button
                  onClick={() => handleVerseChange(selectedVerse ? selectedVerse.verse_number + 1 : 1)}
                  disabled={!selectedVerse || selectedVerse.verse_number >= verses.length}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="text-lg">
                {selectedVerse?.text.split(' ').map((word, index) => (
                  <span
                    key={index}
                    onClick={() => handleWordClick(index)}
                    className={`${getWordStyling(index)} mx-1`}
                  >
                    {word}
                  </span>
                ))}
              </div>

              {/* Translations section */}
              {verseAnalysisState.isAnalysisDone && Object.keys(verseAnalysisState.translations).length > 0 && (
                <div className="mt-6 p-4 border-4 border-black bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-lg font-black mb-2 uppercase flex items-center gap-2">
                    <FontAwesomeIcon icon={faGlobe} />
                    Translations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(verseAnalysisState.translations).map(([lang, text]) => (
                      <div key={lang} className="flex items-start gap-2">
                        <span className="text-xl">
                          {LANGUAGES.find(l => l.code === lang)?.flag || '🌐'}
                        </span>
                        <p className="text-sm leading-snug"><span className="font-bold uppercase">{LANGUAGES.find(l => l.code === lang)?.name || lang}:</span> {text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Theological Layer section */}
              {verseAnalysisState.theologicalLayer && (
                <div className="mt-6 p-4 border-4 border-black bg-purple-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-lg font-black mb-2 uppercase flex items-center gap-2 text-purple-800">
                    <FontAwesomeIcon icon={faDove} />
                    {verseAnalysisState.theologicalLayer.title || 'Theological Insights'}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {verseAnalysisState.theologicalLayer.points.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Word Info Popup */}
            {isPopupVisible && verseAnalysisState.wordInfo && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <WordInfoComponent
                  wordInfo={verseAnalysisState.wordInfo}
                  isPopup={true}
                  onClose={() => setIsPopupVisible(false)}
                  onRegenerate={async (word) => {
                    const wordInfo = await lookupWord(word);
                    setVerseAnalysisState(prev => ({
                      ...prev,
                      wordInfo
                    }));
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
