import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
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
  faRotate
} from '@fortawesome/free-solid-svg-icons';
import { BOOK_ICONS, getBookCategoryColor } from '../constants';

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
  faRotate
);

// Constants
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Book constants
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

interface VerseAnalysisState {
  analysis: Record<string, WordInfo>;
  grammarBreakdown: any[];
  selectedWordIndex: number | null;
  wordInfo: WordInfo | null;
  isAnalysisDone: boolean;
  translations: Record<string, string>;
  theological_layer: string[];
  symbolic_layer: string[];
  cosmological_layer: string[];
  isLoading: boolean;
  loadingMessage: string;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveMessage: string;
  selectedWord: string | null;
  hoveredWord: string | null;
  nameOccurrences: string[];
}

// Custom Dropdown for Book Selector
const BookDropdown: React.FC<{
  books: Book[];
  selectedBookAbbr: string;
  setSelectedBookAbbr: (abbr: string) => void;
}> = ({ books, selectedBookAbbr, setSelectedBookAbbr }) => {
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
              onClick={() => { setSelectedBookAbbr(book.latin_name); setOpen(false); }}
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
}> = ({ chapters, currentChapter, setCurrentChapter }) => {
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
              onClick={() => { setCurrentChapter(chapter); setOpen(false); }}
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

// Language Selector Component
const LanguageSelector: React.FC<{
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  availableLanguages: { code: string; name: string; flag: string; }[];
}> = ({ selectedLanguage, onLanguageChange, availableLanguages }) => {
  const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const selectedLang = availableLanguages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="bg-white border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 flex items-center gap-2 font-black text-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <FontAwesomeIcon icon={faLanguage} className="text-black" />
        {selectedLang ? `${selectedLang.flag} ${selectedLang.name}` : 'Select Language'}
        <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-gray-500" />
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 z-30 bg-white border-4 border-black rounded shadow-lg min-w-full"
          role="listbox"
        >
          {availableLanguages.map(lang => (
            <button
              key={lang.code}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 font-bold text-lg hover:bg-gray-100 transition ${
                selectedLanguage === lang.code ? 'bg-gray-100' : ''
              }`}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={selectedLanguage === lang.code}
            >
              {lang.flag} {lang.name}
              {selectedLanguage === lang.code && <span className="ml-auto">✔️</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const VersePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verseAnalysisState, setVerseAnalysisState] = useState<VerseAnalysisState>({
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
    loadingMessage: '',
    saveStatus: 'idle',
    saveMessage: '',
    selectedWord: null,
    hoveredWord: null,
    nameOccurrences: []
  });

  const [selectedBookAbbr, setSelectedBookAbbr] = useState<string>("Gn");
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [chapters, setChapters] = useState<number[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [availableLanguages, setAvailableLanguages] = useState<{ code: string; name: string; flag: string; }[]>([]);
  const [audioAvailable, setAudioAvailable] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isOpenAIAnalyzing, setIsOpenAIAnalyzing] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  useEffect(() => {
    // Fetch books on component mount
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching books...');
        const response = await fetch(`${API_BASE_URL}/books`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Books data:', data);
        if (!Array.isArray(data)) {
          console.error('Books data is not an array:', data);
          throw new Error('Invalid books data format');
        }
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to load books. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    // Fetch verses when book or chapter changes
    const fetchVerses = async () => {
      try {
        setError(null);
        const response = await fetch(`${API_BASE_URL}/verses/by-reference/${selectedBookAbbr}/${currentChapter}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Ensure data is an array
        setVerses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching verses:', error);
        setError('Failed to load verses. Please try again later.');
        setVerses([]); // Reset verses to empty array on error
      }
    };

    fetchVerses();
  }, [selectedBookAbbr, currentChapter]);

  useEffect(() => {
    const fetchSupportedLanguages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/languages/supported`);
        if (!response.ok) throw new Error('Failed to fetch supported languages');
        const data = await response.json();
        setAvailableLanguages(data.supported_languages);
        setSelectedLanguage(data.default_language);
      } catch (error) {
        console.error('Error fetching supported languages:', error);
      }
    };
    fetchSupportedLanguages();
  }, []);

  // Initialize AudioContext
  useEffect(() => {
    setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)());
  }, []);

  // Check if audio is available for current verse
  const checkAudioAvailability = useCallback(async () => {
    if (!selectedVerse) {
      setAudioAvailable(false);
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/audio/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}`;
      const response = await fetch(url, { method: 'HEAD' });
      setAudioAvailable(response.ok);
    } catch (error) {
      setAudioAvailable(false);
    }
  }, [selectedVerse, selectedBookAbbr, currentChapter]);

  // Play audio function
  const playAudio = async (startTime: number = 0, loop: boolean = false) => {
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

  // Check audio availability when verse changes
  useEffect(() => {
    checkAudioAvailability();
  }, [selectedVerse, checkAudioAvailability]);

  const analyzeVerse = async () => {
    if (!selectedVerse) return;

    setVerseAnalysisState(prev => ({
      ...prev,
      isLoading: true,
      loadingMessage: 'Analyzing verse...'
    }));

    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds

    for (let attempt = 0; attempt < maxRetries; attempt++) {
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

        if (response.status === 429) {
          // Rate limit hit, wait and retry
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
          setVerseAnalysisState(prev => ({
            ...prev,
            loadingMessage: `Rate limit hit. Retrying in ${delay/1000} seconds...`
          }));
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
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
          loadingMessage: ''
        }));
        return; // Success, exit the retry loop
      } catch (error) {
        if (attempt === maxRetries - 1) {
          // Last attempt failed
          console.error('Error analyzing verse:', error);
          setVerseAnalysisState(prev => ({
            ...prev,
            isLoading: false,
            loadingMessage: '',
            saveStatus: 'error',
            saveMessage: 'Failed to analyze verse. Please try again later.'
          }));
        }
        // Otherwise, continue to next retry
      }
    }
  };

  const handleWordClick = (word: string, index: number) => {
    setVerseAnalysisState(prev => ({
      ...prev,
      selectedWord: word,
      selectedWordIndex: index,
      wordInfo: prev.analysis[word] || null
    }));
  };

  const handleWordHover = (word: string) => {
    setVerseAnalysisState(prev => ({
      ...prev,
      hoveredWord: word
    }));
  };

  const renderWordInfo = () => {
    const { wordInfo } = verseAnalysisState;
    if (!wordInfo) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
        <h3 className="text-xl font-bold mb-2">{wordInfo.latin}</h3>
        <div className="space-y-2">
          <p><span className="font-semibold">Definition:</span> {wordInfo.definition}</p>
          <p><span className="font-semibold">Part of Speech:</span> {wordInfo.partOfSpeech}</p>
          {wordInfo.etymology && (
            <p><span className="font-semibold">Etymology:</span> {wordInfo.etymology}</p>
          )}
          {wordInfo.morphology && (
            <p><span className="font-semibold">Morphology:</span> {wordInfo.morphology}</p>
          )}
          {wordInfo.pronunciation && (
            <p><span className="font-semibold">Pronunciation:</span> {wordInfo.pronunciation}</p>
          )}
        </div>
      </div>
    );
  };

  const renderTranslations = () => {
    const { translations } = verseAnalysisState;
    if (!translations || Object.keys(translations).length === 0) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
        <h3 className="text-xl font-bold mb-2">Translations</h3>
        <div className="space-y-2">
          {Object.entries(translations).map(([language, text]) => (
            <div key={language} className="border-b pb-2">
              <span className="font-semibold">{language}:</span> {text}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLayers = () => {
    const { theological_layer, symbolic_layer, cosmological_layer } = verseAnalysisState;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            <FontAwesomeIcon icon={faChurch} className="mr-2" />
            Theological Layer
          </h3>
          <ul className="space-y-2">
            {theological_layer.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 mr-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            <FontAwesomeIcon icon={faBrain} className="mr-2" />
            Symbolic Layer (Jungian & Campbell)
          </h3>
          <ul className="space-y-2">
            {symbolic_layer.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 mr-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            <FontAwesomeIcon icon={faGlobe} className="mr-2" />
            Cosmological Layer
          </h3>
          <ul className="space-y-2">
            {cosmological_layer.map((item, index) => (
              <li key={index} className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 mr-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const handleVerseChange = (verseNumber: number) => {
    if (verseNumber >= 1 && verseNumber <= verses.length) {
      setSelectedVerse(verses.find(v => v.verse_number === verseNumber) || null);
    }
  };

  // Recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        uploadRecording(blob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Upload recording to server
  const uploadRecording = async (audioBlob: Blob) => {
    if (!selectedVerse || !audioBlob) return;

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
        // Check audio availability after upload
        setTimeout(() => {
          checkAudioAvailability();
        }, 1000);
      }
    } catch (error) {
      console.error('Error uploading recording:', error);
    }
  };

  // Greb AI enhance handler
  const handleEnhanceClick = async () => {
    if (!selectedVerse || isOpenAIAnalyzing) return;
    setIsOpenAIAnalyzing(true);
    try {
      await analyzeVerse();
    } finally {
      setIsOpenAIAnalyzing(false);
    }
  };

  const translateVerse = async (targetLanguage: string) => {
    if (!selectedVerse) return;

    setIsTranslating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/dictionary/translate/verse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verse: selectedVerse.text,
          reference: `${selectedBookAbbr} ${currentChapter}:${selectedVerse.verse_number}`,
          target_language: targetLanguage
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setVerseAnalysisState(prev => ({
        ...prev,
        translations: data.translations || {},
        isLoading: false,
        loadingMessage: '',
        saveStatus: 'saved',
        saveMessage: 'Translation saved successfully'
      }));
    } catch (error) {
      console.error('Error translating verse:', error);
      setVerseAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        loadingMessage: '',
        saveStatus: 'error',
        saveMessage: 'Failed to translate verse. Please try again later.'
      }));
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Vulgate Bible Study</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => handleVerseChange(selectedVerse ? selectedVerse.verse_number - 1 : 1)}
              disabled={!selectedVerse || selectedVerse.verse_number <= 1}
              className="px-3 py-2 text-lg font-black text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-30 transition-all duration-200 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
              title="Previous verse"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            {isLoading ? (
              <div className="px-4 py-2 bg-white border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <FontAwesomeIcon icon={faSpinner} spin className="text-black" />
                <span className="ml-2">Loading books...</span>
              </div>
            ) : Array.isArray(books) && books.length > 0 ? (
              <BookDropdown 
                books={books} 
                selectedBookAbbr={selectedBookAbbr} 
                setSelectedBookAbbr={setSelectedBookAbbr} 
              />
            ) : (
              <div className="px-4 py-2 bg-white border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-red-600">No books available</span>
              </div>
            )}
            <ChapterDropdown chapters={chapters} currentChapter={currentChapter} setCurrentChapter={setCurrentChapter} />
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              availableLanguages={availableLanguages}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Verse Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {verses && verses.length > 0 ? (
            verses.map((verse) => (
              <div
                key={verse.verse_number}
                onClick={() => setSelectedVerse(verse)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedVerse?.verse_number === verse.verse_number
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="font-semibold">Verse {verse.verse_number}</div>
                <div className="text-gray-600 mt-2">{verse.text}</div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {error ? 'Error loading verses' : 'No verses found for this chapter'}
            </div>
          )}
        </div>

        {/* Verse and translation */}
        <div className="w-full">
          <div className="font-bold text-lg mb-2 flex items-center gap-2 justify-center">
            <FontAwesomeIcon icon={faBook} />
            {BOOK_NAMES[selectedBookAbbr] || selectedBookAbbr} {currentChapter}:{selectedVerse?.verse_number}
          </div>
          <div className="min-h-[120px] flex items-center justify-center px-4 py-2" style={{ willChange: 'auto' }}>
            {selectedVerse && (
              <p className="text-xl font-bold text-center break-words whitespace-pre-line w-full max-w-full text-black leading-relaxed">
                {selectedVerse?.text}
              </p>
            )}
          </div>

          {/* Translation section */}
          {selectedVerse && verseAnalysisState.translations && (
            <div className="mt-4 border-t-2 border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FontAwesomeIcon icon={faLanguage} />
                  Translation
                </h3>
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={(lang) => {
                    setSelectedLanguage(lang);
                    if (!verseAnalysisState.translations[lang]) {
                      translateVerse(lang);
                    }
                  }}
                  availableLanguages={availableLanguages}
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                {verseAnalysisState.translations[selectedLanguage] ? (
                  <p className="text-lg text-gray-700">
                    {verseAnalysisState.translations[selectedLanguage]}
                  </p>
                ) : isTranslating ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Translating...</span>
                  </div>
                ) : (
                  <button
                    onClick={() => translateVerse(selectedLanguage)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faLanguage} />
                    <span>Click to translate to {availableLanguages.find(l => l.code === selectedLanguage)?.name}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Analysis Section */}
        {selectedVerse && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              {BOOK_NAMES[selectedBookAbbr]} {currentChapter}:{selectedVerse.verse_number}
            </h2>
            <div className="text-lg mb-6 relative">
              <button
                onClick={async () => {
                  if (!selectedVerse) return;
                  setVerseAnalysisState(prev => ({
                    ...prev,
                    isLoading: true,
                    loadingMessage: 'Regenerating analysis...'
                  }));
                  await analyzeVerse();
                }}
                className="absolute -right-8 top-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Regenerate analysis"
              >
                <FontAwesomeIcon icon={faRotate} className="w-4 h-4" />
              </button>
              {selectedVerse.text.split(' ').map((word, index) => (
                <span
                  key={index}
                  onClick={() => handleWordClick(word, index)}
                  onMouseEnter={() => handleWordHover(word)}
                  onMouseLeave={() => handleWordHover('')}
                  className={`cursor-pointer hover:bg-yellow-100 px-1 rounded ${
                    verseAnalysisState.selectedWord === word ? 'bg-yellow-200' : ''
                  }`}
                >
                  {word}{' '}
                </span>
              ))}
            </div>
            
            {verseAnalysisState.isLoading ? (
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>{verseAnalysisState.loadingMessage}</span>
              </div>
            ) : verseAnalysisState.isAnalysisDone ? (
              <div className="space-y-4">
                {renderWordInfo()}
                {renderTranslations()}
                {renderLayers()}
              </div>
            ) : (
              <button
                onClick={analyzeVerse}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Analyze Verse
              </button>
            )}
          </div>
        )}

        {/* Play/Pause and Record buttons */}
        <div className="flex gap-4 justify-center mt-4">
          {audioAvailable && (
            <button
              className={`p-3 rounded-full ${isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white shadow transition-colors duration-200`}
              title={isPlaying ? 'Pause audio' : 'Play audio'}
              onClick={() => {
                if (isPlaying) {
                  if (audioSource) audioSource.stop();
                  setIsPlaying(false);
                  setAudioSource(null);
                } else {
                  playAudio(0, false);
                }
              }}
              disabled={!selectedVerse}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
          )}
          <div className="flex gap-4">
            <button
              className={`p-3 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-pink-500 hover:bg-pink-600'} text-white shadow transition-colors duration-200`}
              title={isRecording ? 'Stop recording' : 'Start recording'}
              onClick={handleRecordClick}
              disabled={!selectedVerse}
            >
              <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
            </button>
            <button
              className={`p-3 rounded-full ${isOpenAIAnalyzing ? 'bg-purple-500 hover:bg-purple-600 animate-pulse' : 'bg-purple-500 hover:bg-purple-600'} text-white shadow transition-colors duration-200`}
              title="Enhance with Greb AI"
              onClick={handleEnhanceClick}
              disabled={!selectedVerse || isOpenAIAnalyzing}
            >
              <FontAwesomeIcon icon={faBrain} />
            </button>
          </div>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={(lang) => {
              setSelectedLanguage(lang);
              if (!verseAnalysisState.translations[lang]) {
                translateVerse(lang);
              }
            }}
            availableLanguages={availableLanguages}
          />
        </div>
      </div>
    </div>
  );
};

export default VersePage; 