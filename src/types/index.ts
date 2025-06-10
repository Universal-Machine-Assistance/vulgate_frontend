// Shared interfaces for the application

// Import FontAwesome icons for BOOK_ICONS
import {
  faTree, faMountain, faFire, faUsers, faScroll, faShield, faGavel, faHeart,
  faHome, faShieldAlt, faHandsHelping, faCrown, faStar, faBalanceScale, faMusic,
  faLightbulb, faSun, faRing, faEye, faBook, faDove, faHeartbeat, faTint,
  faLeaf, faFish, faEnvelope, faFeather, faUserTie, faGift, faChurch,
  faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons';

export interface NameOccurrence {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  context: string;
}

export interface VerseRelationship {
  verse_reference: string;
  verse_text: string;
  position: number;
}

export interface VerseRelationshipsResponse {
  word: string;
  found: boolean;
  verse_count: number;
  verses: VerseRelationship[];
}

export interface AnalysisHistoryEntry {
  id: number;
  action_type: string;
  target_field: string;
  target_identifier?: string;
  old_value?: string;
  new_value?: string;
  change_source: string;
  created_at: string;
  confidence_score?: number;
  review_status: string;
  extra_data?: any;
}

export interface QueueItem {
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  status: string;
  grammar_complete: boolean;
  theological_complete: boolean;
  symbolic_complete: boolean;
  cosmological_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface WordInfo {
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

export type GrammarColorKey = 'verb' | 'noun' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun' | 'participle' | 'default';

export const GRAMMAR_COLORS: Record<GrammarColorKey, string> = {
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

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "latin", name: "Latin", flag: "🏛️" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "it", name: "Italian", flag: "🇮🇹" }
];

export interface Book {
  id: number;
  name: string;
  latin_name: string;
  chapter_count: number;
  created_at: string;
}

export interface Verse {
  verse_number: number;
  text: string;
  macronized_text?: string;
}

export const BOOK_ICONS: { [key: string]: any } = {
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
  "Ps": faMusic,        // Psalms - Music
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

export const getBookCategoryColor = (bookName: string) => {
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

// Book names mapping
export const BOOK_NAMES: { [key: string]: string } = {
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

// Additional interfaces for verse analysis
export interface VerseAnalysis {
  [key: string]: WordInfo;
}

export interface GrammarItem {
  word: string;
  meaning: string;
  part_of_speech: string;
  grammar_description?: string;
  morphology?: string;
}

export interface NotificationType {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface EditState {
  isEditing: boolean;
  editingWord: string | null;
  editMeaning: string;
  editGrammarDescription: string;
  editPartOfSpeech: string;
  editMorphology: string;
}

export interface VerseAnalysisState {
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