import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import './App.css';
import BookInfoPanel from './components/BookInfoPanel';
import WordVerseRelationships from './components/WordVerseRelationships';
import NameOccurrencesComponent from './components/NameOccurrencesComponent';
import AnalysisHistoryComponent from './components/AnalysisHistoryComponent';
import QueueComponent from './components/QueueComponent';
import { NameOccurrence, QueueItem } from './types';
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

// Animated component wrapper for enter/exit animations
const AnimatedWrapper: React.FC<{
  show: boolean;
  children: React.ReactNode;
  enterClass?: string;
  exitClass?: string;
  duration?: number;
}> = ({ show, children, enterClass = 'smooth-entrance', exitClass = 'smooth-exit', duration = 300 }) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setAnimationClass(enterClass);
    } else if (shouldRender) {
      setAnimationClass(exitClass);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setAnimationClass('');
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, enterClass, exitClass, duration, shouldRender]);

  if (!shouldRender) return null;

  return <div className={animationClass}>{children}</div>;
};

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
  grammar_description?: string;
  morphology?: string;
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
  isName?: boolean;
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

// Update the GRAMMAR_COLORS constant with proper typing
type GrammarColorKey = 'verb' | 'noun' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun' | 'participle' | 'default';

const GRAMMAR_COLORS: Record<GrammarColorKey, string> = {
  'verb': 'bg-blue-100 text-blue-800 border-blue-300',
  'noun': 'bg-green-100 text-green-800 border-green-300',
  'adjective': 'bg-purple-100 text-purple-800 border-purple-300', 
  'adverb': 'bg-orange-100 text-orange-800 border-orange-300',
  'preposition': 'bg-gray-100 text-gray-800 border-gray-300',
  'conjunction': 'bg-pink-100 text-pink-800 border-pink-300',
  'pronoun': 'bg-red-100 text-red-800 border-red-300',
  'participle': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'default': 'bg-gray-100 text-gray-800 border-gray-300'
};

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

// Helper function to extract colors from Tailwind classes
const getColorsFromGrammarClass = (colorClass: string) => {
  const colorMap: { [key: string]: { bg: string; text: string } } = {
    'bg-blue-100': { bg: '#dbeafe', text: '#1e40af' },
    'bg-green-100': { bg: '#dcfce7', text: '#166534' },
    'bg-purple-100': { bg: '#f3e8ff', text: '#7c3aed' },
    'bg-orange-100': { bg: '#fed7aa', text: '#ea580c' },
    'bg-gray-100': { bg: '#f3f4f6', text: '#374151' },
    'bg-pink-100': { bg: '#fce7f3', text: '#be185d' },
    'bg-red-100': { bg: '#fee2e2', text: '#dc2626' },
    'bg-indigo-100': { bg: '#e0e7ff', text: '#4338ca' }
  };
  
  // Extract the background class from the colorClass string
  const bgClass = colorClass.split(' ').find(cls => cls.startsWith('bg-'));
  return colorMap[bgClass || 'bg-gray-100'] || colorMap['bg-gray-100'];
};

