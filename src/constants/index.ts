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
  faFont,
  faExchangeAlt,
  faQuoteLeft,
  faRobot,
  faBookOpen,
  faGem,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

// Constants
export const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Book constants
export const BOOK_ABBREVIATIONS: { [key: string]: number } = {
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

// Add icons to the library
export const initializeFontAwesome = () => {
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
    faGem,
    faInfoCircle
  );
};

// Initialize FontAwesome icons
initializeFontAwesome(); 