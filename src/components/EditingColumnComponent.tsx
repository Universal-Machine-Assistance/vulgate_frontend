import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { GrammarItem } from '../types';
import GrammarBreakdownComponent from './GrammarBreakdownComponent';

interface EditingColumnComponentProps {
  grammarBreakdown: GrammarItem[];
  onWordClick: (index: number) => void;
  onGrammarWordClick: (word: string) => void;
}

const EditingColumnComponent: React.FC<EditingColumnComponentProps> = ({
  grammarBreakdown,
  onWordClick,
  onGrammarWordClick
}) => {
  return (
    <div className="flex-[2] min-w-[260px]">
      <div className="bg-white border-4 border-black rounded-2xl shadow-lg shadow-gray-200/40 p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          <FontAwesomeIcon icon={faEdit} className="mr-2" />
          Edit
        </h3>
        <div className="space-y-4">
          {/* Grammar breakdown display */}
          <GrammarBreakdownComponent
            grammarBreakdown={grammarBreakdown}
            onWordClick={onWordClick}
            onGrammarWordClick={onGrammarWordClick}
          />
        </div>
      </div>
    </div>
  );
};

export default EditingColumnComponent; 