// Get book category colors based on book type with more vibrant colors
const getBookCategoryColor = (bookName: string) => {
  const pentateuch = ['Gn', 'Ex', 'Lv', 'Nm', 'Dt'];
  const historical = ['Jos', 'Jdc', 'Rt', '1Sm', '2Sm', '1Rg', '2Rg', '1Chr', '2Chr', 'Esr', 'Ne', 'Tb', 'Jdt', 'Est', '1Mac', '2Mac'];
  const wisdom = ['Job', 'Ps', 'Pr', 'Qo', 'Ct', 'Ws', 'Si'];
  const prophets = ['Is', 'Jr', 'Lm', 'Ba', 'Ez', 'Dn', 'Os', 'Jl', 'Am', 'Abd', 'Jon', 'Mi', 'Na', 'Hab', 'So', 'Ag', 'Za', 'Ml'];
  const gospels = ['Mt', 'Mc', 'Lc', 'Jo'];
  const paulineEpistles = ['Rm', '1Cor', '2Cor', 'Gal', 'Eph', 'Ph', 'Col', '1Th', '2Th', '1Tm', '2Tm', 'Tt', 'Phm'];
  const catholicEpistles = ['Heb', 'Jas', '1Pt', '2Pt', '1Jn', '2Jn', '3Jn', 'Jude'];
  const acts = ['Act'];
  
  if (pentateuch.includes(bookName)) return 'bg-gradient-to-br from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 border-red-300';
  if (historical.includes(bookName)) return 'bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 border-blue-300';
  if (wisdom.includes(bookName)) return 'bg-gradient-to-br from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 border-emerald-300';
  if (prophets.includes(bookName)) return 'bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 border-purple-300';
  if (gospels.includes(bookName)) return 'bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border-amber-300';
  if (paulineEpistles.includes(bookName)) return 'bg-gradient-to-br from-rose-100 to-rose-200 hover:from-rose-200 hover:to-rose-300 border-rose-300';
  if (catholicEpistles.includes(bookName)) return 'bg-gradient-to-br from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300 border-indigo-300';
  if (acts.includes(bookName)) return 'bg-gradient-to-br from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300 border-teal-300';
  if (bookName === 'Ap') return 'bg-gradient-to-br from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 border-orange-300'; // Apocalypse
  return 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border-gray-300';
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
    // Handle common Latin ligatures and characters first
    .replace(/æ/g, 'ae')  // æ ligature -> ae
    .replace(/œ/g, 'oe')  // œ ligature -> oe  
    .replace(/ſ/g, 's')   // long s -> s
    // Then normalize Unicode and remove diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove non-Latin characters
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



// New interfaces for global edit mode

interface EditSession {
  session_token: string;
  session_id: number;
  verse_id: number;
  session_data: {
    verse_text: string;
    grammar_breakdown: GrammarItem[];
    interpretation_layers: TheologicalLayer[];
  };
  created_at: string;
  updated_at: string;
}

interface FieldEdit {
  id: number;
  field_type: string;
  field_identifier: string;
  current_value: string;
  is_modified: boolean;
  ai_suggested_value?: string;
  confidence_score?: number;
}

interface TheologicalLayer {
  layer_type: string;
  title: string;
  points: string[];
}

interface GlobalEditState {
  isActive: boolean;
  session?: EditSession;
  fields: FieldEdit[];
  selectedField?: number;
  isLoading: boolean;
}



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


// WordInfo Component - Simplified without buttons
const WordInfoComponent: React.FC<{ 
  wordInfo: WordInfo | null; 
  className?: string;
  onClose?: () => void;
  isPopup?: boolean;
  onNavigateToVerse?: (reference: string) => void;
}> = ({ wordInfo, className = "", onClose, isPopup = false, onNavigateToVerse }) => {
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

  // Get grammar color based on part of speech
  const getGrammarColorClasses = (partOfSpeech: string) => {
    const posKey = (partOfSpeech?.toLowerCase() || 'default') as GrammarColorKey;
    return GRAMMAR_COLORS[posKey] || GRAMMAR_COLORS.default;
  };

  const grammarColorClasses = getGrammarColorClasses(currentWordInfo.partOfSpeech);

  // Grammar-based styling with neubrutalist design
  const containerClasses = isPopup 
    ? `${grammarColorClasses} border-4 border-black rounded-none p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-300 ease-in-out` 
    : `${grammarColorClasses} border-4 border-black rounded-none p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out transform`;

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
        </div>
        
        {/* Add verse relationships section */}
        <WordVerseRelationships 
          word={currentWordInfo.latin} 
          onNavigateToVerse={onNavigateToVerse}
        />
      </div>
    </div>
  );
};

