import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { WordInfo, GrammarColorKey, GRAMMAR_COLORS } from '../types';
import WordVerseRelationships from './WordVerseRelationships';

interface WordInfoComponentProps {
  wordInfo: WordInfo | null;
  className?: string;
  onClose?: () => void;
  isPopup?: boolean;
  onNavigateToVerse?: (reference: string) => void;
}

const WordInfoComponent: React.FC<WordInfoComponentProps> = ({ 
  wordInfo, 
  className = "", 
  onClose, 
  isPopup = false, 
  onNavigateToVerse 
}) => {
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

export default WordInfoComponent; 