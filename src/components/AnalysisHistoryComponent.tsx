import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faEdit, 
  faBrain, 
  faQuestionCircle, 
  faSpinner 
} from '@fortawesome/free-solid-svg-icons';
import { AnalysisHistoryEntry } from '../types';

interface AnalysisHistoryComponentProps {
  book: string;
  chapter: number;
  verse: number;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const AnalysisHistoryComponent: React.FC<AnalysisHistoryComponentProps> = ({ 
  book, 
  chapter, 
  verse 
}) => {
  const [history, setHistory] = useState<AnalysisHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/analysis/history/${book}/${chapter}/${verse}`);
        const data = await response.json();
        if (data.found) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [book, chapter, verse]);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'analysis': return faClipboardList;
      case 'edit': return faEdit;
      case 'regenerate': return faBrain;
      case 'ai_generate': return faBrain;
      default: return faQuestionCircle;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'user': return 'text-blue-600';
      case 'ai': return 'text-purple-600';
      case 'greb_ai': return 'text-green-600';
      case 'automated': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          <span>Loading history...</span>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">No analysis history available for this verse.</p>
      </div>
    );
  }

  const displayedHistory = expanded ? history : history.slice(0, 5);

  return (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <FontAwesomeIcon icon={faClipboardList} className="text-gray-600" />
        Analysis History ({history.length})
      </h3>
      <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
        {displayedHistory.map((entry, index) => (
          <div key={entry.id} className="p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon 
                  icon={getActionIcon(entry.action_type)} 
                  className="text-gray-500" 
                />
                <span className="font-semibold text-sm text-gray-800">
                  {entry.action_type.replace('_', ' ')}
                </span>
                <span className={`text-xs font-medium ${getSourceColor(entry.change_source)}`}>
                  {entry.change_source}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(entry.created_at).toLocaleString()}
              </span>
            </div>
            
            <div className="text-sm text-gray-700">
              <strong>Field:</strong> {entry.target_field}
              {entry.target_identifier && (
                <span className="ml-2 text-gray-500">({entry.target_identifier})</span>
              )}
            </div>
            
            {entry.old_value && entry.new_value && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                <div className="text-red-600">
                  <strong>From:</strong> {entry.old_value.length > 50 ? `${entry.old_value.substring(0, 50)}...` : entry.old_value}
                </div>
                <div className="text-green-600 mt-1">
                  <strong>To:</strong> {entry.new_value.length > 50 ? `${entry.new_value.substring(0, 50)}...` : entry.new_value}
                </div>
              </div>
            )}

            {entry.confidence_score && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">Confidence:</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${entry.confidence_score * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{Math.round(entry.confidence_score * 100)}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {history.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200"
        >
          {expanded ? `Show less` : `Show ${history.length - 5} more entries`}
        </button>
      )}
    </div>
  );
};

export default AnalysisHistoryComponent; 