import { 
  faCrown, 
  faFeatherAlt, 
  faHeart, 
  faFire, 
  faUser, 
  faShield, 
  faStar, 
  faGem 
} from '@fortawesome/free-solid-svg-icons';

export const getIconForWordType = (partOfSpeech: string) => {
  const pos = (partOfSpeech || '').toLowerCase();
  switch (pos) {
    case 'verb': return faCrown;
    case 'noun': return faFeatherAlt;
    case 'adjective': return faHeart;
    case 'adverb': return faFire;
    case 'pronoun': return faUser;
    case 'preposition': return faShield;
    case 'conjunction': return faStar;
    case 'participle': return faGem;
    default: return faFeatherAlt;
  }
};

export const getColorForWordType = (partOfSpeech: string): string => {
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
};

export const getColorsFromGrammarClass = (colorClass: string) => {
  // Extract colors from Tailwind class strings like 'bg-blue-100 text-blue-800 border-blue-300'
  const bgMatch = colorClass.match(/bg-(\w+)-(\d+)/);
  const textMatch = colorClass.match(/text-(\w+)-(\d+)/);
  
  if (bgMatch && textMatch) {
    const [, bgColor, bgShade] = bgMatch;
    const [, textColor, textShade] = textMatch;
    
    // Map Tailwind colors to hex values (simplified)
    const colorMap: { [key: string]: { [key: string]: string } } = {
      blue: { '100': '#dbeafe', '800': '#1e40af' },
      green: { '100': '#bbf7d0', '800': '#166534' },
      purple: { '100': '#e9d5ff', '800': '#6d28d9' },
      orange: { '100': '#fed7aa', '800': '#c2410c' },
      red: { '100': '#fecaca', '800': '#b91c1c' },
      gray: { '100': '#f3f4f6', '800': '#1f2937' },
      pink: { '100': '#fbcfe8', '800': '#be185d' },
      indigo: { '100': '#c7d2fe', '800': '#3730a3' }
    };
    
    return {
      bg: colorMap[bgColor]?.[bgShade] || '#f3f4f6',
      text: colorMap[textColor]?.[textShade] || '#1f2937'
    };
  }
  
  // Fallback
  return {
    bg: '#f3f4f6',
    text: '#1f2937'
  };
};

export const normalizeLatin = (word: string): string => {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/æ/g, 'ae')
    .replace(/œ/g, 'oe')
    .replace(/[^\w]/g, ''); // Remove non-word characters
};

export const getHighlightBgForWordType = (partOfSpeech: string) => {
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
};

export const getHighlightTextForWordType = (partOfSpeech: string) => {
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
}; 