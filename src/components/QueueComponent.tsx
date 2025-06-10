import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faCheckSquare, 
  faSquare 
} from '@fortawesome/free-solid-svg-icons';
import { QueueItem } from '../types';

interface QueueComponentProps {
  queueItems: QueueItem[];
  onNavigateToVerse: (book: string, chapter: number, verse: number) => void;
}

const QueueComponent: React.FC<QueueComponentProps> = ({ 
  queueItems, 
  onNavigateToVerse 
}) => {
  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 border-4 border-gray-400 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 mb-4">
        <FontAwesomeIcon icon={faClipboardList} /> Analysis Queue
      </h3>
      <div className="max-h-80 overflow-y-auto">
        {queueItems.length > 0 ? (
          <div className="space-y-2">
            {queueItems.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white p-3 rounded-lg border-l-4 border-blue-500 cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                onClick={() => onNavigateToVerse(item.book, item.chapter, item.verse)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-800">{item.reference}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === "Complete" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    item.grammar_complete ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}>
                    <FontAwesomeIcon icon={item.grammar_complete ? faCheckSquare : faSquare} />
                    Grammar
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    item.theological_complete ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}>
                    <FontAwesomeIcon icon={item.theological_complete ? faCheckSquare : faSquare} />
                    Theological
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    item.symbolic_complete ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}>
                    <FontAwesomeIcon icon={item.symbolic_complete ? faCheckSquare : faSquare} />
                    Symbolic
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <FontAwesomeIcon icon={faClipboardList} className="text-4xl mb-2 opacity-50" />
            <div className="text-lg font-semibold mb-2">Queue is empty</div>
            <div className="text-sm">Analysis queue will show recent verse processing activity.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueComponent; 