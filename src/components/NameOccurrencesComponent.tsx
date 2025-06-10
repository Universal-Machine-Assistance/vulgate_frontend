import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { NameOccurrence, BOOK_NAMES } from '../types';

interface NameOccurrencesComponentProps {
  occurrences: NameOccurrence[];
  onNavigate: (book: string, chapter: number, verse: number) => void;
}

const NameOccurrencesComponent: React.FC<NameOccurrencesComponentProps> = ({ 
  occurrences, 
  onNavigate 
}) => {
  if (!occurrences || occurrences.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-blue-50 border-4 border-blue-400 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        <FontAwesomeIcon icon={faUser} className="text-blue-600" />
        Other Occurrences
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
        {occurrences.map((occ, index) => (
          <button
            key={index}
            onClick={() => onNavigate(occ.book, occ.chapter, occ.verse)}
            className="w-full text-left p-2 hover:bg-blue-100 rounded transition-colors duration-200 border-2 border-blue-200"
          >
            <div className="font-bold text-blue-800">
              {BOOK_NAMES[occ.book] || occ.book} {occ.chapter}:{occ.verse}
            </div>
            <div className="text-sm text-gray-600">{occ.context}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NameOccurrencesComponent; 