import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { GrammarColorKey, GRAMMAR_COLORS, GrammarItem } from '../types';

interface GrammarBreakdownComponentProps {
  grammarBreakdown: GrammarItem[];
  onWordClick: (index: number) => void;
  onGrammarWordClick: (word: string) => void;
}

const GrammarBreakdownComponent: React.FC<GrammarBreakdownComponentProps> = ({
  grammarBreakdown,
  onWordClick,
  onGrammarWordClick
}) => {
  return (
    <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
      <h4 className="text-md font-bold mb-2 text-gray-700">
        <FontAwesomeIcon icon={faBook} className="mr-2" />
        Grammar Breakdown
      </h4>
      
      {/* Grammar Legend */}
      <div className="mb-3 p-3 bg-white border border-gray-200 rounded">
        <h5 className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
          Legenda Grammatica (Grammar Legend)
        </h5>
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

      {/* Grammar breakdown word list */}
      <div className="space-y-2">
        {grammarBreakdown.map((item, index) => {
          const posKey = (item.part_of_speech?.toLowerCase() || 'default') as GrammarColorKey;
          const colorClass = GRAMMAR_COLORS[posKey] || GRAMMAR_COLORS.default;
          return (
            <button
              key={index}
              className={`w-full flex justify-between items-center p-2 rounded border cursor-pointer transition-transform duration-150 hover:scale-[1.02] ${colorClass}`}
              onClick={() => {
                onWordClick(index);
                onGrammarWordClick(item.word);
              }}
            >
              <span className="font-bold">{item.word}</span>
              <span className="text-xs uppercase">{item.part_of_speech}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GrammarBreakdownComponent; 