// Custom Dropdown for Book Selector
const BookDropdown: React.FC<{
  books: Book[];
  selectedBookAbbr: string;
  setSelectedBookAbbr: (abbr: string) => void;
  onBookChange?: (book: string, chapter: number, verse: number) => void;
}> = ({ books, selectedBookAbbr, setSelectedBookAbbr, onBookChange }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const selectedBook = books.find(b => b.latin_name === selectedBookAbbr);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="bg-white border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 flex items-center gap-2 font-black text-lg cursor-pointer min-w-[120px]"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <FontAwesomeIcon icon={BOOK_ICONS[selectedBookAbbr] || faBook} className="text-black" />
        {selectedBook ? selectedBook.latin_name : 'Book'}
        <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-gray-500" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 z-30 bg-white border-4 border-black rounded shadow-lg min-w-full max-h-80 overflow-y-auto custom-scrollbar hide-scrollbar"
          role="listbox"
        >
          {books.map(book => (
            <button
              key={book.id}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 font-bold text-lg ${getBookCategoryColor(book.latin_name)} focus:ring-2 focus:ring-black transition rounded ${selectedBookAbbr === book.latin_name ? 'ring-2 ring-black' : ''}`}
              onClick={() => { 
                setSelectedBookAbbr(book.latin_name); 
                setOpen(false);
                // When book changes, navigate to chapter 1 verse 1 of the new book
                if (onBookChange) {
                  onBookChange(book.latin_name, 1, 1);
                }
              }}
              role="option"
              aria-selected={selectedBookAbbr === book.latin_name}
              tabIndex={0}
            >
              <FontAwesomeIcon icon={BOOK_ICONS[book.latin_name] || faBook} className="text-black" />
              {book.latin_name} <span className="ml-2 text-gray-500 text-base">{book.name}</span>
              {selectedBookAbbr === book.latin_name && <span className="ml-auto">✔️</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom Dropdown for Chapter Selector
const ChapterDropdown: React.FC<{
  chapters: number[];
  currentChapter: number;
  setCurrentChapter: (chapter: number) => void;
  onChapterChange?: (chapter: number) => void;
}> = ({ chapters, currentChapter, setCurrentChapter, onChapterChange }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="bg-white border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 flex items-center gap-2 font-black text-lg cursor-pointer min-w-[120px]"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <FontAwesomeIcon icon={faScroll} className="text-black" />
        Chapter {currentChapter}
        <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-gray-500" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 z-30 bg-white border-4 border-black rounded shadow-lg min-w-full max-h-80 overflow-y-auto custom-scrollbar hide-scrollbar"
          role="listbox"
        >
          {chapters.map(chapter => (
            <button
              key={chapter}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 font-bold text-lg hover:bg-yellow-100 focus:bg-yellow-200 transition rounded ${currentChapter === chapter ? 'bg-yellow-200' : ''}`}
              onClick={() => { 
                setCurrentChapter(chapter); 
                setOpen(false);
                if (onChapterChange) {
                  onChapterChange(chapter);
                }
              }}
              role="option"
              aria-selected={currentChapter === chapter}
              tabIndex={0}
            >
              Chapter {chapter}
              {currentChapter === chapter && <span className="ml-auto">✔️</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom Dropdown for Verse Selector
const VerseDropdown: React.FC<{
  verses: Verse[];
  selectedVerseNumber: number;
  handleVerseChange: (verseNumber: number) => void;
}> = ({ verses, selectedVerseNumber, handleVerseChange }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="bg-[#f8fafc] border-4 border-black rounded shadow-lg shadow-gray-300/40 px-4 py-2 flex items-center gap-2 font-black text-lg cursor-pointer min-w-[120px]"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <FontAwesomeIcon icon={faBook} className="text-black" />
        Verse {selectedVerseNumber}
        <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-gray-500" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 z-30 bg-white border-4 border-black rounded shadow-lg shadow-gray-300/40 min-w-full max-h-80 overflow-y-auto custom-scrollbar hide-scrollbar"
          role="listbox"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {verses.map(verse => (
            <button
              key={verse.verse_number}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 font-bold text-lg hover:bg-blue-100 focus:bg-blue-200 transition rounded ${selectedVerseNumber === verse.verse_number ? 'bg-blue-200' : ''}`}
              onClick={() => { handleVerseChange(verse.verse_number); setOpen(false); }}
              role="option"
              aria-selected={selectedVerseNumber === verse.verse_number}
              tabIndex={0}
            >
              Verse {verse.verse_number}
              {selectedVerseNumber === verse.verse_number && <span className="ml-auto">✔️</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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







// Global Edit Mode Component
const GlobalEditComponent: React.FC<{
  book: string;
  chapter: number;
  verse: number;
  onEditModeChange: (isActive: boolean) => void;
}> = ({ book, chapter, verse, onEditModeChange }) => {
  const [globalEditState, setGlobalEditState] = useState<GlobalEditState>({
    isActive: false,
    fields: [],
    isLoading: false
  });

  const startGlobalEdit = async () => {
    setGlobalEditState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/edit/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book, chapter, verse })
      });

      const sessionData = await response.json();
      
      if (response.ok) {
        const fieldsResponse = await fetch(`${API_BASE_URL}/analysis/edit/session/${sessionData.session_token}`);
        const fieldsData = await fieldsResponse.json();
        
        setGlobalEditState({
          isActive: true,
          session: {
            session_token: sessionData.session_token,
            session_id: sessionData.session_id,
            verse_id: fieldsData.verse_id,
            session_data: sessionData.verse_data,
            created_at: fieldsData.created_at,
            updated_at: fieldsData.updated_at
          },
          fields: fieldsData.fields,
          isLoading: false
        });
        onEditModeChange(true);
      }
    } catch (error) {
      console.error('Error starting global edit:', error);
      setGlobalEditState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const updateField = async (fieldId: number, newValue: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/edit/field/${fieldId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_value: newValue })
      });

             if (response.ok) {
        setGlobalEditState(prev => ({
          ...prev,
          fields: prev.fields.map(field => 
            field.id === fieldId 
              ? { ...field, current_value: newValue, is_modified: true }
              : field
          )
        }));
      }
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const generateAISuggestion = async (fieldId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/edit/field/${fieldId}/ai-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const suggestion = await response.json();
      
             if (response.ok) {
        setGlobalEditState(prev => ({
          ...prev,
          fields: prev.fields.map(field => 
            field.id === fieldId 
              ? { 
                  ...field, 
                  ai_suggested_value: suggestion.suggested_value,
                  confidence_score: suggestion.confidence_score
                }
              : field
          )
        }));
      }
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
    }
  };

  const saveAllChanges = async () => {
    if (!globalEditState.session) return;
    
    setGlobalEditState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/edit/session/${globalEditState.session.session_token}/save`, {
        method: 'POST'
      });

      const result = await response.json();
      
      if (response.ok) {
        setGlobalEditState({
          isActive: false,
          fields: [],
          isLoading: false
        });
        onEditModeChange(false);
        
        // Reload the page to show updated content
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setGlobalEditState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cancelEdit = () => {
    setGlobalEditState({
      isActive: false,
      fields: [],
      isLoading: false
    });
    onEditModeChange(false);
  };

  if (!globalEditState.isActive) {
    return (
      <div className="mt-4 p-4 bg-purple-50 border border-purple-300 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faEdit} />
              Global Edit Mode
            </h3>
            <p className="text-sm text-purple-600 mt-1">
              Edit all fields in this verse including text, definitions, and theological insights.
            </p>
          </div>
          <button
            onClick={startGlobalEdit}
                         disabled={globalEditState.isLoading}
             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
           >
             {globalEditState.isLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            ) : (
              'Start Editing'
            )}
          </button>
        </div>
      </div>
    );
  }

  const modifiedFields = globalEditState.fields.filter(field => field.is_modified);

  return (
    <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-400 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faEdit} />
          Global Edit Mode - Active
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-purple-600">
            {modifiedFields.length} field(s) modified
          </span>
          <button
            onClick={saveAllChanges}
            disabled={globalEditState.isLoading || modifiedFields.length === 0}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faSave} className="mr-1" />
            Save All
          </button>
          <button
            onClick={cancelEdit}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-1" />
            Cancel
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {globalEditState.fields.map((field) => (
          <div key={field.id} className="p-3 bg-white border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-purple-800">
                  {field.field_type.replace('_', ' ')}
                </span>
                {field.field_identifier !== 'main' && (
                  <span className="text-xs text-gray-500">({field.field_identifier})</span>
                )}
                {field.is_modified && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Modified
                  </span>
                )}
              </div>
              <button
                onClick={() => generateAISuggestion(field.id)}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faBrain} className="mr-1" />
                AI Suggest
              </button>
            </div>

            <textarea
              value={field.current_value}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
              rows={field.field_type === 'verse_text' ? 3 : 2}
            />

            {field.ai_suggested_value && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-800">AI Suggestion</span>
                  {field.confidence_score && (
                    <span className="text-xs text-blue-600">
                      {Math.round(field.confidence_score * 100)}% confidence
                    </span>
                  )}
                </div>
                <p className="text-sm text-blue-700">{field.ai_suggested_value}</p>
                <button
                  onClick={() => updateField(field.id, field.ai_suggested_value!)}
                  className="mt-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Apply Suggestion
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

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
      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        console.log('R key - triggering record'); // Debug log
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

  // Helper function to render interpretation layers
  const renderInterpretationLayers = () => {
    if (!analysisResultHasLayers(verseAnalysisState)) return null;

    const { theological_layer = [], symbolic_layer = [], cosmological_layer = [] } = verseAnalysisState;

    const layerCard = (title: string, latin: string, icon: any, points: string[], bg: string, border: string) => (
      <div className={`${bg} ${border} rounded-lg p-4 shadow`}>
        <h3 className="text-xl font-bold mb-2 flex items-center">
          <FontAwesomeIcon icon={icon} className="mr-2" />
          {title}
        </h3>
        <div className="italic text-gray-700 mb-1">{latin}</div>
        <ul className="list-disc list-inside text-gray-800 space-y-1">
          {points.map((p, idx) => (
            <li key={idx}>{p}</li>
          ))}
        </ul>
      </div>
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {layerCard('Theological Layer', 'Stratum Theologicum', faChurch, theological_layer, 'bg-yellow-100', 'border-l-8 border-yellow-400')}
        {layerCard('Symbolic Layer (Jungian & Campbell)', 'Stratum Symbolicum (Jungianum & Campbell)', faBrain, symbolic_layer, 'bg-purple-100', 'border-l-8 border-purple-400')}
        {layerCard('Cosmological-Historical Layer', 'Stratum Cosmologicum-Historicum', faGlobe, cosmological_layer, 'bg-orange-100', 'border-l-8 border-orange-400')}
      </div>
    );
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
        <div className="bg-white border-4 border-black rounded-2xl shadow-lg shadow-gray-200/40 p-6 w-full">
          {/* Verse navigation/selector */}
          <div className="bg-white border-4 border-black rounded-xl shadow-2xl shadow-gray-400/50 p-4 w-full flex flex-wrap gap-4 justify-center items-center mb-6">
            <button
              onClick={navigateToPreviousVerse}
              disabled={!selectedVerse || (selectedVerse.verse_number <= 1 && currentChapter <= 1) || isTransitioning || navigationInProgress}
              className="w-12 h-12 text-lg font-black text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-30 transition-all duration-200 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center"
              title="Previous verse (← arrow key) - crosses chapters"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <BookDropdown 
              books={books} 
              selectedBookAbbr={selectedBookAbbr} 
              setSelectedBookAbbr={setSelectedBookAbbr}
              onBookChange={(book, chapter, verse) => {
                updateURL(book, chapter, verse);
              }}
            />
            <ChapterDropdown 
              chapters={chapters} 
              currentChapter={currentChapter} 
              setCurrentChapter={setCurrentChapter}
              onChapterChange={(chapter) => {
                updateURL(selectedBookAbbr, chapter, 1);
              }}
            />
            <VerseDropdown verses={verses} selectedVerseNumber={selectedVerse?.verse_number || 1} handleVerseChange={handleVerseChange} />
            {/* Language dropdown shows when translations available */}
            <AnimatedWrapper 
              show={verseAnalysisState.translations && Object.keys(verseAnalysisState.translations).length > 0}
              enterClass="smooth-entrance"
              exitClass="smooth-exit"
            >
              <LanguageDropdown
                languages={Object.keys(verseAnalysisState.translations || {})}
                selectedLang={selectedTranslationLang}
                setSelectedLang={setSelectedTranslationLang}
                translations={verseAnalysisState.translations || {}}
              />
            </AnimatedWrapper>
            <button
              onClick={navigateToNextVerse}
              disabled={!selectedVerse || (selectedVerse.verse_number >= verses.length && currentChapter >= chapters.length) || isTransitioning || navigationInProgress}
              className="w-12 h-12 text-lg font-black text-white bg-purple-500 hover:bg-purple-600 disabled:opacity-30 transition-all duration-200 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center"
              title="Next verse (→ arrow key) - crosses chapters"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          {/* Verse and translation */}
          <div className="w-full">
            <div className="font-bold text-lg mb-2 flex items-center gap-2 justify-center">
              <button
                onClick={() => setIsBookInfoOpen(true)}
                className="text-purple-600 hover:text-purple-800 hover:scale-110 transition-all duration-200 p-1 rounded"
                title="Informatio Libri - Click for book information"
              >
                <FontAwesomeIcon icon={faBook} />
              </button>
              {BOOK_NAMES[selectedBookAbbr] || selectedBookAbbr} {currentChapter}:{selectedVerse?.verse_number}
              {/* Navigation state indicator */}
              {navigationInProgress && (
                <span className="text-sm text-blue-600 animate-pulse ml-2">
                  ⏳ Navigating...
                </span>
              )}
              {/* Sync verification */}
              {selectedVerse && location.pathname !== `/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}` && !navigationInProgress && (
                <span className="text-sm text-red-600 ml-2" title="Verse may be out of sync">
                  ⚠️ Syncing...
                </span>
              )}
            </div>
            <div className="verse-container min-h-[120px] flex items-center justify-center px-4 py-2 bg-white rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-100">
              {selectedVerse && (
                <div className={`verse-content ${verseAnimation !== 'none' ? verseAnimation : ''}`}>
                  <p className="text-xl font-bold text-center break-words whitespace-pre-line w-full max-w-full text-black leading-relaxed">
                  {selectedVerse?.text.split(' ').map((word, index) => {
                  const cleanWord = word.replace(/[.,:;?!]$/, '');
                  const normalized = normalizeLatin(cleanWord);
                  const wordInfo = verseAnalysisState.analysis[normalized];
                  const partOfSpeech = (wordInfo?.partOfSpeech?.toLowerCase() || 'unknown') as GrammarColorKey;
                  const isSelected = verseAnalysisState.selectedWord === normalized;
                  const isHovered = verseAnalysisState.hoveredWord === normalized;
                  const isClickSelected = verseAnalysisState.selectedWordIndex === index;
                  const isCurrentlyPlaying = currentlyPlayingWordIndex === index;
                  
                  // Analysis completed animation class
                  const analysisCompleteClass = verseAnalysisState.isAnalysisDone ? 'analysis-complete' : '';
                  
                  let className = `mx-1 break-words inline-block font-black cursor-pointer transition-all duration-500 ${analysisCompleteClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 focus:bg-blue-50`;
                  let style: React.CSSProperties = {
                    transformOrigin: 'center',
                    willChange: 'transform',
                    padding: '0.15em 0.2em',
                    margin: '0 0.1em'
                  };
                  
                  // Show highlights only if analysis is done and interaction is happening
                  if (verseAnalysisState.isAnalysisDone && (isSelected || isHovered || isClickSelected || isCurrentlyPlaying)) {
                    const colorClass = GRAMMAR_COLORS[partOfSpeech] || GRAMMAR_COLORS.default;
                    const colors = getColorsFromGrammarClass(colorClass);
                    
                    style.backgroundColor = colors.bg;
                    style.color = colors.text;
                    
                    style.borderRadius = '0.5rem';
                    style.padding = '0.15em 0.4em';
                    style.position = 'relative';
                    style.zIndex = 1;
                    style.border = 'none';
                    
                    if (isSelected) {
                      style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
                    }
                    if (isHovered) {
                      style.transform = 'scale(1.05)';
                      style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }
                    if (isCurrentlyPlaying) {
                      // Keep the grammar-based background color but add playing effects
                      style.transform = 'scale(1.1)';
                      style.boxShadow = '0 0 0 4px rgba(251, 191, 36, 0.8), 0 8px 16px rgba(0, 0, 0, 0.2)'; 
                      style.fontWeight = '900';
                      style.animation = 'pulse 0.5s ease-in-out';
                      // Add a subtle golden border to indicate it's currently playing
                      style.border = '2px solid #fbbf24';
                    }
                  } else {
                    // Default black text - no highlighting until analysis completes
                    className += 'text-black hover:bg-gray-100 hover:rounded hover:shadow-sm ';
                    style.border = 'none';
                    style.background = 'transparent';
                  }
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleWordClick(index);
                        handleGrammarWordClick(cleanWord);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleWordClick(index);
                          handleGrammarWordClick(cleanWord);
                        }
                      }}
                      onMouseEnter={() => handleWordHover(cleanWord)}
                      onMouseLeave={() => handleWordHover(null)}
                      className={className}
                      style={{
                        ...style,
                        border: 'none',
                        background: style.backgroundColor || 'transparent',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        textDecoration: 'none',
                        outline: 'none'
                      }}
                      title={wordInfo ? `${wordInfo.partOfSpeech}: ${wordInfo.definition}` : 'Click for definition'}
                      tabIndex={0}
                      role="button"
                      aria-label={`Word: ${cleanWord}${wordInfo ? ` - ${wordInfo.partOfSpeech}: ${wordInfo.definition}` : ''}`}
                    >
                      {word}
                    </button>
                  );
                })}
                  </p>
                </div>
              )}
            </div>
            
            {/* Loading indicator below verse */}
            {isVerseLoading && !verseAnalysisState.isAnalysisDone && (
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm">Analyzing verse...</span>
              </div>
            )}
            
            {/* Simplified Translation Display */}
            <AnimatedWrapper 
              show={!isVerseLoading && verseAnalysisState.translations && Object.keys(verseAnalysisState.translations).length > 0}
              enterClass="smooth-entrance-up"
              exitClass="smooth-exit-down"
            >
              <div className="mt-4 border-t border-gray-200 pt-3">
                {(() => {
                  const currentTranslation = verseAnalysisState.translations?.[selectedTranslationLang] || '';
                  
                  return (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-gray-800 leading-relaxed text-sm">
                        {renderMarkdown(currentTranslation)}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </AnimatedWrapper>
          </div>

          {/* Play/Pause and Record buttons */}
          <div className="flex gap-4 justify-center mt-4 flex-wrap">
            {audioAvailable && (
              <button
                className={`p-3 rounded-full ${isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white shadow transition-all duration-200`}
                title={isPlaying ? 'Pause audio (P key)' : 'Play audio with word highlighting (P key)'}
                onClick={() => {
                  if (isPlaying) {
                    if (audioSource) audioSource.stop();
                    setIsPlaying(false);
                    setAudioSource(null);
                    setCurrentlyPlayingWordIndex(null);
                  } else {
                    playAudioWithWordHighlighting();
                  }
                }}
                disabled={!selectedVerse}
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
            )}
            <button
              className={`p-3 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-pink-500 hover:bg-pink-600'} text-white shadow transition-all duration-200 hover:scale-130`}
              title={isRecording ? 'Stop recording (R key)' : 'Start recording (R key)'}
              onClick={handleRecordClick}
              disabled={!selectedVerse}
            >
              <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
            </button>
            {/* Manual upload button - appears when there's a recording but upload failed or didn't happen */}
            {recording && !isUploading && !uploadSuccess && !audioAvailable && (
              <button
                className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow transition-colors duration-200"
                title="Upload recording"
                onClick={() => uploadRecording(recording)}
                disabled={!selectedVerse}
              >
                <FontAwesomeIcon icon={faUpload} />
              </button>
            )}
            {/* Enhanced OpenAI Analysis button with floating translation icon */}
            <div className="relative floating-translation-container">
              <button
                className={`p-3 rounded-full border-2 border-black ${
                  isOpenAIAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                } text-white shadow transition-all duration-200 hover:scale-130`}
                title="Enhance analysis with Greb AI (G key) | Hover to show translation generator"
                onClick={handleEnhanceClick}
                onMouseEnter={() => {
                  if (hoverTimeoutId) {
                    clearTimeout(hoverTimeoutId);
                    setHoverTimeoutId(null);
                  }
                  setBrainButtonHovered(true);
                }}
                onMouseLeave={() => {
                  const timeoutId = setTimeout(() => {
                    setBrainButtonHovered(false);
                  }, 1500); // 1.5 second delay
                  setHoverTimeoutId(timeoutId);
                }}
                disabled={!selectedVerse || isOpenAIAnalyzing}
              >
                {isOpenAIAnalyzing ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faBrain} />
                )}
              </button>
              
              {/* Floating Translation Icon - shows on hover */}
              {(showFloatingTranslation || brainButtonHovered) && (
                <div 
                  className="absolute -top-9 -right-2 z-50"
                  onMouseEnter={() => {
                    if (hoverTimeoutId) {
                      clearTimeout(hoverTimeoutId);
                      setHoverTimeoutId(null);
                    }
                    setBrainButtonHovered(true);
                  }}
                  onMouseLeave={() => {
                    const timeoutId = setTimeout(() => {
                      setBrainButtonHovered(false);
                    }, 1500); // 1.5 second delay
                    setHoverTimeoutId(timeoutId);
                  }}
                >
                  <button
                    onClick={handleForceTranslations}
                    disabled={isGeneratingTranslations}
                    className={`w-8 h-8 rounded-full border-2 border-black shadow-lg transform transition-all duration-300 ease-out ${
                      isGeneratingTranslations 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-110 animate-bounce'
                    } text-white flex items-center justify-center relative overflow-hidden`}
                    style={{
                      animation: (showFloatingTranslation || brainButtonHovered)
                        ? 'floatingTranslationPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' 
                        : undefined
                    }}
                    title="Force generate all translations"
                  >
                    {isGeneratingTranslations ? (
                      <div className="relative">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-xs" />
                        <LanguageCycleIndicator />
                      </div>
                    ) : (
                      <FontAwesomeIcon icon={faLanguage} className="text-xs" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Recording status */}
          {uploadStatus && (
            <div className="mt-2 text-center">
              {uploadStatus}
            </div>
          )}
        </div>

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
                  renderInterpretationLayers()
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
                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                  <h4 className="text-md font-bold mb-2 text-gray-700">
                    <FontAwesomeIcon icon={faBook} className="mr-2" />
                    Grammar Breakdown
                  </h4>
                  
                  {/* Grammar Legend */}
                  <div className="mb-3 p-3 bg-white border border-gray-200 rounded">
                    <h5 className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Legenda Grammatica (Grammar Legend)</h5>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
                        <span className="text-blue-800 font-medium">Verbum</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                        <span className="text-green-800 font-medium">Nomen</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-purple-100 border border-purple-300"></div>
                        <span className="text-purple-800 font-medium">Adiectivum</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-orange-100 border border-orange-300"></div>
                        <span className="text-orange-800 font-medium">Adverbium</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
                        <span className="text-red-800 font-medium">Pronomen</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300"></div>
                        <span className="text-gray-800 font-medium">Praepositio</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-pink-100 border border-pink-300"></div>
                        <span className="text-pink-800 font-medium">Coniunctio</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-indigo-100 border border-indigo-300"></div>
                        <span className="text-indigo-800 font-medium">Participium</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {verseAnalysisState.grammarBreakdown.map((item, index) => {
                      const posKey = (item.part_of_speech?.toLowerCase() || 'default') as GrammarColorKey;
                      const colorClass = GRAMMAR_COLORS[posKey] || GRAMMAR_COLORS.default;
                      return (
                        <button
                          key={index}
                          className={`w-full flex justify-between items-center p-2 rounded border cursor-pointer transition-transform duration-150 hover:scale-[1.02] ${colorClass}`}
                          onClick={() => {
                            handleWordClick(index);
                            handleGrammarWordClick(item.word);
                          }}
                        >
                          <span className="font-bold">{item.word}</span>
                          <span className="text-xs uppercase">{item.part_of_speech}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
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

// Add these helper functions above App
function getHighlightBgForWordType(partOfSpeech: string) {
  const pos = (partOfSpeech || '').toLowerCase();
  switch (pos) {
    case 'verb': return '#dbeafe'; // blue-100
    case 'noun': return '#bbf7d0'; // green-100
    case 'adjective': return '#e9d5ff'; // purple-100
    case 'adverb': return '#fed7aa'; // orange-100
    case 'pronoun': return '#fecaca'; // red-100
    case 'preposition': return '#f3f4f6'; // gray-100
    case 'conjunction': return '#fbcfe8'; // pink-100
    case 'participle': return '#c7d2fe'; // indigo-100
    case 'unknown':
    case '':
    default: return '#e5e7eb'; // gray-200
  }
}
function getHighlightTextForWordType(partOfSpeech: string) {
  const pos = (partOfSpeech || '').toLowerCase();
  switch (pos) {
    case 'verb': return '#1e40af'; // blue-800
    case 'noun': return '#166534'; // green-800
    case 'adjective': return '#6d28d9'; // purple-800
    case 'adverb': return '#c2410c'; // orange-800
    case 'pronoun': return '#b91c1c'; // red-800
    case 'preposition': return '#1f2937'; // gray-800
    case 'conjunction': return '#be185d'; // pink-800
    case 'participle': return '#3730a3'; // indigo-800
    case 'unknown':
    case '':
    default: return '#374151'; // gray-700
  }
}

// Enhanced Language Dropdown with clear translation type indicators
const LanguageDropdown: React.FC<{
  languages: string[];
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  translations?: { [key: string]: string };
}> = ({ languages, selectedLang, setSelectedLang, translations = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (lang: string) => {
    setSelectedLang(lang);
    setIsOpen(false);
  };

  const languageName = LANGUAGES.find(l => l.code === selectedLang)?.name || selectedLang.toUpperCase();
  const languageFlag = LANGUAGES.find(l => l.code === selectedLang)?.flag || '🌐';

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-white hover:bg-gray-50 text-black font-black border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] flex items-center gap-2 transition-all duration-200"
      >
        <span className="text-lg">{languageFlag}</span>
        <span className="font-black text-black">{languageName}</span>
        <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-gray-600" />
      </button>
      {isOpen && (
        <div className="origin-top-right absolute z-50 mt-2 w-48 bg-white border-4 border-black rounded-none shadow-lg">
          {languages.map(lang => {
            const langName = LANGUAGES.find(l => l.code === lang)?.name || lang.toUpperCase();
            const langFlag = LANGUAGES.find(l => l.code === lang)?.flag || '🌐';
            
            return (
              <button
                key={lang}
                onClick={() => handleSelect(lang)}
                className={`block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3 ${
                  selectedLang === lang ? 'bg-gray-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <span className="text-lg">{langFlag}</span>
                <div className="flex-1">
                  <div className="font-bold text-black">{langName}</div>
                </div>
                {selectedLang === lang && (
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faGem} className="text-yellow-600" />
                    <span className="text-xs font-bold text-blue-600">ACTIVE</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
