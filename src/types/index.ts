// Shared interfaces for the application

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